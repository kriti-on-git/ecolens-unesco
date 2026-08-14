'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { MotionConfig } from 'framer-motion';
import { markSourceOpenedInProfile, mergeExploredIntoProfile, scoreCaseStudy } from '@/lib/scoring';
import { loadJson, saveJson, STORAGE_KEYS } from '@/lib/storage';
import type { AwarenessProfile, CaseStudy, Topic, TopicDimensionKind, UserResponse } from '@/types';

interface EcholensState {
  profiles: Record<string, AwarenessProfile>;
  explored: Record<string, TopicDimensionKind[]>;
  openedSources: string[];
}

interface EcholensContextValue {
  hydrated: boolean;
  openedSources: string[];
  getProfile: (topicId: string) => AwarenessProfile | null;
  getProfiles: () => AwarenessProfile[];
  completeCaseStudy: (
    topic: Topic,
    caseStudy: CaseStudy,
    responses: UserResponse[],
    pathLength: number,
  ) => AwarenessProfile;
  markDimensionsExplored: (topic: Topic, kinds: TopicDimensionKind[]) => void;
  markSourceOpened: (topicId: string | null, sourceId: string, sourceTitle: string) => void;
}

const EcholensContext = createContext<EcholensContextValue | null>(null);

const EMPTY_STATE: EcholensState = { profiles: {}, explored: {}, openedSources: [] };

/**
 * Module-level store read via useSyncExternalStore. This lets the provider
 * hydrate from localStorage without effects (no hydration mismatch: the
 * server snapshot is used during hydration, then the store value kicks in).
 */
let store: EcholensState = EMPTY_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function getSnapshot(): EcholensState {
  if (!loaded) {
    store = loadJson<EcholensState>(STORAGE_KEYS.state, EMPTY_STATE);
    loaded = true;
  }
  return store;
}

/**
 * Server snapshot must differ from the client snapshot so React re-renders
 * once after hydration (localStorage only exists on the client).
 */
const getServerSnapshot = (): EcholensState | null => null;

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function update(fn: (prev: EcholensState) => EcholensState): void {
  store = fn(store);
  saveJson(STORAGE_KEYS.state, store);
  listeners.forEach((listener) => listener());
}

export function EcholensProvider({ children }: { children: React.ReactNode }) {
  const rawState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Before hydration (server + initial client render) the store is null.
  const state: EcholensState = rawState ?? EMPTY_STATE;
  const hydrated = rawState !== null;

  const value = useMemo<EcholensContextValue>(() => {
    const getProfile = (topicId: string) => state.profiles[topicId] ?? null;
    const getProfiles = () =>
      Object.values(state.profiles).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

    const completeCaseStudy: EcholensContextValue['completeCaseStudy'] = (
      topic,
      caseStudy,
      responses,
      pathLength,
    ) => {
      const prior = state.profiles[topic.id] ?? null;
      const previouslyExplored = state.explored[topic.id] ?? [];
      const profile = scoreCaseStudy({
        topic,
        caseStudy,
        responses,
        pathLength,
        attempt: (prior?.attempt ?? 0) + 1,
        prior,
        previouslyExplored,
      });
      update((s) => ({ ...s, profiles: { ...s.profiles, [topic.id]: profile } }));
      return profile;
    };

    const markDimensionsExplored: EcholensContextValue['markDimensionsExplored'] = (
      topic,
      kinds,
    ) => {
      const topicId = topic.id;
      update((s) => {
        const already = s.explored[topicId] ?? [];
        const merged = [...new Set([...already, ...kinds])];
        const profiles = { ...s.profiles };
        if (profiles[topicId]) {
          profiles[topicId] = mergeExploredIntoProfile(profiles[topicId], topic, merged);
        }
        return { ...s, explored: { ...s.explored, [topicId]: merged }, profiles };
      });
    };

    const markSourceOpened: EcholensContextValue['markSourceOpened'] = (
      topicId,
      sourceId,
      sourceTitle,
    ) => {
      update((s) => {
        if (s.openedSources.includes(sourceId)) return s;
        const profiles = { ...s.profiles };
        if (topicId && profiles[topicId]) {
          profiles[topicId] = markSourceOpenedInProfile(profiles[topicId], sourceTitle);
        }
        return { ...s, openedSources: [...s.openedSources, sourceId], profiles };
      });
    };

    return {
      hydrated,
      openedSources: state.openedSources,
      getProfile,
      getProfiles,
      completeCaseStudy,
      markDimensionsExplored,
      markSourceOpened,
    };
  }, [state, hydrated]);

  return (
    <EcholensContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </EcholensContext.Provider>
  );
}

export function useEcholens(): EcholensContextValue {
  const ctx = useContext(EcholensContext);
  if (!ctx) throw new Error('useEcholens must be used within EcholensProvider');
  return ctx;
}
