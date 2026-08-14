import { RecommendationList } from '@/components/recommendations/recommendation-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recommendations',
};

export default function RecommendationsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
      <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
        Recommendations
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">What to read next</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
        Articles, reports, books, videos, and primary sources worth your attention. Every
        recommendation explains why it was surfaced — usually because it covers a perspective you
        haven&apos;t explored, or because it is the primary source behind a claim you encountered.
      </p>

      <RecommendationList />
    </div>
  );
}
