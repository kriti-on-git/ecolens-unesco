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

// ---- The Renewable Energy Transition ----
const energyQuestions: Record<string, CaseQuestion> = {
  eq1: {
    id: 'eq1',
    type: 'priority',
    scenario:
      'The grid operator announces a plan to close the last coal plant in your region a decade early, replacing it with renewables and storage.',
    prompt: 'What do you want to understand first about the plan?',
    relatedDimensionKinds: ['environmental', 'economic', 'social'],
    options: [
      {
        id: 'eq1-o1',
        label: 'Whether the grid can stay reliable',
        dimensionKind: 'scientific',
        nextQuestionId: 'eq2',
        pathLabel: 'reliability first',
      },
      {
        id: 'eq1-o2',
        label: 'What it will cost households and industry',
        dimensionKind: 'economic',
        nextQuestionId: 'eq3',
        pathLabel: 'costs first',
      },
      {
        id: 'eq1-o3',
        label: 'What happens to the mining communities',
        dimensionKind: 'social',
        nextQuestionId: 'eq4',
        pathLabel: 'communities first',
      },
    ],
  },
  eq2: {
    id: 'eq2',
    type: 'evidence',
    scenario:
      "The operator's reliability report is met with a study arguing storage technology cannot yet cover the evening peak.",
    prompt: 'How would you weigh the two claims?',
    relatedDimensionKinds: ['scientific', 'institutional'],
    options: [
      {
        id: 'eq2-o1',
        label: 'Check the capacity numbers both sides cite',
        dimensionKind: 'scientific',
        nextQuestionId: 'eq5',
        pathLabel: 'capacity check',
      },
      {
        id: 'eq2-o2',
        label: 'Look at who funded each analysis',
        dimensionKind: 'institutional',
        nextQuestionId: 'eq5',
        pathLabel: 'follow the funding',
      },
      {
        id: 'eq2-o3',
        label: 'Compare how other regions handled the same problem',
        dimensionKind: 'political',
        nextQuestionId: 'eq6',
        pathLabel: 'regional comparisons',
      },
    ],
  },
  eq3: {
    id: 'eq3',
    type: 'consequence',
    scenario:
      'A cost analysis predicts electricity bills will rise in the short term even as total system costs fall later.',
    prompt: 'What would you most want to know about the cost claim?',
    relatedDimensionKinds: ['economic', 'political'],
    options: [
      {
        id: 'eq3-o1',
        label: 'How long the short-term increase lasts',
        dimensionKind: 'economic',
        nextQuestionId: 'eq6',
        pathLabel: 'timeline of costs',
      },
      {
        id: 'eq3-o2',
        label: 'Which households are hit hardest',
        dimensionKind: 'social',
        nextQuestionId: 'eq7',
        pathLabel: 'who pays',
      },
      {
        id: 'eq3-o3',
        label: 'Whether subsidies are available',
        dimensionKind: 'political',
        nextQuestionId: 'eq7',
        pathLabel: 'subsidy question',
      },
    ],
  },
  eq4: {
    id: 'eq4',
    type: 'stakeholder',
    scenario:
      'A public meeting about the closure fills a hall with miners, families, and environmental groups.',
    prompt: 'Whose concern should carry the most weight in the transition plan?',
    relatedDimensionKinds: ['social', 'environmental', 'economic'],
    options: [
      {
        id: 'eq4-o1',
        label: 'The workers facing unemployment',
        dimensionKind: 'social',
        nextQuestionId: 'eq7',
        pathLabel: 'workers first',
      },
      {
        id: 'eq4-o2',
        label: 'The communities breathing cleaner air',
        dimensionKind: 'environmental',
        nextQuestionId: 'eq7',
        pathLabel: 'health first',
      },
      {
        id: 'eq4-o3',
        label: 'The ratepayers funding the transition',
        dimensionKind: 'economic',
        nextQuestionId: 'eq8',
        pathLabel: 'ratepayers first',
      },
    ],
  },
  eq5: {
    id: 'eq5',
    type: 'uncertainty',
    scenario:
      'Two respected engineers disagree publicly about whether storage will be ready in time for the closure date.',
    prompt: 'What would you do with the disagreement?',
    relatedDimensionKinds: ['scientific', 'political'],
    options: [
      {
        id: 'eq5-o1',
        label: 'Look at the actual dispatch data',
        dimensionKind: 'scientific',
        nextQuestionId: 'eq9',
        pathLabel: 'dispatch data',
      },
      {
        id: 'eq5-o2',
        label: "Read the dissenting engineer's full argument",
        dimensionKind: 'scientific',
        nextQuestionId: 'eq9',
        pathLabel: 'dissent in full',
      },
      {
        id: 'eq5-o3',
        label: 'See what the regulator requires before approving',
        dimensionKind: 'political',
        nextQuestionId: 'eq10',
        pathLabel: 'regulator bar',
      },
    ],
  },
  eq6: {
    id: 'eq6',
    type: 'interpretation',
    scenario:
      'The same official statistics are presented by two outlets: one reports the transition as a success story, the other as a looming failure.',
    prompt: 'What would you do next?',
    relatedDimensionKinds: ['cultural', 'scientific', 'historical'],
    options: [
      {
        id: 'eq6-o1',
        label: 'Compare how each outlet framed the numbers',
        dimensionKind: 'cultural',
        nextQuestionId: 'eq9',
        pathLabel: 'framing comparison',
      },
      {
        id: 'eq6-o2',
        label: 'Go to the raw dataset yourself',
        dimensionKind: 'scientific',
        nextQuestionId: 'eq9',
        pathLabel: 'raw data',
      },
      {
        id: 'eq6-o3',
        label: 'Check the dates and what changed between them',
        dimensionKind: 'historical',
        nextQuestionId: 'eq10',
        pathLabel: 'context check',
      },
    ],
  },
  eq7: {
    id: 'eq7',
    type: 'cause',
    scenario: 'You are asked why the energy transition is so contentious in your region.',
    prompt: 'Which explanation do you find most compelling?',
    relatedDimensionKinds: ['economic', 'political', 'social'],
    options: [
      {
        id: 'eq7-o1',
        label: 'Because the costs and benefits fall unevenly',
        dimensionKind: 'economic',
        nextQuestionId: 'eq10',
        pathLabel: 'uneven burden',
      },
      {
        id: 'eq7-o2',
        label: 'Because it has become a partisan signal',
        dimensionKind: 'political',
        nextQuestionId: 'eq10',
        pathLabel: 'partisan signal',
      },
      {
        id: 'eq7-o3',
        label: 'Because place and identity are at stake',
        dimensionKind: 'social',
        nextQuestionId: 'eq10',
        pathLabel: 'place and identity',
      },
    ],
  },
  eq8: {
    id: 'eq8',
    type: 'assumption',
    scenario: "A headline claims: 'The transition will cut household bills by 40%.'",
    prompt: 'Which assumption would you examine first?',
    relatedDimensionKinds: ['economic', 'scientific', 'social'],
    options: [
      {
        id: 'eq8-o1',
        label: 'How the 40% figure was derived',
        dimensionKind: 'economic',
        nextQuestionId: 'eq9',
        pathLabel: 'figure provenance',
      },
      {
        id: 'eq8-o2',
        label: 'Whether grid upgrades are priced in',
        dimensionKind: 'scientific',
        nextQuestionId: 'eq9',
        pathLabel: 'upgrades priced in',
      },
      {
        id: 'eq8-o3',
        label: 'Which households the claim actually describes',
        dimensionKind: 'social',
        nextQuestionId: 'eq10',
        pathLabel: 'which households',
      },
    ],
  },
  eq9: {
    id: 'eq9',
    type: 'source-selection',
    scenario: "You want to form a grounded view of the transition's viability.",
    prompt: 'Which source would teach you the most?',
    relatedDimensionKinds: ['scientific', 'social', 'economic'],
    options: [
      {
        id: 'eq9-o1',
        label: 'Peer-reviewed storage research',
        dimensionKind: 'scientific',
        nextQuestionId: 'eq10',
        pathLabel: 'storage research',
      },
      {
        id: 'eq9-o2',
        label: 'Reporting from a town that already closed its plant',
        dimensionKind: 'social',
        nextQuestionId: 'eq10',
        pathLabel: 'lived experience',
      },
      {
        id: 'eq9-o3',
        label: 'The official cost model and its scenarios',
        dimensionKind: 'economic',
        nextQuestionId: 'eq10',
        pathLabel: 'cost model',
      },
    ],
  },
  eq10: {
    id: 'eq10',
    type: 'consequence',
    scenario: 'The final decision on the closure date is now in front of the regulator.',
    prompt: 'What matters most to you about the outcome?',
    relatedDimensionKinds: ['environmental', 'political', 'economic'],
    options: [
      {
        id: 'eq10-o1',
        label: 'That emissions targets are actually met',
        dimensionKind: 'environmental',
        nextQuestionId: null,
        pathLabel: 'targets met',
      },
      {
        id: 'eq10-o2',
        label: 'That the decision holds across governments',
        dimensionKind: 'political',
        nextQuestionId: null,
        pathLabel: 'durable decision',
      },
      {
        id: 'eq10-o3',
        label: 'That nobody is left paying an unfair share',
        dimensionKind: 'economic',
        nextQuestionId: null,
        pathLabel: 'fair share',
      },
    ],
  },
};

