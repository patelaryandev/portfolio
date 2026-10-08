import { describe, expect, it, vi } from 'vitest';
import { nextCount } from '../worker/counter';
import { handlePing, handleVisit, utcDay } from '../worker/handlers';

const build = { sha: 'a3f9c1e', time: '2026-10-08T04:11:00.000Z' };
const req = (method = 'GET', colo?: string) =>
  Object.assign(new Request('https://patelaryan.dev/api/visit', { method }), colo ? { cf: { colo } } : {});

describe('nextCount', () => {
  it('starts at 1', () => expect(nextCount(undefined, '2026-10-08')).toEqual({ day: '2026-10-08', count: 1 }));
  it('increments on the same day', () => expect(nextCount({ day: '2026-10-08', count: 41 }, '2026-10-08').count).toBe(42));
  it('restarts on a new UTC day', () => expect(nextCount({ day: '2026-10-07', count: 900 }, '2026-10-08')).toEqual({ day: '2026-10-08', count: 1 }));
});

describe('utcDay', () => {
  it('uses UTC, not IST', () => expect(utcDay(new Date('2026-10-08T23:30:00+05:30'))).toBe('2026-10-08'));
  it('rolls at UTC midnight', () => expect(utcDay(new Date('2026-10-09T05:29:00+05:30'))).toBe('2026-10-08'));
});

describe('handlePing', () => {
  it.each(['HEAD', 'GET'])('%s → 204, empty, uncached', async (method) => {
    const res = handlePing(new Request('https://x/api/ping', { method }));
    expect(res.status).toBe(204);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.text()).toBe('');
  });
  it('POST → 405', () => expect(handlePing(new Request('https://x/api/ping', { method: 'POST' })).status).toBe(405));
});

describe('handleVisit', () => {
  it('passes colo through and counts once', async () => {
    const hit = vi.fn().mockResolvedValue(7);
    const res = await handleVisit(req('GET', 'DEL'), hit, build, new Date('2026-10-08T04:00:00Z'));
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toEqual({ colo: 'DEL', visitsToday: 7, build });
    expect(hit).toHaveBeenCalledExactlyOnceWith('2026-10-08');
  });

  it('a broken counter still returns colo and build', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await handleVisit(req('GET', 'BOM'), () => Promise.reject(new Error('DO down')), build);
    expect(await res.json()).toEqual({ colo: 'BOM', visitsToday: null, build });
  });

  it('missing cf → colo null', async () => {
    const res = await handleVisit(req('GET'), async () => 1, build);
    expect((await res.json()).colo).toBeNull();
  });

  it('POST → 405 and does not count', async () => {
    const hit = vi.fn();
    expect((await handleVisit(req('POST'), hit, build)).status).toBe(405);
    expect(hit).not.toHaveBeenCalled();
  });
});
