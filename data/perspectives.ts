import type { TopicDimension, TopicDimensionKind } from '@/types';

/**
 * Registry of information dimensions (perspectives) an issue can be
 * approached from. Case studies, awareness profiles, and knowledge graphs
 * all reference these kinds, so definitions live in one place.
 *
 * Hardcoded prototype data — the structure maps onto a real taxonomy or
 * knowledge-graph dimension set later.
 */
export const dimensionRegistry: Record<TopicDimensionKind, TopicDimension> = {
  historical: {
    id: 'dimension-historical',
    kind: 'historical',
    label: 'Historical context',
    tag: 'History',
    description: 'How past events, patterns, and precedents shape the current issue.',
  },
  economic: {
    id: 'dimension-economic',
    kind: 'economic',
    label: 'Economic dimension',
    tag: 'Economy',
    description: 'Costs, incentives, markets, and the distribution of economic effects.',
  },
  legal: {
    id: 'dimension-legal',
    kind: 'legal',
    label: 'Legal perspective',
    tag: 'Law',
    description: 'Rights, regulation, statutes, and judicial interpretation.',
  },
  social: {
    id: 'dimension-social',
    kind: 'social',
    label: 'Social dimension',
    tag: 'Society',
    description: 'Community effects, inequality, and everyday life for affected people.',
  },
  political: {
    id: 'dimension-political',
    kind: 'political',
    label: 'Political dimension',
    tag: 'Politics',
    description: 'Power, parties, coalitions, and the politics of decision-making.',
  },
  scientific: {
    id: 'dimension-scientific',
    kind: 'scientific',
    label: 'Scientific dimension',
    tag: 'Science',
    description: 'Evidence, methods, uncertainty, and what research can and cannot say.',
  },
  environmental: {
    id: 'dimension-environmental',
    kind: 'environmental',
    label: 'Environmental dimension',
    tag: 'Environment',
    description: 'Ecological effects, resources, and long-term planetary consequences.',
  },
  cultural: {
    id: 'dimension-cultural',
    kind: 'cultural',
    label: 'Cultural dimension',
    tag: 'Culture',
    description: 'Norms, values, media, and how meaning is produced and shared.',
  },
  education: {
    id: 'dimension-education',
    kind: 'education',
    label: 'Educational dimension',
    tag: 'Education',
    description: 'How knowledge and skills are taught, assessed, and resourced.',
  },
  individual: {
    id: 'dimension-individual',
    kind: 'individual',
    label: 'Individual perspective',
    tag: 'Individuals',
    description: 'Personal experience, rights, and the lived reality of single people.',
  },
  institutional: {
    id: 'dimension-institutional',
    kind: 'institutional',
    label: 'Institutional perspective',
    tag: 'Institutions',
    description: 'How organizations, agencies, and systems actually operate.',
  },
  international: {
    id: 'dimension-international',
    kind: 'international',
    label: 'International dimension',
    tag: 'Global',
    description: 'Cross-border effects, comparisons, and global governance.',
  },
  ethical: {
    id: 'dimension-ethical',
    kind: 'ethical',
    label: 'Ethical dimension',
    tag: 'Ethics',
    description: 'Values, trade-offs, fairness, and questions of right action.',
  },
};

export function getDimension(kind: TopicDimensionKind): TopicDimension {
  return dimensionRegistry[kind];
}

export function getDimensionLabel(kind: TopicDimensionKind): string {
  return dimensionRegistry[kind].label;
}
