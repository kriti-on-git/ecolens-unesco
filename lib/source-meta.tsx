import {
  Archive,
  AtSign,
  BookOpen,
  FileText,
  FlaskConical,
  Globe,
  Landmark,
  MessageSquareQuote,
  Newspaper,
  Podcast,
  Scale,
  Video,
  type LucideIcon,
} from 'lucide-react';
import type { SourceType } from '@/types';

const sourceMeta: Record<SourceType, { label: string; icon: LucideIcon }> = {
  article: { label: 'Article', icon: Newspaper },
  report: { label: 'Report', icon: FileText },
  research: { label: 'Research', icon: FlaskConical },
  book: { label: 'Book', icon: BookOpen },
  video: { label: 'Video', icon: Video },
  'government-document': { label: 'Government document', icon: Landmark },
  'court-judgment': { label: 'Court judgment', icon: Scale },
  'primary-source': { label: 'Primary source', icon: Archive },
  'expert-commentary': { label: 'Expert commentary', icon: MessageSquareQuote },
  'local-reporting': { label: 'Local reporting', icon: Newspaper },
  'international-reporting': { label: 'International reporting', icon: Globe },
  'social-post': { label: 'Social post', icon: AtSign },
  podcast: { label: 'Podcast', icon: Podcast },
};

export function sourceTypeLabel(type: SourceType): string {
  return sourceMeta[type].label;
}

export function sourceTypeIcon(type: SourceType, className?: string) {
  const Icon = sourceMeta[type].icon;
  return <Icon className={className} aria-hidden />;
}
