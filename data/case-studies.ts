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

const misinformationQuestions: Record<string, CaseQuestion> = {
  mq1: {
    id: 'mq1',
    type: 'priority',
    scenario:
      'A video clip of a candidate appears on your feed with a caption claiming they said something inflammatory. It is spreading fast.',
    prompt: 'Before you react, what matters most to you?',
    relatedDimensionKinds: ['scientific', 'institutional', 'individual'],
    options: [
      {
        id: 'mq1-o1',
        label: 'Whether the clip is even real',
        dimensionKind: 'scientific',
        nextQuestionId: 'mq2',
        pathLabel: 'authenticity first',
      },
      {
        id: 'mq1-o2',
        label: 'Who is spreading it and why',
        dimensionKind: 'institutional',
        nextQuestionId: 'mq3',
        pathLabel: 'spread first',
      },
      {
        id: 'mq1-o3',
        label: 'How it makes me feel toward the candidate',
        dimensionKind: 'individual',
        nextQuestionId: 'mq4',
        pathLabel: 'emotional response first',
      },
    ],
  },
  mq2: {
    id: 'mq2',
    type: 'evidence',
    scenario:
      'You learn the clip is authentic but years old — it was stripped of its original context and presented as new.',
    prompt: 'What would you do next?',
    relatedDimensionKinds: ['scientific', 'institutional', 'historical'],
    options: [
      {
        id: 'mq2-o1',
        label: 'Find the full original footage and compare',
        dimensionKind: 'scientific',
        nextQuestionId: 'mq5',
        pathLabel: 'original footage',
      },
      {
        id: 'mq2-o2',
        label: 'See how independent fact-checkers described it',
        dimensionKind: 'institutional',
        nextQuestionId: 'mq5',
        pathLabel: 'fact-checkers first',
      },
      {
        id: 'mq2-o3',
        label: 'Consider whether the age of the clip changes its meaning',
        dimensionKind: 'historical',
        nextQuestionId: 'mq6',
        pathLabel: 'context over time',
      },
    ],
  },
  mq3: {
    id: 'mq3',
    type: 'source-selection',
    scenario: 'A page you do not recognize appears to be driving the clip’s spread.',
    prompt: 'Which check tells you the most about that page?',
    relatedDimensionKinds: ['institutional', 'social', 'cultural'],
    options: [
      {
        id: 'mq3-o1',
        label: "Investigate the page's history and funding",
        dimensionKind: 'institutional',
        nextQuestionId: 'mq5',
        pathLabel: 'follow the funding',
      },
      {
        id: 'mq3-o2',
        label: 'Map who amplified it first and how fast',
        dimensionKind: 'social',
        nextQuestionId: 'mq6',
        pathLabel: 'amplifier map',
      },
      {
        id: 'mq3-o3',
        label: 'Check whether established outlets are covering it',
        dimensionKind: 'cultural',
        nextQuestionId: 'mq6',
        pathLabel: 'mainstream coverage',
      },
    ],
  },
  mq4: {
    id: 'mq4',
    type: 'assumption',
    scenario:
      'You catch yourself sharing the clip on impulse — then deleting it. Your first reaction was emotional, not analytical.',
    prompt: 'What do you examine first?',
    relatedDimensionKinds: ['individual', 'scientific', 'institutional'],
    options: [
      {
        id: 'mq4-o1',
        label: 'What in the post triggered the reaction',
        dimensionKind: 'individual',
        nextQuestionId: 'mq6',
        pathLabel: 'trigger analysis',
      },
      {
        id: 'mq4-o2',
        label: 'Whether the clip fits a known manipulation pattern',
        dimensionKind: 'scientific',
        nextQuestionId: 'mq7',
        pathLabel: 'pattern check',
      },
      {
        id: 'mq4-o3',
        label: 'Why the platform surfaced it to me at all',
        dimensionKind: 'institutional',
        nextQuestionId: 'mq7',
        pathLabel: 'algorithm question',
      },
    ],
  },
  mq5: {
    id: 'mq5',
    type: 'uncertainty',
    scenario: 'Independent fact-checkers disagree about how harmful the clip actually is.',
    prompt: 'How do you handle the disagreement?',
    relatedDimensionKinds: ['scientific', 'ethical', 'institutional'],
    options: [
      {
        id: 'mq5-o1',
        label: 'Read both rulings and the evidence each cites',
        dimensionKind: 'scientific',
        nextQuestionId: 'mq7',
        pathLabel: 'both rulings',
      },
      {
        id: 'mq5-o2',
        label: 'Treat the disagreement itself as information',
        dimensionKind: 'ethical',
        nextQuestionId: 'mq8',
        pathLabel: 'disagreement as signal',
      },
      {
        id: 'mq5-o3',
        label: "Wait for election officials' assessment",
        dimensionKind: 'institutional',
        nextQuestionId: 'mq8',
        pathLabel: 'official assessment',
      },
    ],
  },
  mq6: {
    id: 'mq6',
    type: 'interpretation',
    scenario: 'Two accounts frame the same clip as proof of opposite things about the candidate.',
    prompt: 'What helps you decide what the clip actually shows?',
    relatedDimensionKinds: ['cultural', 'historical', 'institutional'],
    options: [
      {
        id: 'mq6-o1',
        label: 'Compare the framing, not just the facts',
        dimensionKind: 'cultural',
        nextQuestionId: 'mq8',
        pathLabel: 'framing comparison',
      },
      {
        id: 'mq6-o2',
        label: 'Trace the clip to its original context',
        dimensionKind: 'historical',
        nextQuestionId: 'mq8',
        pathLabel: 'original context',
      },
      {
        id: 'mq6-o3',
        label: 'Check the timing of both posts',
        dimensionKind: 'institutional',
        nextQuestionId: 'mq9',
        pathLabel: 'timing check',
      },
    ],
  },
  mq7: {
    id: 'mq7',
    type: 'cause',
    scenario: 'You are asked why false election claims seem to spread fastest right now.',
    prompt: 'Which explanation do you find most compelling?',
    relatedDimensionKinds: ['cultural', 'institutional', 'individual'],
    options: [
      {
        id: 'mq7-o1',
        label: 'Because attention is at its highest',
        dimensionKind: 'cultural',
        nextQuestionId: 'mq9',
        pathLabel: 'attention peak',
      },
      {
        id: 'mq7-o2',
        label: 'Because coordination is organized',
        dimensionKind: 'institutional',
        nextQuestionId: 'mq9',
        pathLabel: 'coordinated spread',
      },
      {
        id: 'mq7-o3',
        label: 'Because people share to signal identity',
        dimensionKind: 'individual',
        nextQuestionId: 'mq9',
        pathLabel: 'identity signaling',
      },
    ],
  },
  mq8: {
    id: 'mq8',
    type: 'consequence',
    scenario: 'You have confirmed the clip is misleading. The story continues either way.',
    prompt: 'What matters most about what happens next?',
    relatedDimensionKinds: ['institutional', 'political', 'legal'],
    options: [
      {
        id: 'mq8-o1',
        label: 'Whether people will actually see the correction',
        dimensionKind: 'institutional',
        nextQuestionId: 'mq9',
        pathLabel: 'correction reach',
      },
      {
        id: 'mq8-o2',
        label: 'Whether it changes how people vote',
        dimensionKind: 'political',
        nextQuestionId: 'mq9',
        pathLabel: 'voting effects',
      },
      {
        id: 'mq8-o3',
        label: 'Whether platforms change their rules',
        dimensionKind: 'legal',
        nextQuestionId: 'mq9',
        pathLabel: 'platform rules',
      },
    ],
  },
  mq9: {
    id: 'mq9',
    type: 'stakeholder',
    scenario:
      'Lawmakers ask who should carry the most responsibility for limiting election misinformation.',
    prompt: 'Who would you hold most accountable?',
    relatedDimensionKinds: ['institutional', 'cultural', 'legal'],
    options: [
      {
        id: 'mq9-o1',
        label: 'The platforms that amplify it',
        dimensionKind: 'institutional',
        nextQuestionId: null,
        pathLabel: 'platforms accountable',
      },
      {
        id: 'mq9-o2',
        label: 'The publishers and media that repeat it',
        dimensionKind: 'cultural',
        nextQuestionId: null,
        pathLabel: 'media accountable',
      },
      {
        id: 'mq9-o3',
        label: 'The election officials and regulators',
        dimensionKind: 'legal',
        nextQuestionId: null,
        pathLabel: 'regulators accountable',
      },
    ],
  },
};

