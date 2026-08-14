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

  // ---- The Renewable Energy Transition ----
  {
    id: 'rec-energy-storage',
    topicId: 'topic-energy-transition',
    source: src('src-energy-storage'),
    dimensionKind: 'scientific',
    reasonKind: 'deepen-topic',
    whyRecommended:
      'Recommended because this is the peer-reviewed evidence behind the reliability debate — what storage can and cannot do today.',
  },
  {
    id: 'rec-energy-coaltown',
    topicId: 'topic-energy-transition',
    source: src('src-energy-coaltown'),
    dimensionKind: 'social',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it brings the social dimension to life — what closure actually meant for one community, in their own words.',
  },
  {
    id: 'rec-energy-costs',
    topicId: 'topic-energy-transition',
    source: src('src-energy-costs'),
    dimensionKind: 'economic',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      "Recommended because it separates household bills from system costs — evidence that complicates the 'transition will bankrupt us' story.",
  },
  {
    id: 'rec-energy-roadmap',
    topicId: 'topic-energy-transition',
    source: src('src-energy-roadmap'),
    dimensionKind: 'political',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the primary document at the center of the debate — the actual targets and timelines being argued over.',
  },
  {
    id: 'rec-energy-ecology',
    topicId: 'topic-energy-transition',
    source: src('src-energy-ecology'),
    dimensionKind: 'environmental',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the environmental dimension beyond emissions — the land-use costs of renewables you may not have considered.',
  },

  // ---- Digital Literacy in the Classroom ----
  {
    id: 'rec-literacy-framework',
    topicId: 'topic-digital-literacy',
    source: src('src-literacy-framework'),
    dimensionKind: 'education',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the primary document at the center of the curriculum debate — the actual framework being adopted.',
  },
  {
    id: 'rec-literacy-study',
    topicId: 'topic-digital-literacy',
    source: src('src-literacy-study'),
    dimensionKind: 'education',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      "Recommended because this meta-analysis tests the 'media literacy does not work' claim with 60+ classroom interventions — worth checking against the headlines.",
  },
  {
    id: 'rec-literacy-gap',
    topicId: 'topic-digital-literacy',
    source: src('src-literacy-gap'),
    dimensionKind: 'social',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the social dimension — district-by-district data on who actually receives digital literacy instruction.',
  },
  {
    id: 'rec-literacy-international',
    topicId: 'topic-digital-literacy',
    source: src('src-literacy-international'),
    dimensionKind: 'international',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the international dimension — how comparable education systems design and evaluate their approaches.',
  },
  {
    id: 'rec-literacy-culture',
    topicId: 'topic-digital-literacy',
    source: src('src-literacy-culture'),
    dimensionKind: 'cultural',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      'Recommended because it shows what students actually do online — evidence that complicates the assumption that classroom skills simply transfer.',
  },

  // ---- Water Scarcity in the 21st Century ----
  {
    id: 'rec-water-basin',
    topicId: 'topic-water-scarcity',
    source: src('src-water-basin'),
    dimensionKind: 'environmental',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the official hydrological assessment behind the claims — the reservoir and groundwater data in full.',
  },
  {
    id: 'rec-water-agriculture',
    topicId: 'topic-water-scarcity',
    source: src('src-water-agriculture'),
    dimensionKind: 'economic',
    reasonKind: 'deepen-topic',
    whyRecommended:
      'Recommended because it digs into the economics of using less water — field trials and cost models behind the pricing debate.',
  },
  {
    id: 'rec-water-treaty',
    topicId: 'topic-water-scarcity',
    source: src('src-water-treaty'),
    dimensionKind: 'legal',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the primary legal text at the center of the allocation debate — the treaty itself, not commentary about it.',
  },
  {
    id: 'rec-water-communities',
    topicId: 'topic-water-scarcity',
    source: src('src-water-communities'),
    dimensionKind: 'social',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the social dimension — reporting from the households that bear the sharpest cuts.',
  },
  {
    id: 'rec-water-cooperation',
    topicId: 'topic-water-scarcity',
    source: src('src-water-cooperation'),
    dimensionKind: 'international',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the international dimension — how nations sharing rivers cooperate or conflict.',
  },

  // ---- The Future of Work in an Automated Economy ----
  {
    id: 'rec-work-forecast',
    topicId: 'topic-future-of-work',
    source: src('src-work-forecast'),
    dimensionKind: 'economic',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the forecast everyone is citing — read the methodology and scenarios before trusting the headlines.',
  },
  {
    id: 'rec-work-history',
    topicId: 'topic-future-of-work',
    source: src('src-work-history'),
    dimensionKind: 'historical',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      "Recommended because it complicates the 'unprecedented' framing — what previous automation waves actually did to jobs.",
  },
  {
    id: 'rec-work-retraining',
    topicId: 'topic-future-of-work',
    source: src('src-work-retraining'),
    dimensionKind: 'institutional',
    reasonKind: 'deepen-topic',
    whyRecommended:
      'Recommended because it grounds the retraining debate in evidence — what programs actually achieve across countries.',
  },
  {
    id: 'rec-work-identity',
    topicId: 'topic-future-of-work',
    source: src('src-work-identity'),
    dimensionKind: 'social',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the social dimension — what jobs mean beyond the paycheck, a perspective the numbers miss.',
  },
  {
    id: 'rec-work-briefing',
    topicId: 'topic-future-of-work',
    source: src('src-work-briefing'),
    dimensionKind: 'political',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because it is the primary policy document — the actual options and cost estimates under consideration.',
  },

  // ---- AI-Generated Books and the Meaning of Authorship ----
  {
    id: 'rec-authorship-guidance',
    topicId: 'topic-authorship',
    source: src('src-authorship-guidance'),
    dimensionKind: 'legal',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the official guidance at the center of the copyright debate — what must be disclosed and why.',
  },
  {
    id: 'rec-authorship-ruling',
    topicId: 'topic-authorship',
    source: src('src-authorship-ruling'),
    dimensionKind: 'legal',
    reasonKind: 'deepen-topic',
    whyRecommended:
      'Recommended because this court ruling sets the precedent the debate keeps circling — a deeper look at the legal dimension.',
  },
  {
    id: 'rec-authorship-economics',
    topicId: 'topic-authorship',
    source: src('src-authorship-economics'),
    dimensionKind: 'economic',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the economic dimension — advances, royalties, and who actually gets paid as AI titles multiply.',
  },
  {
    id: 'rec-authorship-writers',
    topicId: 'topic-authorship',
    source: src('src-authorship-writers'),
    dimensionKind: 'individual',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the individual perspective — what working writers themselves say about the new landscape.',
  },
  {
    id: 'rec-authorship-ethics',
    topicId: 'topic-authorship',
    source: src('src-authorship-ethics'),
    dimensionKind: 'ethical',
    reasonKind: 'contrasting-evidence',
    whyRecommended:
      'Recommended because it takes the ethical argument seriously — when imitation becomes appropriation, argued in full rather than in headlines.',
  },

  // ---- Gene Editing and Human Ethics ----
  {
    id: 'rec-gene-trials',
    topicId: 'topic-gene-editing',
    source: src('src-gene-trials'),
    dimensionKind: 'scientific',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because this is the peer-reviewed trial data behind the safety claims — read the results before the arguments about them.',
  },
  {
    id: 'rec-gene-ethics',
    topicId: 'topic-gene-editing',
    source: src('src-gene-ethics'),
    dimensionKind: 'ethical',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the ethical dimension — who can consent to changes that affect people not yet born.',
  },
  {
    id: 'rec-gene-regulation',
    topicId: 'topic-gene-editing',
    source: src('src-gene-regulation'),
    dimensionKind: 'legal',
    reasonKind: 'primary-source',
    whyRecommended:
      'Recommended because it is the primary regulatory document — what is actually permitted under the current framework.',
  },
  {
    id: 'rec-gene-cultural',
    topicId: 'topic-gene-editing',
    source: src('src-gene-cultural'),
    dimensionKind: 'cultural',
    reasonKind: 'missing-perspective',
    whyRecommended:
      'Recommended because it covers the cultural dimension — how different communities actually view genetic change.',
  },
];

export function getRecommendationsForTopic(topicId: string): Recommendation[] {
  return recommendations.filter((recommendation) => recommendation.topicId === topicId);
}
