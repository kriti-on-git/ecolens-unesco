import { NextResponse } from 'next/server';
import { analyzeContent } from '@/lib/ai';

/**
 * Content-understanding endpoint.
 *
 * Exposes the centralized AI service for pasted content. The service runs
 * on the deterministic fallback when no LLM is configured, so this endpoint
 * always returns a structured analysis — never a broken state.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { text?: string } | null;
  const text = body?.text?.trim() ?? '';
  if (!text) {
    return NextResponse.json({ error: 'Provide text to analyze.' }, { status: 400 });
  }

  const result = await analyzeContent({ ref: 'pasted-text', inputType: 'text', text });
  return NextResponse.json(result);
}