const energyFollowUps: Record<string, CaseQuestion[]> = {
  environmental: [
    {
      id: 'fe-env-1',
      type: 'cause',
      scenario: 'A new solar farm is proposed on farmland that supports local wildlife.',
      prompt: 'How do you weigh the trade-off?',
      relatedDimensionKinds: ['environmental'],
      options: [
        {
          id: 'fe-env-1-o1',
          label: 'Climate benefits outweigh local land costs',
          dimensionKind: 'environmental',
          nextQuestionId: null,
          pathLabel: 'climate over land',
        },
        {
          id: 'fe-env-1-o2',
          label: 'Require habitat mitigation first',
          dimensionKind: 'environmental',
          nextQuestionId: null,
          pathLabel: 'mitigation first',
        },
        {
          id: 'fe-env-1-o3',
          label: 'Find sites that avoid the conflict entirely',
          dimensionKind: 'environmental',
          nextQuestionId: null,
          pathLabel: 'avoid conflict',
        },
      ],
    },
  ],
  scientific: [
    {
      id: 'fe-sci-1',
      type: 'evidence',
      scenario: 'Storage capability is the crux of the reliability debate.',
      prompt: 'Which evidence would you ask for first?',
      relatedDimensionKinds: ['scientific'],
      options: [
        {
          id: 'fe-sci-1-o1',
          label: 'Real dispatch data from operating plants',
          dimensionKind: 'scientific',
          nextQuestionId: null,
          pathLabel: 'dispatch data',
        },
        {
          id: 'fe-sci-1-o2',
          label: 'Round-trip efficiency benchmarks',
          dimensionKind: 'scientific',
          nextQuestionId: null,
          pathLabel: 'efficiency benchmarks',
        },
        {
          id: 'fe-sci-1-o3',
          label: 'Grid-modeling assumptions in plain language',
          dimensionKind: 'scientific',
          nextQuestionId: null,
          pathLabel: 'modeling assumptions',
        },
      ],
    },
  ],
};

// ---- Digital Literacy in the Classroom ----
const literacyQuestions: Record<string, CaseQuestion> = {
  lq1: {
    id: 'lq1',
    type: 'priority',
    scenario:
      'Your district is adopting a new media literacy curriculum. A parent meeting is divided, and teachers worry it will crowd out other subjects.',
    prompt: 'What should the curriculum prioritize?',
    relatedDimensionKinds: ['education', 'cultural', 'political'],
    options: [
      {
        id: 'lq1-o1',
        label: 'Skills students can use in every subject',
        dimensionKind: 'education',
        nextQuestionId: 'lq2',
        pathLabel: 'transferable skills',
      },
      {
        id: 'lq1-o2',
        label: 'Understanding how platforms shape attention',
        dimensionKind: 'cultural',
        nextQuestionId: 'lq3',
        pathLabel: 'platform awareness',
      },
      {
        id: 'lq1-o3',
        label: 'Evaluating claims and sources directly',
        dimensionKind: 'education',
        nextQuestionId: 'lq4',
        pathLabel: 'evaluation skills',
      },
    ],
  },
  lq2: {
    id: 'lq2',
    type: 'evidence',
    scenario:
      'A study is cited claiming media literacy programs rarely change real-world behavior.',
    prompt: 'What would you check before trusting that claim?',
    relatedDimensionKinds: ['education', 'scientific'],
    options: [
      {
        id: 'lq2-o1',
        label: 'How behavior was measured',
        dimensionKind: 'education',
        nextQuestionId: 'lq5',
        pathLabel: 'measurement first',
      },
      {
        id: 'lq2-o2',
        label: 'Which programs the study included',
        dimensionKind: 'scientific',
        nextQuestionId: 'lq5',
        pathLabel: 'program sample',
      },
      {
        id: 'lq2-o3',
        label: 'How recent the evidence is',
        dimensionKind: 'scientific',
        nextQuestionId: 'lq6',
        pathLabel: 'recency check',
      },
    ],
  },
  lq3: {
    id: 'lq3',
    type: 'stakeholder',
    scenario:
      'The district must decide who helps design the lessons about platforms and algorithms.',
    prompt: 'Whose input should carry the most weight?',
    relatedDimensionKinds: ['cultural', 'institutional', 'individual'],
    options: [
      {
        id: 'lq3-o1',
        label: 'Classroom teachers who see students daily',
        dimensionKind: 'institutional',
        nextQuestionId: 'lq6',
        pathLabel: 'teachers first',
      },
      {
        id: 'lq3-o2',
        label: 'Researchers who study youth media habits',
        dimensionKind: 'cultural',
        nextQuestionId: 'lq6',
        pathLabel: 'researchers first',
      },
      {
        id: 'lq3-o3',
        label: 'Students themselves',
        dimensionKind: 'individual',
        nextQuestionId: 'lq7',
        pathLabel: 'students first',
      },
    ],
  },
  lq4: {
    id: 'lq4',
    type: 'assumption',
    scenario: "A critic says: 'Teaching kids to fact-check is futile — they won't do it anyway.'",
    prompt: 'Which assumption in that claim would you question first?',
    relatedDimensionKinds: ['education', 'social', 'individual'],
    options: [
      {
        id: 'lq4-o1',
        label: 'That evaluation must happen at the moment of sharing',
        dimensionKind: 'education',
        nextQuestionId: 'lq7',
        pathLabel: 'timing assumption',
      },
      {
        id: 'lq4-o2',
        label: 'That habits are fixed by adolescence',
        dimensionKind: 'social',
        nextQuestionId: 'lq7',
        pathLabel: 'fixed habits',
      },
      {
        id: 'lq4-o3',
        label: 'That individual choices drive the problem',
        dimensionKind: 'individual',
        nextQuestionId: 'lq8',
        pathLabel: 'individual framing',
      },
    ],
  },
  lq5: {
    id: 'lq5',
    type: 'uncertainty',
    scenario:
      'Expert testimony at a school board hearing directly contradicts published research findings.',
    prompt: 'How do you decide what to take away?',
    relatedDimensionKinds: ['education', 'scientific'],
    options: [
      {
        id: 'lq5-o1',
        label: 'Focus on what both sides actually agree on',
        dimensionKind: 'education',
        nextQuestionId: 'lq9',
        pathLabel: 'common ground',
      },
      {
        id: 'lq5-o2',
        label: 'Read the studies behind each position',
        dimensionKind: 'scientific',
        nextQuestionId: 'lq9',
        pathLabel: 'primary studies',
      },
      {
        id: 'lq5-o3',
        label: 'Note what nobody is addressing',
        dimensionKind: 'education',
        nextQuestionId: 'lq10',
        pathLabel: 'unasked questions',
      },
    ],
  },
  lq6: {
    id: 'lq6',
    type: 'consequence',
    scenario: 'The curriculum passes but funding for teacher training is cut.',
    prompt: 'What do you expect to happen in practice?',
    relatedDimensionKinds: ['institutional', 'social', 'political'],
    options: [
      {
        id: 'lq6-o1',
        label: 'Lessons get taught inconsistently',
        dimensionKind: 'institutional',
        nextQuestionId: 'lq9',
        pathLabel: 'inconsistent teaching',
      },
      {
        id: 'lq6-o2',
        label: 'The gap widens between well-resourced and under-resourced schools',
        dimensionKind: 'social',
        nextQuestionId: 'lq9',
        pathLabel: 'widening gap',
      },
      {
        id: 'lq6-o3',
        label: 'The curriculum becomes symbolic rather than practical',
        dimensionKind: 'political',
        nextQuestionId: 'lq10',
        pathLabel: 'symbolic adoption',
      },
    ],
  },
  lq7: {
    id: 'lq7',
    type: 'interpretation',
    scenario:
      'Two outlets cover the same district data — one celebrates rising digital skills, the other reports the skills gap is growing.',
    prompt: 'What would you do next?',
    relatedDimensionKinds: ['cultural', 'social', 'international'],
    options: [
      {
        id: 'lq7-o1',
        label: 'Compare how each defined the skill being measured',
        dimensionKind: 'cultural',
        nextQuestionId: 'lq10',
        pathLabel: 'definition check',
      },
      {
        id: 'lq7-o2',
        label: 'Look at the underlying assessment data',
        dimensionKind: 'social',
        nextQuestionId: 'lq10',
        pathLabel: 'raw assessment',
      },
      {
        id: 'lq7-o3',
        label: 'See how comparable systems abroad report it',
        dimensionKind: 'international',
        nextQuestionId: 'lq10',
        pathLabel: 'international view',
      },
    ],
  },
  lq8: {
    id: 'lq8',
    type: 'cause',
    scenario: 'You are asked why some students leave school with weak digital judgment.',
    prompt: 'Which explanation do you find most compelling?',
    relatedDimensionKinds: ['social', 'institutional', 'economic'],
    options: [
      {
        id: 'lq8-o1',
        label: 'Unequal access to devices and connectivity',
        dimensionKind: 'social',
        nextQuestionId: 'lq10',
        pathLabel: 'access divide',
      },
      {
        id: 'lq8-o2',
        label: 'Inconsistent teacher training and support',
        dimensionKind: 'institutional',
        nextQuestionId: 'lq10',
        pathLabel: 'training gap',
      },
      {
        id: 'lq8-o3',
        label: 'Pressure from commercial platforms on attention',
        dimensionKind: 'economic',
        nextQuestionId: 'lq10',
        pathLabel: 'platform pressure',
      },
    ],
  },
  lq9: {
    id: 'lq9',
    type: 'source-selection',
    scenario: 'You want to understand what media literacy actually achieves in schools.',
    prompt: 'Which source would teach you the most?',
    relatedDimensionKinds: ['education', 'international', 'social'],
    options: [
      {
        id: 'lq9-o1',
        label: 'A meta-analysis of classroom interventions',
        dimensionKind: 'education',
        nextQuestionId: 'lq10',
        pathLabel: 'meta-analysis',
      },
      {
        id: 'lq9-o2',
        label: 'Comparative studies of other education systems',
        dimensionKind: 'international',
        nextQuestionId: 'lq10',
        pathLabel: 'other systems',
      },
      {
        id: 'lq9-o3',
        label: 'District data on who receives instruction',
        dimensionKind: 'social',
        nextQuestionId: 'lq10',
        pathLabel: 'district data',
      },
    ],
  },
  lq10: {
    id: 'lq10',
    type: 'stakeholder',
    scenario: 'The school board is deciding whether to make the curriculum mandatory or optional.',
    prompt: 'What should decide the outcome?',
    relatedDimensionKinds: ['political', 'education', 'cultural'],
    options: [
      {
        id: 'lq10-o1',
        label: 'The evidence of what works',
        dimensionKind: 'education',
        nextQuestionId: null,
        pathLabel: 'evidence decides',
      },
      {
        id: 'lq10-o2',
        label: 'What parents and communities want',
        dimensionKind: 'political',
        nextQuestionId: null,
        pathLabel: 'community decides',
      },
      {
        id: 'lq10-o3',
        label: 'What students actually need today',
        dimensionKind: 'cultural',
        nextQuestionId: null,
        pathLabel: 'students decide',
      },
    ],
  },
};