const misinformationFollowUps: Record<string, CaseQuestion[]> = {
  legal: [
    {
      id: 'fm-legal-1',
      type: 'source-selection',
      scenario: 'The rules on deepfakes and disinformation are being debated in several states.',
      prompt: 'Which legal source would you read first?',
      relatedDimensionKinds: ['legal'],
      options: [
        {
          id: 'fm-legal-1-o1',
          label: 'A comparison of state election-integrity laws',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'state law comparison',
        },
        {
          id: 'fm-legal-1-o2',
          label: 'A recent court ruling on coordinated disinformation',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'disinformation ruling',
        },
        {
          id: 'fm-legal-1-o3',
          label: "A regulator's enforcement guidance",
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'enforcement guidance',
        },
      ],
    },
  ],
  political: [
    {
      id: 'fm-political-1',
      type: 'cause',
      scenario: 'Some campaigns embrace viral clips; others denounce them.',
      prompt: 'What explains that difference best?',
      relatedDimensionKinds: ['political'],
      options: [
        {
          id: 'fm-political-1-o1',
          label: 'Which side benefits from the clip',
          dimensionKind: 'political',
          nextQuestionId: null,
          pathLabel: 'benefit analysis',
        },
        {
          id: 'fm-political-1-o2',
          label: 'Each campaign’s risk tolerance',
          dimensionKind: 'political',
          nextQuestionId: null,
          pathLabel: 'risk tolerance',
        },
        {
          id: 'fm-political-1-o3',
          label: 'How close the race is in each district',
          dimensionKind: 'political',
          nextQuestionId: null,
          pathLabel: 'race closeness',
        },
      ],
    },
  ],
  individual: [
    {
      id: 'fm-individual-1',
      type: 'uncertainty',
      scenario: 'Research shows corrections often fail to change minds.',
      prompt: 'What does that make you question?',
      relatedDimensionKinds: ['individual'],
      options: [
        {
          id: 'fm-individual-1-o1',
          label: 'Whether the correction reached the right people',
          dimensionKind: 'individual',
          nextQuestionId: null,
          pathLabel: 'correction audience',
        },
        {
          id: 'fm-individual-1-o2',
          label: 'Why beliefs resist updating',
          dimensionKind: 'individual',
          nextQuestionId: null,
          pathLabel: 'belief updating',
        },
        {
          id: 'fm-individual-1-o3',
          label: 'What would make corrections stick',
          dimensionKind: 'individual',
          nextQuestionId: null,
          pathLabel: 'effective corrections',
        },
      ],
    },
  ],
};

