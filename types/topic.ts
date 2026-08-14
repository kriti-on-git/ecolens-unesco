/**
 * Topic model — the curated information landscape.
 *
 * Topics are organized by time, category, and a prototype trend signal.
 * All data is typed local data for the prototype; these structures are
 * designed to map onto PostgreSQL / external news APIs later without
 * rewriting the UI.
 */

export type TopicCategoryId =
  | 'politics'
  | 'technology'
  | 'science'
  | 'literature'
  | 'society'
  | 'economics'
  | 'environment'
  | 'history'
  | 'law'
  | 'education'
  | 'global-affairs';

export interface TopicCategory {
  id: TopicCategoryId;
  label: string;
  description: string;
}

/** Prototype time grouping for the discovery surface. */
export type TopicTimeGroup = 'happening-now' | 'today' | 'this-week' | 'emerging';

/**
 * The perspective dimensions of an information ecosystem.
 * Case studies, profiles, and knowledge graphs all reference these kinds.
 */
export type TopicDimensionKind =
  | 'historical'
  | 'economic'
  | 'legal'
  | 'social'
  | 'political'
  | 'scientific'
  | 'environmental'
  | 'cultural'
  | 'education'
  | 'individual'
  | 'institutional'
  | 'international'
  | 'ethical';

export interface TopicDimension {
  id: string;
  kind: TopicDimensionKind;
  label: string;
  description: string;
  /** Short tag shown in the perspective map and profile. */
  tag: string;
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  whyItMatters: string;
  categoryId: TopicCategoryId;
  timeGroup: TopicTimeGroup;
  /** 0–1 prototype popularity signal. */
  trendSignal: number;
  /** Approximate number of active discussions — prototype signal. */
  discussionCount: number;
  dimensions: TopicDimension[];
  createdAt: string;
  updatedAt: string;
}