const literacyFollowUps: Record<string, CaseQuestion[]> = {
  social: [
    {
      id: 'fl-social-1',
      type: 'cause',
      scenario: 'The skills gap between districts keeps making headlines.',
      prompt: 'What would you investigate first?',
      relatedDimensionKinds: ['social'],
      options: [
        {
          id: 'fl-social-1-o1',
          label: 'Connectivity and device access by district',
          dimensionKind: 'social',
          nextQuestionId: null,
          pathLabel: 'access data',
        },
        {
          id: 'fl-social-1-o2',
          label: 'Teacher training hours by district',
          dimensionKind: 'social',
          nextQuestionId: null,
          pathLabel: 'training data',
        },
        {
          id: 'fl-social-1-o3',
          label: 'How the gap changed over five years',
          dimensionKind: 'social',
          nextQuestionId: null,
          pathLabel: 'trend data',
        },
      ],
    },
  ],
  international: [
    {
      id: 'fl-intl-1',
      type: 'source-selection',
      scenario: 'A minister cites another country as proof the approach works.',
      prompt: 'What would you check about that comparison?',
      relatedDimensionKinds: ['international'],
      options: [
        {
          id: 'fl-intl-1-o1',
          label: 'How their system differs from yours',
          dimensionKind: 'international',
          nextQuestionId: null,
          pathLabel: 'system differences',
        },
        {
          id: 'fl-intl-1-o2',
          label: 'How their outcomes are measured',
          dimensionKind: 'international',
          nextQuestionId: null,
          pathLabel: 'outcome measures',
        },
        {
          id: 'fl-intl-1-o3',
          label: 'Whether the comparison is apples to apples',
          dimensionKind: 'international',
          nextQuestionId: null,
          pathLabel: 'comparability',
        },
      ],
    },
  ],
};

