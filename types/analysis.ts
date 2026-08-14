import type { ContentClassification, NutritionLabel } from './source';

/**
 * Content analysis model — the result of analyzing user-supplied input
 * (pasted URL, pasted text, or uploaded screenshot). For the prototype this
 * is deterministic mock output; in the future the AI layer fills it in.
 */

export type ContentInputType = 'url' | 'text' | 'screenshot';

export interface ContentAnalysis {
  id: string;
  /** The pasted URL / text / screenshot reference that was analyzed. */
  inputRef: string;
  inputType: ContentInputType;
  summary: string;
  claims: string[];
  /** Dimensions this content covers. */
  dimensionsCovered: string[];
  classification: ContentClassification;
  nutritionLabel: NutritionLabel;
  createdAt: string;
}
