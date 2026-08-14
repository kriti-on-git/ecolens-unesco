import { getDimensionLabel } from '@/data/perspectives';
import type {
  AwarenessProfile,
  CaseQuestion,
  CaseStudy,
  EvidencePreference,
  ProfileMetric,
  ProfileMetricId,
  SourcePreference,
  Topic,
  TopicDimensionKind,
  UserResponse,
} from '@/types';

/**
 * Deterministic awareness-profile scoring.
 *
 * Scores are derived from what the user actually explored — never a
 * diagnosis. Every metric carries an explanation grounded in the answers.
 * This logic is intentionally simple and replaceable: the same inputs can
 * later feed a smarter engine without changing the UI.
 */

/** Question types that exercise evidence handling. */
const EVIDENCE_TYPES = new Set(['evidence', 'uncertainty', 'source-selection']);

/** Question types that exercise context and framing. */
const CONTEXT_TYPES = new Set(['interpretation', 'consequence', 'context']);

export interface ScoreInput {
  topic: Topic;
  caseStudy: CaseStudy;
  responses: UserResponse[];
  /** Total questions in the completed path (for depth scaling). */
  pathLength: number;
  attempt: number;
  prior?: AwarenessProfile | null;
  previouslyExplored?: TopicDimensionKind[];
}

export function scoreCaseStudy(input: ScoreInput): AwarenessProfile {
  const { topic, responses, pathLength, attempt, prior, previouslyExplored } = input;

  const topicKinds = topic.dimensions.map((d) => d.kind);
  const encountered = union(
    previouslyExplored ?? [],
    ...responses.map((r) => r.dimensionKinds),
    prior?.exploredDimensions ?? [],
  );
  // The profile describes coverage for the selected topic, so exploration is
  // scoped to the topic's own dimensions (options may lean on other kinds).
  const { explored, missing } = detectGaps(topic, encountered);
  const unexplored = missing;

  const answered = responses.length;
  const evidenceRatio = answered
    ? responses.filter((r) => EVIDENCE_TYPES.has(questionType(input.caseStudy, r.questionId)))
        .length / answered
    : 0;
  const contextRatio = answered
    ? responses.filter((r) => CONTEXT_TYPES.has(questionType(input.caseStudy, r.questionId)))
        .length / answered
    : 0;
  const sourceEngaged = responses.some((r) => {
    const q = input.caseStudy.questions[r.questionId];
    return (
      q?.type === 'source-selection' ||
      q?.options.find((o) => o.id === r.optionId)?.dimensionKind === 'individual'
    );
  });

  const coverage = topicKinds.length ? (explored.length / topicKinds.length) * 100 : 0;
  const depth = pathLength ? Math.min((answered / pathLength) * 100, 100) : 0;

  const rawMetrics: Record<ProfileMetricId, number> = {
    'information-awareness': round(0.6 * coverage + 0.4 * Math.min((answered / 5) * 100, 100)),
    'perspective-coverage': round(coverage),
    'evidence-awareness': round(answered ? 25 + 75 * evidenceRatio : 12),
    'source-diversity': round(
      answered ? 30 + 70 * (sourceEngaged ? 0.6 + evidenceRatio * 0.4 : evidenceRatio) : 15,
    ),
    'context-awareness': round(answered ? 30 + 70 * contextRatio : 15),
    'topic-depth': round(depth),
  };

  const exploredLabels = explored.map(getDimensionLabel);
  const unexploredLabels = unexplored.map(getDimensionLabel);

  const metrics: ProfileMetric[] = (
    [
      {
        id: 'information-awareness',
        label: 'Information awareness',
        explanation: `You engaged with ${explored.length} of ${topicKinds.length} dimensions of this issue across ${answered} questions.`,
      },
      {
        id: 'perspective-coverage',
        label: 'Perspective coverage',
        explanation: explored.length
          ? `You encountered: ${listLabels(exploredLabels)}.`
          : 'No perspectives were explored yet.',
      },
      {
        id: 'evidence-awareness',
        label: 'Evidence awareness',
        explanation:
          evidenceRatio > 0
            ? `You chose evidence-oriented answers ${Math.round(evidenceRatio * answered)} of ${answered} times — checking claims against what supports them.`
            : "You have not engaged with evidence-oriented questions yet; the claims you met still have sources you haven't checked.",
      },
      {
        id: 'source-diversity',
        label: 'Source diversity',
        explanation: sourceEngaged
          ? 'You compared where information comes from — primary voices and institutional sources were part of your path.'
          : 'You have not compared sources directly yet; primary-source evidence behind the claims remains unexplored.',
      },
      {
        id: 'context-awareness',
        label: 'Context awareness',
        explanation:
          contextRatio > 0
            ? `You considered framing and consequence ${Math.round(contextRatio * answered)} of ${answered} times — how context shapes meaning.`
            : 'You have not weighed framing or consequences yet; context is a dimension you could explore next.',
      },
      {
        id: 'topic-depth',
        label: 'Topic depth',
        explanation: `You followed the branch ${answered} steps deep of a ${pathLength}-step path.`,
      },
    ] as Array<{ id: ProfileMetricId; label: string; explanation: string }>
  ).map((m) => ({
    ...m,
    value: blend(m.id, rawMetrics[m.id], prior),
  }));

  const { evidencePreference, sourcePreference } = derivePreferences(responses);

  return {
    topicId: topic.id,
    createdAt: prior?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attempt,
    metrics,
    exploredDimensions: explored,
    unexploredDimensions: unexplored,
    evidencePreference,
    sourcePreference,
    reasoningPath: responses.map((r) => r.pathLabel).filter((p): p is string => Boolean(p)),
    narrative: buildNarrative(
      topic,
      exploredLabels,
      unexploredLabels,
      evidenceRatio,
      sourceEngaged,
      prior,
    ),
  };
}