// ---- Water Scarcity in the 21st Century ----
const waterQuestions: Record<string, CaseQuestion> = {
  wq1: {
    id: 'wq1',
    type: 'priority',
    scenario:
      'A drought is deepening and the river authority must decide how to cut water use across farms, cities, and industry.',
    prompt: 'What should guide the cuts?',
    relatedDimensionKinds: ['environmental', 'economic', 'social'],
    options: [
      {
        id: 'wq1-o1',
        label: 'Keeping ecosystems alive',
        dimensionKind: 'environmental',
        nextQuestionId: 'wq2',
        pathLabel: 'ecosystems first',
      },
      {
        id: 'wq1-o2',
        label: 'Protecting livelihoods and jobs',
        dimensionKind: 'economic',
        nextQuestionId: 'wq3',
        pathLabel: 'livelihoods first',
      },
      {
        id: 'wq1-o3',
        label: 'Ensuring households have water for daily life',
        dimensionKind: 'social',
        nextQuestionId: 'wq4',
        pathLabel: 'households first',
      },
    ],
  },
  wq2: {
    id: 'wq2',
    type: 'evidence',
    scenario:
      "The authority's assessment says the river can survive two more dry years — a farmers' group disputes the modeling.",
    prompt: 'How would you weigh the two claims?',
    relatedDimensionKinds: ['environmental', 'scientific'],
    options: [
      {
        id: 'wq2-o1',
        label: 'Check the hydrological data both sides cite',
        dimensionKind: 'scientific',
        nextQuestionId: 'wq5',
        pathLabel: 'hydrology check',
      },
      {
        id: 'wq2-o2',
        label: 'Ask who built each model and for whom',
        dimensionKind: 'institutional',
        nextQuestionId: 'wq5',
        pathLabel: 'model provenance',
      },
      {
        id: 'wq2-o3',
        label: 'Compare with what happened in earlier droughts',
        dimensionKind: 'historical',
        nextQuestionId: 'wq6',
        pathLabel: 'past droughts',
      },
    ],
  },
  wq3: {
    id: 'wq3',
    type: 'consequence',
    scenario:
      'A plan proposes steep water prices to reduce demand, with rebates for low-income households.',
    prompt: 'What would you most want to know about the pricing plan?',
    relatedDimensionKinds: ['economic', 'social'],
    options: [
      {
        id: 'wq3-o1',
        label: 'Whether rebates actually reach the households that need them',
        dimensionKind: 'social',
        nextQuestionId: 'wq6',
        pathLabel: 'rebate reach',
      },
      {
        id: 'wq3-o2',
        label: 'How much demand the price is expected to cut',
        dimensionKind: 'economic',
        nextQuestionId: 'wq7',
        pathLabel: 'demand response',
      },
      {
        id: 'wq3-o3',
        label: 'Who proposed the numbers and from what data',
        dimensionKind: 'economic',
        nextQuestionId: 'wq7',
        pathLabel: 'price provenance',
      },
    ],
  },
  wq4: {
    id: 'wq4',
    type: 'stakeholder',
    scenario:
      'A public hearing on the cuts is dominated by large farms, small farmers, and city residents.',
    prompt: 'Whose voice should carry the most weight?',
    relatedDimensionKinds: ['social', 'legal', 'economic'],
    options: [
      {
        id: 'wq4-o1',
        label: 'Small farmers with no alternative supply',
        dimensionKind: 'social',
        nextQuestionId: 'wq7',
        pathLabel: 'small farmers',
      },
      {
        id: 'wq4-o2',
        label: 'Households in the most affected towns',
        dimensionKind: 'social',
        nextQuestionId: 'wq7',
        pathLabel: 'affected towns',
      },
      {
        id: 'wq4-o3',
        label: 'The holders of senior water rights',
        dimensionKind: 'legal',
        nextQuestionId: 'wq8',
        pathLabel: 'rights holders',
      },
    ],
  },
  wq5: {
    id: 'wq5',
    type: 'uncertainty',
    scenario: 'Two hydrologists give opposite answers about how long the reserves will last.',
    prompt: 'What would you do with the disagreement?',
    relatedDimensionKinds: ['scientific', 'political'],
    options: [
      {
        id: 'wq5-o1',
        label: 'Examine the data each side relies on',
        dimensionKind: 'scientific',
        nextQuestionId: 'wq9',
        pathLabel: 'data examination',
      },
      {
        id: 'wq5-o2',
        label: 'Focus on the assumptions both share',
        dimensionKind: 'scientific',
        nextQuestionId: 'wq9',
        pathLabel: 'shared assumptions',
      },
      {
        id: 'wq5-o3',
        label: 'See what the legal framework requires',
        dimensionKind: 'political',
        nextQuestionId: 'wq10',
        pathLabel: 'legal triggers',
      },
    ],
  },
  wq6: {
    id: 'wq6',
    type: 'interpretation',
    scenario:
      'Two outlets report the same reservoir levels — one frames it as recovery, the other as the worst on record.',
    prompt: 'What would you do next?',
    relatedDimensionKinds: ['cultural', 'scientific', 'historical'],
    options: [
      {
        id: 'wq6-o1',
        label: 'Compare the baselines each outlet used',
        dimensionKind: 'cultural',
        nextQuestionId: 'wq9',
        pathLabel: 'baseline check',
      },
      {
        id: 'wq6-o2',
        label: 'Look at the raw reservoir data',
        dimensionKind: 'scientific',
        nextQuestionId: 'wq9',
        pathLabel: 'raw data',
      },
      {
        id: 'wq6-o3',
        label: "Check the record length and what 'worst' means",
        dimensionKind: 'historical',
        nextQuestionId: 'wq10',
        pathLabel: 'record context',
      },
    ],
  },
  wq7: {
    id: 'wq7',
    type: 'assumption',
    scenario: "A headline declares: 'Desalination will end the water crisis.'",
    prompt: 'Which assumption would you examine first?',
    relatedDimensionKinds: ['economic', 'environmental', 'scientific'],
    options: [
      {
        id: 'wq7-o1',
        label: 'Whether the energy cost is accounted for',
        dimensionKind: 'economic',
        nextQuestionId: 'wq10',
        pathLabel: 'energy cost',
      },
      {
        id: 'wq7-o2',
        label: 'What it does to coastal ecosystems',
        dimensionKind: 'environmental',
        nextQuestionId: 'wq10',
        pathLabel: 'ecosystem cost',
      },
      {
        id: 'wq7-o3',
        label: 'Whether the scale actually matches the shortfall',
        dimensionKind: 'scientific',
        nextQuestionId: 'wq10',
        pathLabel: 'scale check',
      },
    ],
  },
  wq8: {
    id: 'wq8',
    type: 'cause',
    scenario: 'You are asked why water disputes between regions keep escalating.',
    prompt: 'Which explanation do you find most compelling?',
    relatedDimensionKinds: ['legal', 'political', 'economic'],
    options: [
      {
        id: 'wq8-o1',
        label: 'Outdated allocation rules',
        dimensionKind: 'legal',
        nextQuestionId: 'wq10',
        pathLabel: 'outdated rules',
      },
      {
        id: 'wq8-o2',
        label: 'Growing political pressure on scarce resources',
        dimensionKind: 'political',
        nextQuestionId: 'wq10',
        pathLabel: 'political pressure',
      },
      {
        id: 'wq8-o3',
        label: 'The rising economic value of every drop',
        dimensionKind: 'economic',
        nextQuestionId: 'wq10',
        pathLabel: 'economic value',
      },
    ],
  },
  wq9: {
    id: 'wq9',
    type: 'source-selection',
    scenario: 'You want a grounded view of how bad the scarcity really is.',
    prompt: 'Which source would teach you the most?',
    relatedDimensionKinds: ['environmental', 'social', 'legal'],
    options: [
      {
        id: 'wq9-o1',
        label: 'The official basin assessment',
        dimensionKind: 'environmental',
        nextQuestionId: 'wq10',
        pathLabel: 'official assessment',
      },
      {
        id: 'wq9-o2',
        label: 'Reporting from the hardest-hit communities',
        dimensionKind: 'social',
        nextQuestionId: 'wq10',
        pathLabel: 'community reporting',
      },
      {
        id: 'wq9-o3',
        label: 'The treaty and allocation rules',
        dimensionKind: 'legal',
        nextQuestionId: 'wq10',
        pathLabel: 'treaty text',
      },
    ],
  },
  wq10: {
    id: 'wq10',
    type: 'consequence',
    scenario: 'The final allocation decision is due, and every option leaves someone worse off.',
    prompt: 'What matters most about the outcome?',
    relatedDimensionKinds: ['international', 'social', 'legal'],
    options: [
      {
        id: 'wq10-o1',
        label: 'That the rules hold for the long term',
        dimensionKind: 'legal',
        nextQuestionId: null,
        pathLabel: 'durable rules',
      },
      {
        id: 'wq10-o2',
        label: 'That the hardest-hit people are protected',
        dimensionKind: 'social',
        nextQuestionId: null,
        pathLabel: 'people protected',
      },
      {
        id: 'wq10-o3',
        label: 'That neighboring regions stay cooperative',
        dimensionKind: 'international',
        nextQuestionId: null,
        pathLabel: 'regional cooperation',
      },
    ],
  },
};

const waterFollowUps: Record<string, CaseQuestion[]> = {
  legal: [
    {
      id: 'fw-legal-1',
      type: 'source-selection',
      scenario: 'The allocation rules themselves are being challenged.',
      prompt: 'Which legal source would you read first?',
      relatedDimensionKinds: ['legal'],
      options: [
        {
          id: 'fw-legal-1-o1',
          label: 'The treaty text and annexes',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'treaty text',
        },
        {
          id: 'fw-legal-1-o2',
          label: 'The drought-trigger clauses',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'drought triggers',
        },
        {
          id: 'fw-legal-1-o3',
          label: 'Recent rulings on allocation disputes',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'dispute rulings',
        },
      ],
    },
  ],
  international: [
    {
      id: 'fw-intl-1',
      type: 'cause',
      scenario:
        'The river crosses a border, and the neighboring country is building a dam upstream.',
      prompt: 'What would you investigate first?',
      relatedDimensionKinds: ['international'],
      options: [
        {
          id: 'fw-intl-1-o1',
          label: 'What the treaty says about new infrastructure',
          dimensionKind: 'international',
          nextQuestionId: null,
          pathLabel: 'treaty terms',
        },
        {
          id: 'fw-intl-1-o2',
          label: 'How similar disputes were resolved elsewhere',
          dimensionKind: 'international',
          nextQuestionId: null,
          pathLabel: 'precedents',
        },
        {
          id: 'fw-intl-1-o3',
          label: "The dam's actual downstream effects",
          dimensionKind: 'international',
          nextQuestionId: null,
          pathLabel: 'downstream effects',
        },
      ],
    },
  ],
};

