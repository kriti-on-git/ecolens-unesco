'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useEcholens } from '@/components/echolens-provider';
import { getDimensionLabel } from '@/data/perspectives';
import { estimatePathLength } from '@/lib/scoring';
import { cn } from '@/lib/utils';
import type {
  AwarenessProfile,
  CaseOption,
  CaseQuestion,
  CaseQuestionType,
  CaseStudy,
  Topic,
  TopicDimensionKind,
  UserResponse,
} from '@/types';

const TYPE_HINTS: Record<CaseQuestionType, string> = {
  assumption: 'You chose to examine the assumptions underneath the claim.',
  interpretation: 'You weighed how meaning is framed and interpreted.',
  evidence: 'You decided to check what actually supports the claim.',
  priority: 'You named what matters most to you first.',
  cause: 'You looked for what is driving the situation.',
  consequence: 'You considered what may follow from the decision.',
  stakeholder: 'You thought about whose perspective should carry weight.',
  uncertainty: 'You engaged with what remains unknown.',
  'source-selection': 'You considered where information comes from.',
};

interface CaseStudyFlowProps {
  caseStudy: CaseStudy;
  topic: Topic;
}

type Phase = 'intro' | 'question' | 'complete';

export function CaseStudyFlow({ caseStudy, topic }: CaseStudyFlowProps) {
  const { hydrated, getProfile, completeCaseStudy } = useEcholens();

  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [result, setResult] = useState<AwarenessProfile | null>(null);

  const prior = hydrated ? getProfile(topic.id) : null;

  /** Second-pass questions about dimensions the user previously skipped. */
  const followUps = useMemo(() => {
    if (!hydrated) return null;
    const priorProfile = getProfile(topic.id);
    if (!priorProfile || priorProfile.attempt < 1) return null;
    const branches: Partial<Record<TopicDimensionKind, CaseQuestion[]>> =
      caseStudy.followUpBranches ?? {};
    const list = priorProfile.unexploredDimensions
      .map((kind) => branches[kind] ?? [])
      .flat()
      .slice(0, 4);
    return list.length > 0 ? list : null;
  }, [hydrated, topic.id, caseStudy, getProfile]);

  const isFollowUp = followUps !== null;
  const totalSteps = followUps
    ? followUps.length
    : estimatePathLength(caseStudy.questions, caseStudy.entryQuestionId);

  const currentQuestion = useMemo<CaseQuestion | null>(() => {
    if (index === 0) {
      if (followUps) return followUps[0];
      return caseStudy.questions[caseStudy.entryQuestionId] ?? null;
    }
    if (followUps) return followUps[index] ?? null;
    const prev = responses[index - 1];
    if (!prev) return null;
    const prevQuestion = caseStudy.questions[prev.questionId];
    const chosen = prevQuestion?.options.find((o) => o.id === prev.optionId);
    if (!chosen?.nextQuestionId) return null;
    return caseStudy.questions[chosen.nextQuestionId] ?? null;
  }, [index, responses, followUps, caseStudy]);

  const selectOption = (option: CaseOption) => {
    if (!currentQuestion || selectedOptionId) return;
    const dims = [
      ...new Set([
        ...(currentQuestion.relatedDimensionKinds ?? []),
        ...(option.dimensionKind ? [option.dimensionKind] : []),
      ]),
    ];
    setResponses((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        optionId: option.id,
        answeredAt: Date.now(),
        dimensionKinds: dims,
        pathLabel: option.pathLabel,
      },
    ]);
    setSelectedOptionId(option.id);
  };

  const continuePath = () => {
    if (!currentQuestion || !selectedOptionId) return;
    const option = currentQuestion.options.find((o) => o.id === selectedOptionId);
    if (!option) return;
    if (option.nextQuestionId && caseStudy.questions[option.nextQuestionId]) {
      setIndex((i) => i + 1);
      setSelectedOptionId(null);
    } else {
      const profile = completeCaseStudy(topic, caseStudy, responses, totalSteps);
      setResult(profile);
      setPhase('complete');
    }
  };

  const answeredCount = responses.length;
  const progress = totalSteps ? (answeredCount / totalSteps) * 100 : 0;
  const selectedOption = currentQuestion?.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="mx-auto w-full max-w-2xl">
      {!hydrated ? (
        <div className="space-y-4 pt-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="secondary" className="text-[11px] font-medium">
                  Adaptive case study
                </Badge>
                {prior && (
                  <Badge variant="outline" className="text-primary text-[11px] font-medium">
                    Pass {prior.attempt + 1}
                  </Badge>
                )}
                {isFollowUp && (
                  <Badge variant="outline" className="text-[11px] font-medium">
                    Focused on skipped dimensions
                  </Badge>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight">{caseStudy.title}</h1>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                {isFollowUp
                  ? 'Last time, some dimensions stayed unexplored. These questions revisit the issue from the ground you skipped — your profile will update as you answer.'
                  : caseStudy.intro}
              </p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                There are no right or wrong answers. Each choice simply reveals how you currently
                approach the issue, so Echolens can show you what you may be missing.
              </p>
              <Button size="lg" className="mt-8" onClick={() => setPhase('question')}>
                Begin
                <ArrowRight className="ml-1.5 size-4" aria-hidden />
              </Button>
            </motion.div>
          )}

          {phase === 'question' && currentQuestion && (
            <motion.div
              key={`q-${currentQuestion.id}-${index}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
              className="pt-4"
            >
              <div className="text-muted-foreground flex items-center justify-between gap-4 text-xs">
                <span className="font-medium">
                  Step {answeredCount + 1} of {totalSteps}
                </span>
                <span className="hidden sm:inline">
                  {isFollowUp ? 'Follow-up pass' : 'Exploring the issue'}
                </span>
              </div>
              <div className="bg-muted mt-2 h-1 w-full overflow-hidden rounded-full">
                <motion.div
                  className="bg-primary h-full rounded-full"
                  initial={false}
                  animate={{ width: `${Math.max(progress, 6)}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              {responses.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-muted-foreground text-[11px] tracking-[0.12em] uppercase">
                    Path
                  </span>
                  {responses.map((r, i) => (
                    <motion.span
                      key={`${r.questionId}-${i}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border-border/70 bg-background text-muted-foreground rounded-full border px-2 py-0.5 text-[11px]"
                    >
                      {r.pathLabel}
                    </motion.span>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  {currentQuestion.scenario}
                </p>
                <h2 className="mt-3 text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
                  {currentQuestion.prompt}
                </h2>
              </div>

              <motion.ul
                className="mt-6 space-y-2.5"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              >
                {currentQuestion.options.map((option) => {
                  const selected = selectedOptionId === option.id;
                  return (
                    <motion.li
                      key={option.id}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => selectOption(option)}
                        disabled={Boolean(selectedOptionId)}
                        className={cn(
                          'flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-all',
                          selected
                            ? 'border-primary/60 bg-primary/5'
                            : 'border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40',
                          selectedOptionId && !selected && 'opacity-50',
                        )}
                      >
                        <span className="text-sm leading-snug font-medium">{option.label}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          {option.dimensionKind && (
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] font-medium',
                                selected
                                  ? 'border-primary/40 text-primary'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {getDimensionLabel(option.dimensionKind)}
                            </Badge>
                          )}
                          <span
                            className={cn(
                              'flex size-5 items-center justify-center rounded-full border transition-colors',
                              selected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border group-hover:border-primary/50 text-transparent',
                            )}
                          >
                            <Check className="size-3" aria-hidden />
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <AnimatePresence>
                {selectedOption && (
                  <motion.div
                    key="explanation"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-border/70 bg-muted/40 mt-6 rounded-xl border p-4"
                  >
                    <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.14em] uppercase">
                      What this reveals
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed">
                      {selectedOption.dimensionKind && (
                        <>
                          This leans toward the{' '}
                          <span className="text-foreground font-medium">
                            {getDimensionLabel(selectedOption.dimensionKind)}
                          </span>
                          .{' '}
                        </>
                      )}
                      {TYPE_HINTS[currentQuestion.type]}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p className="text-muted-foreground text-xs">
                        Nothing is judged here — the path simply shapes what Echolens shows you
                        next.
                      </p>
                      <Button onClick={continuePath} className="shrink-0">
                        Continue
                        <ArrowRight className="ml-1.5 size-4" aria-hidden />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'complete' && result && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="pt-4"
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[11px] font-medium">
                  {isFollowUp
                    ? `Profile updated — pass ${result.attempt}`
                    : `Awareness profile — pass ${result.attempt}`}
                </Badge>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                Here&apos;s where your exploration stands
              </h1>
              <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                {result.narrative}
              </p>

              <ProfileReveal profile={result} />

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/perspectives/${topic.slug}`}
                  className={buttonVariants({ size: 'lg' })}
                >
                  <Eye className="mr-1.5 size-4" aria-hidden />
                  See what you may be missing
                </Link>
                <Link
                  href="/profile"
                  className={buttonVariants({ size: 'lg', variant: 'outline' })}
                >
                  Open awareness profile
                </Link>
              </div>
              <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <Link href="/recommendations" className="hover:text-foreground transition-colors">
                  Explore recommendations
                </Link>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  Return to topic
                </Link>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Another topic
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function ProfileReveal({ profile }: { profile: AwarenessProfile }) {
  const overall = useMemo(
    () => Math.round(profile.metrics.reduce((sum, m) => sum + m.value, 0) / profile.metrics.length),
    [profile],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="mt-8 grid gap-6 sm:grid-cols-[auto_1fr]"
    >
      <div className="border-border/70 bg-card flex flex-col items-center justify-center rounded-xl border p-6 text-center">
        <p className="text-4xl font-semibold tracking-tight">{overall}</p>
        <p className="text-muted-foreground mt-1 max-w-[9rem] text-xs leading-snug">
          overall awareness across {profile.metrics.length} measures
        </p>
      </div>

      <div className="border-border/70 bg-card rounded-xl border p-5">
        <ul className="space-y-3">
          {profile.metrics.map((metric, i) => (
            <motion.li
              key={metric.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
            >
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium">{metric.label}</span>
                <span className="text-muted-foreground">{metric.value}</span>
              </div>
              <div className="bg-muted mt-1 h-1 w-full overflow-hidden rounded-full">
                <motion.div
                  className="bg-primary h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
                />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
