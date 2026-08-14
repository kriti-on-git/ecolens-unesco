import type { TopicDimensionKind } from './topic';

/**
 * Source model — articles, reports, books, videos, primary sources, etc.
 * Every source carries a nutrition label so the user can see what kind of
 * information they are looking at before drawing conclusions.
 */

export type SourceType =
  | 'article'
  | 'report'
  | 'research'
  | 'book'
  | 'video'
  | 'government-document'
  | 'court-judgment'
  | 'primary-source'
  | 'expert-commentary'
  | 'local-reporting'
  | 'international-reporting'
  | 'social-post'
  | 'podcast';

/**
 * Never a simplistic "truth percentage" — these classifications describe
 * the nature of the content, not its correctness.
 */
export type ContentClassification =
  'verified-fact' | 'disputed-claim' | 'opinion' | 'interpretation' | 'insufficient-evidence';

export type AvailabilityLevel = 'high' | 'medium' | 'low';
export type EmotionalFraming = 'neutral' | 'mild' | 'strong';

export interface NutritionLabel {
  source: string;
  publishedAt?: string;
  evidenceAvailability: AvailabilityLevel;
  primarySourceAvailability: AvailabilityLevel;
  contextAvailability: AvailabilityLevel;
  emotionalFraming: EmotionalFraming;
  relatedPerspectives: string[];
  sourceDiversity: AvailabilityLevel;
}

export interface Source {
  id: string;
  title: string;
  sourceName: string;
  type: SourceType;
  url: string;
  publishedAt?: string;
  description: string;
  /** Perspectives this source speaks to. */
  dimensionKinds: TopicDimensionKind[];
  classification: ContentClassification;
  nutritionLabel: NutritionLabel;
}
