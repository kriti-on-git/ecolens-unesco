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
  /** Answers recorded per topic, so a journey can be reconstructed. */
  responses: Record<string, UserResponse[]>;
  /** The most recently selected topic (used for “continue exploring”). */
  lastTopicId: string | null;
  /** Recommendation cards the user has viewed. */
  viewedRecommendations: string[];
  /** Knowledge-graph nodes the user has opened. */
  openedNodes: string[];
}

interface EcholensContextValue {
  hydrated: boolean;
  openedSources: string[];
  viewedRecommendations: string[];
  openedNodes: string[];
  lastTopicId: string | null;
  getProfile: (topicId: string) => AwarenessProfile | null;
  getProfiles: () => AwarenessProfile[];
  getExplored: (topicId: string) => TopicDimensionKind[];
  completeCaseStudy: (
    topic: Topic,
    caseStudy: CaseStudy,
    responses: UserResponse[],
    pathLength: number,
  ) => AwarenessProfile;
  markDimensionsExplored: (topic: Topic, kinds: TopicDimensionKind[]) => void;
  markSourceOpened: (topicId: string | null, sourceId: string, sourceTitle: string) => void;
  setLastTopic: (topicId: string) => void;
  markRecommendationViewed: (recommendationId: string) => void;
  markNodeOpened: (nodeId: string) => void;
}

const EcholensContext = createContext<EcholensContextValue | null>(null);

const EMPTY_STATE: EcholensState = {
  profiles: {},
  explored: {},
  openedSources: [],
  responses: {},
  lastTopicId: null,
  viewedRecommendations: [],
  openedNodes: [],
};

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
  // Always start from the persisted store: effects can fire before React's
  // post-hydration store check has loaded localStorage, and writing from the
  // empty module default would wipe saved progress (prompt4 bugfix).
  const current = getSnapshot();
  const next = fn(current);
  if (next === current) return; // no change — avoid writes and re-renders
  store = next;
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
    const getExplored = (topicId: string) => state.explored[topicId] ?? [];
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
      update((s) => ({
        ...s,
        profiles: { ...s.profiles, [topic.id]: profile },
        responses: { ...s.responses, [topic.id]: responses },
        lastTopicId: topic.id,
      }));
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

    const setLastTopic: EcholensContextValue['setLastTopic'] = (topicId) => {
      update((s) => (s.lastTopicId === topicId ? s : { ...s, lastTopicId: topicId }));
    };

    const markRecommendationViewed: EcholensContextValue['markRecommendationViewed'] = (id) => {
      update((s) =>
        s.viewedRecommendations.includes(id)
          ? s
          : { ...s, viewedRecommendations: [...s.viewedRecommendations, id] },
      );
    };

    const markNodeOpened: EcholensContextValue['markNodeOpened'] = (nodeId) => {
      update((s) =>
        s.openedNodes.includes(nodeId) ? s : { ...s, openedNodes: [...s.openedNodes, nodeId] },
      );
    };

    return {
      hydrated,
      openedSources: state.openedSources,
      viewedRecommendations: state.viewedRecommendations,
      openedNodes: state.openedNodes,
      lastTopicId: state.lastTopicId,
      getProfile,
      getProfiles,
      getExplored,
      completeCaseStudy,
      markDimensionsExplored,
      markSourceOpened,
      setLastTopic,
      markRecommendationViewed,
      markNodeOpened,
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
