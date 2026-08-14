'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEcholens } from '@/components/echolens-provider';
import { SourceDrawer } from '@/components/source-drawer';
import { getTopicById, recommendations } from '@/data';
import { getDimensionLabel } from '@/data/perspectives';
import { sourceTypeIcon, sourceTypeLabel } from '@/lib/source-meta';
import { cn } from '@/lib/utils';
import type { Source, TopicDimensionKind } from '@/types';

const classificationLabel: Record<string, string> = {
  'verified-fact': 'Verified fact',
  'disputed-claim': 'Disputed claim',
  opinion: 'Opinion',
  interpretation: 'Interpretation',
  'insufficient-evidence': 'Insufficient evidence',
};

export function RecommendationList() {
  const { openedSources } = useEcholens();
  const [dimension, setDimension] = useState<'all' | TopicDimensionKind>('all');
  const [topicFilter, setTopicFilter] = useState<'all' | string>('all');
  const [activeSource, setActiveSource] = useState<Source | null>(null);

  const topics = useMemo(() => {
    const ids = [...new Set(recommendations.map((r) => r.topicId))];
    return ids.map((id) => ({ id, topic: getTopicById(id) })).filter((t) => t.topic);
  }, []);

  const dimensions = useMemo(() => [...new Set(recommendations.map((r) => r.dimensionKind))], []);

  const filtered = useMemo(
    () =>
      recommendations
        .filter((r) => dimension === 'all' || r.dimensionKind === dimension)
        .filter((r) => topicFilter === 'all' || r.topicId === topicFilter),
    [dimension, topicFilter],
  );

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-1.5">
        <FilterChip
          active={topicFilter === 'all'}
          onClick={() => setTopicFilter('all')}
          label="All topics"
        />
        {topics.map((t) => (
          <FilterChip
            key={t.id}
            active={topicFilter === t.id}
            onClick={() => setTopicFilter(t.id)}
            label={t.topic?.title ?? t.id}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <FilterChip
          active={dimension === 'all'}
          onClick={() => setDimension('all')}
          label="All dimensions"
        />
        {dimensions.map((kind) => (
          <FilterChip
            key={kind}
            active={dimension === kind}
            onClick={() => setDimension(kind)}
            label={getDimensionLabel(kind)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border-border mt-10 rounded-xl border border-dashed py-16 text-center">
          <p className="text-muted-foreground text-sm">
            No recommendations match this combination — try widening the filters.
          </p>
        </div>
      ) : (
        <motion.ul
          className="mt-6 space-y-4"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {filtered.map((recommendation) => {
            const topic = getTopicById(recommendation.topicId);
            const opened = openedSources.includes(recommendation.source.id);
            return (
              <motion.li
                key={recommendation.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
                className="border-border/70 bg-card rounded-xl border p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5">
                        {sourceTypeIcon(recommendation.source.type, 'size-3.5')}
                        {sourceTypeLabel(recommendation.source.type)}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{recommendation.source.sourceName}</span>
                      {recommendation.source.publishedAt && (
                        <>
                          <span aria-hidden>·</span>
                          <span>{recommendation.source.publishedAt}</span>
                        </>
                      )}
                      {opened && (
                        <span className="text-primary inline-flex items-center gap-1">
                          <Check className="size-3" aria-hidden />
                          Explored
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-base leading-snug font-semibold tracking-tight">
                      {recommendation.source.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                      {recommendation.source.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        {getDimensionLabel(recommendation.dimensionKind)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-muted-foreground text-[10px] font-medium"
                      >
                        {classificationLabel[recommendation.source.classification]}
                      </Badge>
                      {topic && (
                        <Link
                          href={`/topics/${topic.slug}`}
                          className="text-muted-foreground hover:text-foreground text-[10px] underline-offset-2 hover:underline"
                        >
                          {topic.title}
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveSource(recommendation.source)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Explore
                      <ArrowRight className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>

                <div className="border-primary/25 bg-primary/5 mt-4 rounded-lg border p-3.5">
                  <p className="text-primary flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase">
                    <Info className="size-3.5" aria-hidden />
                    Why recommended
                  </p>
                  <p className="text-foreground/80 mt-1.5 text-[13px] leading-relaxed">
                    {recommendation.whyRecommended}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      <SourceDrawer source={activeSource} onClose={() => setActiveSource(null)} />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs transition-colors',
        active
          ? 'border-primary/50 bg-primary/10 text-primary font-medium'
          : 'border-border/70 text-muted-foreground hover:border-border hover:text-foreground',
      )}
    >
      {label}
    </button>
  );
}
