// tests/live.test.ts
import { describe, expect, it, vi } from 'vitest';
import { fetchVisit, initialLive, liveReducer, timeRequest, type LiveEvent, type LiveState } from '@/lib/live';

const run = (events: LiveEvent[], from: LiveState = initialLive) => events.reduce(liveReducer, from);

describe('liveReducer', () => {
  it('goes live on a visit', () => {
    expect(run([{ type: 'visit-ok', colo: 'DEL', visitsToday: 12 }])).toMatchObject({ status: 'live', colo: 'DEL', visitsToday: 12 });
  });
  it('rounds timings and keeps the last 5', () => {
    const s = run([10.4, 20, 30, 40, 50, 60.6].map((ms) => ({ type: 'ping-ok', ms }) as LiveEvent));
    expect(s.ms).toBe(61);
    expect(s.history).toEqual([20, 30, 40, 50, 61]);
  });
  it('a failed ping clears the shown timing instead of leaving a stale one', () => {
    expect(run([{ type: 'ping-ok', ms: 31 }, { type: 'ping-fail' }]).ms).toBeNull();
  });
  it('goes down after 3 failures in a row, and a success resets the count', () => {
    const f: LiveEvent = { type: 'ping-fail' };
    expect(run([f, f, { type: 'ping-ok', ms: 30 }, f, f]).status).not.toBe('down');
    expect(run([f, f, f]).status).toBe('down');
  });
  it('a failed visit means down, and down is final', () => {
    expect(run([{ type: 'visit-fail' }, { type: 'ping-ok', ms: 30 }])).toMatchObject({ status: 'down', ms: null });
  });
});

describe('timeRequest', () => {
  it('times a HEAD request with no-store', async () => {
    const f = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const clock = [100, 131];
    expect(await timeRequest('/api/ping', f, () => clock.shift()!)).toBe(31);
    expect(f).toHaveBeenCalledWith('/api/ping', expect.objectContaining({ method: 'HEAD', cache: 'no-store' }));
  });
  it('returns null on a non-2xx or a network error', async () => {
    expect(await timeRequest('/x', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))).toBeNull();
    expect(await timeRequest('/x', vi.fn().mockRejectedValue(new TypeError('offline')))).toBeNull();
  });
  it('returns null on timeout', async () => {
    const hang = (_: string, init: RequestInit) => new Promise<Response>((_, reject) =>
      init.signal!.addEventListener('abort', () => reject(new DOMException('timeout', 'TimeoutError'))));
    expect(await timeRequest('/x', hang as typeof fetch, performance.now.bind(performance), 20)).toBeNull();
  });
});

describe('fetchVisit', () => {
  it('returns colo and count', async () => {
    const f = vi.fn().mockResolvedValue(Response.json({ colo: 'DEL', visitsToday: 3, build: {} }));
    expect(await fetchVisit(f)).toEqual({ colo: 'DEL', visitsToday: 3 });
  });
  it('returns null on bad JSON', async () => {
    expect(await fetchVisit(vi.fn().mockResolvedValue(new Response('<html>')))).toBeNull();
  });
});
