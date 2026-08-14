/**
 * Typed localStorage persistence for user progress.
 *
 * The prototype stores everything the user does — profiles, explored
 * dimensions, opened sources — in localStorage so progress survives page
 * navigation. No server-side user state in the prototype.
 */

const PREFIX = 'echolens.';

export const STORAGE_KEYS = {
  state: `${PREFIX}state.v1`,
} as const;

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode / quota) — degrade silently.
  }
}
