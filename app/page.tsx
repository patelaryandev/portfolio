import { Blueprint } from '@/components/Blueprint';
import { Changelog } from '@/components/Changelog';
import { Cta } from '@/components/Cta';
import { Profile } from '@/components/Profile';
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
const version = siteVersion(new Date(stamp.time));

export default function Home() {
  const all = withVersions(entries);
  const cardIds: string[] = cards.map((c) => c.id);
  const pens = Object.fromEntries(all.map((e) => [e.id, e.pen]));
  const shipped = all.filter((e) => e.featured && !cardIds.includes(e.id));
  return (
    <>
    <Nav />
    <main className="home wrap">
      <section className="left">
        <h1 className="name">{site.name},<br /><i>v{version}</i>, still shipping.</h1>
        <p className="lede">{site.lede}</p>
        <ul className="chips" aria-label="What I work with">{site.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        <Cta />
        <Profile where="inline" />
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
          <Profile where="panel" />
          <Blueprint stamp={stamp} siteVersion={version} builtAt={formatBuilt(stamp.time)} />
        </div>
      </aside>
    </main>
    </>
  );
}