// ---- The Future of Work in an Automated Economy ----
const workQuestions: Record<string, CaseQuestion> = {
  wfq1: {
    id: 'wfq1',
    type: 'priority',
    scenario:
      'A new automation forecast predicts major job displacement in your region. Unions and tech firms are both citing it.',
    prompt: 'What matters most to you about the forecast?',
    relatedDimensionKinds: ['economic', 'social', 'institutional'],
    options: [
      {
        id: 'wfq1-o1',
        label: 'Whether the numbers are credible',
        dimensionKind: 'economic',
        nextQuestionId: 'wfq2',
        pathLabel: 'credibility first',
      },
      {
        id: 'wfq1-o2',
        label: "What it means for people's lives",
        dimensionKind: 'social',
        nextQuestionId: 'wfq3',
        pathLabel: 'lives first',
      },
      {
        id: 'wfq1-o3',
        label: 'Who is preparing for it',
        dimensionKind: 'institutional',
        nextQuestionId: 'wfq4',
        pathLabel: 'preparation first',
      },
    ],
  },
  wfq2: {
    id: 'wfq2',
    type: 'evidence',
    scenario:
      "The forecast's authors publish their model, and a rival institute disputes the assumptions.",
    prompt: 'How would you weigh the two analyses?',
    relatedDimensionKinds: ['economic', 'scientific'],
    options: [
      {
        id: 'wfq2-o1',
        label: 'Compare the assumptions each model makes',
        dimensionKind: 'scientific',
        nextQuestionId: 'wfq5',
        pathLabel: 'assumptions compared',
      },
      {
        id: 'wfq2-o2',
        label: 'Check what data each side fed the model',
        dimensionKind: 'scientific',
        nextQuestionId: 'wfq5',
        pathLabel: 'input data',
      },
      {
        id: 'wfq2-o3',
        label: 'See who funded each analysis',
        dimensionKind: 'institutional',
        nextQuestionId: 'wfq6',
        pathLabel: 'funding trail',
      },
    ],
  },
  wfq3: {
    id: 'wfq3',
    type: 'stakeholder',
    scenario: 'A town hall about the forecast fills with workers, employers, and students.',
    prompt: 'Whose concern should carry the most weight?',
    relatedDimensionKinds: ['social', 'economic', 'individual'],
    options: [
      {
        id: 'wfq3-o1',
        label: 'Workers in the most exposed jobs',
        dimensionKind: 'social',
        nextQuestionId: 'wfq6',
        pathLabel: 'exposed workers',
      },
      {
        id: 'wfq3-o2',
        label: 'Students choosing careers now',
        dimensionKind: 'individual',
        nextQuestionId: 'wfq7',
        pathLabel: 'students choosing',
      },
      {
        id: 'wfq3-o3',
        label: 'Employers planning investments',
        dimensionKind: 'economic',
        nextQuestionId: 'wfq7',
        pathLabel: 'employers planning',
      },
    ],
  },
  wfq4: {
    id: 'wfq4',
    type: 'consequence',
    scenario:
      'The government responds to the forecast with a retraining program funded by a payroll levy.',
    prompt: 'What would you most want to know about the program?',
    relatedDimensionKinds: ['institutional', 'political', 'economic'],
    options: [
      {
        id: 'wfq4-o1',
        label: 'How it compares to programs that actually worked',
        dimensionKind: 'institutional',
        nextQuestionId: 'wfq7',
        pathLabel: 'evidence of programs',
      },
      {
        id: 'wfq4-o2',
        label: 'Whether the funding is durable',
        dimensionKind: 'political',
        nextQuestionId: 'wfq7',
        pathLabel: 'funding durability',
      },
      {
        id: 'wfq4-o3',
        label: 'How much it costs and who pays',
        dimensionKind: 'economic',
        nextQuestionId: 'wfq8',
        pathLabel: 'cost and burden',
      },
    ],
  },
  wfq5: {
    id: 'wfq5',
    type: 'uncertainty',
    scenario:
      'Two credible economists testify with directly opposite predictions about net job losses.',
    prompt: 'How do you decide what to take away?',
    relatedDimensionKinds: ['economic', 'scientific'],
    options: [
      {
        id: 'wfq5-o1',
        label: 'Focus on where both agree',
        dimensionKind: 'economic',
        nextQuestionId: 'wfq9',
        pathLabel: 'common ground',
      },
      {
        id: 'wfq5-o2',
        label: 'Read the models behind each claim',
        dimensionKind: 'scientific',
        nextQuestionId: 'wfq9',
        pathLabel: 'the models',
      },
      {
        id: 'wfq5-o3',
        label: 'Note what neither is addressing',
        dimensionKind: 'scientific',
        nextQuestionId: 'wfq10',
        pathLabel: 'unasked questions',
      },
    ],
  },
  wfq6: {
    id: 'wfq6',
    type: 'interpretation',
    scenario:
      'Two outlets cover the same forecast — one reports an automation boom, the other a jobs catastrophe.',
    prompt: 'What would you do next?',
    relatedDimensionKinds: ['cultural', 'historical', 'economic'],
    options: [
      {
        id: 'wfq6-o1',
        label: 'Compare how each framed the same numbers',
        dimensionKind: 'cultural',
        nextQuestionId: 'wfq9',
        pathLabel: 'framing comparison',
      },
      {
        id: 'wfq6-o2',
        label: 'Read the underlying report yourself',
        dimensionKind: 'economic',
        nextQuestionId: 'wfq9',
        pathLabel: 'report directly',
      },
      {
        id: 'wfq6-o3',
        label: 'Check what past forecasts actually got right',
        dimensionKind: 'historical',
        nextQuestionId: 'wfq10',
        pathLabel: 'track record',
      },
    ],
  },
  wfq7: {
    id: 'wfq7',
    type: 'cause',
    scenario: 'You are asked why automation debates are so polarized.',
    prompt: 'Which explanation do you find most compelling?',
    relatedDimensionKinds: ['political', 'cultural', 'social'],
    options: [
      {
        id: 'wfq7-o1',
        label: 'Because forecasts are used as political ammunition',
        dimensionKind: 'political',
        nextQuestionId: 'wfq10',
        pathLabel: 'political ammunition',
      },
      {
        id: 'wfq7-o2',
        label: 'Because work is tied to identity',
        dimensionKind: 'social',
        nextQuestionId: 'wfq10',
        pathLabel: 'identity stakes',
      },
      {
        id: 'wfq7-o3',
        label: 'Because the future is genuinely uncertain',
        dimensionKind: 'cultural',
        nextQuestionId: 'wfq10',
        pathLabel: 'genuine uncertainty',
      },
    ],
  },
  wfq8: {
    id: 'wfq8',
    type: 'assumption',
    scenario: "A columnist writes: 'Retraining has never worked, and never will.'",
    prompt: 'Which assumption would you question first?',
    relatedDimensionKinds: ['historical', 'institutional', 'individual'],
    options: [
      {
        id: 'wfq8-o1',
        label: 'That past failures predict future ones',
        dimensionKind: 'historical',
        nextQuestionId: 'wfq9',
        pathLabel: 'past predicts future',
      },
      {
        id: 'wfq8-o2',
        label: 'That programs are the only lever',
        dimensionKind: 'institutional',
        nextQuestionId: 'wfq9',
        pathLabel: 'only lever',
      },
      {
        id: 'wfq8-o3',
        label: 'That individual effort decides outcomes',
        dimensionKind: 'individual',
        nextQuestionId: 'wfq10',
        pathLabel: 'individual effort',
      },
    ],
  },
  wfq9: {
    id: 'wfq9',
    type: 'source-selection',
    scenario: 'You want to form a grounded view of what automation will really do to work.',
    prompt: 'Which source would teach you the most?',
    relatedDimensionKinds: ['historical', 'economic', 'institutional'],
    options: [
      {
        id: 'wfq9-o1',
        label: 'A historical study of past automation waves',
        dimensionKind: 'historical',
        nextQuestionId: 'wfq10',
        pathLabel: 'history of waves',
      },
      {
        id: 'wfq9-o2',
        label: 'The forecast report with its scenarios',
        dimensionKind: 'economic',
        nextQuestionId: 'wfq10',
        pathLabel: 'forecast report',
      },
      {
        id: 'wfq9-o3',
        label: 'An evidence review of retraining programs',
        dimensionKind: 'institutional',
        nextQuestionId: 'wfq10',
        pathLabel: 'retraining evidence',
      },
    ],
  },
  wfq10: {
    id: 'wfq10',
    type: 'stakeholder',
    scenario: 'A national strategy for the automated economy is being drafted.',
    prompt: 'What should the strategy protect first?',
    relatedDimensionKinds: ['political', 'economic', 'social'],
    options: [
      {
        id: 'wfq10-o1',
        label: 'Income security during transitions',
        dimensionKind: 'political',
        nextQuestionId: null,
        pathLabel: 'income security',
      },
      {
        id: 'wfq10-o2',
        label: 'Productivity and competitiveness',
        dimensionKind: 'economic',
        nextQuestionId: null,
        pathLabel: 'competitiveness',
      },
      {
        id: 'wfq10-o3',
        label: 'The meaning and dignity of work',
        dimensionKind: 'social',
        nextQuestionId: null,
        pathLabel: 'dignity of work',
      },
    ],
  },
};

