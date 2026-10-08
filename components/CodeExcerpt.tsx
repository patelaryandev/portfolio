// components/CodeExcerpt.tsx
import { readFileSync } from 'node:fs';
import { codeToHtml } from 'shiki';
import type { Excerpt } from '@/content/case-studies';

export async function CodeExcerpt({ excerpt }: { excerpt: Excerpt }) {
  const code = readFileSync(`content/excerpts/${excerpt.file}`, 'utf8').trimEnd();
  const lines = code.split('\n').length;
  const html = await codeToHtml(code, { lang: excerpt.lang, theme: 'github-light' });
  return (
    <figure className="excerpt">
      <figcaption>
        <b>{excerpt.title}</b> <span className="mono">{excerpt.source}</span>
        <span className="pen excerpt-note">{excerpt.note}</span>
      </figcaption>
      <div className="code" dangerouslySetInnerHTML={{ __html: html }} />
      {lines > 12 ? <details><summary><span className="more">show all {lines} lines</span><span className="less">show less</span></summary></details> : null}
    </figure>
  );
}
