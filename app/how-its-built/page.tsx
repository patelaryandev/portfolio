// app/how-its-built/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Blueprint } from '@/components/Blueprint';
import { CodeExcerpt } from '@/components/CodeExcerpt';
import { TitleBlock } from '@/components/TitleBlock';
import build from '@/content/build.json';
import weight from '@/content/weight.json';
import { formatBuilt, type BuildStamp } from '@/lib/stamp';
import { siteVersion } from '@/lib/version';
import type { Weight } from '@/lib/weight';

export const metadata: Metadata = { title: "How it's built", description: 'This site, documented by its own build: request path, deploy path, page weight and the Worker source.' };

const stamp = build as BuildStamp;
const w = weight as Weight | { measured: false };
const version = siteVersion(new Date(stamp.time));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatDay = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;

const decisions = [
  ['A static export', 'a Next.js server', 'every page is the same for every visitor, so plain files are faster and have nothing to patch'],
  ['Cloudflare Workers', 'Pages', 'one deploy serves the files and the two small APIs, and it is where Cloudflare is putting new features'],
  ['A Durable Object', 'KV', 'KV is eventually consistent, so two visits at once could lose a count; a Durable Object cannot'],
  ['Plain CSS', 'a CSS framework', 'the design has a handful of components, and tokens in custom properties cover them'],
  ['A native <details> toggle', 'a JS accordion', 'the code is readable with JavaScript off and ships zero bytes of script'],
] as const;

export default function HowItsBuilt() {
  return (
    <main className="page wrap">
      <p className="top"><Link href="/">← Aryan Patel</Link></p>
      <div className="sheet grid">
        <h1 className="name">How it&apos;s built</h1>
        <p className="lede">Every number on this sheet comes from this build or from your own request. None of it is typed by hand.</p>

        <h2 className="section-h">1 · Your request, up close</h2>
        <Blueprint stamp={stamp} siteVersion={version} builtAt={formatBuilt(stamp.time)} variant="sheet" />

        <h2 className="section-h">2 · How it got here</h2>
        <p>{stamp.steps.join(' → ')}{stamp.runUrl ? <> · <a href={stamp.runUrl}>see the run</a></> : null}</p>

        <h2 className="section-h">3 · What shipped with this build</h2>
        <ol className="log">
          {stamp.commits.map((c) => (
            <li className="row" key={c.sha}>
              <span className="v">{c.sha}</span><span>{c.subject}</span><span className="d">{formatDay(c.time)}</span>
            </li>
          ))}
        </ol>

        <h2 className="section-h">4 · What the homepage weighs</h2>
        {w.measured ? (
          <dl className="facts weight">
            <dt>HTML</dt><dd>{kb(w.html)}</dd><dt>CSS</dt><dd>{kb(w.css)}</dd>
            <dt>JavaScript</dt><dd>{kb(w.js)} of a {kb(w.budgetJs)} budget</dd>
            <dt>Fonts (preloaded)</dt><dd>{kb(w.fonts)}</dd><dt>Total, gzipped</dt><dd>{kb(w.total)}</dd>
          </dl>
        ) : <p>Measured on the next build pass.</p>}
        <p className="pen">the build fails if JavaScript goes over budget</p>

        <h2 className="section-h">5 · The Worker, annotated</h2>
        <CodeExcerpt excerpt={{ title: 'The two endpoints', file: '../../worker/handlers.ts', lang: 'ts', source: 'worker/handlers.ts', note: 'the ping never counts as a visit; a broken counter still answers' }} />
        <CodeExcerpt excerpt={{ title: "Today's count", file: '../../worker/visit-counter.ts', lang: 'ts', source: 'worker/visit-counter.ts', note: 'a Durable Object, so simultaneous visits never lose a count' }} />

        <h2 className="section-h">6 · Decisions</h2>
        <ul className="decisions">
          {decisions.map(([x, y, z]) => <li key={x}>Chose <b>{x}</b> over {y}, because {z}.</li>)}
        </ul>

        <TitleBlock cells={[
          { label: 'Drawn by', value: 'Aryan Patel' }, { label: 'Revision', value: version },
          { label: 'Build', value: stamp.sha }, { label: 'Sheet', value: '2 / 2' },
        ]} />
      </div>
    </main>
  );
}
