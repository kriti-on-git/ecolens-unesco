/**
 * AI provider boundary.
 *
 * All AI calls in the application must go through this boundary
 * (lib/ai) — never provider-specific calls scattered through the UI.
 * The prototype ships with a deterministic mock provider; a real LLM
 * provider can be swapped in behind the same interface.
 */

export type AiProviderName = 'mock' | 'openai' | 'anthropic';

export interface AiRequest {
  system?: string;
  prompt: string;
  /**
   * Optional structured context (e.g. topic id, explored dimensions) that
   * lets the provider shape deterministic or model-based responses.
   */
  context?: Record<string, unknown>;
}

export interface AiResponse {
  text: string;
  provider: AiProviderName;
  model: string;
  /** True when the response came from the deterministic fallback. */
  isMock: boolean;
}

export interface AiProvider {
  readonly name: AiProviderName;
  readonly model: string;
  generate(request: AiRequest): Promise<AiResponse>;
}
