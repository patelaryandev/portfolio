import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodeExcerpt } from '@/components/CodeExcerpt';
import { Drawing } from '@/components/Drawing';
import { caseStudies } from '@/content/case-studies';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const dynamicParams = false;
export const generateStaticParams = () => caseStudies.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  return c ? { title: c.title, description: c.problem.slice(0, 155) } : {};
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
    <Nav current="work" />
    <main className="page wrap">
      <p className="top"><Link href="/work">← Every release</Link></p>
      <h1 className="name">{c.title}</h1>
      {c.live ? <p className="live"><a href={c.live.href}>{c.live.label}</a></p> : null}
      <p className="lede">{c.problem}</p>
      {c.parts ? (
        <>
          <h2 className="section-h">What it does</h2>
          <dl className="parts">{c.parts.map((x) => <div key={x.name}><dt>{x.name}</dt><dd>{x.does}</dd></div>)}</dl>
        </>
      ) : null}
      <h2 className="section-h">How it works</h2>
      <Drawing spec={c.drawing} />
      <h2 className="section-h">Key decisions</h2>
      {c.excerpts.map((e, i) => <CodeExcerpt key={e.file} excerpt={e} n={i + 1} />)}
      <h2 className="section-h">What I&apos;d do differently</h2>
      <ul className="results">{c.differently.map((d) => <li key={d}>{d}</li>)}</ul>
      <h2 className="section-h">Results</h2>
      <ul className="results">{c.results.map((r) => <li key={r}>{r}</li>)}</ul>
      {c.links.length ? <p className="more">{c.links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}</p> : null}
    </main>
    <Footer />
    </>
  );
}
