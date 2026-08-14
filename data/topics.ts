import type { Topic, TopicDimension } from '@/types';

/**
 * Curated demo topics for the discovery surface.
 *
 * These are hardcoded prototype signals (time group, trend, discussion
 * counts) that make the information landscape feel alive. The structure
 * maps onto trending-news APIs later without changing the UI.
 */

const techDimensions: TopicDimension[] = [
  {
    id: 'ai-regulation-economic',
    kind: 'economic',
    label: 'Economic dimension',
    tag: 'Economy',
    description: 'Innovation, competitiveness, investment, and job effects of AI rules.',
  },
  {
    id: 'ai-regulation-legal',
    kind: 'legal',
    label: 'Legal perspective',
    tag: 'Law',
    description: 'What the proposed laws actually require, and who enforces them.',
  },
  {
    id: 'ai-regulation-individual',
    kind: 'individual',
    label: 'Individual perspective',
    tag: 'Individuals',
    description: 'Rights and experiences of people affected by AI decisions.',
  },
  {
    id: 'ai-regulation-institutional',
    kind: 'institutional',
    label: 'Institutional perspective',
    tag: 'Institutions',
    description: 'How companies, agencies, and regulators would implement the rules.',
  },
  {
    id: 'ai-regulation-international',
    kind: 'international',
    label: 'International dimension',
    tag: 'Global',
    description: 'How different countries and blocs are approaching AI governance.',
  },
  {
    id: 'ai-regulation-ethical',
    kind: 'ethical',
    label: 'Ethical dimension',
    tag: 'Ethics',
    description: 'Trade-offs between innovation, safety, fairness, and accountability.',
  },
  {
    id: 'ai-regulation-scientific',
    kind: 'scientific',
    label: 'Scientific dimension',
    tag: 'Science',
    description: 'What current AI research can and cannot predict about system behavior.',
  },
];

const energyDimensions: TopicDimension[] = [
  {
    id: 'energy-environmental',
    kind: 'environmental',
    label: 'Environmental dimension',
    tag: 'Environment',
    description: 'Emissions, land use, and ecological effects of energy choices.',
  },
  {
    id: 'energy-economic',
    kind: 'economic',
    label: 'Economic dimension',
    tag: 'Economy',
    description: 'Costs, subsidies, and the economics of renewable infrastructure.',
  },
  {
    id: 'energy-political',
    kind: 'political',
    label: 'Political dimension',
    tag: 'Politics',
    description: 'Policy fights, energy security, and the politics of transition.',
  },
  {
    id: 'energy-social',
    kind: 'social',
    label: 'Social dimension',
    tag: 'Society',
    description: 'Communities affected by new energy projects and job shifts.',
  },
  {
    id: 'energy-technological',
    kind: 'scientific',
    label: 'Scientific dimension',
    tag: 'Science',
    description: 'Grid technology, storage, and the engineering of the transition.',
  },
];

const literacyDimensions: TopicDimension[] = [
  {
    id: 'literacy-educational',
    kind: 'education',
    label: 'Educational dimension',
    tag: 'Schools',
    description: 'How digital literacy is taught, assessed, and resourced in schools.',
  },
  {
    id: 'literacy-social',
    kind: 'social',
    label: 'Social dimension',
    tag: 'Society',
    description: 'Who gets access to digital skills and why that matters.',
  },
  {
    id: 'literacy-cultural',
    kind: 'cultural',
    label: 'Cultural dimension',
    tag: 'Culture',
    description: 'How media habits and platform culture shape what students encounter.',
  },
  {
    id: 'literacy-political',
    kind: 'political',
    label: 'Political dimension',
    tag: 'Politics',
    description: 'Curriculum debates and who decides what counts as literacy.',
  },
  {
    id: 'literacy-international',
    kind: 'international',
    label: 'International dimension',
    tag: 'Global',
    description: 'How other education systems approach media literacy.',
  },
];