/** Merge dimensions explored outside the case study (perspective map) into a profile. */
export function mergeExploredIntoProfile(
  profile: AwarenessProfile,
  topic: Topic,
  kinds: TopicDimensionKind[],
): AwarenessProfile {
  const explored = union(profile.exploredDimensions, kinds);
  const topicKinds = topic.dimensions.map((d) => d.kind);
  const unexplored = topicKinds.filter((kind) => !explored.includes(kind));

  const depthMetric = profile.metrics.find((m) => m.id === 'topic-depth');
  const coverageMetric = profile.metrics.find((m) => m.id === 'perspective-coverage');

  const metrics = profile.metrics.map((m) => {
    if (m.id === 'topic-depth' && depthMetric) {
      return { ...m, value: Math.min(m.value + 8, 100) };
    }
    if (m.id === 'perspective-coverage' && coverageMetric) {
      return {
        ...m,
        value: topicKinds.length
          ? Math.round((explored.length / topicKinds.length) * 100)
          : m.value,
        explanation: `You encountered: ${listLabels(explored.map(getDimensionLabel))}.`,
      };
    }
    return m;
  });

  const newKinds = kinds.map(getDimensionLabel);
  const narrative = `${profile.narrative} After exploring ${listLabels(newKinds)}, your coverage of the topic widened.`;

  return {
    ...profile,
    updatedAt: new Date().toISOString(),
    metrics,
    exploredDimensions: explored,
    unexploredDimensions: unexplored,
    narrative,
  };
}

/** Bump source-diversity when the user opens a source. */
export function markSourceOpenedInProfile(
  profile: AwarenessProfile,
  sourceTitle: string,
): AwarenessProfile {
  const metrics = profile.metrics.map((m) => {
    if (m.id === 'source-diversity') {
      return {
        ...m,
        value: Math.min(m.value + 6, 100),
        explanation: `You opened "${sourceTitle}" — your engagement with sources is growing.`,
      };
    }
    return m;
  });
  return { ...profile, updatedAt: new Date().toISOString(), metrics };
}

/**
 * Gap detection — compare the topic's dimensions against the dimensions the
 * user has explored. Returns what was covered and what is still missing.
 */
