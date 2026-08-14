import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
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
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="text-primary size-4" aria-hidden />
            The information map renders here
          </CardTitle>
          <CardDescription className="leading-relaxed">
            This topic&apos;s knowledge graph — {topic.dimensions.length} dimensions of claims,
            evidence, and sources — will be rendered here as an interactive React Flow map. Each
            node opens a dynamic branch of deeper information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {topic.dimensions.map((dimension) => (
              <li key={dimension.id} className="text-muted-foreground text-sm">
                {dimension.label}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
