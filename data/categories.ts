import type { TopicCategory } from '@/types';

/**
 * Curated topic categories for the discovery surface.
 * Hardcoded prototype data — replaceable by a real taxonomy service later.
 */
export const topicCategories: TopicCategory[] = [
  {
    id: 'politics',
    label: 'Politics & Public Policy',
    description: 'Government action, elections, and public decision-making.',
  },
  {
    id: 'technology',
    label: 'Technology',
    description: 'Digital systems, AI, platforms, and their societal effects.',
  },
  {
    id: 'science',
    label: 'Science',
    description: 'Research, evidence, and the scientific process.',
  },
  {
    id: 'literature',
    label: 'Literature & Culture',
    description: 'Books, media, and how culture shapes meaning.',
  },
  {
    id: 'society',
    label: 'Society',
    description: 'Communities, inequality, and everyday life.',
  },
  {
    id: 'economics',
    label: 'Economics',
    description: 'Markets, work, and the distribution of resources.',
  },
  {
    id: 'environment',
    label: 'Environment',
    description: 'Climate, ecosystems, and sustainability.',
  },
  {
    id: 'history',
    label: 'History',
    description: 'The past as context for the present.',
  },
  {
    id: 'law',
    label: 'Law',
    description: 'Rights, regulation, and the rule of law.',
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Learning, schools, and digital literacy.',
  },
  {
    id: 'global-affairs',
    label: 'Global Affairs',
    description: 'International relations and cross-border issues.',
  },
];

export function getCategory(id: string): TopicCategory | undefined {
  return topicCategories.find((category) => category.id === id);
}

export function getCategoryLabel(id: string): string {
  return getCategory(id)?.label ?? id;
}
