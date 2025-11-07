import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = process.env.ANTHROPIC_API_KEY?.slice(0, 7) || 'none';

  return NextResponse.json({
    hasAnthropicKey: hasKey,
    keyPrefix: keyPrefix,
    nodeVersion: process.version,
    environment: process.env.VERCEL_ENV || 'local',
    timestamp: new Date().toISOString(),
  });
}
