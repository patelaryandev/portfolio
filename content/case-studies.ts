import type { DrawingSpec } from './drawing-types';
export type { DrawingSpec } from './drawing-types';

export type Excerpt = {
  title: string; file: string;
  lang: 'js' | 'ts' | 'tsx' | 'sql' | 'python' | 'dockerfile' | 'yaml';
  source: string; note: string;
};

export type CaseStudy = {
  slug: 'gfg-rkgit' | 'nivaran' | 'prometheus';
  title: string; problem: string; drawing: DrawingSpec;
  excerpts: Excerpt[]; results: string[]; links: { label: string; href: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'gfg-rkgit',
    title: 'GFG RKGIT platform',
    problem: 'Our GFG Campus Body runs events, registrations and attendance for 300+ members. A club platform has to outlive the students who built it, so I made the browser untrusted: admin actions and form submissions go through one API that checks who you are, and Firestore rules limit what the browser can write directly.',
    drawing: {
      viewBox: '0 0 640 290',
      label: 'Three React apps (public site, admin portal, team portal) call one Cloudflare Worker API at api.gfg.rkgit.in, which uses Firestore with security rules, KV for token keys and rate limits, and R2 for media.',
      boxes: [
        { x: 20, y: 20, w: 180, text: 'Public site (React)' },
        { x: 230, y: 20, w: 180, text: 'Admin portal (React)' },
        { x: 440, y: 20, w: 180, text: 'Team portal (React)' },
        { x: 170, y: 120, w: 300, text: 'Worker API · api.gfg.rkgit.in' },
        { x: 20, y: 220, w: 180, text: 'Firestore + rules' },
        { x: 230, y: 220, w: 180, text: 'KV · keys, rate limits' },
        { x: 440, y: 220, w: 180, text: 'R2 · photos' },
      ],
      arrows: [
        { d: 'M110 60 L250 120' }, { d: 'M320 60 V120' }, { d: 'M530 60 L390 120' },
        { d: 'M250 160 L110 220' }, { d: 'M320 160 V220' }, { d: 'M390 160 L530 220' },
      ],
      notes: [{ x: 2, y: 91, text: 'cron: graduates archived every 1 June' }],
    },
    excerpts: [
      { title: 'Admin requests prove who you are', file: 'gfg/auth.js', lang: 'js', source: 'gfg-rkgit-worker · src/middleware/auth.js', note: 'Firebase ID token checked in the Worker, keys cached in KV' },
      { title: 'Rules for what the browser may write directly', file: 'gfg/firestore.rules', lang: 'js', source: 'gfg-rkgit-infra · firestore.rules', note: 'the repo has an emulator test suite for these rules' },
      { title: 'Access that expires on its own', file: 'gfg/revoke-scanner-access.js', lang: 'js', source: 'gfg-rkgit-worker · src/scheduled/revoke-scanner-access.js', note: 'a daily cron removes event-scanner access' },
    ],
    results: ['Used by 300+ members of GFG Campus Body RKGIT', 'Form submissions through the Worker need a sign-in and are rate-limited per user: 3 feedback submissions per form and 1 career application a day', 'Admin actions need a token and an active admin record'],
    links: [],
  },
  {
    slug: 'nivaran',
    title: 'Nivaran',
    problem: 'Potholes, garbage and broken streetlights get reported in WhatsApp groups and forgotten. Nivaran lets a citizen report one with a photo and their GPS location, and the database itself ranks it.',
    drawing: {
      viewBox: '0 0 640 290',
      label: 'A React web app writes reports to Supabase Postgres, where triggers set priority and votes from the reporter and affected citizens verify fixes. An Edge Function sends push notifications through Firebase Cloud Messaging back to the app.',
      boxes: [
        { x: 230, y: 20, w: 180, text: 'React web app' },
        { x: 170, y: 120, w: 300, text: 'Supabase Postgres + triggers' },
        { x: 80, y: 220, w: 220, text: 'Edge Function · send-push' },
        { x: 340, y: 220, w: 240, text: 'Firebase Cloud Messaging' },
      ],
      arrows: [
        { d: 'M320 60 V120' }, { d: 'M280 160 L190 220' }, { d: 'M300 240 H340' },
        { d: 'M460 220 Q 610 140 410 40', dashed: true },
      ],
      notes: [{ x: 2, y: 44, text: 'photo + GPS in, push out' }],
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
      viewBox: '0 0 640 230',
      label: 'git tag triggers GitHub Actions, which builds a Docker image, smoke-tests its health endpoint and pushes it to GHCR. The FastAPI app runs with async SQLAlchemy on PostgreSQL, exposes Prometheus metrics and reports errors to Sentry.',
      boxes: [
        { x: 10, y: 20, w: 130, text: 'git tag v*' },
        { x: 165, y: 20, w: 140, text: 'GitHub Actions', dashed: true },
        { x: 330, y: 20, w: 140, text: 'smoke /health' },
        { x: 495, y: 20, w: 135, text: 'GHCR image' },
        { x: 165, y: 150, w: 140, text: 'FastAPI app' },
        { x: 330, y: 150, w: 140, text: 'PostgreSQL' },
        { x: 10, y: 150, w: 130, text: '/metrics' },
        { x: 495, y: 150, w: 135, text: 'Sentry' },
      ],
      arrows: [
        { d: 'M140 40 H165' }, { d: 'M305 40 H330' }, { d: 'M470 40 H495' },
        { d: 'M562 60 V88 H235 V150', dashed: true },
        { d: 'M305 170 H330' }, { d: 'M165 170 H140' }, { d: 'M235 190 V212 H562 V190' },
      ],
      notes: [{ x: 40, y: 45, text: 'every tag is a deployable image' }],
    },
    excerpts: [
      { title: 'A container that checks itself', file: 'prometheus/Dockerfile', lang: 'dockerfile', source: 'prometheus · Dockerfile', note: 'dependencies in their own cached layer, a non-root user and a /health check' },
      { title: 'Release on tag', file: 'prometheus/release.yml', lang: 'yaml', source: 'prometheus · .github/workflows/release.yml', note: 'smoke-tests the container before pushing' },
      { title: 'Metrics and errors wired in', file: 'prometheus/main.py', lang: 'python', source: 'prometheus · app/main.py', note: 'Prometheus metrics wired into the app; Sentry starts when a DSN is configured' },
    ],
    results: ['CI, CodeQL and a release workflow on GitHub Actions', 'Versioned images on GHCR', 'Deploy blueprint for Render included'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/witharyan/prometheus' }],
  },
];
