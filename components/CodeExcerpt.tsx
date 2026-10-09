// components/CodeExcerpt.tsx
import { readFileSync } from 'node:fs';
import { codeToHtml } from 'shiki';
import type { Excerpt } from '@/content/case-studies';

// One key decision: the why in plain words first, the code folded underneath for whoever wants it.
export async function CodeExcerpt({ excerpt, n }: { excerpt: Excerpt; n: number }) {
  const code = readFileSync(`content/excerpts/${excerpt.file}`, 'utf8').trimEnd();
  const lines = code.split('\n').length;
  const html = await codeToHtml(code, { lang: excerpt.lang, theme: 'github-light' });
  return (
    <section className="decision">
      <h3><span className="mono">{String(n).padStart(2, '0')}</span> {excerpt.title}</h3>
      <p>{excerpt.why}</p>
      <details className="excerpt">
        <summary><span className="more">See the code</span><span className="less">Hide the code</span> <span className="mono">{excerpt.source} · {lines} lines</span></summary>
        <div className="code" dangerouslySetInnerHTML={{ __html: html }} />
      </details>
      {excerpt.href ? <a className="gh" href={excerpt.href}>View on GitHub ↗</a> : null}
    </section>
  );
}