const waterDimensions: TopicDimension[] = [
  {
    id: 'water-environmental',
    kind: 'environmental',
    label: 'Environmental dimension',
    tag: 'Environment',
    description: 'Climate effects on water availability and ecosystem health.',
  },
  {
    id: 'water-economic',
    kind: 'economic',
    label: 'Economic dimension',
    tag: 'Economy',
    description: 'Water pricing, agriculture, industry, and economic risk.',
  },
  {
    id: 'water-social',
    kind: 'social',
    label: 'Social dimension',
    tag: 'Society',
    description: 'Who bears the cost of scarcity, including households and farmers.',
  },
  {
    id: 'water-legal',
    kind: 'legal',
    label: 'Legal perspective',
    tag: 'Law',
    description: 'Water rights, treaties, and the rules that allocate rivers.',
  },
  {
    id: 'water-international',
    kind: 'international',
    label: 'International dimension',
    tag: 'Global',
    description: 'Cross-border rivers and cooperation between nations.',
  },
];

const workDimensions: TopicDimension[] = [
  {
    id: 'work-economic',
    kind: 'economic',
    label: 'Economic dimension',
    tag: 'Economy',
    description: 'Productivity, wages, and which jobs automation touches.',
  },
  {
    id: 'work-social',
    kind: 'social',
    label: 'Social dimension',
    tag: 'Society',
    description: 'How work shapes identity, community, and everyday life.',
  },
  {
    id: 'work-historical',
    kind: 'historical',
    label: 'Historical context',
    tag: 'History',
    description: 'What past technological transitions can teach us.',
  },
  {
    id: 'work-institutional',
    kind: 'institutional',
    label: 'Institutional perspective',
    tag: 'Institutions',
    description: 'The role of companies, unions, and training systems.',
  },
];

const misinformationDimensions: TopicDimension[] = [
  {
    id: 'misinfo-political',
    kind: 'political',
    label: 'Political dimension',
    tag: 'Politics',
    description: 'How false claims travel through campaigns and platforms.',
  },
  {
    id: 'misinfo-scientific',
    kind: 'scientific',
    label: 'Scientific dimension',
    tag: 'Science',
    description: 'Research on how misinformation spreads and what countermeasures work.',
  },
  {
    id: 'misinfo-individual',
    kind: 'individual',
    label: 'Individual perspective',
    tag: 'Individuals',
    description: 'Why people share, believe, and resist correcting information.',
  },
  {
    id: 'misinfo-institutional',
    kind: 'institutional',
    label: 'Institutional perspective',
    tag: 'Institutions',
    description: 'Platform policies, fact-checkers, and election officials.',
  },
  {
    id: 'misinfo-legal',
    kind: 'legal',
    label: 'Legal perspective',
    tag: 'Law',
    description: 'Laws around platforms, speech, and election integrity.',
  },
];

const housingDimensions: TopicDimension[] = [
  {
    id: 'housing-economic',
    kind: 'economic',
    label: 'Economic dimension',
    tag: 'Economy',
    description: 'Markets, interest rates, and the economics of building.',
  },
  {
    id: 'housing-social',
    kind: 'social',
    label: 'Social dimension',
    tag: 'Society',
    description: 'Who can afford to live where, and the cost of displacement.',
  },
  {
    id: 'housing-legal',
    kind: 'legal',
    label: 'Legal perspective',
    tag: 'Law',
    description: 'Zoning, tenant protections, and land-use law.',
  },
  {
    id: 'housing-political',
    kind: 'political',
    label: 'Political dimension',
    tag: 'Politics',
    description: 'Local politics of development, taxes, and housing policy.',
  },
];

const authorshipDimensions: TopicDimension[] = [
  {
    id: 'authorship-cultural',
    kind: 'cultural',
    label: 'Cultural dimension',
    tag: 'Culture',
    description: 'How authorship, creativity, and originality are being redefined.',
  },
  {
    id: 'authorship-legal',
    kind: 'legal',
    label: 'Legal perspective',
    tag: 'Law',
    description: 'Copyright law and who owns AI-assisted works.',
  },
  {
    id: 'authorship-economic',
    kind: 'economic',
    label: 'Economic dimension',
    tag: 'Economy',
    description: 'Publishing economics, advances, and who gets paid.',
  },
  {
    id: 'authorship-ethical',
    kind: 'ethical',
    label: 'Ethical dimension',
    tag: 'Ethics',
    description: 'Credit, consent, and the ethics of imitation.',
  },
  {
    id: 'authorship-individual',
    kind: 'individual',
    label: 'Individual perspective',
    tag: 'Writers',
    description: 'What the shift means for working writers and readers.',
  },
];

