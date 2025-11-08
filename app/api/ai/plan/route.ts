// app/api/ai/plan/route.ts - AI Plan Generation via OpenRouter (Claude)

import { NextResponse } from "next/server";
import type { AIPlanRequest, AIPlanResponse } from "@/app/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are an expert risk analyst and business continuity planner for SMEs.

Given a scenario with variables and time horizon, provide:
1. Executive summary (exactly 6 concise bullet points)
2. Three key actions (prioritized, specific, actionable)
3. Timeline (realistic implementation schedule)

Respond ONLY with valid JSON in this exact structure:
{
  "summary": "Multi-line executive summary with 6 bullets:\\n• Bullet 1\\n• Bullet 2\\n• Bullet 3\\n• Bullet 4\\n• Bullet 5\\n• Bullet 6",
  "actions": ["Action 1", "Action 2", "Action 3"],
  "timeline": "Week 1: ... Week 2: ... Month 1: ...",
  "confidence": 0.85
}

Be realistic, data-driven, and concise. Focus on SME-appropriate solutions.`;

// ============================================================================
// Local Fallback (Rule-based)
// ============================================================================

function generateLocalPlan(request: AIPlanRequest): AIPlanResponse {
  const { scenarioTitle, variables, timeHorizonDays, simulationSummary } = request;

  const summary = `**Risk Analysis: ${scenarioTitle}**

• **Scope**: ${variables.length} variable(s) over ${timeHorizonDays} days
• **Key Variables**: ${variables.slice(0, 3).map((v) => v.name).join(", ")}
• **Uncertainty**: Distribution-based modeling applied to capture variability
• **Timeline**: ${timeHorizonDays < 30 ? "Short-term" : timeHorizonDays < 90 ? "Medium-term" : "Long-term"} horizon
• **Simulation**: ${simulationSummary || "Monte Carlo analysis performed"}
• **Recommendation**: Implement mitigation in phases with quick wins first`;

  const actions = [
    `Immediately address top sensitivity drivers: ${variables[0]?.name || "primary variable"}`,
    `Establish monitoring dashboard for ${variables.slice(0, 2).map((v) => v.name).join(" and ")}`,
    `Review and update contingency plan within ${Math.ceil(timeHorizonDays / 7)} weeks`,
  ];

  const timeline =
    timeHorizonDays <= 7
      ? "Day 1-2: Assessment & stakeholder alignment. Day 3-5: Implement quick mitigations. Day 6-7: Monitor & adjust."
      : timeHorizonDays <= 30
        ? "Week 1: Detailed assessment. Week 2-3: Implement controls. Week 4: Review effectiveness."
        : "Month 1: Planning & resource allocation. Month 2-3: Implementation. Month 4+: Monitoring & optimization.";

  return {
    summary,
    actions,
    timeline,
    confidence: 0.7,
    _source: "local",
  };
}

// ============================================================================
// OpenRouter AI (Claude)
// ============================================================================

async function generateAIPlan(request: AIPlanRequest): Promise<AIPlanResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.log("[AI Plan] No OPENROUTER_API_KEY found, using local fallback");
    return generateLocalPlan(request);
  }

  const { scenarioTitle, scenarioDescription, variables, timeHorizonDays, simulationSummary } =
    request;

  const userPrompt = `Scenario: ${scenarioTitle}
${scenarioDescription ? `Description: ${scenarioDescription}\n` : ""}
Time Horizon: ${timeHorizonDays} days

Variables:
${variables.map((v) => `- ${v.name} (${v.distribution}${v.unit ? `, unit: ${v.unit}` : ""})`).join("\n")}

${simulationSummary ? `\nSimulation Results:\n${simulationSummary}` : ""}

Provide a strategic risk management plan in JSON format.`;

  try {
    console.log("[AI Plan] Calling OpenRouter API...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Risk Coach Neo",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[AI Plan] OpenRouter error:", response.status, errorText);
      return generateLocalPlan(request);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[AI Plan] No content in response");
      return generateLocalPlan(request);
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(jsonStr);

    console.log("[AI Plan] Successfully generated AI plan");

    return {
      summary: parsed.summary || "",
      actions: parsed.actions || [],
      timeline: parsed.timeline || "",
      confidence: parsed.confidence || 0.8,
      _source: "ai",
      _model: data.model || "anthropic/claude-3.5-sonnet",
      _requestId: data.id,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[AI Plan] Error calling OpenRouter:", err.message);
    return generateLocalPlan(request);
  }
}

// ============================================================================
// Route Handler
// ============================================================================

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AIPlanRequest;

    if (!body.scenarioTitle || !body.variables || body.variables.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: scenarioTitle, variables" },
        { status: 400 }
      );
    }

    const plan = await generateAIPlan(body);

    return NextResponse.json(plan, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[AI Plan] Route error:", err);
    return NextResponse.json(
      { error: "Failed to generate plan", details: err.message },
      { status: 500 }
    );
  }
}