const housingQuestions: Record<string, CaseQuestion> = {
  hq1: {
    id: 'hq1',
    type: 'priority',
    scenario: 'Your city announces a major housing plan. Coverage focuses on the politics of it.',
    prompt: 'What do you want to understand first?',
    relatedDimensionKinds: ['economic', 'social', 'legal'],
    options: [
      {
        id: 'hq1-o1',
        label: 'How it would affect rents and prices',
        dimensionKind: 'economic',
        nextQuestionId: 'hq2',
        pathLabel: 'prices first',
      },
      {
        id: 'hq1-o2',
        label: 'Who it helps and who it displaces',
        dimensionKind: 'social',
        nextQuestionId: 'hq3',
        pathLabel: 'people first',
      },
      {
        id: 'hq1-o3',
        label: 'What the law currently allows and blocks',
        dimensionKind: 'legal',
        nextQuestionId: 'hq4',
        pathLabel: 'law first',
      },
    ],
  },
  hq2: {
    id: 'hq2',
    type: 'evidence',
    scenario: "The city's report claims the plan will lower rents by 10% within five years.",
    prompt: 'What would you check first?',
    relatedDimensionKinds: ['scientific', 'historical', 'institutional'],
    options: [
      {
        id: 'hq2-o1',
        label: 'The assumptions inside the economic model',
        dimensionKind: 'scientific',
        nextQuestionId: 'hq5',
        pathLabel: 'model assumptions',
      },
      {
        id: 'hq2-o2',
        label: 'How similar plans fared in other cities',
        dimensionKind: 'historical',
        nextQuestionId: 'hq6',
        pathLabel: 'other cities',
      },
      {
        id: 'hq2-o3',
        label: 'Who commissioned and funded the study',
        dimensionKind: 'institutional',
        nextQuestionId: 'hq6',
        pathLabel: 'funding check',
      },
    ],
  },
  hq3: {
    id: 'hq3',
    type: 'stakeholder',
    scenario: 'Renters, landlords, and developers are all lobbying the council over the plan.',
    prompt: 'Whose voice would you seek out first?',
    relatedDimensionKinds: ['individual', 'social', 'scientific'],
    options: [
      {
        id: 'hq3-o1',
        label: 'Current renters facing instability',
        dimensionKind: 'individual',
        nextQuestionId: 'hq5',
        pathLabel: 'renters first',
      },
      {
        id: 'hq3-o2',
        label: 'Small landlords and long-time owners',
        dimensionKind: 'social',
        nextQuestionId: 'hq6',
        pathLabel: 'landlords first',
      },
      {
        id: 'hq3-o3',
        label: 'Urban researchers studying housing policy',
        dimensionKind: 'scientific',
        nextQuestionId: 'hq7',
        pathLabel: 'researchers first',
      },
    ],
  },
  hq4: {
    id: 'hq4',
    type: 'interpretation',
    scenario:
      'Two lawyers publicly disagree about whether the plan is even legal under the zoning code.',
    prompt: 'How would you decide who is right?',
    relatedDimensionKinds: ['legal'],
    options: [
      {
        id: 'hq4-o1',
        label: 'Read the relevant zoning chapters yourself',
        dimensionKind: 'legal',
        nextQuestionId: 'hq6',
        pathLabel: 'zoning code',
      },
      {
        id: 'hq4-o2',
        label: 'Read a court ruling on a similar plan',
        dimensionKind: 'legal',
        nextQuestionId: 'hq7',
        pathLabel: 'similar ruling',
      },
      {
        id: 'hq4-o3',
        label: 'Check how the term “affordable” is defined in law',
        dimensionKind: 'legal',
        nextQuestionId: 'hq7',
        pathLabel: 'definition check',
      },
    ],
  },
  hq5: {
    id: 'hq5',
    type: 'cause',
    scenario: 'You are asked why housing became unaffordable in your city over the last decade.',
    prompt: 'Which cause do you weigh most heavily?',
    relatedDimensionKinds: ['economic', 'social', 'institutional'],
    options: [
      {
        id: 'hq5-o1',
        label: 'Supply has not kept up with population growth',
        dimensionKind: 'economic',
        nextQuestionId: 'hq8',
        pathLabel: 'supply shortfall',
      },
      {
        id: 'hq5-o2',
        label: 'Wages stalled while prices climbed',
        dimensionKind: 'social',
        nextQuestionId: 'hq8',
        pathLabel: 'wage stagnation',
      },
      {
        id: 'hq5-o3',
        label: 'Speculation and investment flows',
        dimensionKind: 'institutional',
        nextQuestionId: 'hq8',
        pathLabel: 'investment flows',
      },
    ],
  },
  hq6: {
    id: 'hq6',
    type: 'context',
    scenario: 'You discover the plan closely echoes one your city tried in the 1990s.',
    prompt: 'What would you examine about that earlier attempt?',
    relatedDimensionKinds: ['historical', 'economic', 'political'],
    options: [
      {
        id: 'hq6-o1',
        label: 'What actually happened after it passed',
        dimensionKind: 'historical',
        nextQuestionId: 'hq8',
        pathLabel: 'outcomes then',
      },
      {
        id: 'hq6-o2',
        label: 'How economic conditions differ from today',
        dimensionKind: 'economic',
        nextQuestionId: 'hq8',
        pathLabel: 'conditions comparison',
      },
      {
        id: 'hq6-o3',
        label: 'What its critics predicted at the time',
        dimensionKind: 'political',
        nextQuestionId: 'hq8',
        pathLabel: 'then-critics',
      },
    ],
  },
  hq7: {
    id: 'hq7',
    type: 'uncertainty',
    scenario: 'Economic forecasts for the plan’s impact conflict sharply across credible groups.',
    prompt: 'What do you do with the conflict?',
    relatedDimensionKinds: ['scientific', 'ethical'],
    options: [
      {
        id: 'hq7-o1',
        label: 'Read the assumptions behind each forecast',
        dimensionKind: 'scientific',
        nextQuestionId: 'hq8',
        pathLabel: 'forecast assumptions',
      },
      {
        id: 'hq7-o2',
        label: 'Note what the forecasts agree on',
        dimensionKind: 'scientific',
        nextQuestionId: 'hq8',
        pathLabel: 'agreed points',
      },
      {
        id: 'hq7-o3',
        label: 'Ask what both forecasts leave out',
        dimensionKind: 'ethical',
        nextQuestionId: 'hq8',
        pathLabel: 'omissions',
      },
    ],
  },
  hq8: {
    id: 'hq8',
    type: 'consequence',
    scenario: 'The plan passes in weakened form. You are asked to imagine five years ahead.',
    prompt: 'What outcome do you expect?',
    relatedDimensionKinds: ['economic', 'social', 'legal'],
    options: [
      {
        id: 'hq8-o1',
        label: 'Rents keep climbing while supply grows slowly',
        dimensionKind: 'economic',
        nextQuestionId: 'hq9',
        pathLabel: 'slow climb',
      },
      {
        id: 'hq8-o2',
        label: 'Some neighborhoods gentrify quickly',
        dimensionKind: 'social',
        nextQuestionId: 'hq9',
        pathLabel: 'quick gentrification',
      },
      {
        id: 'hq8-o3',
        label: 'Litigation slows implementation',
        dimensionKind: 'legal',
        nextQuestionId: 'hq9',
        pathLabel: 'litigation drag',
      },
    ],
  },
  hq9: {
    id: 'hq9',
    type: 'assumption',
    scenario: "A widely shared headline declares: 'Density is the only answer.'",
    prompt: 'Which part of that claim would you question first?',
    relatedDimensionKinds: ['cultural', 'individual', 'scientific'],
    options: [
      {
        id: 'hq9-o1',
        label: 'The word “only”',
        dimensionKind: 'cultural',
        nextQuestionId: null,
        pathLabel: 'the “only”',
      },
      {
        id: 'hq9-o2',
        label: 'Who benefits most from density',
        dimensionKind: 'individual',
        nextQuestionId: null,
        pathLabel: 'density beneficiaries',
      },
      {
        id: 'hq9-o3',
        label: 'Counter-evidence from cities that tried it',
        dimensionKind: 'scientific',
        nextQuestionId: null,
        pathLabel: 'density evidence',
      },
    ],
  },
};

