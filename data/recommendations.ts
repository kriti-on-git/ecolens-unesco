import { sources } from './sources';
import type { Recommendation } from '@/types';

/**
 * Mock recommendations for the demo topics.
 *
 * Every recommendation carries an explicit, human-readable reason so the
 * user always understands *why* it was surfaced — typically because it
 * covers an unexplored perspective or is the primary source behind a claim
 * they encountered. Sources come from the shared registry (data/sources.ts),
 * so metadata lives in one place. Hardcoded prototype data.
 */

function src(id: string) {
  const source = sources.find((s) => s.id === id);
  if (!source) throw new Error(`Missing source for recommendation: ${id}`);
  return source;
}

export const recommendations: Recommendation[] = [
  // ---- The Global Push to Regulate AI ----
  {
    id: 'rec-alignment-book',
    topicId: 'topic-ai-regulation',
    source: src('src-alignment-book'),
    dimensionKind: 'ethical',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the ethical dimension of AI — a perspective your exploration has not touched yet.',
  },
  {
    id: 'rec-draft-statute',
    topicId: 'topic-ai-regulation',
    source: src('src-draft-statute'),
    dimensionKind: 'legal',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the primary source behind the legal claims you encountered in the case study.',
  },
  {
    id: 'rec-reg-monitor',
    topicId: 'topic-ai-regulation',
    source: src('src-reg-monitor'),
    dimensionKind: 'international',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the international dimension — how other countries are approaching the same question.',
  },
  {
    id: 'rec-labor-research',
    topicId: 'topic-ai-regulation',
    source: src('src-labor-research'),
    dimensionKind: 'economic',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      "Recommended because this peer-reviewed study complicates the 'automation destroys jobs' claim with evidence you have not seen.",
  },
  {
    id: 'rec-court-ruling',
    topicId: 'topic-ai-regulation',
    source: src('src-court-ruling'),
    dimensionKind: 'legal',
    reasonKind: 'deepen-topic',
    whyRecommended:
      "Recommended because this court ruling deepens the legal dimension — a precedent cited in today's debate.",
  },
  {
    id: 'rec-hearing-transcript',
    topicId: 'topic-ai-regulation',
    source: src('src-hearing-transcript'),
    dimensionKind: 'institutional',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the primary record of the institutional debate — you can hear the actual arguments in full.',
  },
  {
    id: 'rec-expert-opinion',
    topicId: 'topic-ai-regulation',
    source: src('src-expert-opinion'),
    dimensionKind: 'scientific',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      'Recommended because it is a clearly-labeled expert opinion that argues against the position most coverage assumes — worth reading as a contrast.',
  },

  // ---- Misinformation in the Coming Elections ----
  {
    id: 'rec-misinfo-factcheck',
    topicId: 'topic-misinformation',
    source: src('src-factcheck-roundup'),
    dimensionKind: 'political',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the verified roundup behind the clip claims you encountered — what is real, what is missing, and what the original shows.',
  },
  {
    id: 'rec-misinfo-amplifiers',
    topicId: 'topic-misinformation',
    source: src('src-amplifier-study'),
    dimensionKind: 'scientific',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      "Recommended because this network analysis shows a small set of accounts drives most reach — evidence that complicates the 'everyone shares it' story.",
  },
  {
    id: 'rec-misinfo-survey',
    topicId: 'topic-misinformation',
    source: src('src-share-survey'),
    dimensionKind: 'individual',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the individual perspective — why people actually share — a dimension your exploration has not touched yet.',
  },
  {
    id: 'rec-misinfo-transparency',
    topicId: 'topic-misinformation',
    source: src('src-platform-transparency'),
    dimensionKind: 'institutional',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because it is the primary record of platform enforcement — official disclosures rather than commentary about them.',
  },
  {
    id: 'rec-misinfo-law',
    topicId: 'topic-misinformation',
    source: src('src-election-law-comparison'),
    dimensionKind: 'legal',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the legal dimension — how different states regulate deepfakes and coordination — which you have not explored.',
  },
  {
    id: 'rec-misinfo-ruling',
    topicId: 'topic-misinformation',
    source: src('src-disinfo-ruling'),
    dimensionKind: 'legal',
    reasonKind: 'deepen-topic',
    whyRecommended:
      'Recommended because this court ruling clarifies the disclosure standards behind the enforcement debate — a deeper look at the legal dimension.',
  },
  {
    id: 'rec-misinfo-thread',
    topicId: 'topic-misinformation',
    source: src('src-clip-thread'),
    dimensionKind: 'social',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      'Recommended because this documented spread timeline lets you see the social mechanics firsthand — a ground-level contrast to platform reports.',
  },

  // ---- Urban Housing Affordability ----
  {
    id: 'rec-housing-permits',
    topicId: 'topic-housing',
    source: src('src-housing-permits'),
    dimensionKind: 'economic',
    reasonKind: 'deepen-topic',
    whyRecommended:
      'Recommended because this is the data behind the supply claim — a decade of permits and rents to check the argument against.',
  },
  {
    id: 'rec-housing-displacement',
    topicId: 'topic-housing',
    source: src('src-displacement-study'),
    dimensionKind: 'social',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      "Recommended because this longitudinal study complicates the 'build more and everything works' story with evidence about who actually moves.",
  },
  {
    id: 'rec-housing-zoning',
    topicId: 'topic-housing',
    source: src('src-zoning-code'),
    dimensionKind: 'legal',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the primary source at the center of the debate — the actual rules governing density and use.',
  },
  {
    id: 'rec-housing-minutes',
    topicId: 'topic-housing',
    source: src('src-council-minutes'),
    dimensionKind: 'political',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this verbatim hearing record lets you hear tenants, landlords, and developers in their own words.',
  },
  {
    id: 'rec-housing-evicted',
    topicId: 'topic-housing',
    source: src('src-evicted-book'),
    dimensionKind: 'social',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it brings the social dimension to life — ground-level reporting on instability you have not encountered in this exploration.',
  },
  {
    id: 'rec-housing-ruling',
    topicId: 'topic-housing',
    source: src('src-rent-ruling'),
    dimensionKind: 'legal',
    reasonKind: 'deepen-topic',
    whyRecommended:
      'Recommended because this court ruling is the precedent shaping what the plan can legally do — a deeper look at the legal dimension.',
  },
];

export function getRecommendationsForTopic(topicId: string): Recommendation[] {
  return recommendations.filter((recommendation) => recommendation.topicId === topicId);
}
