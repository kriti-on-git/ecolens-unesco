import type { TopicDimensionKind } from './topic';

/**
 * Knowledge graph model — typed graph data rendered with React Flow.
 *
 * The structure is intentionally Neo4j-shaped (nodes + typed edges) so the
 * prototype data can move to a graph database later without UI rewrites.
 */

export type KnowledgeNodeType =
  | 'topic'
  | 'dimension'
  | 'claim'
  | 'evidence'
  | 'source'
  | 'article'
  | 'report'
  | 'research'
  | 'book'
  | 'government-document'
  | 'court-judgment'
  | 'primary-source'
  | 'historical-context'
  | 'expert-analysis'
  | 'local-reporting'
  | 'international-reporting'
  | 'related-issue'
  | 'stakeholder';

export interface KnowledgeNode {
  id: string;
  label: string;
  type: KnowledgeNodeType;
  dimensionKind?: TopicDimensionKind;
  summary: string;
  /** Vertical position used for layout (0 = topic root). */
  level: number;
  /** Deep links into source content. */
  sourceIds?: string[];
  metadata?: Record<string, string | number | boolean>;
}

export interface KnowledgeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  /** e.g. "supports", "contradicts", "contextualizes". */
  relation: string;
}

export interface KnowledgeGraph {
  id: string;
  topicId: string;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}