const workFollowUps: Record<string, CaseQuestion[]> = {
  historical: [
    {
      id: 'fwf-historical-1',
      type: 'cause',
      scenario: 'A pundit claims the current automation wave is unprecedented.',
      prompt: 'What would you check first?',
      relatedDimensionKinds: ['historical'],
      options: [
        {
          id: 'fwf-historical-1-o1',
          label: 'How past waves compared in speed and scope',
          dimensionKind: 'historical',
          nextQuestionId: null,
          pathLabel: 'past waves',
        },
        {
          id: 'fwf-historical-1-o2',
          label: 'What jobs were created afterward',
          dimensionKind: 'historical',
          nextQuestionId: null,
          pathLabel: 'created jobs',
        },
        {
          id: 'fwf-historical-1-o3',
          label: 'How long the disruption actually lasted',
          dimensionKind: 'historical',
          nextQuestionId: null,
          pathLabel: 'disruption length',
        },
      ],
    },
  ],
  social: [
    {
      id: 'fwf-social-1',
      type: 'consequence',
      scenario: 'Automation spreads fastest in some regions and sectors first.',
      prompt: 'What worries you most about that uneven spread?',
      relatedDimensionKinds: ['social'],
      options: [
        {
          id: 'fwf-social-1-o1',
          label: 'That some communities get left behind',
          dimensionKind: 'social',
          nextQuestionId: null,
          pathLabel: 'left behind',
        },
        {
          id: 'fwf-social-1-o2',
          label: 'That the gains concentrate in few places',
          dimensionKind: 'social',
          nextQuestionId: null,
          pathLabel: 'concentrated gains',
        },
        {
          id: 'fwf-social-1-o3',
          label: 'That the transition fractures communities',
          dimensionKind: 'social',
          nextQuestionId: null,
          pathLabel: 'fractured communities',
        },
      ],
    },
  ],
};

// ---- AI-Generated Books and the Meaning of Authorship ----
const authorshipQuestions: Record<string, CaseQuestion> = {
  aq1: {
    id: 'aq1',
    type: 'priority',
    scenario:
      'A major publisher releases an AI-assisted novel that becomes a bestseller. Writers are angry; readers are curious.',
    prompt: 'What matters most to you about the book?',
    relatedDimensionKinds: ['legal', 'economic', 'individual'],
    options: [
      {
        id: 'aq1-o1',
        label: 'Whether it was legal',
        dimensionKind: 'legal',
        nextQuestionId: 'aq2',
        pathLabel: 'legality first',
      },
      {
        id: 'aq1-o2',
        label: 'Who gets paid for it',
        dimensionKind: 'economic',
        nextQuestionId: 'aq3',
        pathLabel: 'money first',
      },
      {
        id: 'aq1-o3',
        label: 'What it means for human writers',
        dimensionKind: 'individual',
        nextQuestionId: 'aq4',
        pathLabel: 'writers first',
      },
    ],
  },
  aq2: {
    id: 'aq2',
    type: 'evidence',
    scenario:
      'The publisher claims the book is fully copyrightable because humans edited it heavily.',
    prompt: 'How would you check that claim?',
    relatedDimensionKinds: ['legal', 'scientific'],
    options: [
      {
        id: 'aq2-o1',
        label: 'Read the copyright guidance on AI-assisted works',
        dimensionKind: 'legal',
        nextQuestionId: 'aq5',
        pathLabel: 'official guidance',
      },
      {
        id: 'aq2-o2',
        label: 'Look at how courts ruled in similar cases',
        dimensionKind: 'legal',
        nextQuestionId: 'aq5',
        pathLabel: 'court rulings',
      },
      {
        id: 'aq2-o3',
        label: 'Ask what proportion of the text was machine-generated',
        dimensionKind: 'scientific',
        nextQuestionId: 'aq6',
        pathLabel: 'generation ratio',
      },
    ],
  },
  aq3: {
    id: 'aq3',
    type: 'consequence',
    scenario:
      "An industry report shows AI-assisted titles are undercutting midlist authors' advances.",
    prompt: 'What would you most want to understand about the economics?',
    relatedDimensionKinds: ['economic', 'individual'],
    options: [
      {
        id: 'aq3-o1',
        label: 'How royalties and advances are changing',
        dimensionKind: 'economic',
        nextQuestionId: 'aq6',
        pathLabel: 'royalties changing',
      },
      {
        id: 'aq3-o2',
        label: 'Which authors are affected most',
        dimensionKind: 'individual',
        nextQuestionId: 'aq7',
        pathLabel: 'who is affected',
      },
      {
        id: 'aq3-o3',
        label: 'Whether readers can tell the difference',
        dimensionKind: 'cultural',
        nextQuestionId: 'aq7',
        pathLabel: 'reader perception',
      },
    ],
  },
  aq4: {
    id: 'aq4',
    type: 'stakeholder',
    scenario: "A writers' union proposes labeling rules for AI-assisted books.",
    prompt: 'Whose perspective should shape the labels?',
    relatedDimensionKinds: ['individual', 'ethical', 'cultural'],
    options: [
      {
        id: 'aq4-o1',
        label: 'Working writers whose income is at stake',
        dimensionKind: 'individual',
        nextQuestionId: 'aq7',
        pathLabel: "writers' income",
      },
      {
        id: 'aq4-o2',
        label: 'Readers who want to know what they are buying',
        dimensionKind: 'ethical',
        nextQuestionId: 'aq7',
        pathLabel: 'reader transparency',
      },
      {
        id: 'aq4-o3',
        label: 'Publishers who decide what gets released',
        dimensionKind: 'cultural',
        nextQuestionId: 'aq8',
        pathLabel: 'publisher view',
      },
    ],
  },
  aq5: {
    id: 'aq5',
    type: 'uncertainty',
    scenario:
      'Legal experts disagree about whether the current rules even apply to this kind of work.',
    prompt: 'How do you decide what to take away?',
    relatedDimensionKinds: ['legal', 'individual'],
    options: [
      {
        id: 'aq5-o1',
        label: 'Read the guidance and ruling texts yourself',
        dimensionKind: 'legal',
        nextQuestionId: 'aq9',
        pathLabel: 'primary texts',
      },
      {
        id: 'aq5-o2',
        label: 'Focus on what the experts agree on',
        dimensionKind: 'legal',
        nextQuestionId: 'aq9',
        pathLabel: 'common ground',
      },
      {
        id: 'aq5-o3',
        label: 'Note the questions nobody can answer yet',
        dimensionKind: 'individual',
        nextQuestionId: 'aq10',
        pathLabel: 'open questions',
      },
    ],
  },
  aq6: {
    id: 'aq6',
    type: 'interpretation',
    scenario:
      'Two reviews of the same AI-assisted novel reach opposite conclusions about its quality and significance.',
    prompt: 'What would you do next?',
    relatedDimensionKinds: ['cultural', 'scientific', 'individual'],
    options: [
      {
        id: 'aq6-o1',
        label: 'Compare what each reviewer valued',
        dimensionKind: 'cultural',
        nextQuestionId: 'aq9',
        pathLabel: 'values compared',
      },
      {
        id: 'aq6-o2',
        label: 'Read the book and judge for yourself',
        dimensionKind: 'individual',
        nextQuestionId: 'aq9',
        pathLabel: 'read it yourself',
      },
      {
        id: 'aq6-o3',
        label: 'Check what the authors disclose about process',
        dimensionKind: 'scientific',
        nextQuestionId: 'aq10',
        pathLabel: 'process disclosure',
      },
    ],
  },
  aq7: {
    id: 'aq7',
    type: 'cause',
    scenario: 'You are asked why the AI-authorship debate is so heated.',
    prompt: 'Which explanation do you find most compelling?',
    relatedDimensionKinds: ['cultural', 'economic', 'ethical'],
    options: [
      {
        id: 'aq7-o1',
        label: 'Because money is moving quickly',
        dimensionKind: 'economic',
        nextQuestionId: 'aq10',
        pathLabel: 'money moving',
      },
      {
        id: 'aq7-o2',
        label: 'Because authorship is tied to identity',
        dimensionKind: 'cultural',
        nextQuestionId: 'aq10',
        pathLabel: 'identity stakes',
      },
      {
        id: 'aq7-o3',
        label: 'Because consent and credit are unresolved',
        dimensionKind: 'ethical',
        nextQuestionId: 'aq10',
        pathLabel: 'consent unresolved',
      },
    ],
  },
  aq8: {
    id: 'aq8',
    type: 'assumption',
    scenario: "A publisher says: 'Readers don\'t care who wrote it, only that it\'s good.'",
    prompt: 'Which assumption would you question first?',
    relatedDimensionKinds: ['cultural', 'individual', 'ethical'],
    options: [
      {
        id: 'aq8-o1',
        label: 'That quality and authorship are unrelated',
        dimensionKind: 'cultural',
        nextQuestionId: 'aq10',
        pathLabel: 'quality vs authorship',
      },
      {
        id: 'aq8-o2',
        label: 'That readers have no stake in provenance',
        dimensionKind: 'individual',
        nextQuestionId: 'aq10',
        pathLabel: 'provenance stake',
      },
      {
        id: 'aq8-o3',
        label: 'That disclosure is a burden, not a right',
        dimensionKind: 'ethical',
        nextQuestionId: 'aq10',
        pathLabel: 'disclosure as right',
      },
    ],
  },
  aq9: {
    id: 'aq9',
    type: 'source-selection',
    scenario: 'You want a grounded view of what AI authorship means for the future of books.',
    prompt: 'Which source would teach you the most?',
    relatedDimensionKinds: ['legal', 'ethical', 'economic'],
    options: [
      {
        id: 'aq9-o1',
        label: 'The copyright guidance and rulings',
        dimensionKind: 'legal',
        nextQuestionId: 'aq10',
        pathLabel: 'legal texts',
      },
      {
        id: 'aq9-o2',
        label: 'A philosophical treatment of authorship',
        dimensionKind: 'ethical',
        nextQuestionId: 'aq10',
        pathLabel: 'philosophy of authorship',
      },
      {
        id: 'aq9-o3',
        label: 'Market data on publishing economics',
        dimensionKind: 'economic',
        nextQuestionId: 'aq10',
        pathLabel: 'market data',
      },
    ],
  },
  aq10: {
    id: 'aq10',
    type: 'consequence',
    scenario: 'A labeling law for AI-assisted works is being drafted.',
    prompt: 'What should the law protect first?',
    relatedDimensionKinds: ['ethical', 'legal', 'individual'],
    options: [
      {
        id: 'aq10-o1',
        label: "Readers' right to know",
        dimensionKind: 'ethical',
        nextQuestionId: null,
        pathLabel: "reader's right to know",
      },
      {
        id: 'aq10-o2',
        label: "Writers' income and credit",
        dimensionKind: 'individual',
        nextQuestionId: null,
        pathLabel: "writer's income",
      },
      {
        id: 'aq10-o3',
        label: 'Clarity and consistency of the rules',
        dimensionKind: 'legal',
        nextQuestionId: null,
        pathLabel: 'rule clarity',
      },
    ],
  },
};

