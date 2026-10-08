export type Commit = { sha: string; time: string; subject: string };
export type BuildStamp = {
  sha: string; time: string; branch: string;
  via: 'wrangler' | 'github-actions';
  steps: string[]; runUrl: string | null; commits: Commit[];
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
    commits: parseLog(log),
  };
}

function parseLog(log: string): Commit[] {
  return log.split('\n').filter(Boolean).map((line) => {
    const [sha, time, ...rest] = line.split('\t');
    return { sha, time, subject: rest.join(' ') };
  });
}
