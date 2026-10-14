import { useEffect, useState } from 'react';

/**
 * Accept only a successful public count.
 * Null means "hide the proof" — including failed fetches, so the UI never shows 0 as a stand-in.
 */
export function parseFollowerCount(payload: unknown): number | null {
  if (!payload || typeof payload !== 'object') return null;

  const body = payload as { ok?: unknown; followers?: unknown };
  if (body.ok !== true) return null;
  if (typeof body.followers !== 'number' || !Number.isInteger(body.followers) || body.followers < 0) {
    return null;
  }

  return body.followers;
}

export function formatCalendarFollowers(count: number): string {
  return count.toLocaleString('en-US');
}

export function useCalendarFollowers(enabled: boolean): number | null {
  const [followers, setFollowers] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch('/api/followers', { signal: controller.signal });
        if (!response.ok) return;

        const payload: unknown = await response.json();
        if (cancelled) return;

        const count = parseFollowerCount(payload);
        if (count !== null) setFollowers(count);
      } catch {
        // Leave followers null so the homepage hides the proof block.
      }
    };

    void load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled]);

  return followers;
}
