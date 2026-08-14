'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useEcholens } from '@/components/echolens-provider';
import { getTopicById } from '@/data/topics';

export function ContinueExploring() {
  const { hydrated, lastTopicId, getProfiles } = useEcholens();

  if (!hydrated) return null;

  const profiles = getProfiles();
  const topic = lastTopicId ? getTopicById(lastTopicId) : undefined;
  const latestProfile = profiles[0];
  const showCard = Boolean(topic) || profiles.length > 0;
  if (!showCard) return null;

  const targetTopic = topic ?? (latestProfile ? getTopicById(latestProfile.topicId) : undefined);
  if (!targetTopic) return null;

  const attempts =
    latestProfile && latestProfile.topicId === targetTopic.id ? latestProfile.attempt : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-primary/30 bg-primary/5 mt-10 rounded-xl border p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
            <Sparkles className="size-3.5" aria-hidden />
            Continue your exploration
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">{targetTopic.title}</h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {attempts > 0
              ? `You've completed ${attempts} pass${attempts > 1 ? 'es' : ''} of its case study. Pick up where you left off — new questions await.`
              : 'Pick up where you left off exploring this issue.'}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href={`/case-study/${targetTopic.slug}`} className={buttonVariants({ size: 'sm' })}>
            Case study
            <ArrowRight className="ml-1.5 size-3.5" aria-hidden />
          </Link>
          <Link
            href={`/perspectives/${targetTopic.slug}`}
            className={buttonVariants({ size: 'sm', variant: 'outline' })}
          >
            <Eye className="mr-1.5 size-3.5" aria-hidden />
            Perspective map
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