export function detectGaps(
  topic: Topic,
  encounteredKinds: TopicDimensionKind[],
): { explored: TopicDimensionKind[]; missing: TopicDimensionKind[] } {
  const topicKinds = topic.dimensions.map((d) => d.kind);
  const explored = topicKinds.filter((kind) => encounteredKinds.includes(kind));
  const missing = topicKinds.filter((kind) => !encounteredKinds.includes(kind));
  return { explored, missing };
}

/** Longest path length from the entry question (for progress + depth scaling). */
export function estimatePathLength(
  questions: Record<string, CaseQuestion>,
  entryId: string,
): number {
  const memo = new Map<string, number>();
  const depth = (id: string): number => {
    if (memo.has(id)) return memo.get(id)!;
    const q = questions[id];
    if (!q) return 0;
    const childDepths = q.options.map((o) => (o.nextQuestionId ? depth(o.nextQuestionId) : 0));
    const result = 1 + (childDepths.length ? Math.max(...childDepths) : 0);
    memo.set(id, result);
    return result;
  };
  return depth(entryId);
}

function questionType(caseStudy: CaseStudy, questionId: string) {
  return caseStudy.questions[questionId]?.type;
}

function derivePreferences(responses: UserResponse[]): {
  evidencePreference: EvidencePreference;
  sourcePreference: SourcePreference;
} {
  // Derived from the reasoning path labels, so it works across case studies
  // rather than depending on a specific question's option ids.
  let evidencePreference: EvidencePreference = 'balanced';
  let sourcePreference: SourcePreference = 'mixed';

  for (const response of responses) {
    const label = response.pathLabel?.toLowerCase() ?? '';
    if (/worker|interview|primary/.test(label)) {
      evidencePreference = 'primary';
      sourcePreference = 'social';
    } else if (/union|reporter|coverage|press/.test(label)) {
      evidencePreference = 'expert';
      sourcePreference = 'news';
    } else if (/history|historical|past|study|research|methodology|data/.test(label)) {
      evidencePreference = 'expert';
      sourcePreference = 'academic';
    } else if (/court|statute|law|legal|regulator|ruling/.test(label)) {
      sourcePreference = 'government';
    } else if (/watchdog|official|platform|transparency/.test(label)) {
      sourcePreference = 'mixed';
    }
  }

  return { evidencePreference, sourcePreference };
}

function buildNarrative(
  topic: Topic,
  exploredLabels: string[],
  unexploredLabels: string[],
  evidenceRatio: number,
  sourceEngaged: boolean,
  prior?: AwarenessProfile | null,
): string {
  const parts: string[] = [];

  if (prior) {
    parts.push(
      `On this second pass through ${topic.title}, you explored further — your profile has been updated to reflect the new ground you covered.`,
    );
  } else if (exploredLabels.length) {
    parts.push(`Your exploration of ${topic.title} focused on ${listLabels(exploredLabels)}.`);
  } else {
    parts.push(`Your exploration of ${topic.title} is just beginning.`);
  }

  if (evidenceRatio < 0.4) {
    parts.push(
      "You engaged more with perspectives than with evidence-oriented questions — the claims you met still have sources you haven't checked.",
    );
  } else {
    parts.push('You regularly checked claims against their evidence.');
  }

  if (!sourceEngaged) {
    parts.push('Primary-source evidence behind the claims you encountered remains unexplored.');
  }

  if (unexploredLabels.length) {
    parts.push(`Dimensions you haven't touched yet include ${listLabels(unexploredLabels)}.`);
  }

  return parts.join(' ');
}

function listLabels(labels: string[]): string {
  if (labels.length === 0) return 'none';
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
}

function union(...arrays: TopicDimensionKind[][]): TopicDimensionKind[] {
  return [...new Set(arrays.flat())];
}

function round(n: number): number {
  return Math.round(n);
}

function blend(metricId: ProfileMetricId, value: number, prior?: AwarenessProfile | null): number {
  if (!prior) return value;
  const prev = prior.metrics.find((m) => m.id === metricId);
  if (!prev) return value;
  return round(0.6 * value + 0.4 * prev.value);
}
