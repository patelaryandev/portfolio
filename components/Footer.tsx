import { site } from '@/content/site';
import resume from '@/content/resume.json';
import build from '@/content/build.json';
import { formatBuilt, type BuildStamp } from '@/lib/stamp';
import { siteVersion } from '@/lib/version';

const stamp = build as BuildStamp;
const version = siteVersion(new Date(stamp.time));

// The bottom edge of the drawing sheet: one slim title block. Revision and build come from the real deploy.
export function Footer() {
  return (
    <footer className="wrap foot">
      <div className="tblock foot-tb">
        <div className="f-by">Drawn by<b>{site.name}</b></div>
        <div className="f-rev">Revision<b>{version} · {stamp.commitUrl ? <a href={stamp.commitUrl}>{stamp.sha}</a> : stamp.sha}</b></div>
        <div className="f-when">Redrawn<b>{formatBuilt(stamp.time)}</b></div>
        <div className="f-mail">Write<b><a href={`mailto:${site.email}`}>{site.email}</a></b></div>
        <div className="f-find">Find me<b><a href={site.github}>GitHub</a> · <a href={site.linkedin}>LinkedIn</a></b></div>
        <div className="f-cv">Resume<b><a href="/resume.pdf">PDF ↓</a> <small>{resume.updated.slice(0, 7)}</small></b></div>
        <div className="f-top"><a href="#top" aria-label="Back to top">↑</a></div>
      </div>
    </footer>
  );
}
