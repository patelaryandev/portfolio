import type { DrawingSpec } from './drawing-types';
export type { DrawingSpec } from './drawing-types';

export type Excerpt = {
  title: string; file: string;
  lang: 'js' | 'ts' | 'tsx' | 'sql' | 'python' | 'dockerfile' | 'yaml';
  source: string; note: string;
};

export type CaseStudy = {
  slug: 'gfg-rkgit' | 'nivaran' | 'prometheus';
  title: string; live?: { label: string; href: string }; problem: string; drawing: DrawingSpec;
  excerpts: Excerpt[]; results: string[]; links: { label: string; href: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'gfg-rkgit',
    title: 'GFG RKGIT platform',
    live: { label: 'Live site: gfg.rkgit.in ↗', href: 'https://gfg.rkgit.in' },
    problem: 'Our GFG Campus Body runs events, registrations and attendance for 300+ members. A club platform has to outlive the students who built it, so I made the browser untrusted: every app, the public site included, goes through one API that checks who you are before anything reaches the database.',
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
      { title: 'Admin requests prove who you are', file: 'gfg/auth.js', lang: 'js', source: 'gfg-rkgit-worker · src/middleware/auth.js', note: 'Firebase ID token checked in the Worker, keys cached in KV' },
      { title: 'Firestore rules, a second lock behind the API', file: 'gfg/firestore.rules', lang: 'js', source: 'gfg-rkgit-infra · firestore.rules', note: 'the repo has an emulator test suite for these rules' },
      { title: 'Access that expires on its own', file: 'gfg/revoke-scanner-access.js', lang: 'js', source: 'gfg-rkgit-worker · src/scheduled/revoke-scanner-access.js', note: 'a daily cron removes event-scanner access' },
    ],
    results: ['Used by 300+ members of GFG Campus Body RKGIT', 'Admin actions need a token and an active admin record'],
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
      { title: 'Priority set by the database', file: 'nivaran/priority_trigger.sql', lang: 'sql', source: 'Nivaran · supabase/migrations/20260328_priority_trigger.sql', note: 'a trigger scores each report from its upvotes and downvotes and sets the priority' },
      { title: 'Push from the edge', file: 'nivaran/send-push.ts', lang: 'ts', source: 'Nivaran · supabase/functions/send-push/index.ts', note: 'sends an FCM push for each new notification row' },
      { title: 'Citizens verify the fix', file: 'nivaran/civic_resolution_engine.sql', lang: 'sql', source: 'Nivaran · supabase/migrations/20260327_civic_resolution_engine.sql', note: 'the reporter and affected citizens vote; more than half saying fixed verifies it, half or more saying not fixed sends it back to In Progress' },
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
      { title: 'A lean, non-root container', file: 'prometheus/Dockerfile', lang: 'dockerfile', source: 'prometheus · Dockerfile', note: 'dependencies in their own cached layer, and a non-root user' },
      { title: 'Release on tag', file: 'prometheus/release.yml', lang: 'yaml', source: 'prometheus · .github/workflows/release.yml', note: 'a version tag triggers the build and push to GHCR' },
      { title: 'Metrics and errors wired in', file: 'prometheus/main.py', lang: 'python', source: 'prometheus · app/main.py', note: 'Prometheus metrics wired into the app; Sentry starts when a DSN is configured' },
    ],
    results: ['CI, CodeQL and a release workflow on GitHub Actions', 'Versioned images on GHCR', 'Deploy blueprint for Render included'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/patelaryandev/prometheus' }],
  },
];
