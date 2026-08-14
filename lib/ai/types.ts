import type {
  ContentClassification,
  ContentInputType,
  NutritionLabel,
  RecommendationReasonKind,
} from '@/types';

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

/*
 * Structured analysis results.
 *
 * The service layer (lib/ai/service.ts) always returns these shapes — from
 * the deterministic mock when AI is unavailable, or from a real provider
 * behind the same interface. The frontend never sees provider internals.
 */

export interface ContentAnalysisResult {
  summary: string;
  claims: string[];
  classification: ContentClassification;
  dimensionsCovered: string[];
  nutrition: Pick<
    NutritionLabel,
    | 'evidenceAvailability'
    | 'primarySourceAvailability'
    | 'contextAvailability'
    | 'emotionalFraming'
  >;
  isMock: boolean;
}

export interface TopicInterpretationResult {
  summary: string;
  keyClaims: string[];
  tensions: string[];
  dimensions: string[];
  isMock: boolean;
}

export type ClaimStatus = 'supported' | 'disputed' | 'unsupported' | 'uncertain';

export interface ExtractedClaim {
  text: string;
  status: ClaimStatus;
  evidenceHints: string[];
}

export interface ClaimExtractionResult {
  claims: ExtractedClaim[];
  isMock: boolean;
}

export interface ContextExplanationResult {
  text: string;
  points: string[];
  isMock: boolean;
}

export interface RecommendationExplanationResult {
  text: string;
  reasonKind: RecommendationReasonKind;
  isMock: boolean;
}

export interface ContentAnalysisInput {
  ref: string;
  inputType: ContentInputType;
  text: string;
}
