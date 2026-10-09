import { site } from '@/content/site';
import resume from '@/content/resume.json';
import { formatResumeDate } from '@/lib/resume';
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';

export function Cta() {
  return (
    <div className="cta">
      <div className="cv">
        <a className="btn solid" href="/resume.pdf"><DownloadIcon /> Resume</a>
        <small>updated {formatResumeDate(resume.updated)}</small>
      </div>
      <a className="btn" href={`mailto:${site.email}`}><MailIcon /> Email me</a>
      <a className="btn icon" href={site.github} aria-label="GitHub"><GitHubIcon /></a>
      <a className="btn icon" href={site.linkedin} aria-label="LinkedIn"><LinkedInIcon /></a>
    </div>
  );
}
