import type { Source } from './source';
import type { TopicDimensionKind } from './topic';

/**
 * Recommendation model.
 *
 * Every recommendation must explain *why* it was recommended — typically
 * because it covers an unexplored perspective or is the primary source
 * behind a claim the user encountered. Never optimized purely for engagement.
 */

export type RecommendationReasonKind =
  | 'missing-perspective'
  | 'primary-source'
  | 'contrasting-evidence'
  | 'deepen-topic'
  | 'follow-up-question';

export interface Recommendation {
  id: string;
  topicId: string;
  source: Source;
  /** The dimension this recommendation serves. */
  dimensionKind: TopicDimensionKind;
  reasonKind: RecommendationReasonKind;
  /** Human-readable explanation of the recommendation. */
  whyRecommended: string;
  /** Set once the user opens the recommendation. */
  openedAt?: string;
}
