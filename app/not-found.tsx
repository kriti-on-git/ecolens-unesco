import Link from 'next/link';
import { Compass } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-xl">
        <Compass className="size-6" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        This page isn&apos;t on the map
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Head back to the topic
        discovery surface to continue exploring.
      </p>
      <Link href="/" className={buttonVariants({ className: 'mt-8' })}>
        Back to topics
      </Link>
    </div>
  );
}
