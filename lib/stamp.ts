export type Commit = { sha: string; time: string; subject: string };
export type BuildStamp = {
  sha: string; time: string; branch: string;
  via: 'wrangler' | 'github-actions';
  steps: string[]; runUrl: string | null; commitUrl: string | null; commits: Commit[];
  // Added after the stamp: by scripts/github.ts (median push-to-live time) and by CI once the tests pass.
  deploySeconds?: number | null; tests?: number | null;
};

type Input = { env: Record<string, string | undefined>; sha: string; dirty: boolean; branch: string; now: Date; log: string };

export function makeStamp({ env, sha, dirty, branch, now, log }: Input): BuildStamp {
  const inActions = env.GITHUB_ACTIONS === 'true';
  const ref = inActions ? env.GITHUB_REF_NAME ?? branch : branch;
  const { GITHUB_SERVER_URL: server, GITHUB_REPOSITORY: repo, GITHUB_RUN_ID: run } = env;
  return {
    sha: dirty ? `${sha}-dirty` : sha,
    time: now.toISOString(),
    branch: ref,
    via: inActions ? 'github-actions' : 'wrangler',
    steps: inActions ? [`git push · ${ref}`, 'GitHub Actions', 'wrangler deploy'] : [`git commit · ${ref}`, 'wrangler deploy'],
    runUrl: inActions && server && repo && run ? `${server}/${repo}/actions/runs/${run}` : null,
    commitUrl: inActions && server && repo && !dirty ? `${server}/${repo}/commit/${sha}` : null,
    commits: parseLog(log),
  };
}

function parseLog(log: string): Commit[] {
  return log.split('\n').filter(Boolean).map((line) => {
    const [sha, time, ...rest] = line.split('\t');
    return { sha, time, subject: rest.join(' ') };
  });
}

type Run = { run_started_at?: string; updated_at?: string };

// Typical push-to-live time: the median of recent successful deploy runs, in seconds.
export function medianDeploySeconds(api: unknown): number | null {
  const runs = (api as { workflow_runs?: Run[] } | null)?.workflow_runs;
  if (!Array.isArray(runs)) return null;
  const secs = runs
    .map((r) => (Date.parse(r.updated_at ?? '') - Date.parse(r.run_started_at ?? '')) / 1000)
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);
  if (!secs.length) return null;
  const mid = secs.length >> 1;
  return Math.round(secs.length % 2 ? secs[mid] : (secs[mid - 1] + secs[mid]) / 2);
}

// The number of tests that passed, from Vitest's JSON report; null unless every test passed.
export function passedTests(report: unknown): number | null {
  const r = report as { success?: unknown; numPassedTests?: unknown } | null;
  return r?.success === true && typeof r.numPassedTests === 'number' ? r.numPassedTests : null;
}

// "about a minute", "about 2 minutes": the plain-English version for the one-line summary.
export function aboutMinutes(seconds: number | null | undefined) {
  if (!seconds) return null;
  const m = Math.max(1, Math.round(seconds / 60));
  return m === 1 ? 'about a minute' : `about ${m} minutes`;
}

// Formatted on the server at build time so the browser never runs Intl for it.
export const formatBuilt = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(iso)) + ' IST';
