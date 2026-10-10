import { site } from '@/content/site';
import build from '@/content/build.json';
import type { BuildStamp } from '@/lib/stamp';
import { siteVersion } from '@/lib/version';

const version = siteVersion(new Date((build as BuildStamp).time));

// Mirrors the nav: a full-width bar with an ink rule that closes the sheet, same outlined buttons.
export function Footer() {
  return (
    <footer className="site-foot">
      <p className="sf-open"><span className="dot" />Open to {site.profile.lookingFor}<small>rev {version}</small></p>
      <ul className="sf-links">
        <li><a className="sf-mail" href={`mailto:${site.email}`}>{site.email}</a></li>
        <li><a href={site.github}>GitHub</a></li>
        <li><a href={site.linkedin}>LinkedIn</a></li>
        <li><a className="sf-top" href="#top" aria-label="Back to top">↑</a></li>
      </ul>
    </footer>
  );
}
