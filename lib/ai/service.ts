import { getKnowledgeGraph } from '@/data/knowledge-graphs';
import { getDimensionLabel, dimensionRegistry } from '@/data/perspectives';
import { getRecommendationsForTopic } from '@/data/recommendations';
import { MockAiProvider } from './mock';
import { generateText } from './index';
import type {
  AiRequest,
  AiResponse,
  ClaimExtractionResult,
  ClaimStatus,
  ContentAnalysisInput,
  ContentAnalysisResult,
  ContextExplanationResult,
  RecommendationExplanationResult,
  TopicInterpretationResult,
} from './types';
import type { Topic, TopicDimensionKind } from '@/types';

/**
 * Centralized AI service.
 *
 * All structured analysis in the application goes through these functions —
 * never provider-specific calls scattered through the frontend. Each
 * function calls the configurable provider and, if AI is unavailable or
 * fails, falls back to a deterministic implementation built from typed
 * local data. The application never displays a broken state.
 */

/** Call the provider, falling back to the deterministic mock on any failure. */
async function safeGenerate(request: AiRequest): Promise<AiResponse> {
  try {
    return await generateText(request);
  } catch {
    return new MockAiProvider().generate(request);
  }
}

/** Try to parse a provider's JSON output; otherwise fall back deterministically. */
function parseJson<T>(text: string, fallback: T): T {
  try {
    return { ...fallback, ...(JSON.parse(text) as T) };
  } catch {
    return fallback;
  }
}

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

/** Content understanding — summarizes pasted text/URLs and classifies it. */
export async function analyzeContent(input: ContentAnalysisInput): Promise<ContentAnalysisResult> {
  const response = await safeGenerate({
    system: 'You analyze information content neutrally, distinguishing facts from claims.',
    prompt: `Analyze this content:\n${truncate(input.text, 2400)}`,
    context: { intent: 'analyze', ref: input.ref, inputType: input.inputType },
  });

  const mock = buildDeterministicAnalysis(input.text);
  if (response.isMock) return { ...mock, isMock: true };
  return parseJson(response.text, { ...mock, isMock: false });
}

/** Topic interpretation — summary, key claims, tensions, and dimensions. */
export async function interpretTopic(topic: Topic): Promise<TopicInterpretationResult> {
  const response = await safeGenerate({
    system: 'You interpret a topic neutrally, surfacing claims and tensions without taking sides.',
    prompt: `Interpret this topic for an information-literacy companion: ${topic.title}`,
    context: { intent: 'interpret', topicId: topic.id },
  });

  const graph = getKnowledgeGraph(topic.id);
  const keyClaims = (graph?.nodes.filter((n) => n.type === 'claim') ?? []).map((n) => n.label);
  const tensions =
    keyClaims.length >= 2
      ? [
          `The debate is often framed as “${keyClaims[0]}” versus “${keyClaims[1]}” — but the full picture is wider.`,
        ]
      : [];
  const mock: TopicInterpretationResult = {
    summary: topic.summary,
    keyClaims,
    tensions,
    dimensions: topic.dimensions.map((d) => getDimensionLabel(d.kind)),
    isMock: true,
  };

  if (response.isMock) return mock;
  return parseJson(response.text, mock);
}

/** Claim extraction — pulls candidate claims from text and flags their status. */
export async function extractClaims(text: string): Promise<ClaimExtractionResult> {
  const response = await safeGenerate({
    system: 'You extract discrete claims from text and classify their evidentiary status.',
    prompt: `Extract the claims in this content:\n${truncate(text, 2400)}`,
    context: { intent: 'extract-claims' },
  });

  const mock = buildDeterministicClaims(text);
  if (response.isMock) return { ...mock, isMock: true };
  return parseJson(response.text, { ...mock, isMock: false });
}

/** Contextual explanation — why a dimension matters for a topic. */
export async function explainContext(
  topic: Topic,
  dimensionKind: TopicDimensionKind,
): Promise<ContextExplanationResult> {
  const response = await safeGenerate({
    system: 'You explain why a perspective matters without advocating a position.',
    prompt: `Explain the ${getDimensionLabel(dimensionKind)} of ${topic.title} to a curious reader.`,
    context: { intent: 'explain', topicId: topic.id, dimension: dimensionKind },
  });

  const dim = dimensionRegistry[dimensionKind];
  const mock: ContextExplanationResult = {
    text: `${dim.label}: ${dim.description} For ${topic.title}, this dimension connects directly to why the issue matters — ${topic.whyItMatters}`,
    points: [topic.whyItMatters, dim.description],
    isMock: true,
  };

  if (response.isMock) return mock;
  return parseJson(response.text, mock);
}

