import type { KnowledgeEdge, KnowledgeGraph, KnowledgeNode } from '@/types';

/**
 * Mock knowledge graphs for the demo topics.
 *
 * Typed graph data (nodes + typed edges) rendered with React Flow. The
 * structure is Neo4j-shaped so it can move to a graph database later
 * without rewriting the UI. Hardcoded prototype data.
 */

const aiRegulationNodes: KnowledgeNode[] = [
  {
    id: 'n-topic',
    label: 'The Global Push to Regulate AI',
    type: 'topic',
    summary:
      'A landmark AI law moving through parliament — the debate spans safety, innovation, rights, and global competition.',
    level: 0,
  },
  {
    id: 'n-dim-legal',
    label: 'Legal perspective',
    type: 'dimension',
    dimensionKind: 'legal',
    summary: 'What the proposed law requires, who enforces it, and how courts interpret it.',
    level: 1,
  },
  {
    id: 'n-dim-economic',
    label: 'Economic dimension',
    type: 'dimension',
    dimensionKind: 'economic',
    summary: 'Innovation, jobs, competitiveness, and the economics of compliance.',
    level: 1,
  },
  {
    id: 'n-dim-ethical',
    label: 'Ethical dimension',
    type: 'dimension',
    dimensionKind: 'ethical',
    summary: 'Trade-offs between innovation, safety, fairness, and accountability.',
    level: 1,
  },
  {
    id: 'n-dim-international',
    label: 'International dimension',
    type: 'dimension',
    dimensionKind: 'international',
    summary: 'How other jurisdictions are approaching the same regulatory question.',
    level: 1,
  },
  {
    id: 'n-claim-high-risk',
    label: "The law applies to 'high-risk' systems",
    type: 'claim',
    dimensionKind: 'legal',
    summary: "The statute's central obligation turns on which systems count as high-risk.",
    level: 2,
    sourceIds: ['src-draft-statute', 'src-techwire-law'],
  },
  {
    id: 'n-claim-innovation',
    label: 'Regulation will slow innovation',
    type: 'claim',
    dimensionKind: 'economic',
    summary: 'A frequently repeated claim that compliance costs will push development elsewhere.',
    level: 2,
    sourceIds: ['src-expert-opinion', 'src-labor-research'],
  },
  {
    id: 'n-claim-trust',
    label: 'Safety standards will raise consumer trust',
    type: 'claim',
    dimensionKind: 'ethical',
    summary: 'The counter-claim that clearer rules make people more willing to use AI services.',
    level: 2,
    sourceIds: ['src-hearing-transcript'],
  },
  {
    id: 'n-claim-divergence',
    label: 'Other jurisdictions are moving faster',
    type: 'claim',
    dimensionKind: 'international',
    summary: 'Comparisons between comprehensive statutes abroad and voluntary codes at home.',
    level: 2,
    sourceIds: ['src-reg-monitor'],
  },
  {
    id: 'n-evidence-definition',
    label: 'Explanatory memorandum defines high-risk',
    type: 'evidence',
    dimensionKind: 'legal',
    summary: 'The official memorandum lists the sectors and use cases that trigger obligations.',
    level: 3,
    sourceIds: ['src-draft-statute'],
  },
  {
    id: 'n-evidence-labor',
    label: 'OECD labor study: mixed effects so far',
    type: 'evidence',
    dimensionKind: 'economic',
    summary:
      'Fifteen-country evidence shows realized displacement is more limited and uneven than headlines suggest.',
    level: 3,
    sourceIds: ['src-labor-research'],
  },
  {
    id: 'n-evidence-testimony',
    label: 'Hearing testimony on model transparency',
    type: 'evidence',
    dimensionKind: 'ethical',
    summary:
      'Engineers and scholars testify about whether transparency requirements are technically feasible.',
    level: 3,
    sourceIds: ['src-hearing-transcript'],
  },
  {
    id: 'n-evidence-comparison',
    label: '12-jurisdiction regulatory comparison',
    type: 'evidence',
    dimensionKind: 'international',
    summary:
      'A systematic map of statute-based and code-based approaches across twelve governments.',
    level: 3,
    sourceIds: ['src-reg-monitor'],
  },
  {
    id: 'n-src-statute',
    label: 'Draft Statute (government)',
    type: 'government-document',
    dimensionKind: 'legal',
    summary: 'The primary legal text with explanatory memorandum.',
    level: 4,
    sourceIds: ['src-draft-statute'],
  },
  {
    id: 'n-src-labor',
    label: 'Automation & Labor Markets (research)',
    type: 'research',
    dimensionKind: 'economic',
    summary: 'Peer-reviewed study of realized automation effects on employment.',
    level: 4,
    sourceIds: ['src-labor-research'],
  },
  {
    id: 'n-src-hearing',
    label: 'Hearing transcript (primary record)',
    type: 'primary-source',
    dimensionKind: 'institutional',
    summary: 'Verbatim public hearing testimony, day 3.',
    level: 4,
    sourceIds: ['src-hearing-transcript'],
  },
  {
    id: 'n-src-monitor',
    label: 'AI Regulation Monitor (report)',
    type: 'report',
    dimensionKind: 'international',
    summary: 'Comparative report across twelve jurisdictions.',
    level: 4,
    sourceIds: ['src-reg-monitor'],
  },
  {
    id: 'n-src-book',
    label: 'The Alignment Problem (book)',
    type: 'book',
    dimensionKind: 'ethical',
    summary: 'Why building AI systems that reliably do what we intend is hard.',
    level: 4,
    sourceIds: ['src-alignment-book'],
  },
];

