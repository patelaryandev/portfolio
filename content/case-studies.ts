import type { DrawingSpec } from './drawing-types';
export type { DrawingSpec } from './drawing-types';

export type Excerpt = {
  title: string; file: string;
  lang: 'js' | 'ts' | 'tsx' | 'sql' | 'python' | 'dockerfile' | 'yaml';
  source: string;
  why: string; // the problem, what I chose and what it costs, in plain words
  href?: string; // the file on GitHub, only for public repos
};

export type CaseStudy = {
  slug: 'gfg-rkgit' | 'nivaran' | 'prometheus';
  title: string; live?: { label: string; href: string }; problem: string; drawing: DrawingSpec;
  parts?: { name: string; does: string }[];
  excerpts: Excerpt[]; differently: string[]; results: string[]; links: { label: string; href: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'gfg-rkgit',
    title: 'GFG RKGIT platform',
    live: { label: 'Live site: gfg.rkgit.in ↗', href: 'https://gfg.rkgit.in' },
    problem: 'The GFG Campus Body RKGIT is our college coding club. This platform is how we manage the whole club and every event we run: registrations, attendance, the team and its members. 300+ students have signed up on it through our events. A club platform has to outlive the students who built it, so I made the browser untrusted: every app, the public site included, goes through one API that checks who you are before anything reaches the database.',
    parts: [
      { name: 'Public website', does: 'gfg.rkgit.in. Anyone can see upcoming events, register for one, send feedback, apply to join the team, and browse the current team and alumni.' },
      { name: 'Admin portal', does: 'For the core team. Create and edit events, manage members, and give volunteers scanner access to check people in at an event.' },
      { name: 'Team portal', does: 'For team members. Each member keeps their own profile up to date: photo, bio, skills and links.' },
    ],
    drawing: {
      viewBox: '0 0 640 385',
      label: 'Three React apps, all signed in with Firebase Auth, and all calling one Cloudflare Worker API at api.gfg.rkgit.in. The public site sends feedback, career applications and event registrations, and loads the team and alumni pages, through the Worker. The admin and team portals send every change with the Firebase ID token. The Worker verifies the token with keys cached in KV, checks the role, and is the one that talks to Firestore, KV for rate limits and R2 for event photos. Cron triggers on the same Worker revoke event-scanner access daily and archive graduates every 1 June.',
      boxes: [
        { x: 30, y: 20, w: 180, text: 'Public site', sub: 'gfg.rkgit.in · forms' },
        { x: 235, y: 20, w: 180, text: 'Admin portal', sub: 'events, members' },
        { x: 440, y: 20, w: 190, text: 'Team portal', sub: 'own profile' },
        { x: 30, y: 135, w: 150, text: 'Firebase Auth', sub: 'sign-in → ID token' },
        { x: 235, y: 135, w: 230, text: 'Worker API', sub: 'checks token + role' },
        { x: 490, y: 135, w: 140, text: 'Cron triggers', sub: 'daily · 1 June', dashed: true },
        { x: 30, y: 265, w: 190, text: 'Firestore', sub: 'events, members, forms' },
        { x: 245, y: 265, w: 180, text: 'KV', sub: 'token keys, rate limits' },
        { x: 450, y: 265, w: 180, text: 'R2', sub: 'event photos' },
      ],
      arrows: [
        { d: 'M80 74 V135', label: [87, 108, 'sign in'] },
        { d: 'M170 74 L280 135', label: [216, 96, 'forms, team'] },
        { d: 'M325 74 V135', label: [332, 108, 'Bearer ID token'] },
        { d: 'M520 74 L430 135' },
        { d: 'M490 162 H465', dashed: true },
        { d: 'M290 189 L150 265', label: [204, 226, 'role, data'], anchor: 'end' },
        { d: 'M335 189 V265', label: [342, 232, 'keys, limits'] },
        { d: 'M410 189 L520 265', label: [478, 232, 'photos'] },
      ],
      notes: [
        { x: 3, y: 87, text: 'one door: every app goes through the Worker' },
      ],
    },
    excerpts: [
      { title: 'Admin requests prove who you are', file: 'gfg/auth.js', lang: 'js', source: 'gfg-rkgit-worker · src/middleware/auth.js', why: 'Three apps share one database, and the students running them change every year. So every admin request carries a Firebase ID token, and the Worker checks it before it does anything else. Google\'s signing keys are cached in KV, so the check does not call Google on every request.' },
      { title: 'Firestore rules, a second lock behind the API', file: 'gfg/firestore.rules', lang: 'js', source: 'gfg-rkgit-infra · firestore.rules', why: 'If the Worker ever has a bug, the database should still say no. The Firestore rules repeat the important checks: only an active admin can manage data, and a team member can change only their own bio, skills and links, never their role. Keeping two layers in step is extra work, but one mistake no longer opens everything.' },
      { title: 'Access that expires on its own', file: 'gfg/revoke-scanner-access.js', lang: 'js', source: 'gfg-rkgit-worker · src/scheduled/revoke-scanner-access.js', why: 'Volunteers get scanner access to check people in at an event, and nobody remembers to take it back. A cron job on the same Worker clears scanner access for every past event each day, and writes an audit entry for each one it removes.' },
    ],
    differently: [
      'The daily cron writes the whole event back just to empty one list. If an admin edits the event at the same moment, one change can overwrite the other. I\'d update only the scanners field.',
      'Audit entries are written one at a time in a loop. I\'d write them in one batch, so a big event is cleared in one round trip.',
    ],
    results: ['300+ students signed up through our club events', 'Admin actions need a token and an active admin record'],
    links: [],
  },
  {
    slug: 'nivaran',
    title: 'Nivaran',
    problem: 'Potholes, garbage and broken streetlights get reported in WhatsApp groups and forgotten. Nivaran lets a citizen report one with a photo and their GPS location, and the database itself ranks it.',
    drawing: {
      viewBox: '0 0 640 410',
      label: 'A citizen uses the React web app, signed in with Supabase Auth. Reports with a photo and GPS go into the issues table, where a trigger turns upvotes and downvotes into a score and a priority. When an officer marks a report Resolved, the reporter and affected citizens vote through the cast_verification_vote function: more than half saying fixed verifies it, half or more saying not fixed sends it back to In Progress. Every status change writes a notifications row; a database webhook calls the send-push Edge Function, which looks up the citizen’s FCM token and sends a push through Firebase Cloud Messaging back to the app.',
      frames: [
        { x: 20, y: 104, w: 610, h: 156, text: 'Supabase Postgres' },
      ],
      boxes: [
        { x: 40, y: 20, w: 230, text: 'React web app', sub: 'report: photo + GPS, vote' },
        { x: 430, y: 20, w: 190, text: 'Supabase Auth', sub: 'who is voting' },
        { x: 40, y: 135, w: 190, text: 'issues', sub: 'trigger: score → priority' },
        { x: 250, y: 135, w: 190, text: 'cast_verification_vote', sub: 'jury: reporter + affected' },
        { x: 460, y: 135, w: 160, text: 'notifications', sub: 'a row per status change' },
        { x: 40, y: 300, w: 240, text: 'Firebase Cloud Messaging', sub: 'FCM v1 API' },
        { x: 330, y: 300, w: 285, text: 'Edge Function · send-push', sub: 'looks up the citizen’s FCM token' },
      ],
      arrows: [
        { d: 'M270 47 H430', label: [350, 41, 'sign in'], anchor: 'middle' },
        { d: 'M110 74 V135', label: [117, 98, 'new report'] },
        { d: 'M230 74 L320 135', label: [280, 98, 'vote: fixed?'] },
        { d: 'M250 162 H230' },
        { d: 'M125 189 V228 H540 V189', label: [335, 222, 'status changed'], anchor: 'middle' },
        { d: 'M590 189 V300', label: [584, 284, 'webhook'], anchor: 'end' },
        { d: 'M330 327 H280' },
        { d: 'M40 327 H8 V40 H40', dashed: true, label: [14, 290, 'push'] },
      ],
      notes: [
        { x: 1, y: 89, text: 'an officer marks it Resolved → the jury votes: fixed or not?' },
      ],
    },
    excerpts: [
      { title: 'Priority set by the database', file: 'nivaran/priority_trigger.sql', lang: 'sql', source: 'Nivaran · supabase/migrations/20260328_priority_trigger.sql', why: 'Which report should an officer fix first? Instead of sorting in the app, a Postgres trigger turns upvotes and downvotes into a score from 0 to 100 and a priority from Low to Critical. Every app and every query sees the same priority, and nobody can skip the rule from the browser.' },
      { title: 'Push from the edge', file: 'nivaran/send-push.ts', lang: 'ts', source: 'Nivaran · supabase/functions/send-push/index.ts', why: 'A citizen should hear back when their report moves, without keeping the app open. Each status change writes a notification row, and a database webhook calls this Edge Function, which finds the citizen\'s FCM token and sends the push. The app never holds the Firebase server key.' },
      { title: 'Citizens verify the fix', file: 'nivaran/civic_resolution_engine.sql', lang: 'sql', source: 'Nivaran · supabase/migrations/20260327_civic_resolution_engine.sql', why: 'An officer marking a report Resolved does not mean the pothole is fixed. So the reporter and the affected citizens vote: more than half saying fixed verifies it, and half or more saying not fixed sends it back to In Progress. The vote count lives in one database function, so it is counted the same way every time.' },
    ],
    differently: [
      'The priority numbers (start at 42, +1.6 per upvote, -1.1 per downvote) are my best guess. I\'d keep them in a settings table and tune them with real reports.',
      'The push function does not check FCM\'s reply, so a dead token fails silently. I\'d read the reply and clear tokens that no longer work.',
    ],
    results: ['Reports carry a photo and GPS location', 'Priority and resolution logic lives in Postgres triggers and functions', 'The reporter and affected citizens vote on whether a resolved report is really fixed', 'Citizens get a push notification when their report changes status'],
    links: [],
  },
  {
    slug: 'prometheus',
    title: 'Prometheus: Expense Tracker API',
    problem: 'I wanted one small API with the full production path around it: tests on every push, a versioned Docker image on every tag, metrics, and error tracking.',
    drawing: {
      viewBox: '0 0 640 500',
      label: 'Every push to main runs CI (ruff lint and format checks, pytest, and Postgres integration tests when a database is configured) and a CodeQL scan. A v* tag runs the release workflow: docker build, a smoke test on /health, then a push of :version and :latest images to GHCR and a GitHub Release. The FastAPI app (auth, transactions, categories and analytics routes) uses async SQLAlchemy on PostgreSQL with Alembic migrations, exposes Prometheus metrics at /metrics and reports errors to Sentry when a DSN is set. deploy/render.yaml is a blueprint that builds the same Dockerfile on Render with a /health check. A scheduled GitHub Actions workflow runs the budget check every day at 09:00 UTC: it reads the database and sends an alert for every budget over its limit.',
      frames: [
        { x: 10, y: 238, w: 620, h: 174, text: 'render.yaml: Render builds this' },
      ],
      boxes: [
        { x: 10, y: 20, w: 120, text: 'git push', sub: 'to main' },
        { x: 160, y: 20, w: 250, text: 'CI', sub: 'ruff · pytest · Postgres tests' },
        { x: 440, y: 20, w: 190, text: 'CodeQL', sub: 'security scan' },
        { x: 10, y: 130, w: 120, text: 'git tag v*', sub: 'release' },
        { x: 160, y: 130, w: 135, text: 'docker build', sub: 'uv, non-root' },
        { x: 320, y: 130, w: 130, text: 'smoke test', sub: 'GET /health' },
        { x: 475, y: 130, w: 155, text: 'GHCR', sub: ':v1.x + :latest' },
        { x: 210, y: 270, w: 190, text: 'FastAPI app', sub: 'auth · transactions' },
        { x: 430, y: 270, w: 190, text: 'PostgreSQL', sub: 'async SQLAlchemy' },
        { x: 30, y: 270, w: 150, text: '/metrics', sub: 'Prometheus format' },
        { x: 210, y: 350, w: 190, text: 'Sentry', sub: 'when a DSN is set' },
        { x: 430, y: 438, w: 200, text: 'Budget check', sub: 'Actions cron · daily 09:00', dashed: true },
      ],
      arrows: [
        { d: 'M130 47 H160' },
        { d: 'M70 20 V10 H535 V20' },
        { d: 'M130 157 H160' },
        { d: 'M295 157 H320' },
        { d: 'M450 157 H475' },
        { d: 'M552 184 V214 H305 V270', dashed: true, label: [430, 208, 'same Dockerfile runs the app'], anchor: 'middle' },
        { d: 'M400 297 H430' },
        { d: 'M210 297 H180' },
        { d: 'M305 324 V350' },
        { d: 'M530 438 V324', dashed: true, label: [522, 386, 'over limit? alert'], anchor: 'end' },
      ],
      notes: [
        { x: 3, y: 40, text: 'every tag is a deployable image' },
      ],
    },
    excerpts: [
      { title: 'A lean, non-root container', file: 'prometheus/Dockerfile', lang: 'dockerfile', source: 'prometheus · Dockerfile', why: 'The image should rebuild fast and run safely. Dependencies install in their own layer, so a code change does not reinstall everything, and the app runs as a non-root user.', href: 'https://github.com/patelaryandev/prometheus/blob/main/Dockerfile' },
      { title: 'Release on tag', file: 'prometheus/release.yml', lang: 'yaml', source: 'prometheus · .github/workflows/release.yml', why: 'A release should be one command: push a version tag. The workflow builds the image, starts it and checks /health, and only then pushes it to GHCR and creates the GitHub Release. A broken image never gets published.', href: 'https://github.com/patelaryandev/prometheus/blob/main/.github/workflows/release.yml' },
      { title: 'Metrics and errors wired in', file: 'prometheus/main.py', lang: 'python', source: 'prometheus · app/main.py', why: 'When something breaks in production, I want to know before a user tells me. The app exposes Prometheus metrics at /metrics, and Sentry starts only when a DSN is set, so local runs need no setup.', href: 'https://github.com/patelaryandev/prometheus/blob/main/app/main.py' },
    ],
    differently: [
      'The container health check calls curl, which the slim Python image does not include. I\'d use a small Python check instead.',
      'The Dockerfile pulls uv:latest, so two builds of the same tag can differ. I\'d pin the uv version.',
      'The Sentry release step is still a placeholder. I\'d wire in sentry-cli so every error links to its release.',
    ],
    results: ['CI, CodeQL and a release workflow on GitHub Actions', 'Versioned images on GHCR', 'Deploy blueprint for Render included'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/patelaryandev/prometheus' }],
  },
];
