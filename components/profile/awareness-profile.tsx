'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useEcholens } from '@/components/echolens-provider';
import { getDimensionLabel } from '@/data/perspectives';
import { getTopicById } from '@/data/topics';
import type { AwarenessProfile as AwarenessProfileModel } from '@/types';

const RADAR_COLOR = '#1f7a72';

export function AwarenessProfileView() {
  const { hydrated, getProfiles } = useEcholens();
  const profiles = getProfiles();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const activeProfile = useMemo(() => {
    if (!profiles.length) return null;
    const selected = profiles.find((p) => p.topicId === selectedTopicId);
    return selected ?? profiles[0];
  }, [profiles, selectedTopicId]);

  if (!hydrated) {
    return (
      <div className="mt-10 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!activeProfile) {
    return (
      <div className="border-border/70 bg-card mt-10 rounded-xl border p-8">
        <p className="flex items-center gap-2 text-base font-medium">
          <Sparkles className="text-primary size-4" aria-hidden />
          Nothing here yet
        </p>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
          Your awareness profile appears after you complete your first case study. It describes your
          information coverage for a topic — which perspectives you explored, which you
          haven&apos;t, and how your understanding changes as you dig deeper. It is a map of your
          exploration, not a judgment about you.
        </p>
        <Link href="/" className={buttonVariants({ className: 'mt-6' })}>
          Find a topic to explore
        </Link>
      </div>
    );
  }

  const topic = getTopicById(activeProfile.topicId);

  return (
    <div className="mt-10">
      {profiles.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {profiles.map((p) => {
            const t = getTopicById(p.topicId);
            const active = p.topicId === activeProfile.topicId;
            return (
              <button
                key={p.topicId}
                type="button"
                onClick={() => setSelectedTopicId(p.topicId)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? 'border-primary/50 bg-primary/10 text-primary font-medium'
                    : 'border-border/70 text-muted-foreground hover:text-foreground'
                }`}
              >
                {t?.title ?? p.topicId}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            Awareness profile
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {topic?.title ?? 'Your profile'}
          </h1>
          <p className="text-muted-foreground mt-1 text-xs">
            {topic?.slug ? (
              <>
                Updated {formatDate(activeProfile.updatedAt)} · pass {activeProfile.attempt}
                {activeProfile.attempt > 1 && ' · updated across passes'}
              </>
            ) : (
              `Updated ${formatDate(activeProfile.updatedAt)}`
            )}
          </p>
        </div>
        {topic && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/case-study/${topic.slug}`}
              className={buttonVariants({ size: 'sm', variant: 'outline' })}
            >
              Case study again
              <ArrowRight className="ml-1.5 size-3.5" aria-hidden />
            </Link>
            <Link
              href={`/perspectives/${topic.slug}`}
              className={buttonVariants({ size: 'sm', variant: 'outline' })}
            >
              <Eye className="mr-1.5 size-3.5" aria-hidden />
              What you may be missing
            </Link>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]"
      >
        <ScoreCard profile={activeProfile} />
        <RadarCard profile={activeProfile} />
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ExploredCard profile={activeProfile} />
        <DetailsCard profile={activeProfile} />
      </div>

      <p className="text-muted-foreground mt-8 max-w-2xl text-sm leading-relaxed">
        {activeProfile.narrative}
      </p>
    </div>
  );
}

function ScoreCard({ profile }: { profile: AwarenessProfileModel }) {
  const overall = useMemo(
    () => Math.round(profile.metrics.reduce((s, m) => s + m.value, 0) / profile.metrics.length),
    [profile],
  );
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overall / 100) * circumference;

  return (
    <div className="border-border/70 bg-card flex flex-col items-center justify-center rounded-xl border p-6">
      <div className="relative">
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          role="img"
          aria-label={`Overall awareness ${overall} out of 100`}
        >
          <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--muted)" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tracking-tight">{overall}</span>
          <span className="text-muted-foreground text-[10px] tracking-[0.14em] uppercase">
            overall
          </span>
        </div>
      </div>
      <p className="text-muted-foreground mt-4 max-w-[14rem] text-center text-xs leading-relaxed">
        Averaged across {profile.metrics.length} awareness measures for this topic.
      </p>
    </div>
  );
}

function RadarCard({ profile }: { profile: AwarenessProfileModel }) {
  const data = profile.metrics.map((m) => ({ label: shortLabel(m.label), value: m.value }));
  return (
    <div className="border-border/70 bg-card rounded-xl border p-6">
      <p className="text-sm font-medium">Coverage at a glance</p>
      <p className="text-muted-foreground mt-1 text-xs">
        How your exploration distributes across awareness dimensions.
      </p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#ddd8cf" />
            <PolarAngleAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b6559' }} />
            <Radar
              dataKey="value"
              stroke={RADAR_COLOR}
              fill={RADAR_COLOR}
              fillOpacity={0.18}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ExploredCard({ profile }: { profile: AwarenessProfileModel }) {
  return (
    <div className="border-border/70 bg-card rounded-xl border p-6">
      <p className="text-sm font-medium">What you explored</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.exploredDimensions.map((kind) => (
          <Badge key={kind} variant="secondary" className="text-[11px] font-medium">
            {getDimensionLabel(kind)}
          </Badge>
        ))}
      </div>

      <p className="mt-5 text-sm font-medium">What you haven&apos;t explored</p>
      {profile.unexploredDimensions.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.unexploredDimensions.map((kind) => (
            <Badge
              key={kind}
              variant="outline"
              className="text-muted-foreground text-[11px] font-medium"
            >
              {getDimensionLabel(kind)}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mt-2 text-xs">
          You&apos;ve touched every dimension of this topic — remarkable coverage.
        </p>
      )}

      {profile.reasoningPath.length > 0 && (
        <>
          <p className="mt-5 text-sm font-medium">Reasoning path</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {profile.reasoningPath.map((step, i) => (
              <span key={`${step}-${i}`} className="flex items-center gap-1.5 text-xs">
                {i > 0 && <ArrowRight className="text-muted-foreground size-3" aria-hidden />}
                <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1">
                  {step}
                </span>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DetailsCard({ profile }: { profile: AwarenessProfileModel }) {
  return (
    <div className="border-border/70 bg-card rounded-xl border p-6">
      <p className="text-sm font-medium">Why each score exists</p>
      <ul className="mt-4 space-y-4">
        {profile.metrics.map((metric) => (
          <li key={metric.id}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="font-medium">{metric.label}</span>
              <span className="text-muted-foreground">{metric.value}</span>
            </div>
            <div className="bg-muted mt-1 h-1 w-full overflow-hidden rounded-full">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
              {metric.explanation}
            </p>
          </li>
        ))}
      </ul>
      <div className="border-border/60 text-muted-foreground mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-xs">
        {profile.evidencePreference && (
          <span>
            Evidence preference:{' '}
            <span className="text-foreground font-medium">{profile.evidencePreference}</span>
          </span>
        )}
        {profile.sourcePreference && (
          <span>
            Source preference:{' '}
            <span className="text-foreground font-medium">{profile.sourcePreference}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function shortLabel(label: string): string {
  const map: Record<string, string> = {
    'Information awareness': 'Awareness',
    'Perspective coverage': 'Perspectives',
    'Evidence awareness': 'Evidence',
    'Source diversity': 'Sources',
    'Context awareness': 'Context',
    'Topic depth': 'Depth',
  };
  return map[label] ?? label;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
