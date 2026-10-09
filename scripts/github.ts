import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { entries } from '../content/projects.ts';
import { pickRepos } from '../lib/github.ts';
import { medianDeploySeconds } from '../lib/stamp.ts';

const allow = entries.flatMap((e) => (e.repo ? [e.repo] : []));
const headers: Record<string, string> = { accept: 'application/vnd.github+json', 'user-agent': 'patelaryandev-build' };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

try {
  const api = process.env.GITHUB_API_URL ?? 'https://api.github.com';
  const res = await fetch(`${api}/users/patelaryandev/repos?per_page=100`, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const repos = pickRepos(await res.json(), allow);
  const out = process.argv.includes('--write-snapshot') ? 'content/github-snapshot.json' : 'content/github.json';
  writeFileSync(out, JSON.stringify(repos, null, 2) + '\n');
  if (out !== 'content/github.json') copyFileSync(out, 'content/github.json');
  console.log(`github: ${repos.length} repos`);
} catch (err) {
  copyFileSync('content/github-snapshot.json', 'content/github.json');
  console.warn(`github: using snapshot (${(err as Error).message})`);
}

// How long a push takes to go live, from the last 10 successful deploys. Shown on the blueprint.
try {
  const api = process.env.GITHUB_API_URL ?? 'https://api.github.com';
  const repo = process.env.GITHUB_REPOSITORY ?? 'patelaryandev/portfolio';
  const res = await fetch(`${api}/repos/${repo}/actions/workflows/deploy.yml/runs?branch=main&event=push&status=success&per_page=10`, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const stamp = JSON.parse(readFileSync('content/build.json', 'utf8'));
  stamp.deploySeconds = medianDeploySeconds(await res.json());
  writeFileSync('content/build.json', JSON.stringify(stamp, null, 2) + '\n');
  console.log(`github: push to live ~${stamp.deploySeconds}s`);
} catch (err) {
  console.warn(`github: no deploy timing (${(err as Error).message})`);
}
