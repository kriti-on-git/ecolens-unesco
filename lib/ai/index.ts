import { aiConfig } from './config';
import { MockAiProvider } from './mock';
import type { AiProvider, AiRequest, AiResponse } from './types';

export * from './config';
export * from './types';

let provider: AiProvider | undefined;

/**
 * Returns the configured AI provider. The prototype always uses the
 * deterministic mock; swap in a real provider here behind the same
 * interface when one is configured.
 */
export function getAiProvider(): AiProvider {
  if (!provider) {
    provider = new MockAiProvider();
    void aiConfig; // config is read when a real provider is added
  }
  return provider;
}

/** Single entry point for text generation across the application. */
export async function generateText(request: AiRequest): Promise<AiResponse> {
  return getAiProvider().generate(request);
}
