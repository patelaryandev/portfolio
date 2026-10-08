import { describe, expect, it } from 'vitest';
import { entries } from '@/content/projects';
import { attachRepos, pickRepos } from '@/lib/github';

const api = [
  { name: 'prometheus', stargazers_count: 3, pushed_at: '2026-08-14T04:23:55Z', html_url: 'https://github.com/witharyan/prometheus', language: 'Python' },
  { name: 'Nivaran', stargazers_count: 9, pushed_at: '2026-04-23T17:41:47Z', html_url: 'https://github.com/witharyan/Nivaran', language: 'Dart' },
  { name: 'Alexa88879', stargazers_count: 0, pushed_at: '2026-06-23T08:15:55Z', html_url: 'https://github.com/witharyan/Alexa88879', language: null },
];

describe('pickRepos', () => {
  it('keeps only allowlisted repos and drops language', () => {
    expect(pickRepos(api, ['prometheus'])).toEqual([
      { name: 'prometheus', stars: 3, pushedAt: '2026-08-14T04:23:55Z', url: 'https://github.com/witharyan/prometheus' },
    ]);
  });
  it('treats a non-array response (rate limit error body) as empty', () => {
    expect(pickRepos({ message: 'API rate limit exceeded' }, ['prometheus'])).toEqual([]);
  });
});

describe('attachRepos', () => {
  it('never adds rows and leaves unmatched entries with github: null', () => {
    const out = attachRepos([{ id: 'a', repo: 'prometheus' }, { id: 'b' }], pickRepos(api, ['prometheus']));
    expect(out).toHaveLength(2);
    expect(out[0].github?.stars).toBe(3);
    expect(out[1].github).toBeNull();
  });
});

describe('curated entries', () => {
  it('never reference the old Dart Nivaran repo', () => {
    expect(entries.some((e) => e.repo === 'Nivaran')).toBe(false);
  });
  it('have unique ids and valid dates', () => {
    expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length);
    for (const e of entries) expect(e.date).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
  });
});
