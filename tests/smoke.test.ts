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
  it('homepage has the menu, the resume button and the photo panel', () => {
    const html = page('index.html');
    expect(html).toContain('href="/resume.pdf"');
    expect(html).toContain('Full-Stack &amp; DevOps Engineer');
    expect(html).toContain('Looking for');
    expect(html).toContain('/aryan-patel.jpg');
    expect(html).toContain('updated ');
  });
  it('serves the resume and the link image', () => {
    expect(existsSync('out/resume.pdf')).toBe(true);
    expect(existsSync('out/og.png')).toBe(true);
    expect(page('index.html')).toContain('og:image');
  });
  it('every page carries the menu', () => {
    for (const f of ['work.html', 'work/nivaran.html', 'how-its-built.html', '404.html']) expect(page(f)).toContain('aria-label="Main"');
  });
  it('uses the full name in the title block', () => {
    expect(page('how-its-built.html')).not.toContain('A. Patel');
  });
  it('the code toggle works without JS', () => {
    expect(page('work/gfg-rkgit.html')).toContain('<details class="excerpt">');
  });
  it('404 speaks in the site voice', () => {
    expect(page('404.html')).toContain('has no page here');
  });
});
