'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Topic, TopicCategory, TopicTimeGroup } from '@/types';

const timeGroupLabels: Record<TopicTimeGroup, string> = {
  'happening-now': 'Happening now',
  today: 'Today',
  'this-week': 'This week',
  emerging: 'Emerging discussions',
};

interface TopicExplorerProps {
  topics: Topic[];
  categories: TopicCategory[];
}

export function TopicExplorer({ topics, categories }: TopicExplorerProps) {
  const [timeGroup, setTimeGroup] = useState<'all' | TopicTimeGroup>('all');
  const [categoryId, setCategoryId] = useState<'all' | string>('all');
  const [query, setQuery] = useState('');
  const categoryLabelById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.label])),
    [categories],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return topics
      .filter((topic) => timeGroup === 'all' || topic.timeGroup === timeGroup)
      .filter((topic) => categoryId === 'all' || topic.categoryId === categoryId)
      .filter(
        (topic) =>
          !q ||
          topic.title.toLowerCase().includes(q) ||
          topic.subtitle.toLowerCase().includes(q) ||
          topic.summary.toLowerCase().includes(q),
      )
      .sort((a, b) => b.trendSignal - a.trendSignal);
  }, [topics, timeGroup, categoryId, query]);

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <TimeGroupButton
            active={timeGroup === 'all'}
            onClick={() => setTimeGroup('all')}
            label="All"
          />
          {(Object.keys(timeGroupLabels) as TopicTimeGroup[]).map((group) => (
            <TimeGroupButton
              key={group}
              active={timeGroup === group}
              onClick={() => setTimeGroup(group)}
              label={timeGroupLabels[group]}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-4 max-w-md">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search topics…"
          aria-label="Search topics"
          className="border-border/70 bg-card focus:border-primary/60 focus:ring-primary/20 placeholder:text-muted-foreground h-10 w-full rounded-lg border pr-9 pl-9 text-sm transition-colors outline-none focus:ring-2"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 transition-colors"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <CategoryChip
          active={categoryId === 'all'}
          onClick={() => setCategoryId('all')}
          label="All categories"
        />
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            active={categoryId === category.id}
            onClick={() => setCategoryId(category.id)}
            label={category.label}
          />
        ))}
      </div>

      <motion.ul
        key={`${timeGroup}-${categoryId}`}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      >
        {filtered.map((topic) => (
          <motion.li
            key={topic.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}
          >
            <Link
              href={`/topics/${topic.slug}`}
              className="group border-border/70 bg-card hover:border-primary/40 flex h-full flex-col gap-3 rounded-xl border p-5 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="text-[11px] font-medium">
                  {timeGroupLabels[topic.timeGroup]}
                </Badge>
                {topic.trendSignal >= 0.9 && (
                  <Badge variant="outline" className="text-primary text-[11px] font-medium">
                    Trending
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="text-base leading-snug font-semibold tracking-tight">
                  {topic.title}
                </h3>
                <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm">
                  {topic.subtitle}
                </p>
              </div>
              <div className="text-muted-foreground mt-auto flex items-center justify-between gap-2 pt-1 text-xs">
                <span className="truncate">{categoryLabelById.get(topic.categoryId)}</span>
                <span className="inline-flex shrink-0 items-center gap-1.5">
                  <MessageSquare className="size-3.5" aria-hidden />
                  {topic.discussionCount.toLocaleString()}
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      {filtered.length === 0 && (
        <div className="border-border mt-8 rounded-xl border border-dashed py-16 text-center">
          <p className="text-muted-foreground text-sm">
            No topics match this combination — try widening the filters.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setTimeGroup('all');
              setCategoryId('all');
              setQuery('');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </section>
  );
}

function TimeGroupButton({
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
      className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function CategoryChip({
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
      className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
        active
          ? 'border-primary/50 bg-primary/10 text-primary'
          : 'border-border/70 text-muted-foreground hover:border-border hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}
