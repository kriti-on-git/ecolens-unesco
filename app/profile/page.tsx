import Link from 'next/link';
import { Gauge } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Awareness profile',
};

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
        Your awareness profile
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        A map of what you&apos;ve explored
      </h1>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="text-primary size-4" aria-hidden />
            Nothing here yet
          </CardTitle>
          <CardDescription className="leading-relaxed">
            Your awareness profile appears after you complete your first case study. It describes
            your information coverage for a topic — which perspectives you explored, which you
            haven&apos;t, and how your understanding changes as you dig deeper. It is a map of your
            exploration, not a judgment about you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={buttonVariants()}>
            Find a topic to explore
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