const authorshipFollowUps: Record<string, CaseQuestion[]> = {
  ethical: [
    {
      id: 'fa-ethical-1',
      type: 'stakeholder',
      scenario: "A bestselling author's name is attached to a book they did not write.",
      prompt: 'What would you want to know first?',
      relatedDimensionKinds: ['ethical'],
      options: [
        {
          id: 'fa-ethical-1-o1',
          label: 'Whether they consented to the arrangement',
          dimensionKind: 'ethical',
          nextQuestionId: null,
          pathLabel: 'consent check',
        },
        {
          id: 'fa-ethical-1-o2',
          label: 'How readers are being told about it',
          dimensionKind: 'ethical',
          nextQuestionId: null,
          pathLabel: 'disclosure to readers',
        },
        {
          id: 'fa-ethical-1-o3',
          label: 'Who benefits from the ambiguity',
          dimensionKind: 'ethical',
          nextQuestionId: null,
          pathLabel: 'beneficiaries',
        },
      ],
    },
  ],
  cultural: [
    {
      id: 'fa-cultural-1',
      type: 'interpretation',
      scenario: 'Critics argue the definition of authorship has always been evolving.',
      prompt: 'How do you weigh that argument?',
      relatedDimensionKinds: ['cultural'],
      options: [
        {
          id: 'fa-cultural-1-o1',
          label: 'Authorship has changed before — this is more of the same',
          dimensionKind: 'cultural',
          nextQuestionId: null,
          pathLabel: 'continuity view',
        },
        {
          id: 'fa-cultural-1-o2',
          label: 'The scale of change is qualitatively new',
          dimensionKind: 'cultural',
          nextQuestionId: null,
          pathLabel: 'discontinuity view',
        },
        {
          id: 'fa-cultural-1-o3',
          label: 'The question is who gets to decide the definition',
          dimensionKind: 'cultural',
          nextQuestionId: null,
          pathLabel: 'who decides',
        },
      ],
    },
  ],
};

// ---- Gene Editing and Human Ethics ----
const geneQuestions: Record<string, CaseQuestion> = {
  gq1: {
    id: 'gq1',
    type: 'priority',
    scenario:
      'A clinical trial of gene editing for a severe inherited condition shows strong early results. A debate erupts about expanding it.',
    prompt: 'What matters most to you about the technology?',
    relatedDimensionKinds: ['scientific', 'ethical', 'legal'],
    options: [
      {
        id: 'gq1-o1',
        label: 'Whether it is safe and effective',
        dimensionKind: 'scientific',
        nextQuestionId: 'gq2',
        pathLabel: 'safety first',
      },
      {
        id: 'gq1-o2',
        label: 'Who gets to decide what is acceptable',
        dimensionKind: 'ethical',
        nextQuestionId: 'gq3',
        pathLabel: 'deciders first',
      },
      {
        id: 'gq1-o3',
        label: 'What the law currently allows',
        dimensionKind: 'legal',
        nextQuestionId: 'gq4',
        pathLabel: 'law first',
      },
    ],
  },
  gq2: {
    id: 'gq2',
    type: 'evidence',
    scenario:
      "The trial's results are impressive but preliminary, and a rival lab questions the follow-up period.",
    prompt: 'How would you evaluate the trial?',
    relatedDimensionKinds: ['scientific', 'institutional'],
    options: [
      {
        id: 'gq2-o1',
        label: 'Examine the trial design and sample size',
        dimensionKind: 'scientific',
        nextQuestionId: 'gq5',
        pathLabel: 'trial design',
      },
      {
        id: 'gq2-o2',
        label: 'Check how the results were peer-reviewed',
        dimensionKind: 'institutional',
        nextQuestionId: 'gq5',
        pathLabel: 'peer review',
      },
      {
        id: 'gq2-o3',
        label: 'Compare with similar trials worldwide',
        dimensionKind: 'scientific',
        nextQuestionId: 'gq6',
        pathLabel: 'global comparison',
      },
    ],
  },
  gq3: {
    id: 'gq3',
    type: 'stakeholder',
    scenario: 'A national bioethics committee is formed to advise on expanding the therapy.',
    prompt: 'Whose voice should carry the most weight?',
    relatedDimensionKinds: ['ethical', 'social', 'individual'],
    options: [
      {
        id: 'gq3-o1',
        label: 'Families living with the condition',
        dimensionKind: 'individual',
        nextQuestionId: 'gq6',
        pathLabel: 'families first',
      },
      {
        id: 'gq3-o2',
        label: 'Bioethicists and clinicians',
        dimensionKind: 'ethical',
        nextQuestionId: 'gq6',
        pathLabel: 'ethicists first',
      },
      {
        id: 'gq3-o3',
        label: 'Disability communities affected by the framing',
        dimensionKind: 'social',
        nextQuestionId: 'gq7',
        pathLabel: 'disability voices',
      },
    ],
  },
  gq4: {
    id: 'gq4',
    type: 'consequence',
    scenario: 'The current regulatory framework was written before this technology existed.',
    prompt: 'What would you most want to know about the law?',
    relatedDimensionKinds: ['legal', 'scientific'],
    options: [
      {
        id: 'gq4-o1',
        label: 'What it actually permits today',
        dimensionKind: 'legal',
        nextQuestionId: 'gq7',
        pathLabel: 'current permissions',
      },
      {
        id: 'gq4-o2',
        label: 'Who enforces it and how',
        dimensionKind: 'legal',
        nextQuestionId: 'gq7',
        pathLabel: 'enforcement',
      },
      {
        id: 'gq4-o3',
        label: 'How far the science has outpaced it',
        dimensionKind: 'scientific',
        nextQuestionId: 'gq8',
        pathLabel: 'science vs law',
      },
    ],
  },
  gq5: {
    id: 'gq5',
    type: 'uncertainty',
    scenario:
      "Two leading scientists disagree about whether the therapy's benefits justify its risks.",
    prompt: 'How do you decide what to take away?',
    relatedDimensionKinds: ['scientific', 'ethical'],
    options: [
      {
        id: 'gq5-o1',
        label: 'Read the underlying trial data yourself',
        dimensionKind: 'scientific',
        nextQuestionId: 'gq9',
        pathLabel: 'trial data',
      },
      {
        id: 'gq5-o2',
        label: 'Focus on the risk thresholds both accept',
        dimensionKind: 'ethical',
        nextQuestionId: 'gq9',
        pathLabel: 'risk thresholds',
      },
      {
        id: 'gq5-o3',
        label: 'Note what neither is saying',
        dimensionKind: 'ethical',
        nextQuestionId: 'gq10',
        pathLabel: 'silences',
      },
    ],
  },
  gq6: {
    id: 'gq6',
    type: 'interpretation',
    scenario:
      'Two outlets report the trial — one calls it a cure, the other warns of unknown long-term effects.',
    prompt: 'What would you do next?',
    relatedDimensionKinds: ['cultural', 'scientific', 'historical'],
    options: [
      {
        id: 'gq6-o1',
        label: 'Compare how each framed the same results',
        dimensionKind: 'cultural',
        nextQuestionId: 'gq9',
        pathLabel: 'framing comparison',
      },
      {
        id: 'gq6-o2',
        label: 'Read the journal publication itself',
        dimensionKind: 'scientific',
        nextQuestionId: 'gq9',
        pathLabel: 'journal article',
      },
      {
        id: 'gq6-o3',
        label: 'Check the history of similar medical claims',
        dimensionKind: 'historical',
        nextQuestionId: 'gq10',
        pathLabel: 'history of claims',
      },
    ],
  },
  gq7: {
    id: 'gq7',
    type: 'assumption',
    scenario: "A commentator says: 'If it treats disease, there\'s nothing to debate.'",
    prompt: 'Which assumption would you question first?',
    relatedDimensionKinds: ['ethical', 'social', 'cultural'],
    options: [
      {
        id: 'gq7-o1',
        label: 'That treatment and enhancement are clearly separable',
        dimensionKind: 'ethical',
        nextQuestionId: 'gq10',
        pathLabel: 'treatment vs enhancement',
      },
      {
        id: 'gq7-o2',
        label: 'That individual benefit settles the question',
        dimensionKind: 'social',
        nextQuestionId: 'gq10',
        pathLabel: 'individual benefit',
      },
      {
        id: 'gq7-o3',
        label: 'That all communities would see it the same way',
        dimensionKind: 'cultural',
        nextQuestionId: 'gq10',
        pathLabel: 'cultural sameness',
      },
    ],
  },
  gq8: {
    id: 'gq8',
    type: 'cause',
    scenario: 'You are asked why the gene-editing debate is so divisive.',
    prompt: 'Which explanation do you find most compelling?',
    relatedDimensionKinds: ['cultural', 'political', 'social'],
    options: [
      {
        id: 'gq8-o1',
        label: 'Because it touches deep beliefs about human nature',
        dimensionKind: 'cultural',
        nextQuestionId: 'gq10',
        pathLabel: 'beliefs about nature',
      },
      {
        id: 'gq8-o2',
        label: 'Because the stakes are irreversible',
        dimensionKind: 'political',
        nextQuestionId: 'gq10',
        pathLabel: 'irreversibility',
      },
      {
        id: 'gq8-o3',
        label: 'Because benefits and risks fall unevenly',
        dimensionKind: 'social',
        nextQuestionId: 'gq10',
        pathLabel: 'uneven stakes',
      },
    ],
  },
  gq9: {
    id: 'gq9',
    type: 'source-selection',
    scenario: 'You want a grounded view of what gene editing can and cannot do.',
    prompt: 'Which source would teach you the most?',
    relatedDimensionKinds: ['scientific', 'ethical', 'cultural'],
    options: [
      {
        id: 'gq9-o1',
        label: 'Peer-reviewed trial results',
        dimensionKind: 'scientific',
        nextQuestionId: 'gq10',
        pathLabel: 'trial results',
      },
      {
        id: 'gq9-o2',
        label: 'A bioethics analysis of consent',
        dimensionKind: 'ethical',
        nextQuestionId: 'gq10',
        pathLabel: 'consent analysis',
      },
      {
        id: 'gq9-o3',
        label: 'Fieldwork on how communities view it',
        dimensionKind: 'cultural',
        nextQuestionId: 'gq10',
        pathLabel: 'community views',
      },
    ],
  },
  gq10: {
    id: 'gq10',
    type: 'stakeholder',
    scenario: 'The government must decide how to regulate heritable gene editing.',
    prompt: 'What should the rules protect first?',
    relatedDimensionKinds: ['ethical', 'legal', 'scientific'],
    options: [
      {
        id: 'gq10-o1',
        label: 'The rights of people not yet born',
        dimensionKind: 'ethical',
        nextQuestionId: null,
        pathLabel: 'future people',
      },
      {
        id: 'gq10-o2',
        label: 'Scientific progress and patient access',
        dimensionKind: 'scientific',
        nextQuestionId: null,
        pathLabel: 'progress and access',
      },
      {
        id: 'gq10-o3',
        label: 'A process that includes all affected communities',
        dimensionKind: 'legal',
        nextQuestionId: null,
        pathLabel: 'inclusive process',
      },
    ],
  },
};

