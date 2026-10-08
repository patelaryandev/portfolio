import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = (p: string) => readFileSync(`out/${p}`, 'utf8');

describe('static export', () => {
  it.each(['index.html', 'work.html', 'work/gfg-rkgit.html', 'work/nivaran.html', 'work/prometheus.html', 'how-its-built.html', '404.html'])('writes %s', (f) => {
    expect(existsSync(`out/${f}`)).toBe(true);
  });
  it('homepage has the title, the email and the live panel', () => {
    const html = page('index.html');
    expect(html).toContain('Vice President, GFG Campus Body RKGIT');
    expect(html).toContain('mailto:hi@patelaryan.dev');
    expect(html).toContain('How this page reached you');
  });
  it('the code toggle works without JS', () => {
    expect(page('work/gfg-rkgit.html')).toContain('<details>');
  });
  it('404 speaks in the site voice', () => {
    expect(page('404.html')).toContain('has no page here');
  });
});
