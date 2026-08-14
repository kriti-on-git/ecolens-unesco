import type { Source } from '@/types';

/**
 * Mock sources for the demo topics.
 *
 * Hardcoded prototype data — metadata (title, date, description, nutrition
 * label) is designed to be replaced by search/news APIs later without
 * changing the UI. Source names are illustrative placeholders.
 */
export const sources: Source[] = [
  {
    id: 'src-techwire-law',
    title: 'The New AI Law: What It Actually Requires',
    sourceName: 'TechWire',
    type: 'article',
    url: 'https://example.com/techwire/new-ai-law-requirements',
    publishedAt: '2026-08-12',
    description:
      "A plain-language walkthrough of the draft law's obligations for developers and deployers of high-risk AI systems.",
    dimensionKinds: ['legal', 'economic'],
    classification: 'verified-fact',
    nutritionLabel: {
      source: 'TechWire (newsroom)',
      publishedAt: '2026-08-12',
      evidenceAvailability: 'medium',
      primarySourceAvailability: 'high',
      contextAvailability: 'high',
      emotionalFraming: 'neutral',
      relatedPerspectives: ['Legal perspective', 'Economic dimension'],
      sourceDiversity: 'high',
    },
  },
  {
    id: 'src-reg-monitor',
    title: 'State of AI Regulation Across 12 Jurisdictions',
    sourceName: 'International AI Governance Monitor',
    type: 'report',
    url: 'https://example.com/monitor/ai-regulation-12-jurisdictions',
    publishedAt: '2026-07-28',
    description:
      'A comparative report mapping how twelve governments are approaching AI rule-making, from comprehensive statutes to voluntary codes.',
    dimensionKinds: ['international', 'legal'],
    classification: 'verified-fact',
    nutritionLabel: {
      source: 'International AI Governance Monitor (research org)',
      publishedAt: '2026-07-28',
      evidenceAvailability: 'high',
      primarySourceAvailability: 'high',
      contextAvailability: 'medium',
      emotionalFraming: 'neutral',
      relatedPerspectives: ['International dimension', 'Legal perspective'],
      sourceDiversity: 'high',
    },
  },
  {
    id: 'src-labor-research',
    title: 'Automation and Labor Markets: Evidence from 15 OECD Countries',
    sourceName: 'Center for Applied AI Research',
    type: 'research',
    url: 'https://example.com/caair/automation-labor-markets',
    publishedAt: '2026-06-15',
    description:
      'A peer-reviewed study measuring realized automation effects on employment across fifteen economies — findings are more mixed than headline claims suggest.',
    dimensionKinds: ['economic', 'scientific'],
    classification: 'verified-fact',
    nutritionLabel: {
      source: 'Center for Applied AI Research (academic)',
      publishedAt: '2026-06-15',
      evidenceAvailability: 'high',
      primarySourceAvailability: 'medium',
      contextAvailability: 'medium',
      emotionalFraming: 'neutral',
      relatedPerspectives: ['Economic dimension', 'Scientific dimension'],
      sourceDiversity: 'high',
    },
  },
  {
    id: 'src-alignment-book',
    title: 'The Alignment Problem: Machine Learning and Human Values',
    sourceName: 'Brian Christian (W. W. Norton)',
    type: 'book',
    url: 'https://example.com/books/alignment-problem',
    publishedAt: '2021-01-01',
    description:
      'A widely cited book tracing why building AI systems that reliably do what we intend is hard — and why that matters for regulation.',
    dimensionKinds: ['ethical', 'scientific'],
    classification: 'interpretation',
    nutritionLabel: {
      source: 'Brian Christian / W. W. Norton (publisher)',
      publishedAt: '2021-01-01',
      evidenceAvailability: 'medium',
      primarySourceAvailability: 'low',
      contextAvailability: 'high',
      emotionalFraming: 'neutral',
      relatedPerspectives: ['Ethical dimension', 'Scientific dimension'],
      sourceDiversity: 'medium',
    },
  },
  {
    id: 'src-policy5-video',
    title: 'What the AI Law Means for You — An Explainer',
    sourceName: 'Policy in 5',
    type: 'video',
    url: 'https://example.com/policyin5/ai-law-explainer',
    publishedAt: '2026-08-05',
    description:
      "A five-minute animated explainer of the law's practical effects on everyday services, from hiring tools to healthcare algorithms.",
    dimensionKinds: ['individual', 'legal'],
    classification: 'interpretation',
    nutritionLabel: {
      source: 'Policy in 5 (explainer channel)',
      publishedAt: '2026-08-05',
      evidenceAvailability: 'low',
      primarySourceAvailability: 'low',
      contextAvailability: 'medium',
      emotionalFraming: 'mild',
      relatedPerspectives: ['Individual perspective', 'Legal perspective'],
      sourceDiversity: 'low',
    },
  },
  {
    id: 'src-draft-statute',
    title: 'Draft Statute on the Governance of AI Systems — Explanatory Memorandum',
    sourceName: 'National Parliament (official)',
    type: 'government-document',
    url: 'https://example.com/parliament/draft-ai-statute',
    publishedAt: '2026-07-15',
    description:
      "The official text of the proposed law with the parliament's explanatory memorandum, including the definition of high-risk systems and enforcement machinery.",
    dimensionKinds: ['legal', 'institutional'],
    classification: 'verified-fact',
    nutritionLabel: {
      source: 'National Parliament (government)',
      publishedAt: '2026-07-15',
      evidenceAvailability: 'high',
      primarySourceAvailability: 'high',
      contextAvailability: 'high',
      emotionalFraming: 'neutral',
      relatedPerspectives: ['Legal perspective', 'Institutional perspective'],
      sourceDiversity: 'medium',
    },
  },
  {
    id: 'src-court-ruling',
    title: 'Ruling on Automated Decision-Making and Due Process',
    sourceName: 'Federal Administrative Court',
    type: 'court-judgment',
    url: 'https://example.com/courts/automated-decisions-ruling',
    publishedAt: '2026-03-19',
    description:
      'A court ruling requiring meaningful human review when automated systems decide benefits claims — a precedent cited in the current debate.',
    dimensionKinds: ['legal', 'individual'],
    classification: 'verified-fact',
    nutritionLabel: {
      source: 'Federal Administrative Court (judicial)',
      publishedAt: '2026-03-19',
      evidenceAvailability: 'high',
      primarySourceAvailability: 'high',
      contextAvailability: 'medium',
      emotionalFraming: 'neutral',
      relatedPerspectives: ['Legal perspective', 'Individual perspective'],
      sourceDiversity: 'medium',
    },
  },
  {
    id: 'src-hearing-transcript',
    title: 'Transcript: Public Hearing on AI Governance, Day 3',
    sourceName: 'Parliamentary Archives',
    type: 'primary-source',
    url: 'https://example.com/parliament/hearing-transcript-day3',
    publishedAt: '2026-07-22',
    description:
      'Verbatim testimony from engineers, labor representatives, and legal scholars, including the exchanges on model transparency and enforcement.',
    dimensionKinds: ['institutional', 'social'],
    classification: 'verified-fact',
    nutritionLabel: {
      source: 'Parliamentary Archives (primary record)',
      publishedAt: '2026-07-22',
      evidenceAvailability: 'high',
      primarySourceAvailability: 'high',
      contextAvailability: 'high',
      emotionalFraming: 'neutral',
      relatedPerspectives: ['Institutional perspective', 'Social dimension'],
      sourceDiversity: 'high',
    },
  },
  {
    id: 'src-expert-opinion',
    title: 'Why I Testify Against the Cap on Open Models',
    sourceName: 'Prof. Ada Lindqvist (commentary)',
    type: 'expert-commentary',
    url: 'https://example.com/commentary/against-open-model-cap',
    publishedAt: '2026-08-01',
    description:
      "A prominent researcher's argument that restricting openly released models would slow safety research — labeled as opinion, with cited sources.",
    dimensionKinds: ['scientific', 'ethical'],
    classification: 'opinion',
    nutritionLabel: {
      source: 'Prof. Ada Lindqvist (individual expert)',
      publishedAt: '2026-08-01',
      evidenceAvailability: 'medium',
      primarySourceAvailability: 'low',
      contextAvailability: 'medium',
      emotionalFraming: 'mild',
      relatedPerspectives: ['Scientific dimension', 'Ethical dimension'],
      sourceDiversity: 'medium',
    },
  },
  {
    id: 'src-civic-thread',
    title: 'Thread: What Local Reporters Are Finding About AI in Hiring',
    sourceName: '@civictechdesk',
    type: 'social-post',
    url: 'https://example.com/civictechdesk/ai-hiring-thread',
    publishedAt: '2026-08-09',
    description:
      'A curated thread collecting local reporting on automated hiring tools, with links back to the original articles for verification.',
    dimensionKinds: ['social', 'individual'],
    classification: 'interpretation',
    nutritionLabel: {
      source: '@civictechdesk (social account)',
      publishedAt: '2026-08-09',
      evidenceAvailability: 'low',
      primarySourceAvailability: 'medium',
      contextAvailability: 'medium',
      emotionalFraming: 'mild',
      relatedPerspectives: ['Social dimension', 'Individual perspective'],
      sourceDiversity: 'medium',
    },
  },
];

export function getSource(id: string): Source | undefined {
  return sources.find((source) => source.id === id);
}

export function getSourcesByIds(ids: string[]): Source[] {
  return ids.map(getSource).filter((source): source is Source => Boolean(source));
}
