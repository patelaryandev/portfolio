import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Flow, flowLayout } from '@/components/Flow';
import type { BuildStamp } from '@/lib/stamp';

const ci: BuildStamp = {
  sha: 'a3f9c1e', time: '2026-10-09T10:00:00Z', branch: 'main', via: 'github-actions',
  steps: ['git push · main', 'GitHub Actions', 'wrangler deploy'],
  runUrl: 'https://github.com/patelaryandev/portfolio/actions/runs/42',
  commitUrl: 'https://github.com/patelaryandev/portfolio/commit/a3f9c1e',
  commits: [], deploySeconds: 68,
};
const laptop: BuildStamp = { ...ci, via: 'wrangler', steps: ['git commit · main', 'wrangler deploy'], runUrl: null, commitUrl: null, deploySeconds: null };

describe('flowLayout', () => {
  it('CI: push, Actions, edge, browser, top to bottom, with the commit and the run linked', () => {
    const { boxes } = flowLayout(ci, 'DEL', 97);
    expect(boxes.map((b) => b.label)).toEqual(['git push · main', 'GitHub Actions', 'Cloudflare · DEL', 'Your browser']);
    expect(boxes.map((b) => b.href)).toEqual([ci.commitUrl, ci.runUrl, null, null]);
    expect(boxes[1].detail).toBe('97 tests pass, then build');
  });
  it('puts the real push-to-live time on the arrow into Cloudflare', () => {
    expect(flowLayout(ci, 'DEL', null).arrows.map((a) => a.label)).toEqual(['on every push', 'push to live: ~68 s', 'round trip']);
  });
  it('a laptop deploy links nothing and claims no CI or timing', () => {
    const { boxes, arrows } = flowLayout(laptop, 'edge', null);
    expect(boxes[1].label).toBe('wrangler deploy');
    expect(boxes.every((b) => b.href === null)).toBe(true);
    expect(arrows[1].label).toBe('deploys to the edge');
  });
  it('every arrow joins the box above to the box below', () => {
    expect(flowLayout(ci, 'DEL', null).arrows.map((a) => a.d)).toEqual(['M44 52 V104', 'M44 148 V200', 'M44 244 V296']);
  });
  it('renders labels as real text and linked boxes as real links', () => {
    const html = renderToStaticMarkup(<svg><Flow stamp={ci} colo="DEL" tests={97} /></svg>);
    expect(html).toContain('href="https://github.com/patelaryandev/portfolio/actions/runs/42"');
    expect(html).toContain('Your browser');
  });
});
