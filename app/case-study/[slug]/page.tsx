import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyFlow } from '@/components/case-study/case-study-flow';
import { getCaseStudyBySlug, getTopicById } from '@/data';
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

  const topic = getTopicById(caseStudy.topicId);
  if (!topic) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Link
        href={`/topics/${topic.slug}`}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {topic.title}
      </Link>

      <CaseStudyFlow caseStudy={caseStudy} topic={topic} />
    </div>
  );
}