const geneDimensions: TopicDimension[] = [
  {
    id: 'gene-scientific',
    kind: 'scientific',
    label: 'Scientific dimension',
    tag: 'Science',
    description: 'What the technology can do, its limits, and current evidence.',
  },
  {
    id: 'gene-ethical',
    kind: 'ethical',
    label: 'Ethical dimension',
    tag: 'Ethics',
    description: 'Consent, fairness, and the ethics of editing human inheritance.',
  },
  {
    id: 'gene-legal',
    kind: 'legal',
    label: 'Legal perspective',
    tag: 'Law',
    description: 'Regulation, patents, and the rules governing the technology.',
  },
  {
    id: 'gene-cultural',
    kind: 'cultural',
    label: 'Cultural dimension',
    tag: 'Culture',
    description: 'How different cultures and belief systems view genetic change.',
  },
];

export const topics: Topic[] = [
  {
    id: 'topic-ai-regulation',
    slug: 'the-global-push-to-regulate-ai',
    title: 'The Global Push to Regulate AI',
    subtitle: 'A landmark AI law is moving through parliament — and the world is watching.',
    summary:
      'Governments are racing to write rules for systems that are already changing how work, health, and public life are organized.',
    whyItMatters:
      'The rules written now will shape who benefits from AI, who is protected from its harms, and how much power stays with the companies building it.',
    categoryId: 'technology',
    timeGroup: 'happening-now',
    trendSignal: 0.94,
    discussionCount: 4820,
    dimensions: techDimensions,
    createdAt: '2026-08-10T08:00:00Z',
    updatedAt: '2026-08-14T09:30:00Z',
  },
  {
    id: 'topic-energy-transition',
    slug: 'the-renewable-energy-transition',
    title: 'The Renewable Energy Transition',
    subtitle: 'Grids are being rebuilt — and the timeline keeps moving.',
    summary:
      'A global shift from fossil fuels to renewable generation is accelerating, bringing new opportunities and new conflicts.',
    whyItMatters:
      'How fast and how fairly the transition happens will determine both the climate outcome and who carries the costs.',
    categoryId: 'environment',
    timeGroup: 'this-week',
    trendSignal: 0.82,
    discussionCount: 3140,
    dimensions: energyDimensions,
    createdAt: '2026-08-05T08:00:00Z',
    updatedAt: '2026-08-13T14:00:00Z',
  },
  {
    id: 'topic-misinformation',
    slug: 'misinformation-in-the-coming-elections',
    title: 'Misinformation in the Coming Elections',
    subtitle: 'Platforms, regulators, and voters are bracing for a test.',
    summary:
      'Election season is bringing a wave of claims, deepfakes, and coordinated narratives that voters will have to navigate.',
    whyItMatters:
      'How people evaluate what they see online in the next months may decide more than any single policy debate.',
    categoryId: 'politics',
    timeGroup: 'happening-now',
    trendSignal: 0.91,
    discussionCount: 5230,
    dimensions: misinformationDimensions,
    createdAt: '2026-08-09T08:00:00Z',
    updatedAt: '2026-08-14T10:00:00Z',
  },
  {
    id: 'topic-housing',
    slug: 'urban-housing-affordability',
    title: 'Urban Housing Affordability',
    subtitle: 'Cities are running out of middle ground.',
    summary:
      'In city after city, the cost of housing is outpacing incomes — and the explanations offered rarely agree.',
    whyItMatters:
      'Housing shapes where people can work, study, and build a life; the debate about why it is unaffordable determines what gets done.',
    categoryId: 'society',
    timeGroup: 'today',
    trendSignal: 0.78,
    discussionCount: 2410,
    dimensions: housingDimensions,
    createdAt: '2026-08-12T08:00:00Z',
    updatedAt: '2026-08-14T08:30:00Z',
  },
  {
    id: 'topic-digital-literacy',
    slug: 'digital-literacy-in-the-classroom',
    title: 'Digital Literacy in the Classroom',
    subtitle: "Schools are deciding what 'understanding the internet' means.",
    summary:
      'New curriculum proposals would teach students how to evaluate sources, spot manipulation, and understand algorithms.',
    whyItMatters:
      'What schools decide to teach now shapes how an entire generation navigates the information ecosystem.',
    categoryId: 'education',
    timeGroup: 'emerging',
    trendSignal: 0.66,
    discussionCount: 1180,
    dimensions: literacyDimensions,
    createdAt: '2026-08-06T08:00:00Z',
    updatedAt: '2026-08-12T16:00:00Z',
  },
  {
    id: 'topic-water-scarcity',
    slug: 'water-scarcity-in-the-21st-century',
    title: 'Water Scarcity in the 21st Century',
    subtitle: 'Rivers are shrinking while demand grows.',
    summary:
      'Droughts, aging infrastructure, and rising demand are pushing water to the top of regional and global agendas.',
    whyItMatters:
      'Water connects food, energy, health, and peace — and the choices made about it affect billions of people.',
    categoryId: 'global-affairs',
    timeGroup: 'this-week',
    trendSignal: 0.71,
    discussionCount: 1670,
    dimensions: waterDimensions,
    createdAt: '2026-08-04T08:00:00Z',
    updatedAt: '2026-08-13T11:00:00Z',
  },
  {
    id: 'topic-future-of-work',
    slug: 'the-future-of-work',
    title: 'The Future of Work in an Automated Economy',
    subtitle: 'Every forecast about automation tells a different story.',
    summary:
      'New studies predict everything from mass displacement to a productivity boom — often from the same starting data.',
    whyItMatters:
      'The stories told about automation shape investments in education, welfare, and jobs — so reading them critically matters.',
    categoryId: 'economics',
    timeGroup: 'emerging',
    trendSignal: 0.69,
    discussionCount: 1390,
    dimensions: workDimensions,
    createdAt: '2026-08-07T08:00:00Z',
    updatedAt: '2026-08-12T13:00:00Z',
  },
  {
    id: 'topic-authorship',
    slug: 'ai-generated-books-and-authorship',
    title: 'AI-Generated Books and the Meaning of Authorship',
    subtitle: 'Who owns a story when the machine writes it?',
    summary:
      'Publishers are releasing AI-assisted books, and writers, readers, and lawyers are arguing about what that does to the idea of authorship.',
    whyItMatters:
      'How copyright and culture settle this question will decide who gets credit, who gets paid, and what counts as a writer in the years ahead.',
    categoryId: 'literature',
    timeGroup: 'emerging',
    trendSignal: 0.58,
    discussionCount: 940,
    dimensions: authorshipDimensions,
    createdAt: '2026-08-08T08:00:00Z',
    updatedAt: '2026-08-12T11:00:00Z',
  },
  {
    id: 'topic-gene-editing',
    slug: 'gene-editing-and-human-ethics',
    title: 'Gene Editing and Human Ethics',
    subtitle: 'The science is moving faster than the rules.',
    summary:
      'New gene-editing techniques are opening possibilities that ethics frameworks and laws were not designed for.',
    whyItMatters:
      'Decisions about what is permissible will be made in the next few years — and they will be hard to reverse.',
    categoryId: 'science',
    timeGroup: 'this-week',
    trendSignal: 0.74,
    discussionCount: 1240,
    dimensions: geneDimensions,
    createdAt: '2026-08-08T08:00:00Z',
    updatedAt: '2026-08-13T09:00:00Z',
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}

export function getTopicById(id: string): Topic | undefined {
  return topics.find((topic) => topic.id === id);
}
