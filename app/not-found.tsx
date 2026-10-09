import Link from 'next/link';
import build from '@/content/build.json';
import { siteVersion } from '@/lib/version';
import { Nav } from '@/components/Nav';

export default function NotFound() {
  return (
    <>
    <Nav />
    <main className="page wrap">
      <h1 className="name">v{siteVersion(new Date(build.time))} has no page here.</h1>
      <p className="lede">The link may be from an older release. <Link href="/">Go to the latest one →</Link></p>
    </main>
    </>
  );
}