const aiRegulationEdges: KnowledgeEdge[] = [
  { id: 'e1', sourceId: 'n-topic', targetId: 'n-dim-legal', relation: 'has-dimension' },
  { id: 'e2', sourceId: 'n-topic', targetId: 'n-dim-economic', relation: 'has-dimension' },
  { id: 'e3', sourceId: 'n-topic', targetId: 'n-dim-ethical', relation: 'has-dimension' },
  { id: 'e4', sourceId: 'n-topic', targetId: 'n-dim-international', relation: 'has-dimension' },
  { id: 'e5', sourceId: 'n-dim-legal', targetId: 'n-claim-high-risk', relation: 'hosts' },
  { id: 'e6', sourceId: 'n-dim-economic', targetId: 'n-claim-innovation', relation: 'hosts' },
  { id: 'e7', sourceId: 'n-dim-ethical', targetId: 'n-claim-trust', relation: 'hosts' },
  { id: 'e8', sourceId: 'n-dim-international', targetId: 'n-claim-divergence', relation: 'hosts' },
  {
    id: 'e9',
    sourceId: 'n-claim-high-risk',
    targetId: 'n-evidence-definition',
    relation: 'supported-by',
  },
  {
    id: 'e10',
    sourceId: 'n-claim-innovation',
    targetId: 'n-evidence-labor',
    relation: 'contradicted-by',
  },
  {
    id: 'e11',
    sourceId: 'n-claim-trust',
    targetId: 'n-evidence-testimony',
    relation: 'supported-by',
  },
  {
    id: 'e12',
    sourceId: 'n-claim-divergence',
    targetId: 'n-evidence-comparison',
    relation: 'supported-by',
  },
  {
    id: 'e13',
    sourceId: 'n-evidence-definition',
    targetId: 'n-src-statute',
    relation: 'drawn-from',
  },
  { id: 'e14', sourceId: 'n-evidence-labor', targetId: 'n-src-labor', relation: 'drawn-from' },
  {
    id: 'e15',
    sourceId: 'n-evidence-testimony',
    targetId: 'n-src-hearing',
    relation: 'drawn-from',
  },
  {
    id: 'e16',
    sourceId: 'n-evidence-comparison',
    targetId: 'n-src-monitor',
    relation: 'drawn-from',
  },
  { id: 'e17', sourceId: 'n-dim-ethical', targetId: 'n-src-book', relation: 'references' },
];

export const knowledgeGraphs: KnowledgeGraph[] = [
  {
    id: 'graph-ai-regulation',
    topicId: 'topic-ai-regulation',
    nodes: aiRegulationNodes,
    edges: aiRegulationEdges,
  },
];

export function getKnowledgeGraph(topicId: string): KnowledgeGraph | undefined {
  return knowledgeGraphs.find((graph) => graph.topicId === topicId);
}
