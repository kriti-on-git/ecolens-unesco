import type { AiProvider, AiRequest, AiResponse } from './types';

/**
 * Deterministic mock provider — the default for the prototype.
 *
 * Returns stable, coherent fallback text so the demo never depends on a
 * live LLM. Intent is passed through request.context.intent; anything
 * unknown falls back to a summary. It never fails.
 */
const fallbacks: Record<string, string> = {
  analyze:
    'This content centers on contested claims. Some are supported by cited evidence, others are asserted without support. The framing shapes the conclusion — check the primary sources and note what is opinion before forming a view.',
  interpret:
    'This topic is contested across several perspectives. The claims made on each side rest on different evidence and different assumptions. The full picture requires exploring the dimensions you have not yet covered.',
  'extract-claims':
    'The claims in this content can be separated from their framing. Each should be verified against the underlying sources before being treated as established.',
  summarize:
    'This content centers on a contested policy question. Several claims are made, but the evidence cited is partial and the framing shapes the conclusion. Consider checking the primary sources and contrasting perspectives before forming a view.',
  explain:
    'This perspective connects to the broader information ecosystem: claims made here are supported by some evidence, contradicted by other evidence, and depend on assumptions that are rarely stated. Exploring the underlying sources will show you what is verified, what is disputed, and what remains open.',
  recommend:
    'This recommendation covers a perspective you have not explored in depth. It complements what you have already considered and will help you see the issue from a dimension that has been missing from your picture so far.',
};

export class MockAiProvider implements AiProvider {
  readonly name = 'mock' as const;
  readonly model = 'deterministic-mock-v1';

  async generate(request: AiRequest): Promise<AiResponse> {
    const intent =
      typeof request.context?.intent === 'string' ? request.context.intent : 'summarize';
    const text = fallbacks[intent] ?? fallbacks.summarize;
    return { text, provider: this.name, model: this.model, isMock: true };
  }
}
