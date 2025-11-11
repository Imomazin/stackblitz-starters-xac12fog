// app/api/risk-advisor/route.ts
import Anthropic from "@anthropic-ai/sdk";

// ——— Helpers ————————————————————————————————————————
type RiskAdvisorReply = {
  plan: string[];
  summary: string;
  score: number; // 0..1
  key_risks: Array<{
    name: string;
    likelihood: string;
    impact: string;
    mitigation: string;
  }>;
  meta?: {
    request_id?: string;
    model?: string;
    tokens?: { input?: number; output?: number };
  };
};

const JSON_SCHEMA_HINT = `
Return ONLY valid JSON for:
type RiskAdvisorReply = {
  plan: string[];
  summary: string;
  score: number; // 0..1
  key_risks: Array<{name: string; likelihood: string; impact: string; mitigation: string;}>;
};
No extra text, no markdown, no code fences.
`;

// Tiny safe JSON parse
function safeParse<T = unknown>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// ——— Handlers ————————————————————————————————————————
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  return Response.json(
    {
      ok: true,
      advisor: hasKey ? "ready" : "missing_api_key",
      hint: hasKey
        ? "POST a JSON body: { message: string, context?: object }"
        : "Set ANTHROPIC_API_KEY in project env and redeploy.",
    },
    { headers: corsHeaders() }
  );
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return Response.json(
      {
        error: "Missing ANTHROPIC_API_KEY",
        hint: "Add ANTHROPIC_API_KEY in Vercel settings (and .env.local for local dev) then redeploy.",
      },
      { status: 503, headers: corsHeaders() }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders() }
    );
  }

  const message: string | undefined = body?.message;
  const context: Record<string, unknown> | undefined = body?.context;

  if (!message || typeof message !== "string") {
    return Response.json(
      { error: "Body must include { message: string }" },
      { status: 400, headers: corsHeaders() }
    );
  }

  const client = new Anthropic({ apiKey: key });

  // Build a compact context string (avoid dumping giant objects)
  const ctx = context ? JSON.stringify(context).slice(0, 4000) : "none";

  const system = `You are R_Lumina's Risk Advisor.
You answer concisely and return ONLY valid JSON that satisfies the TypeScript type below.
Use realistic, actionable recommendations grounded in business risk practices.
${JSON_SCHEMA_HINT}`;

  const userPrompt = `
User message:
${message}

Context (optional):
${ctx}
`.trim();

  try {
    const msg = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 900,
      temperature: 0.2,
      system,
      messages: [{ role: "user", content: userPrompt }],
    });

    const contentText =
      msg?.content?.[0]?.type === "text"
        ? (msg.content[0] as any).text
        : "";

    const parsed = safeParse<RiskAdvisorReply>(contentText);
    if (!parsed) {
      // Fallback (never 500) – still demo-safe
      const fallback: RiskAdvisorReply = {
        plan: [
          "Verify demand and inventory buffers.",
          "Escalate supplier response and secure alternate source.",
          "Stage risk communication to stakeholders within 24h.",
        ],
        summary:
          "Unable to parse structured JSON from the LLM; providing a safe fallback playbook.",
        score: 0.2,
        key_risks: [
          {
            name: "Parsing Failure",
            likelihood: "low",
            impact: "medium",
            mitigation:
              "Retry advisor call; if persistent, reduce prompt length or remove unusual characters.",
          },
        ],
        meta: {
          model: msg?.model ?? "unknown",
          request_id: (msg as any)?._request_id,
          tokens: (msg as any)?.usage
            ? {
                input: (msg as any).usage.input_tokens,
                output: (msg as any).usage.output_tokens,
              }
            : undefined,
        },
      };
      return Response.json(fallback, { headers: corsHeaders() });
    }

    // Augment with meta
    parsed.meta = {
      model: msg?.model ?? "unknown",
      request_id: (msg as any)?._request_id,
      tokens: (msg as any)?.usage
        ? {
            input: (msg as any).usage.input_tokens,
            output: (msg as any).usage.output_tokens,
          }
        : undefined,
    };

    return Response.json(parsed, { headers: corsHeaders() });
  } catch (err: any) {
    console.error("Advisor error:", err?.response?.data ?? err?.message ?? err);
    const fallback: RiskAdvisorReply = {
      plan: [
        "Trigger contingency plan for the most likely risk scenario.",
        "Reduce exposure by adjusting purchase orders and lead time buffers.",
        "Schedule a checkpoint with the operations team tomorrow.",
      ],
      summary:
        "An error occurred contacting the advisor. This is a safe operational fallback.",
      score: 0.25,
      key_risks: [
        {
          name: "LLM/Network Error",
          likelihood: "medium",
          impact: "low",
          mitigation:
            "Check API key, network status, and retry. Consider rate limits.",
        },
      ],
    };
    return Response.json(
      { ...fallback, error: err?.message ?? "Unknown error" },
      { status: 200, headers: corsHeaders() } // 200 for demo-safety
    );
  }
}
