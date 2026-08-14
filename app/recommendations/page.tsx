import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recommendations',
};

export default function RecommendationsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
        Recommendations
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">What to read next</h1>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="text-primary size-4" aria-hidden />
            Recommendations appear as you explore
          </CardTitle>
          <CardDescription className="leading-relaxed">
            Articles, reports, books, videos, and primary sources will appear here based on your
            awareness profile. Every recommendation explains why it was suggested — usually because
            it covers a perspective you haven&apos;t explored yet, or because it is the primary
            source behind a claim you encountered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={buttonVariants()}>
            Explore a topic first
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
