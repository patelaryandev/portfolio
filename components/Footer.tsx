import { site } from '@/content/site';
import resume from '@/content/resume.json';
import build from '@/content/build.json';
import { formatBuilt, type BuildStamp } from '@/lib/stamp';
import { siteVersion } from '@/lib/version';
import { formatResumeDate } from '@/lib/resume';
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';
import { TitleBlock } from './TitleBlock';

const stamp = build as BuildStamp;
const version = siteVersion(new Date(stamp.time));

// The bottom of the drawing sheet: general notes and contact on the left, the title block
// (filled from the real build) along the bottom edge.
export function Footer({ sheet }: { sheet: string }) {
  return (
    <footer className="foot-sheet grid">
      <div className="wrap">
        <div className="fs-main">
          <div className="fs-notes">
            <h2>General notes</h2>
            <ol>
              <li>Open to {site.profile.lookingFor}.</li>
              <li>Write to <a href={`mailto:${site.email}`}>{site.email}</a>.</li>
              <li>Redrawn on every push. Now at rev {version}.</li>
            </ol>
          </div>
          <div className="fs-links">
            <a className="btn solid" href={`mailto:${site.email}`}><MailIcon /> Email me</a>
            <a className="btn" href="/resume.pdf"><DownloadIcon /> Resume <small>{formatResumeDate(resume.updated)}</small></a>
            <a className="btn icon" href={site.github} aria-label="GitHub"><GitHubIcon /></a>
            <a className="btn icon" href={site.linkedin} aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
        </div>
        <TitleBlock cells={[
          { label: 'Drawn by', value: site.name },
          { label: 'Sheet', value: sheet },
          { label: 'Revision', value: version },
          { label: 'Build', value: stamp.commitUrl ? <a href={stamp.commitUrl}>{stamp.sha}</a> : stamp.sha },
          { label: 'Redrawn', value: formatBuilt(stamp.time) },
          { label: 'Source', value: <a href={`${site.github}/portfolio`}>portfolio ↗</a> },
        ]} />
        <p className="fs-end">
          <span>© {new Date(stamp.time).getFullYear()} {site.name} · {site.place}</span>
          <a href="#top">Back to top ↑</a>
        </p>
      </div>
    </footer>
  );
}
