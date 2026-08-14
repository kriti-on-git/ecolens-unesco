'use client';

import { useEffect } from 'react';
import { useEcholens } from '@/components/echolens-provider';

/**
 * Records the currently selected topic so the home page can offer
 * “continue your exploration” (prompt3: persist selected topic).
 */
export function TrackLastTopic({ topicId }: { topicId: string }) {
  const { setLastTopic } = useEcholens();

  useEffect(() => {
    setLastTopic(topicId);
  }, [topicId, setLastTopic]);

  return null;
}
