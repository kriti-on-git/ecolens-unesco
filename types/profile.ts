import type { TopicDimensionKind } from './topic';

/**
 * Awareness profile model.
 *
 * Describes the user's interaction and information coverage for one topic —
 * never their identity or a personality diagnosis. Scores always come with
 * an explanation grounded in what the user actually explored.
 */

export type ProfileMetricId =
  | 'information-awareness'
  | 'perspective-coverage'
  | 'evidence-awareness'
  | 'source-diversity'
  | 'context-awareness'
  | 'topic-depth';

export interface ProfileMetric {
  id: ProfileMetricId;
  label: string;
  /** 0–100. */
  value: number;
  /** Why this score exists — grounded in explored dimensions/content. */
  explanation: string;
}

export type EvidencePreference = 'anecdotal' | 'expert' | 'primary' | 'balanced';
export type SourcePreference = 'news' | 'academic' | 'government' | 'social' | 'mixed';

export interface AwarenessProfile {
  topicId: string;
  createdAt: string;
  updatedAt: string;
  /** Which attempt at the case study produced this profile. */
  attempt: number;
  metrics: ProfileMetric[];
  exploredDimensions: TopicDimensionKind[];
  unexploredDimensions: TopicDimensionKind[];
  evidencePreference?: EvidencePreference;
  sourcePreference?: SourcePreference;
  /** Ordered labels of the reasoning path taken. */
  reasoningPath: string[];
  /** Neutral narrative built from exploration, e.g. "your exploration has focused heavily on…" */
  narrative: string;
}
