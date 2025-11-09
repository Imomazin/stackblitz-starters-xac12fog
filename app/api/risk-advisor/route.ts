// app/api/risk-advisor/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SYSTEM_PROMPT = `You are an expert AI Risk Advisor with deep knowledge in enterprise risk management. Your expertise spans:

**Risk Management Frameworks:**
- COSO Enterprise Risk Management
- ISO 31000 Risk Management
- NIST Cybersecurity Framework
- Basel III/IV for financial risk
- TCFD for climate risk
- SOX, GDPR, and regulatory compliance

**Domain Expertise:**
- Strategic risk (market, competitive, reputational)
- Operational risk (process, supply chain, technology)
- Financial risk (VaR, credit, liquidity, market)
- Cyber risk (threats, vulnerabilities, incident response)
- Climate & ESG risk (physical, transition, regulatory)
- Compliance & legal risk
- Project risk management

**Quantitative Methods:**
- Monte Carlo simulation
- Value at Risk (VaR) and Conditional VaR
- Probability distributions (Normal, Log-Normal, Triangular, Beta, Gamma, Weibull, Poisson, Exponential)
- Correlation modeling (Copulas, Pearson, Spearman)
- Sensitivity analysis and scenario planning
- FMEA (Failure Mode Effects Analysis)
- Bow-Tie analysis

**Best Practices:**
- Risk identification and classification
- Risk appetite and tolerance frameworks
- Risk treatment strategies (avoid, reduce, transfer, accept)
- KRI (Key Risk Indicators) design
- Risk reporting and visualization
- Crisis management and business continuity

**Your Task:**
Provide clear, actionable, expert guidance on risk management questions. When users ask about:
1. **Classification/Categorization**: Explain frameworks (COSO, ISO 31000) and guide them through categorizing their risks
2. **Quantitative Methods**: Explain the math, when to use each method, and how to implement in R_LUMINA
3. **Domain-Specific Risks**: Provide deep, specialized knowledge for cyber, climate, financial, operational, etc.
4. **Platform Features**: Guide users on which R_LUMINA tools/tabs to use for their specific needs
5. **Best Practices**: Share industry standards and proven approaches

**Response Style:**
- Start by acknowledging what they're asking
- Provide structured, detailed answers with numbered steps when appropriate
- Use markdown formatting (headers, bold, bullet points, code blocks)
- Include relevant formulas or frameworks
- Suggest specific R_LUMINA features/tabs to use
- End with follow-up questions or next steps

**Important:**
- Be comprehensive but concise
- Use technical terminology appropriately but explain when needed
- Provide examples when helpful
- If uncertain, say so and suggest consulting domain experts`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const question: string = typeof body?.question === 'string' ? body.question : '';
    const conversationHistory: Array<{ role: string; content: string }> = body?.history || [];

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const hasKey = !!apiKey;

    console.log('[risk-advisor] Request received:', {
      hasKey,
      keyPrefix: apiKey?.slice(0, 7) || 'none',
      questionLength: question.length,
      historyLength: conversationHistory.length,
      timestamp: new Date().toISOString(),
    });

    // Fallback if no key
    if (!hasKey) {
      console.warn('[risk-advisor] ANTHROPIC_API_KEY not found, returning fallback');
      return NextResponse.json(
        {
          response: `🤔 **I understand you're asking about:** "${question}"

I'm an AI Risk Advisor, but I need an API key to provide intelligent responses. For now, here's general guidance:

**Common Risk Management Steps:**
1. **Identify** - Catalog all potential risks
2. **Assess** - Evaluate likelihood and impact
3. **Treat** - Choose strategy (avoid, reduce, transfer, accept)
4. **Monitor** - Track KRIs and update regularly

**R_LUMINA Tools You Can Use:**
- **Risk Register** - Document and categorize risks
- **Monte Carlo** - Quantitative risk analysis
- **Bow-Tie Analysis** - Map causes and consequences
- **FMEA** - Prioritize by severity

Please configure ANTHROPIC_API_KEY environment variable for full AI-powered guidance.`,
          _source: 'fallback'
        },
        { status: 200 }
      );
    }

    // Build conversation messages
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.map(msg => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: question || 'How can I get started with risk management?'
      }
    ];

    // Real AI call with Anthropic Claude
    console.log('[risk-advisor] Calling Anthropic API');
    const anthropic = new Anthropic({ apiKey });
    const model = 'claude-3-5-sonnet-20241022';

    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages,
    });

    const requestId = response.id;

    console.log('[risk-advisor] Response received:', {
      requestId,
      stopReason: response.stop_reason,
      model: response.model,
      usage: response.usage,
    });

    // Extract text content
    const content = response.content[0];
    if (content.type !== 'text') {
      console.error('[risk-advisor] unexpected content type:', content.type);
      return NextResponse.json(
        { error: 'Unexpected response type from AI', requestId },
        { status: 500 }
      );
    }

    const responseText = content.text;

    console.log('[risk-advisor] Success:', {
      modelUsed: model,
      requestId,
      responseLength: responseText.length,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    });

    return NextResponse.json(
      {
        response: responseText,
        _source: 'anthropic',
        _requestId: requestId,
        _model: model,
        _usage: response.usage,
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error('[risk-advisor] API error:', {
      name: err.name,
      message: err.message,
      status: err.status,
      type: err.type,
      code: err.code,
    });

    return NextResponse.json(
      {
        error: 'Failed to get AI response',
        details: err.message || 'Unknown error',
        type: err.type || err.name,
      },
      { status: 500 }
    );
  }
}
