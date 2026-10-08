import { describe, expect, it } from 'vitest';
import { semesterOf, siteVersion, withVersions } from '@/lib/version';

describe('semesterOf', () => {
  it.each([
    ['2023-08', 1, 1], ['2024-01', 1, 2], ['2025-04', 2, 4], ['2025-06', 2, 4],
    ['2025-11-23', 3, 5], ['2026-04-01', 3, 6], ['2026-07-31', 3, 6], ['2026-08-14', 4, 7], ['2026-12', 4, 7],
  ])('%s → year %i sem %i', (date, year, sem) => {
    expect(semesterOf(date)).toEqual({ year, sem });
  });
});

describe('withVersions', () => {
  it('sorts newest first and numbers patches oldest-first within a semester', () => {
    const out = withVersions([
      { id: 'a', date: '2026-08-14' }, { id: 'b', date: '2026-09-29' }, { id: 'c', date: '2025-06' },
    ]);
    expect(out.map((e) => [e.id, e.version])).toEqual([['b', 'v4.7.1'], ['a', 'v4.7.0'], ['c', 'v2.4.0']]);
  });
});

describe('siteVersion', () => {
  it('is 4.7 in October 2026', () => expect(siteVersion(new Date('2026-10-08T04:00:00Z'))).toBe('4.7'));
});
