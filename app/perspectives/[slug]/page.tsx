import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PerspectiveMap } from '@/components/perspectives/perspective-map';
import { TrackLastTopic } from '@/components/track-last-topic';
import { getTopic } from '@/data';
import type { Metadata } from 'next';

interface PerspectivesPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PerspectivesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  return {
    title: topic ? `${topic.title} — perspectives` : 'Perspectives',
  };
}

export default async function PerspectivesPage({ params }: PerspectivesPageProps) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <TrackLastTopic topicId={topic.id} />
      <Link
        href={`/topics/${topic.slug}`}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {topic.title}
      </Link>

      <div className="mt-6">
        <Badge variant="secondary" className="text-[11px] font-medium">
          Perspective map
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          See what you may be missing
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
          The issue at the center, the perspectives around it. Click an unexplored dimension to open
          its information branch — and your profile updates as you explore.
        </p>
      </div>

      <PerspectiveMap topic={topic} />
    </div>
  );
}
