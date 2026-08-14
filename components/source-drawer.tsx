'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useEcholens } from '@/components/echolens-provider';
import { getDimensionLabel } from '@/data/perspectives';
import { sourceTypeLabel, sourceTypeIcon } from '@/lib/source-meta';
import type { Source } from '@/types';
import { cn } from '@/lib/utils';

interface SourceDrawerProps {
  source: Source | null;
  topicId?: string | null;
  onClose: () => void;
}

export function SourceDrawer({ source, topicId, onClose }: SourceDrawerProps) {
  const { markSourceOpened } = useEcholens();

  useEffect(() => {
    if (source) {
      markSourceOpened(topicId ?? null, source.id, source.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source?.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {source && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={source.title}
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="bg-foreground/20 absolute inset-0 h-full w-full cursor-default backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className="border-border bg-background absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            <header className="border-border/70 flex items-start justify-between gap-4 border-b px-6 py-5">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                {sourceTypeIcon(source.type, 'size-4')}
                <span>{sourceTypeLabel(source.type)}</span>
                <span aria-hidden>·</span>
                <span>{source.sourceName}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                autoFocus
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1.5 transition-colors"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[11px] font-medium">
                  {classificationLabel(source.classification)}
                </Badge>
                {source.publishedAt && (
                  <span className="text-muted-foreground text-xs">
                    Published {source.publishedAt}
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-xl leading-snug font-semibold tracking-tight">
                {source.title}
              </h2>

              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {source.description}
              </p>

              {source.dimensionKinds.length > 0 && (
                <div className="mt-5">
                  <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.14em] uppercase">
                    Perspectives it speaks to
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {source.dimensionKinds.map((kind) => (
                      <Badge key={kind} variant="secondary" className="text-[11px] font-medium">
                        {getDimensionLabel(kind)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-border/70 bg-muted/30 mt-6 rounded-xl border p-4">
                <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.14em] uppercase">
                  Information nutrition label
                </p>
                <dl className="mt-3 space-y-2.5 text-xs">
                  <NutritionRow label="Source" value={source.nutritionLabel.source} />
                  {source.nutritionLabel.publishedAt && (
                    <NutritionRow label="Published" value={source.nutritionLabel.publishedAt} />
                  )}
                  <AvailabilityRow
                    label="Evidence availability"
                    level={source.nutritionLabel.evidenceAvailability}
                  />
                  <AvailabilityRow
                    label="Primary-source availability"
                    level={source.nutritionLabel.primarySourceAvailability}
                  />
                  <AvailabilityRow
                    label="Context availability"
                    level={source.nutritionLabel.contextAvailability}
                  />
                  <AvailabilityRow
                    label="Source diversity"
                    level={source.nutritionLabel.sourceDiversity}
                  />
                  <NutritionRow
                    label="Emotional framing"
                    value={capitalize(source.nutritionLabel.emotionalFraming)}
                  />
                </dl>
                {source.nutritionLabel.relatedPerspectives.length > 0 && (
                  <div className="border-border/60 mt-4 border-t pt-3">
                    <p className="text-muted-foreground text-[11px]">Related perspectives</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {source.nutritionLabel.relatedPerspectives.map((p) => (
                        <span key={p} className="text-foreground/80 text-[11px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <footer className="border-border/70 border-t px-6 py-4">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Open source
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </footer>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function NutritionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function AvailabilityRow({ label, level }: { label: string; level: 'high' | 'medium' | 'low' }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className="flex items-center gap-1" aria-hidden>
          {(['high', 'medium', 'low'] as const).map((l) => (
            <span
              key={l}
              className={cn('size-1.5 rounded-full', level === l ? 'bg-primary' : 'bg-border')}
            />
          ))}
        </span>
        <span className="w-14 text-right font-medium">{capitalize(level)}</span>
      </dd>
    </div>
  );
}

function classificationLabel(classification: Source['classification']): string {
  const map: Record<Source['classification'], string> = {
    'verified-fact': 'Verified fact',
    'disputed-claim': 'Disputed claim',
    opinion: 'Opinion',
    interpretation: 'Interpretation',
    'insufficient-evidence': 'Insufficient evidence',
  };
  return map[classification];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
