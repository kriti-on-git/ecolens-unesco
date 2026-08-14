import { getTopicById } from './topics';
import type { CaseQuestion, CaseStudy } from '@/types';

/**
 * Mock adaptive case studies.
 *
 * Case studies are hardcoded branching trees. Options are never
 * correct/incorrect — each one reveals how the user approaches the issue
 * and routes them onto a different branch, so different users experience
 * different paths. The data structure maps onto a content database later.
 */

const aiRegulationQuestions: Record<string, CaseQuestion> = {
  q1: {
    id: 'q1',
    type: 'priority',
    scenario:
      'A landmark AI law is moving through parliament. News coverage is intense and mostly focuses on what the law would do to companies.',
    prompt: 'As you first read about the law, what matters most to you?',
    relatedDimensionKinds: ['economic', 'individual', 'institutional'],
    options: [
      {
        id: 'q1-o1',
        label: 'Whether it helps or hurts innovation and jobs',
        dimensionKind: 'economic',
        nextQuestionId: 'q2',
        pathLabel: 'economic lens',
      },
      {
        id: 'q1-o2',
        label: "Whether it protects people's rights and safety",
        dimensionKind: 'individual',
        nextQuestionId: 'q3',
        pathLabel: 'individual rights lens',
      },
      {
        id: 'q1-o3',
        label: 'Who will actually enforce it and how',
        dimensionKind: 'institutional',
        nextQuestionId: 'q4',
        pathLabel: 'institutional lens',
      },
    ],
  },
  q2: {
    id: 'q2',
    type: 'evidence',
    scenario:
      'Supporters of the law point to a widely shared study showing productivity gains from AI adoption.',
    prompt: 'What would you want to check first before trusting the study?',
    relatedDimensionKinds: ['scientific', 'institutional', 'economic'],
    options: [
      {
        id: 'q2-o1',
        label: "The study's sample size and methodology",
        dimensionKind: 'scientific',
        nextQuestionId: 'q5',
        pathLabel: 'methodology first',
      },
      {
        id: 'q2-o2',
        label: 'Who funded it and whether conflicts of interest exist',
        dimensionKind: 'institutional',
        nextQuestionId: 'q5',
        pathLabel: 'follow the funding',
      },
      {
        id: 'q2-o3',
        label: 'Counter-evidence from other sectors and countries',
        dimensionKind: 'economic',
        nextQuestionId: 'q6',
        pathLabel: 'seek counter-evidence',
      },
    ],
  },
  q3: {
    id: 'q3',
    type: 'stakeholder',
    scenario:
      'The parliament opens public consultations on who should help write the detailed rules.',
    prompt: 'Whose voice should carry the most weight in shaping the rules?',
    relatedDimensionKinds: ['scientific', 'social', 'institutional'],
    options: [
      {
        id: 'q3-o1',
        label: 'The engineers building the systems',
        dimensionKind: 'scientific',
        nextQuestionId: 'q6',
        pathLabel: 'builders first',
      },
      {
        id: 'q3-o2',
        label: 'The communities and workers affected by AI',
        dimensionKind: 'social',
        nextQuestionId: 'q7',
        pathLabel: 'affected people first',
      },
      {
        id: 'q3-o3',
        label: 'Independent researchers and civil-society watchdogs',
        dimensionKind: 'institutional',
        nextQuestionId: 'q7',
        pathLabel: 'watchdogs first',
      },
    ],
  },
  q4: {
    id: 'q4',
    type: 'consequence',
    scenario:
      "A parliamentary analysis warns that, as written, the law's enforcement machinery is weak and thinly funded.",
    prompt:
      'If the law passes as written, what do you think is most likely to happen in five years?',
    relatedDimensionKinds: ['international', 'institutional', 'legal'],
    options: [
      {
        id: 'q4-o1',
        label: 'Innovation migrates to friendlier jurisdictions',
        dimensionKind: 'international',
        nextQuestionId: 'q8',
        pathLabel: 'flight of innovation',
      },
      {
        id: 'q4-o2',
        label: 'A compliance industry grows while little changes in practice',
        dimensionKind: 'institutional',
        nextQuestionId: 'q8',
        pathLabel: 'compliance industry',
      },
      {
        id: 'q4-o3',
        label: 'Safety standards gradually strengthen through enforcement',
        dimensionKind: 'legal',
        nextQuestionId: 'q9',
        pathLabel: 'gradual strengthening',
      },
    ],
  },
  q5: {
    id: 'q5',
    type: 'uncertainty',
    scenario:
      'At a public hearing, two respected experts give sharply conflicting testimony about how dangerous current AI systems are.',
    prompt: 'How do you decide what to take away from the hearing?',
    relatedDimensionKinds: ['scientific', 'ethical'],
    options: [
      {
        id: 'q5-o1',
        label: 'Focus on the points both experts agree on',
        dimensionKind: 'scientific',
        nextQuestionId: 'q9',
        pathLabel: 'common ground',
      },
      {
        id: 'q5-o2',
        label: 'Examine the underlying data each side cites',
        dimensionKind: 'scientific',
        nextQuestionId: 'q9',
        pathLabel: 'data first',
      },
      {
        id: 'q5-o3',
        label: 'Note the questions nobody in the room is answering',
        dimensionKind: 'ethical',
        nextQuestionId: 'q10',
        pathLabel: 'unasked questions',
      },
    ],
  },
  q6: {
    id: 'q6',
    type: 'assumption',
    scenario: "A headline declares: 'AI will eliminate 40% of jobs within a decade.'",
    prompt: 'Which assumption in that headline would you examine first?',
    relatedDimensionKinds: ['social', 'institutional', 'economic'],
    options: [
      {
        id: 'q6-o1',
        label: "How 'jobs' and the timeframe are defined",
        dimensionKind: 'social',
        nextQuestionId: 'q9',
        pathLabel: 'definitions first',
      },
      {
        id: 'q6-o2',
        label: 'Who produced the estimate and from what data',
        dimensionKind: 'institutional',
        nextQuestionId: 'q9',
        pathLabel: 'provenance first',
      },
      {
        id: 'q6-o3',
        label: 'Whether new roles would offset the displacement',
        dimensionKind: 'economic',
        nextQuestionId: 'q10',
        pathLabel: 'offsets question',
      },
    ],
  },
  q7: {
    id: 'q7',
    type: 'source-selection',
    scenario: 'You want to understand what automation actually means for workers in your region.',
    prompt: 'Which source would teach you the most?',
    relatedDimensionKinds: ['individual', 'social', 'historical'],
    options: [
      {
        id: 'q7-o1',
        label: 'Interviews with workers in affected industries',
        dimensionKind: 'individual',
        nextQuestionId: 'q9',
        pathLabel: 'workers themselves',
      },
      {
        id: 'q7-o2',
        label: 'A detailed report from a major labor union',
        dimensionKind: 'social',
        nextQuestionId: 'q9',
        pathLabel: 'union view',
      },
      {
        id: 'q7-o3',
        label: 'A historical study of past technological shifts',
        dimensionKind: 'historical',
        nextQuestionId: 'q10',
        pathLabel: 'history of shifts',
      },
    ],
  },
  q8: {
    id: 'q8',
    type: 'interpretation',
    scenario:
      "Two reputable outlets report the same official estimate of AI's economic impact — one frames it as a boom, the other as a threat.",
    prompt: 'What would you do next?',
    relatedDimensionKinds: ['cultural', 'scientific', 'historical'],
    options: [
      {
        id: 'q8-o1',
        label: 'Compare how each outlet framed the same figures',
        dimensionKind: 'cultural',
        nextQuestionId: 'q10',
        pathLabel: 'framing comparison',
      },
      {
        id: 'q8-o2',
        label: 'Go back to the raw estimate and read it yourself',
        dimensionKind: 'scientific',
        nextQuestionId: 'q10',
        pathLabel: 'raw data',
      },
      {
        id: 'q8-o3',
        label: 'Check the publication dates and surrounding context',
        dimensionKind: 'historical',
        nextQuestionId: 'q10',
        pathLabel: 'context check',
      },
    ],
  },
  q9: {
    id: 'q9',
    type: 'cause',
    scenario: 'Someone asks you why public concern about AI seems to be rising right now.',
    prompt: 'Which explanation do you find most compelling?',
    relatedDimensionKinds: ['scientific', 'cultural', 'economic'],
    options: [
      {
        id: 'q9-o1',
        label: 'A run of specific, high-profile incidents',
        dimensionKind: 'scientific',
        nextQuestionId: 'q10',
        pathLabel: 'incidents drive concern',
      },
      {
        id: 'q9-o2',
        label: 'Intensifying media coverage of AI',
        dimensionKind: 'cultural',
        nextQuestionId: 'q10',
        pathLabel: 'coverage drives concern',
      },
      {
        id: 'q9-o3',
        label: 'Broader economic insecurity',
        dimensionKind: 'economic',
        nextQuestionId: 'q10',
        pathLabel: 'insecurity drives concern',
      },
    ],
  },
  q10: {
    id: 'q10',
    type: 'consequence',
    scenario:
      'The vote on the AI law is delayed for further study. You now have time to go deeper.',
    prompt: 'What would you do with the extra time?',
    relatedDimensionKinds: ['political', 'legal', 'international'],
    options: [
      {
        id: 'q10-o1',
        label: 'Follow the legislative debate closely',
        dimensionKind: 'political',
        nextQuestionId: null,
        pathLabel: 'follow the debate',
      },
      {
        id: 'q10-o2',
        label: 'Read the dissenting committee report',
        dimensionKind: 'legal',
        nextQuestionId: null,
        pathLabel: 'dissenting report',
      },
      {
        id: 'q10-o3',
        label: 'Study how other countries regulate AI',
        dimensionKind: 'international',
        nextQuestionId: null,
        pathLabel: 'global comparison',
      },
    ],
  },
};

