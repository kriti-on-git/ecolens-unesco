import type { AiProviderName } from './types';

/**
 * Single configurable LLM provider.
 *
 * The prototype runs on the deterministic mock provider and requires no
 * environment variables. To enable a real provider later, set LLM_PROVIDER
 * and LLM_API_KEY (see .env.example). No external API is called until then.
 */
export const aiConfig = {
  provider: (process.env.LLM_PROVIDER ?? 'mock') as AiProviderName,
  apiKey: process.env.LLM_API_KEY ?? '',
  model: process.env.LLM_MODEL ?? '',
};

export function isAiConfigured(): boolean {
  return aiConfig.provider !== 'mock' && Boolean(aiConfig.apiKey);
}