/** Recommendation explanation — why a specific recommendation was surfaced. */
export async function explainRecommendation(
  recommendation: ReturnType<typeof getRecommendationsForTopic>[number],
): Promise<RecommendationExplanationResult> {
  const response = await safeGenerate({
    system: 'You explain recommendations by grounding them in the user’s exploration gaps.',
    prompt: `Why recommend this? ${recommendation.source.title}`,
    context: {
      intent: 'recommend',
      topicId: recommendation.topicId,
      dimension: recommendation.dimensionKind,
    },
  });

  const mock: RecommendationExplanationResult = {
    text: recommendation.whyRecommended,
    reasonKind: recommendation.reasonKind,
    isMock: true,
  };

  if (response.isMock) return mock;
  return parseJson(response.text, mock);
}

/* ------------------------------------------------------------------ */
/* Deterministic fallbacks — functional without any LLM.               */
/* ------------------------------------------------------------------ */

function buildDeterministicAnalysis(text: string): Omit<ContentAnalysisResult, 'isMock'> {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const claims = sentences.slice(0, 4);
  const lowered = text.toLowerCase();

  let classification: ContentAnalysisResult['classification'] = 'insufficient-evidence';
  if (/opinion|believe|in my view|should|certainly|clearly/.test(lowered)) {
    classification = 'opinion';
  } else if (/alleged|reportedly|claims to|accused/.test(lowered)) {
    classification = 'disputed-claim';
  } else if (/study found|data shows|according to|found that|measured/.test(lowered)) {
    classification = 'verified-fact';
  }

  const dimensionsCovered = Object.values(dimensionRegistry)
    .filter((d) => {
      const keywords = d.description
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 4);
      return keywords.some((w) => lowered.includes(w));
    })
    .slice(0, 4)
    .map((d) => d.label);

  const length = text.length;
  const nutrition: ContentAnalysisResult['nutrition'] = {
    evidenceAvailability: length > 1200 ? 'high' : length > 400 ? 'medium' : 'low',
    primarySourceAvailability: /according to|transcript|filing|dataset|survey/.test(lowered)
      ? 'high'
      : 'low',
    contextAvailability: length > 800 ? 'high' : 'medium',
    emotionalFraming: /outrageous|shocking|disgrace|unbelievable/.test(lowered)
      ? 'strong'
      : /surprising|worrying|striking/.test(lowered)
        ? 'mild'
        : 'neutral',
  };

  return {
    summary:
      sentences.length > 0
        ? `This content makes ${claims.length} main claim${claims.length === 1 ? '' : 's'}. It leans ${classification.replace(/-/g, ' ')} in nature. Verify the claims against primary sources before treating them as settled.`
        : 'This content is too short to analyze meaningfully.',
    claims,
    classification,
    dimensionsCovered,
    nutrition,
  };
}

function buildDeterministicClaims(text: string): Omit<ClaimExtractionResult, 'isMock'> {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 5);

  const claims = sentences.map(
    (sentence): { text: string; status: ClaimStatus; evidenceHints: string[] } => {
      const lowered = sentence.toLowerCase();
      let status: ClaimStatus = 'unsupported';
      if (/may|might|could|perhaps|possibly/.test(lowered)) status = 'uncertain';
      else if (/alleged|reportedly|claims that|accused/.test(lowered)) status = 'disputed';
      else if (/study|data|found|according to|research|survey/.test(lowered)) status = 'supported';

      const hints: string[] = [];
      if (status !== 'unsupported') hints.push('look for the underlying source');
      if (/according to|study|survey|report/.test(lowered))
        hints.push('check the cited study or report');
      if (/percent|%|million|billion|figure/.test(lowered))
        hints.push('verify the numbers against the original data');
      return { text: sentence, status, evidenceHints: hints };
    },
  );

  return { claims };
}
