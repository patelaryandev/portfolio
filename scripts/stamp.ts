import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { makeStamp } from '../lib/stamp.ts';

const git = (cmd: string, fallback: string) => {
  try { return execSync(`git ${cmd}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return fallback; }
};

const stamp = makeStamp({
  env: process.env,
  sha: git('rev-parse --short HEAD', 'unknown'),
  dirty: git('status --porcelain', '') !== '',
  branch: git('rev-parse --abbrev-ref HEAD', 'main'),
  now: new Date(),
  log: git('log -10 --format=%h%x09%cI%x09%s', ''),
});

writeFileSync('content/build.json', JSON.stringify(stamp, null, 2) + '\n');
writeFileSync('content/weight.json', JSON.stringify({ measured: false }) + '\n');
console.log(`stamp: ${stamp.sha} via ${stamp.via}`);

// The resume PDF has one source, resume/resume.pdf. The site serves a copy and shows the day it last changed.
if (!existsSync('resume/resume.pdf')) {
  console.error('stamp: resume/resume.pdf is missing');
  process.exit(1);
}
copyFileSync('resume/resume.pdf', 'public/resume.pdf');
const updated = git('log -1 --format=%cI -- resume/resume.pdf', '') || statSync('resume/resume.pdf').mtime.toISOString();
writeFileSync('content/resume.json', JSON.stringify({ updated }) + '\n');
