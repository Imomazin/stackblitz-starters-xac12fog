// app/api/riskcoach/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs'; // keep SDK happy on Vercel

type Plan = {
  summary: string;
  rating?: string;
  actions_24h?: string[];
  actions_7d?: string[];
  actions_30d?: string[];
  owners?: string[];
  checklist?: string[];
  template?: string;
  confidence?: number; // 0..1
};

const SYSTEM_PROMPT = `
You are an SME (small/medium enterprise) risk coach.
Return a compact JSON object ONLY (no prose outside JSON) with:

{
  "summary": "one sentence summary of the situation + the chosen strategy",
  "rating": "Low | Medium | High - brief reason",
  "actions_24h": ["action 1", "action 2", "action 3"],
  "actions_7d": ["action 1", "action 2"],
  "actions_30d": ["action 1", "action 2"],
  "owners": ["Owner 1", "Owner 2", "Owner 3"],
  "checklist": ["checkpoint 1", "checkpoint 2", "checkpoint 3"],
  "template": "Multi-line template text for customer communication or internal update",
  "confidence": 0.0-1.0
}

Policies:
- Never include any text outside the JSON.
- Be realistic, concise, and actionable.
- Rating should start with Low, Medium, or High followed by a brief reason.
- Owners can be roles (Ops Lead, Procurement, Account Manager).
- Actions should be specific and time-bound.
- Template should be a ready-to-use text (e.g., email to customer or internal update).
`;

function heuristicScore(text: string): number {
  const t = text.toLowerCase();
  if (t.includes('immediately') || t.includes('critical') || t.includes('high')) return 0.9;
  if (t.includes('monitor') || t.includes('low')) return 0.6;
  return 0.75;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const message: string = typeof body?.message === 'string' ? body.message : '';

    const hasKey = !!process.env.OPENAI_API_KEY;
    console.log('[riskcoach] hasKey:', hasKey);

    // Fallback if no key
    if (!hasKey) {
      const reply =
        "I've structured your response into key steps. Let's take the next action.";
      const plan: Plan = {
        summary:
          'Mock guidance: confirm supplier ETA, protect critical orders, and update customers with realistic dates.',
        rating: 'Medium - manageable with quick action',
        actions_24h: [
          'Confirm new ETA with supplier via phone and email',
          'Calculate exact stockout date for each critical SKU',
          'Draft customer communication template'
        ],
        actions_7d: [
          'Implement priority system for remaining stock allocation',
          'Research and qualify backup suppliers',
          'Set up daily inventory tracking dashboard'
        ],
        actions_30d: [
          'Negotiate standing backup agreements with 2-3 alternative suppliers',
          'Review and update supply chain risk assessment',
          'Implement automated low-stock alerts'
        ],
        owners: ['Procurement Lead', 'Operations Manager', 'Account Management'],
        checklist: [
          'Supplier ETA confirmation documented',
          'Critical SKU priority list created',
          'Customer communication sent',
          'Daily stock levels monitored',
          'Backup supplier outreach initiated'
        ],
        template: `Subject: Update on Your Order - Revised Timeline

Dear [Customer Name],

We want to keep you informed about your order #[ORDER_ID]. Due to an unexpected delay with our supplier (14-day postponement), we're working to minimize impact to your delivery.

Current Status:
- Original delivery: [DATE]
- Revised estimate: [NEW_DATE]

Actions We're Taking:
- Daily supplier coordination to expedite shipment
- Priority allocation of existing stock
- Backup supplier activation

We apologize for this inconvenience and appreciate your patience. Please contact us at [CONTACT] with any questions.

Best regards,
[Your Company]`,
        confidence: 0.7
      };
      return NextResponse.json(
        { plan, reply, score: plan.confidence ?? 0.7, source: 'mock' },
        { status: 200 }
      );
    }

    // Real AI call
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = 'gpt-4o-mini';

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message || 'No details provided.' }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content;
    const requestId = completion.id;

    if (!raw) {
      console.error('[riskcoach] empty AI response, requestId:', requestId);
      return NextResponse.json(
        { error: 'Empty AI response' },
        { status: 500 }
      );
    }

    let parsed: Plan | null = null;
    try {
      parsed = JSON.parse(raw) as Plan;
    } catch (e) {
      console.error('[riskcoach] JSON parse error:', e, 'raw:', raw.slice(0, 500), 'requestId:', requestId);
      return NextResponse.json(
        { error: 'AI returned invalid JSON' },
        { status: 500 }
      );
    }

    // Build our final response
    const reply = parsed.summary || "Here's your structured next-step plan.";
    const score = typeof parsed.confidence === 'number'
      ? parsed.confidence
      : heuristicScore(reply);

    console.log('[riskcoach] modelUsed:', model, 'requestId:', requestId, 'hasRating:', !!parsed.rating);

    return NextResponse.json(
      { plan: parsed, reply, score, source: 'openai' },
      { status: 200 }
    );

  } catch (err) {
    console.error('[riskcoach] API error:', err);
    return NextResponse.json(
      { error: 'Something went wrong processing your request.' },
      { status: 500 }
    );
  }
}

/**
 * Test (once deployed):
 * curl -s -X POST "http://localhost:3000/api/riskcoach" \
 *   -H "Content-Type: application/json" \
 *   -d '{"message":"Supplier delay 14 days, we have 10 days of stock, no backup supplier."}' | jq .
 *
 * Or on Vercel:
 * curl -s -X POST "https://your-domain.vercel.app/api/riskcoach" \
 *   -H "Content-Type: application/json" \
 *   -d '{"message":"Supplier delay 14 days, we have 10 days of stock, no backup supplier."}' | jq .
 */
