import { site } from '@/content/site';
import build from '@/content/build.json';
import type { BuildStamp } from '@/lib/stamp';
import { siteVersion } from '@/lib/version';

const stamp = build as BuildStamp;
const version = siteVersion(new Date(stamp.time));

// The bottom edge of the sheet: a scale ruler over one mono line. Revision and build come from the real deploy.
export function Footer() {
  return (
    <footer className="wrap foot">
      <p className="foot-id">
        <span>{site.name}</span>
        <span>rev {version}{stamp.commitUrl ? <> · <a href={stamp.commitUrl}>{stamp.sha}</a></> : <> · {stamp.sha}</>}</span>
      </p>
      <nav className="foot-links" aria-label="Contact">
        <a href={`mailto:${site.email}`}>Email</a>
        <a href={site.github}>GitHub</a>
        <a href={site.linkedin}>LinkedIn</a>
        <a href="/resume.pdf">Resume ↓</a>
        <a href="#top" aria-label="Back to top">↑</a>
      </nav>
    </footer>
  );
}
