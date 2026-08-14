import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrackLastTopic } from '@/components/track-last-topic';
import { getCategoryLabel, getTopic, getDimension } from '@/data';
import type { Metadata } from 'next';

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  return {
    title: topic?.title ?? 'Topic',
    description: topic?.summary,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
      <TrackLastTopic topicId={topic.id} />
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All topics
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-[11px] font-medium">
          {getCategoryLabel(topic.categoryId)}
        </Badge>
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{topic.title}</h1>
      <p className="text-muted-foreground mt-3 text-lg leading-relaxed">{topic.subtitle}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">In context</CardTitle>
              <CardDescription className="leading-relaxed">{topic.summary}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Why it matters</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              {topic.whyItMatters}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="text-primary size-4" aria-hidden />
                Information dimensions
              </CardTitle>
              <CardDescription>
                The perspectives this issue can be explored from. You&apos;ll map your coverage of
                them in the case study.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 sm:grid-cols-2">
                {topic.dimensions.map((dimension) => (
                  <li
                    key={dimension.id}
                    className="border-border/60 bg-muted/40 rounded-lg border p-3"
                  >
                    <p className="text-sm font-medium">{getDimension(dimension.kind).label}</p>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {dimension.description}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="lg:mt-0">
            <CardHeader>
              <CardTitle className="text-base">Start exploring</CardTitle>
              <CardDescription className="leading-relaxed">
                Answer a few scenario-based questions. There are no right answers — the goal is to
                see how you approach this issue and what you might be missing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href={`/case-study/${topic.slug}`}
                className={buttonVariants({ className: 'w-full' })}
              >
                Start case study
                <ArrowRight className="ml-1.5 size-4" aria-hidden />
              </Link>
              <Link
                href={`/perspectives/${topic.slug}`}
                className={buttonVariants({ variant: 'outline', className: 'w-full' })}
              >
                <Eye className="mr-1.5 size-4" aria-hidden />
                See the information map
              </Link>
              <Separator />
              <dl className="text-muted-foreground space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt>Trend signal</dt>
                  <dd className="text-foreground font-medium">
                    {Math.round(topic.trendSignal * 100)}%
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Active discussions</dt>
                  <dd className="text-foreground font-medium">
                    {topic.discussionCount.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