const housingFollowUps: Record<string, CaseQuestion[]> = {
  legal: [
    {
      id: 'fh-legal-1',
      type: 'source-selection',
      scenario: 'The plan’s legality is being challenged in court.',
      prompt: 'Which legal document would you read first?',
      relatedDimensionKinds: ['legal'],
      options: [
        {
          id: 'fh-legal-1-o1',
          label: 'The zoning chapters the challenge cites',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'zoning chapters',
        },
        {
          id: 'fh-legal-1-o2',
          label: 'A ruling on rent regulation and property rights',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'rent regulation ruling',
        },
        {
          id: 'fh-legal-1-o3',
          label: "The city attorney's legal opinion",
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'city attorney opinion',
        },
      ],
    },
  ],
  social: [
    {
      id: 'fh-social-1',
      type: 'stakeholder',
      scenario:
        'New development is planned along a transit corridor where rents are already rising.',
      prompt: 'What would you track to understand displacement risk?',
      relatedDimensionKinds: ['social'],
      options: [
        {
          id: 'fh-social-1-o1',
          label: 'Who is moving out of the corridor, and where they go',
          dimensionKind: 'social',
          nextQuestionId: null,
          pathLabel: 'movers tracked',
        },
        {
          id: 'fh-social-1-o2',
          label: 'How rent increases compare to income growth',
          dimensionKind: 'social',
          nextQuestionId: null,
          pathLabel: 'rent vs income',
        },
        {
          id: 'fh-social-1-o3',
          label: 'What long-time residents say about the change',
          dimensionKind: 'social',
          nextQuestionId: null,
          pathLabel: 'resident voices',
        },
      ],
    },
  ],
  economic: [
    {
      id: 'fh-economic-1',
      type: 'evidence',
      scenario: 'The council wants data on whether building more really lowers rents.',
      prompt: 'Which dataset would you ask for?',
      relatedDimensionKinds: ['economic'],
      options: [
        {
          id: 'fh-economic-1-o1',
          label: 'Permit and completion trends over ten years',
          dimensionKind: 'economic',
          nextQuestionId: null,
          pathLabel: 'permit trends',
        },
        {
          id: 'fh-economic-1-o2',
          label: 'Rent movements in neighborhoods that built most',
          dimensionKind: 'economic',
          nextQuestionId: null,
          pathLabel: 'rent vs building',
        },
        {
          id: 'fh-economic-1-o3',
          label: 'Affordability metrics by income bracket',
          dimensionKind: 'economic',
          nextQuestionId: null,
          pathLabel: 'affordability brackets',
        },
      ],
    },
  ],
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-misinformation',
    slug: 'misinformation-in-the-coming-elections',
    topicId: 'topic-misinformation',
    title: 'The Clip in Your Feed',
    intro:
      "A viral clip about a candidate is everywhere, and everyone seems sure about what it means. We'll explore how you navigate the claim, the spread, and what to do next — not to grade you, but to map how you approach uncertain information.",
    entryQuestionId: 'mq1',
    questions: misinformationQuestions,
    followUpBranches: misinformationFollowUps,
  },
  {
    id: 'case-housing',
    slug: 'urban-housing-affordability',
    topicId: 'topic-housing',
    title: 'The City Housing Plan',
    intro:
      "Your city has just unveiled a plan to make housing more affordable, and the debate is loud. We'll explore how you weigh the economics, the people, and the law behind it — mapping your approach, not judging it.",
    entryQuestionId: 'hq1',
    questions: housingQuestions,
    followUpBranches: housingFollowUps,
  },
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
