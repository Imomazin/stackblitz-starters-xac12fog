export async function POST(req: Request) {
  const { message = "" } = await req.json().catch(() => ({}));
  const apiKey = process.env.OPENAI_API_KEY;

  // Fallback if no key configured
  if (!apiKey) {
    const reply =
      `Thanks. I read: "${message}". Here are your next 3 actions:\n` +
      `1) Get the facts: who, what, when, impact.\n` +
      `2) Pick the fastest mitigation you control today.\n` +
      `3) Tell the right person, set a checkpoint for tomorrow.`;
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }

  // System prompt that enforces simple, structured guidance
  const system = `
You are an SME Risk Coach. Speak plainly. No jargon. No fear.
Classify the issue and return a structured plan as JSON with fields:
summary (one sentence),
rating (Low|Medium|High + one line reason),
actions_24h (3-5 bullets),
actions_7d (3-5 bullets),
actions_30d (3-5 bullets),
owners (role names only),
checklist (5-8 short items),
template (short email or message).
Keep answers concise and directly actionable.
`;

  // Use OpenAI Responses API (compatible with Next.js edge/fetch)
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: message }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text);
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "{}";
    // Pass through as structured object, plus a friendly text rendering
    const plan = JSON.parse(content);

    const pretty =
      `${plan.summary}\n` +
      `Risk rating: ${plan.rating}\n\n` +
      `24 hours:\n- ${(plan.actions_24h || []).join("\n- ")}\n\n` +
      `7 days:\n- ${(plan.actions_7d || []).join("\n- ")}\n\n` +
      `30 days:\n- ${(plan.actions_30d || []).join("\n- ")}\n\n` +
      `Owners: ${(plan.owners || []).join(", ")}\n\n` +
      `Checklist:\n- ${(plan.checklist || []).join("\n- ")}\n\n` +
      `Template:\n${plan.template || ""}`;

    return new Response(JSON.stringify({ plan, reply: pretty }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        reply:
          "The coach hit an error generating a plan. Try again in a minute or shorten your input.",
        error: String(err?.message || err),
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  }
}
