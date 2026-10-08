import { readFileSync } from 'node:fs';

export type RepoInfo = { name: string; stars: number; pushedAt: string; url: string };

type ApiRepo = { name: string; stargazers_count: number; pushed_at: string; html_url: string };

// GitHub only adds facts (stars, last push) to entries I curated. It never adds rows.
export function pickRepos(api: unknown, allow: string[]): RepoInfo[] {
  if (!Array.isArray(api)) return [];
  return (api as ApiRepo[])
    .filter((r) => allow.includes(r.name))
    .map((r) => ({ name: r.name, stars: r.stargazers_count, pushedAt: r.pushed_at, url: r.html_url }));
}

export function attachRepos<T extends { repo?: string }>(entries: T[], repos: RepoInfo[]) {
  return entries.map((e) => ({ ...e, github: repos.find((r) => r.name === e.repo) ?? null }));
}

export function loadRepos(): RepoInfo[] {
  return JSON.parse(readFileSync('content/github.json', 'utf8')) as RepoInfo[];
}
