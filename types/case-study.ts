import type { TopicDimensionKind } from './topic';

/**
 * Case study model — an adaptive, branching exploration.
 *
 * Case studies are not quizzes. Options are never correct/incorrect;
 * instead each option reveals how the user currently approaches the
 * issue and routes them onto a different branch.
 */

export type CaseQuestionType =
  | 'assumption'
  | 'interpretation'
  | 'evidence'
  | 'priority'
  | 'cause'
  | 'consequence'
  | 'stakeholder'
  | 'uncertainty'
  | 'source-selection';

export interface CaseOption {
  id: string;
  label: string;
  /** The dimension this option leans toward — drives branching and scoring. */
  dimensionKind?: TopicDimensionKind;
  /** Id of the next question, or null to end this branch. */
  nextQuestionId?: string | null;
  /** Reasoning-path label used in profile explanations. */
  pathLabel?: string;
}

export interface CaseQuestion {
  id: string;
  type: CaseQuestionType;
  /** Short scenario framing the question in context. */
  scenario: string;
  prompt: string;
  options: CaseOption[];
  /** Dimensions this question touches — recorded into the awareness profile. */
  relatedDimensionKinds: TopicDimensionKind[];
}

export interface CaseStudy {
  id: string;
  slug: string;
  topicId: string;
  title: string;
  intro: string;
  entryQuestionId: string;
  questions: Record<string, CaseQuestion>;
  /**
   * Alternate branches for a second pass. Keyed by a dimension the user
   * previously ignored — returning users see different questions.
   */
  followUpBranches?: Record<TopicDimensionKind, CaseQuestion[]>;
}

export interface UserResponse {
  questionId: string;
  optionId: string;
  /** Millisecond timestamp. */
  answeredAt: number;
  dimensionKinds: TopicDimensionKind[];
  pathLabel?: string;
}
