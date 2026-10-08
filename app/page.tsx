import Link from 'next/link';
import { Blueprint } from '@/components/Blueprint';
import { Changelog } from '@/components/Changelog';
import { Contact } from '@/components/Contact';
import build from '@/content/build.json';
import { entries } from '@/content/projects';
import { site } from '@/content/site';
import { formatBuilt, type BuildStamp } from '@/lib/stamp';
import { siteVersion, withVersions } from '@/lib/version';

const stamp = build as BuildStamp;
const version = siteVersion(new Date(stamp.time));

export default function Home() {
  const featured = withVersions(entries).filter((e) => e.featured).slice(0, 6);
  return (
    <main className="home wrap">
      <section className="left">
        <p className="top"><b>{site.name}</b> &nbsp;·&nbsp; {site.place}</p>
        <h1 className="name">{site.name},<br /><i>v{version}</i>, still shipping.</h1>
        <p className="lede">{site.lede} {site.role}.</p>
        <Changelog items={featured} showPens />
        <p className="more"><Link href="/work">Every release →</Link> &nbsp;·&nbsp; <Link href="/how-its-built">How this site is built →</Link></p>
        <section className="about" aria-labelledby="about-h">
          <h2 id="about-h">About</h2>
          {site.about.map((p) => <p key={p}>{p}</p>)}
          <Contact />
        </section>
      </section>
      <aside className="panel" aria-label="How this page reached you">
        <Blueprint stamp={stamp} siteVersion={version} builtAt={formatBuilt(stamp.time)} />
      </aside>
    </main>
  );
}
