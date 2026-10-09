import { Blueprint } from '@/components/Blueprint';
import { Changelog } from '@/components/Changelog';
import { Cta } from '@/components/Cta';
import { MeLine, OpenTo, Profile } from '@/components/Profile';
import { ProjectCards } from '@/components/ProjectCards';
import Link from 'next/link';
import build from '@/content/build.json';
import { cards } from '@/content/cards';
import { entries } from '@/content/projects';
import { site } from '@/content/site';
import { formatBuilt, type BuildStamp } from '@/lib/stamp';
import { siteVersion, withVersions } from '@/lib/version';
import { Nav } from '@/components/Nav';

const stamp = build as BuildStamp;

// Tells Google and AI search who this site is about, and which profiles are the same person.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person', '@id': 'https://patelaryan.dev/#me',
      name: site.name, url: 'https://patelaryan.dev', image: 'https://patelaryan.dev/aryan-patel.jpg',
      jobTitle: site.title, description: site.summary, email: `mailto:${site.email}`,
      address: { '@type': 'PostalAddress', addressLocality: site.place, addressCountry: 'IN' },
      affiliation: { '@type': 'CollegeOrUniversity', name: 'Raj Kumar Goel Institute of Technology (RKGIT)' },
      memberOf: { '@type': 'Organization', name: 'GFG Campus Body RKGIT', url: 'https://gfg.rkgit.in' },
      knowsAbout: site.stack,
      sameAs: [site.github, site.linkedin],
    },
    { '@type': 'WebSite', '@id': 'https://patelaryan.dev/#site', url: 'https://patelaryan.dev', name: site.name, publisher: { '@id': 'https://patelaryan.dev/#me' } },
  ],
};
const version = siteVersion(new Date(stamp.time));

export default function Home() {
  const all = withVersions(entries);
  const cardIds: string[] = cards.map((c) => c.id);
  const pens = Object.fromEntries(all.map((e) => [e.id, e.pen]));
  const shipped = all.filter((e) => e.featured && !cardIds.includes(e.id));
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <Nav />
    <main className="home wrap">
      <section className="left">
        <MeLine />
        <h1 className="name">{site.name}.<br />I build web apps and <i>ship them</i>.</h1>
        <p className="lede">{site.lede}</p>
        <ul className="chips" aria-label="What I work with">{site.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        <OpenTo />
        <Cta />
        <h2 className="kicker"><span>Selected work</span></h2>
        <ProjectCards items={all.filter((e) => cardIds.includes(e.id))} pens={pens} />
        <h2 className="kicker"><span>Also shipped</span><Link href="/work">Every release <span className="arr">→</span></Link></h2>
        <Changelog items={shipped} showPens />
        <section className="about" aria-labelledby="about-h">
          <h2 id="about-h">About</h2>
          {site.about.map((p) => <p key={p}>{p}</p>)}
        </section>
      </section>
      <aside className="panel grid" aria-label="Profile and how this page reached you">
        <div className="panel-in">
          <Profile />
          <Blueprint stamp={stamp} siteVersion={version} builtAt={formatBuilt(stamp.time)} />
        </div>
      </aside>
    </main>
    </>
  );
}
