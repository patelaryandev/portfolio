// lib/live.ts — state and timed requests for the "how this page reached you" panel.
export const CYCLE_MS = 5500;
export const LAND_MS = Math.round(CYCLE_MS * 0.35); // when the dot lands in "Site files"
export const MAX_FAILURES = 3;
export const HISTORY = 5;

export type LiveState = {
  status: 'loading' | 'live' | 'down';
  colo: string | null; visitsToday: number | null;
  ms: number | null; history: number[]; failures: number;
};

export type LiveEvent =
  | { type: 'visit-ok'; colo: string | null; visitsToday: number | null }
  | { type: 'visit-fail' }
  | { type: 'ping-ok'; ms: number }
  | { type: 'ping-fail' };

export const initialLive: LiveState = { status: 'loading', colo: null, visitsToday: null, ms: null, history: [], failures: 0 };

export function liveReducer(s: LiveState, e: LiveEvent): LiveState {
  if (s.status === 'down') return s;
  switch (e.type) {
    case 'visit-ok': return { ...s, status: 'live', colo: e.colo, visitsToday: e.visitsToday };
    case 'visit-fail': return { ...s, status: 'down', ms: null };
    case 'ping-ok': {
      const ms = Math.round(e.ms);
      return { ...s, ms, history: [...s.history, ms].slice(-HISTORY), failures: 0 };
    }
    case 'ping-fail': {
      const failures = s.failures + 1;
      return { ...s, ms: null, failures, status: failures >= MAX_FAILURES ? 'down' : s.status };
    }
  }
}

export async function timeRequest(url: string, f: typeof fetch = fetch, now = () => performance.now(), timeoutMs = 1500): Promise<number | null> {
  try {
    const start = now();
    const res = await f(url, { method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(timeoutMs) });
    const end = now();
    return res.ok ? end - start : null;
  } catch {
    return null;
  }
}

export async function fetchVisit(f: typeof fetch = fetch, timeoutMs = 1500) {
  try {
    const res = await f('/api/visit', { cache: 'no-store', signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    const body = (await res.json()) as { colo?: unknown; visitsToday?: unknown };
    return {
      colo: typeof body.colo === 'string' ? body.colo : null,
      visitsToday: typeof body.visitsToday === 'number' ? body.visitsToday : null,
    };
  } catch {
    return null;
  }
}