/** Second-pass branches shown to users who previously ignored a dimension. */
const aiRegulationFollowUps: Record<string, CaseQuestion[]> = {
  historical: [
    {
      id: 'fq-historical-1',
      type: 'assumption',
      scenario:
        'New technology regulations often echo older ones — radio broadcasting, the early internet, credit reporting.',
      prompt: 'Which historical parallel would you examine first?',
      relatedDimensionKinds: ['historical'],
      options: [
        {
          id: 'fq-historical-1-o1',
          label: 'How radio broadcasting was first regulated',
          dimensionKind: 'historical',
          nextQuestionId: null,
          pathLabel: 'radio precedent',
        },
        {
          id: 'fq-historical-1-o2',
          label: 'How the early internet avoided regulation',
          dimensionKind: 'historical',
          nextQuestionId: null,
          pathLabel: 'internet precedent',
        },
        {
          id: 'fq-historical-1-o3',
          label: 'How credit-reporting rules were written',
          dimensionKind: 'historical',
          nextQuestionId: null,
          pathLabel: 'credit precedent',
        },
      ],
    },
  ],
  legal: [
    {
      id: 'fq-legal-1',
      type: 'source-selection',
      scenario:
        "The law's enforcement details are now under scrutiny, and legal documents are circulating.",
      prompt: 'Which legal document would you read first?',
      relatedDimensionKinds: ['legal'],
      options: [
        {
          id: 'fq-legal-1-o1',
          label: 'The enforcement chapter of the draft statute',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'enforcement chapter',
        },
        {
          id: 'fq-legal-1-o2',
          label: 'A recent court ruling on automated decisions',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'court ruling',
        },
        {
          id: 'fq-legal-1-o3',
          label: "A lawyer's plain-language explainer",
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'plain-language explainer',
        },
      ],
    },
  ],
  international: [
    {
      id: 'fq-international-1',
      type: 'cause',
      scenario: 'Countries are visibly diverging in how they regulate AI.',
      prompt: 'What explains the divergence best?',
      relatedDimensionKinds: ['international'],
      options: [
        {
          id: 'fq-international-1-o1',
          label: 'Different economic structures and incentives',
          dimensionKind: 'international',
          nextQuestionId: null,
          pathLabel: 'economic structures',
        },
        {
          id: 'fq-international-1-o2',
          label: 'Different attitudes toward state power',
          dimensionKind: 'international',
          nextQuestionId: null,
          pathLabel: 'state power attitudes',
        },
        {
          id: 'fq-international-1-o3',
          label: 'Different exposure to AI industries',
          dimensionKind: 'international',
          nextQuestionId: null,
          pathLabel: 'industry exposure',
        },
      ],
    },
  ],
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-ai-regulation',
    slug: 'ai-regulation',
    topicId: 'topic-ai-regulation',
    title: 'The AI Law on Your Screen',
    intro:
      "You've been following a landmark AI law moving through parliament. We'll explore how you approach the issue — not to grade you, but to map what you've considered and what you might be missing.",
    entryQuestionId: 'q1',
    questions: aiRegulationQuestions,
    followUpBranches: aiRegulationFollowUps,
  },
];

export function getCaseStudyByTopic(topicId: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.topicId === topicId);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(
    (caseStudy) => caseStudy.slug === slug || getTopicById(caseStudy.topicId)?.slug === slug,
  );
}
