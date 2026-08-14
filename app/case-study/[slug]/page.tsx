import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCaseStudyBySlug, getTopic } from '@/data';
import type { Metadata } from 'next';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  return {
    title: caseStudy?.title ?? 'Case study',
    description: caseStudy?.intro,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) notFound();

  const topic = getTopic(caseStudy.topicId);
  const questionCount = Object.keys(caseStudy.questions).length;

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link
        href={topic ? `/topics/${topic.slug}` : '/'}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {topic ? topic.title : 'All topics'}
      </Link>

      <div className="mt-6">
        <Badge variant="secondary" className="text-[11px] font-medium">
          Interactive case study
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {caseStudy.title}
        </h1>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed">{caseStudy.intro}</p>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitBranch className="text-primary size-4" aria-hidden />
            The adaptive question flow starts here
          </CardTitle>
          <CardDescription className="leading-relaxed">
            This case study has {questionCount} scenario-based questions arranged in a branching
            tree. Your answers route you onto a path — no answers are right or wrong, and each
            choice reveals how you currently approach the issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            The interactive question flow, awareness-profile scoring, and follow-up branches are the
            next milestone in this build. The data model and demo content for them are already in
            place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/topics/${topic?.slug ?? ''}`}
              className={buttonVariants({ variant: 'outline' })}
            >
              Back to topic
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
