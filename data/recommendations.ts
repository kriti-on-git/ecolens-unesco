import type { Recommendation } from '@/types';

/**
 * Mock recommendations for the demo topics.
 *
 * Every recommendation carries an explicit, human-readable reason so the
 * user always understands *why* it was surfaced — typically because it
 * covers an unexplored perspective or is the primary source behind a claim
 * they encountered. Hardcoded prototype data.
 */
export const recommendations: Recommendation[] = [
  {
    id: 'rec-alignment-book',
    topicId: 'topic-ai-regulation',
    source: {
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
    dimensionKind: 'ethical',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the ethical dimension of AI — a perspective your exploration has not touched yet.',
  },
  {
    id: 'rec-draft-statute',
    topicId: 'topic-ai-regulation',
    source: {
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
    dimensionKind: 'legal',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the primary source behind the legal claims you encountered in the case study.',
  },
  {
    id: 'rec-reg-monitor',
    topicId: 'topic-ai-regulation',
    source: {
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
    dimensionKind: 'international',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the international dimension — how other countries are approaching the same question.',
  },
  {
    id: 'rec-labor-research',
    topicId: 'topic-ai-regulation',
    source: {
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
    dimensionKind: 'economic',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      "Recommended because this peer-reviewed study complicates the 'automation destroys jobs' claim with evidence you have not seen.",
  },
  {
    id: 'rec-court-ruling',
    topicId: 'topic-ai-regulation',
    source: {
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
    dimensionKind: 'legal',
    reasonKind: 'deepen-topic',
    whyRecommended:
      "Recommended because this court ruling deepens the legal dimension — a precedent directly cited in today's debate.",
  },
  {
    id: 'rec-hearing-transcript',
    topicId: 'topic-ai-regulation',
    source: {
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
    dimensionKind: 'institutional',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the primary record of the institutional debate — you can hear the actual arguments in full.',
  },
  {
    id: 'rec-expert-opinion',
    topicId: 'topic-ai-regulation',
    source: {
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
    dimensionKind: 'scientific',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      'Recommended because it is a clearly-labeled expert opinion that argues against the position most coverage assumes — worth reading as a contrast.',
  },
];

export function getRecommendationsForTopic(topicId: string): Recommendation[] {
  return recommendations.filter((recommendation) => recommendation.topicId === topicId);
}