const geneFollowUps: Record<string, CaseQuestion[]> = {
  scientific: [
    {
      id: 'fg-sci-1',
      type: 'evidence',
      scenario: 'The safety evidence keeps being cited in conflicting ways.',
      prompt: 'Which evidence would you ask for first?',
      relatedDimensionKinds: ['scientific'],
      options: [
        {
          id: 'fg-sci-1-o1',
          label: 'Long-term follow-up data from trials',
          dimensionKind: 'scientific',
          nextQuestionId: null,
          pathLabel: 'long-term data',
        },
        {
          id: 'fg-sci-1-o2',
          label: 'Off-target effect measurements',
          dimensionKind: 'scientific',
          nextQuestionId: null,
          pathLabel: 'off-target effects',
        },
        {
          id: 'fg-sci-1-o3',
          label: 'Independent replication studies',
          dimensionKind: 'scientific',
          nextQuestionId: null,
          pathLabel: 'replications',
        },
      ],
    },
  ],
  legal: [
    {
      id: 'fg-legal-1',
      type: 'source-selection',
      scenario: 'The regulatory framework is under review.',
      prompt: 'Which legal source would you read first?',
      relatedDimensionKinds: ['legal'],
      options: [
        {
          id: 'fg-legal-1-o1',
          label: 'The current regulatory framework',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'framework text',
        },
        {
          id: 'fg-legal-1-o2',
          label: 'Recent rulings on gene patents',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'patent rulings',
        },
        {
          id: 'fg-legal-1-o3',
          label: 'International regulatory comparisons',
          dimensionKind: 'legal',
          nextQuestionId: null,
          pathLabel: 'international rules',
        },
      ],
    },
  ],
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-energy-transition',
    slug: 'the-renewable-energy-transition',
    topicId: 'topic-energy-transition',
    title: 'The Grid on the Edge',
    intro:
      "Your region's last coal plant is closing a decade early, and the debate is loud. We'll explore how you weigh reliability, cost, and community through the decisions ahead — mapping your approach, not judging it.",
    entryQuestionId: 'eq1',
    questions: energyQuestions,
    followUpBranches: energyFollowUps,
  },
  {
    id: 'case-digital-literacy',
    slug: 'digital-literacy-in-the-classroom',
    topicId: 'topic-digital-literacy',
    title: 'The Curriculum Meeting',
    intro:
      "Your district is adopting a media literacy curriculum, and everyone has an opinion. We'll explore how you decide what students should learn — mapping how you approach education and information, not grading you.",
    entryQuestionId: 'lq1',
    questions: literacyQuestions,
    followUpBranches: literacyFollowUps,
  },
  {
    id: 'case-water-scarcity',
    slug: 'water-scarcity-in-the-21st-century',
    topicId: 'topic-water-scarcity',
    title: 'The River Agreement',
    intro:
      "A deepening drought forces hard choices about who gets water. We'll explore how you weigh ecology, economy, and people through the allocation debate — mapping your approach, not grading you.",
    entryQuestionId: 'wq1',
    questions: waterQuestions,
    followUpBranches: waterFollowUps,
  },
  {
    id: 'case-future-of-work',
    slug: 'the-future-of-work',
    topicId: 'topic-future-of-work',
    title: 'The Automation Forecast',
    intro:
      "A new forecast predicts how automation will change your region's jobs, and every side is citing it. We'll explore how you evaluate the numbers, the people, and the policy — mapping your approach, not grading you.",
    entryQuestionId: 'wfq1',
    questions: workQuestions,
    followUpBranches: workFollowUps,
  },
  {
    id: 'case-authorship',
    slug: 'ai-generated-books-and-authorship',
    topicId: 'topic-authorship',
    title: 'The Ghostwritten Bestseller',
    intro:
      "An AI-assisted novel is topping the charts and writers are furious. We'll explore how you think about authorship, money, and credit in a changing industry — mapping your approach, not grading you.",
    entryQuestionId: 'aq1',
    questions: authorshipQuestions,
    followUpBranches: authorshipFollowUps,
  },
  {
    id: 'case-gene-editing',
    slug: 'gene-editing-and-human-ethics',
    topicId: 'topic-gene-editing',
    title: "The Clinic's Decision",
    intro:
      "Promising trial results put gene editing on the national agenda. We'll explore how you weigh science, ethics, and law in decisions that will be hard to reverse — mapping your approach, not grading you.",
    entryQuestionId: 'gq1',
    questions: geneQuestions,
    followUpBranches: geneFollowUps,
  },
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
