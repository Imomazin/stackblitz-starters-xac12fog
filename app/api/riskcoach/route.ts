import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    // Talk to OpenAI API using your Vercel environment key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OpenAI API key" },
        { status: 500 }
      );
    }

    const prompt = `
      You are an SME Risk Coach. The user says: "${input}".
      Analyze it like a management consultant and generate:
      1. A brief risk diagnosis (2 sentences).
      2. A three-step adaptive mitigation plan (each step under 15 words).
      3. A short confidence rating (High, Medium, or Low).
      4. Optional note if data or action gaps exist.
      Return as JSON with keys: plan, reply, score.
    `;

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await completion.json();

    // Extract message
    const output =
      data?.choices?.[0]?.message?.content || "Unable to generate guidance right now.";

    // Basic confidence heuristic
    const score =
      output.toLowerCase().includes("immediately") ||
      output.toLowerCase().includes("critical")
        ? 0.9
        : output.toLowerCase().includes("monitor")
        ? 0.6
        : 0.75;

    return NextResponse.json({
      plan: output,
      reply: "I've structured your response into key steps. Let’s take the next action.",
      score,
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Something went wrong processing your request." },
      { status: 500 }
    );
  }
}
