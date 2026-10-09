export type Entry = {
  id: string; title: string; summary: string;
  date: string;                    // YYYY-MM or YYYY-MM-DD; sets the version
  status?: 'current';
  kind: 'project' | 'win';
  stack: string[];
  repo?: string;                   // public repo name under patelaryandev, used as the GitHub allowlist
  page?: 'gfg-rkgit' | 'nivaran' | 'prometheus';
  featured?: boolean;              // shown on the homepage
  pen?: string;                    // optional pencil note, at most 2 on a screen
};

export const entries: Entry[] = [
  { id: 'gfg-rkgit', title: 'GFG RKGIT platform', summary: '3 React apps, one Cloudflare Worker API', date: '2026-09-29', status: 'current', kind: 'project',
    stack: ['React', 'Cloudflare Workers', 'KV', 'R2', 'Firebase Auth', 'Firestore'], page: 'gfg-rkgit', featured: true, pen: '300+ members use it' },
  { id: 'prometheus', title: 'Prometheus', summary: 'Expense Tracker API: FastAPI, Docker, GHCR releases, Sentry', date: '2026-08-14', kind: 'project',
    stack: ['FastAPI', 'PostgreSQL', 'Docker', 'GitHub Actions', 'GHCR', 'Prometheus metrics', 'Sentry'], repo: 'prometheus', page: 'prometheus', featured: true },
  { id: 'nivaran', title: 'Nivaran', summary: 'Report a civic issue with a photo and GPS; the city sees it ranked', date: '2026-04-01', kind: 'project',
    stack: ['React', 'Supabase', 'PostgreSQL', 'Firebase Cloud Messaging'], page: 'nivaran', featured: true },
  { id: 'clubs-rkgit', title: 'clubs.rkgit.in', summary: 'Directory of every RKGIT club, kept in one JSON file that non-developers can edit', date: '2026-09-14', kind: 'project',
    stack: ['Astro', 'Cloudflare Pages', 'GitHub Actions'], repo: 'clubs-rkgit' },
  { id: 'vyapari', title: 'Vyapari Copilot', summary: 'AI assistant for kirana stores: scan to stock, barcode billing', date: '2025-11-23', kind: 'project',
    stack: ['JavaScript', 'Gemini', 'Google Vision'], repo: 'vyapari', featured: true },
  { id: 'qr-attendance', title: 'QR attendance', summary: 'QR-code attendance for the college ERP', date: '2025-11-04', kind: 'project', stack: ['JavaScript'] },
  { id: 'techtrix', title: "Techtrix '25: 1st place", summary: 'National hackathon at ITS Engineering College, 100+ teams', date: '2025-06', kind: 'win', stack: [], featured: true, pen: 'my first hackathon' },
  { id: 'srijan', title: 'SRIJAN 2025: 3rd prize', summary: 'ECE RKGIT project exhibition, with a cash award', date: '2025-04', kind: 'win', stack: [], featured: true },
  { id: 'binary-hacks', title: 'Binary Hacks 3.0: 2nd place', summary: 'Intra-college hackathon with team Log4J', date: '2025-06', kind: 'win', stack: [] },
];
