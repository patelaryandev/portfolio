import { describe, expect, it } from 'vitest';
import { makeStamp } from '@/lib/stamp';

const log = 'a3f9c1e\t2026-10-08T09:41:00+05:30\tShip the homepage\n2ed037d\t2026-10-08T07:34:00+05:30\tIgnore project-docs/\n';
const base = { sha: 'a3f9c1e', dirty: false, branch: 'main', now: new Date('2026-10-08T04:11:00Z'), log };

describe('makeStamp', () => {
  it('on a laptop: two steps, wrangler, no run link', () => {
    const s = makeStamp({ ...base, env: {} });
    expect(s.via).toBe('wrangler');
    expect(s.steps).toEqual(['git commit · main', 'wrangler deploy']);
    expect(s.runUrl).toBeNull();
    expect(s.time).toBe('2026-10-08T04:11:00.000Z');
  });

  it('in GitHub Actions: three steps and a run link', () => {
    const s = makeStamp({ ...base, env: {
      GITHUB_ACTIONS: 'true', GITHUB_REF_NAME: 'main', GITHUB_SERVER_URL: 'https://github.com',
      GITHUB_REPOSITORY: 'witharyan/witharyan', GITHUB_RUN_ID: '42',
    } });
    expect(s.via).toBe('github-actions');
    expect(s.steps).toEqual(['git push · main', 'GitHub Actions', 'wrangler deploy']);
    expect(s.runUrl).toBe('https://github.com/witharyan/witharyan/actions/runs/42');
  });

  it('marks uncommitted builds honestly', () => {
    expect(makeStamp({ ...base, dirty: true, env: {} }).sha).toBe('a3f9c1e-dirty');
  });

  it('parses the last commits, keeping tabs out of subjects', () => {
    const s = makeStamp({ ...base, env: {} });
    expect(s.commits).toEqual([
      { sha: 'a3f9c1e', time: '2026-10-08T09:41:00+05:30', subject: 'Ship the homepage' },
      { sha: '2ed037d', time: '2026-10-08T07:34:00+05:30', subject: 'Ignore project-docs/' },
    ]);
  });
});
