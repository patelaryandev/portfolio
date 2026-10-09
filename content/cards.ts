// The three project cards on the home page. The thumbnail is the case-study drawing cut down to a few short words.
export type MiniBox = { x: number; y: number; w: number; text: string; dashed?: boolean };
export type MiniArrow = { d: string; dashed?: boolean };
export type Card = {
  id: 'gfg-rkgit' | 'prometheus' | 'nivaran';
  line: string; tags: string[]; ext?: { label: string; href: string };
  mini: { boxes: MiniBox[]; arrows: MiniArrow[] };
};

export const cards: Card[] = [
  {
    id: 'gfg-rkgit',
    line: 'The platform our GFG Campus Body runs on: 3 React apps on one Cloudflare Worker API.',
    tags: ['React', 'Cloudflare Workers', 'KV', 'R2', 'Firestore'],
    ext: { label: 'Live site ↗', href: 'https://gfg.rkgit.in' },
    mini: {
      boxes: [
        { x: 5, y: 10, w: 90, text: 'Public' }, { x: 105, y: 10, w: 90, text: 'Admin' }, { x: 205, y: 10, w: 90, text: 'Team' },
        { x: 75, y: 78, w: 150, text: 'Worker API' },
        { x: 5, y: 146, w: 90, text: 'Firestore' }, { x: 105, y: 146, w: 90, text: 'KV' }, { x: 205, y: 146, w: 90, text: 'R2' },
      ],
      arrows: [{ d: 'M50 44 L120 78' }, { d: 'M150 44 V78' }, { d: 'M250 44 L180 78' }, { d: 'M120 112 L50 146' }, { d: 'M150 112 V146' }, { d: 'M180 112 L250 146' }],
    },
  },
  {
    id: 'prometheus',
    line: 'Expense Tracker API with the full production path: CI, tagged Docker releases, metrics, Sentry.',
    tags: ['FastAPI', 'PostgreSQL', 'Docker', 'GitHub Actions', 'GHCR'],
    ext: { label: 'Code ↗', href: 'https://github.com/patelaryandev/prometheus' },
    mini: {
      boxes: [
        { x: 5, y: 10, w: 80, text: 'git tag' }, { x: 105, y: 10, w: 90, text: 'Actions', dashed: true }, { x: 215, y: 10, w: 80, text: 'GHCR' },
        { x: 5, y: 78, w: 80, text: '/metrics' }, { x: 105, y: 78, w: 90, text: 'FastAPI' }, { x: 215, y: 78, w: 80, text: 'Postgres' },
        { x: 105, y: 146, w: 90, text: 'Sentry' },
      ],
      arrows: [{ d: 'M85 27 H105' }, { d: 'M195 27 H215' }, { d: 'M255 44 V61 H150 V78', dashed: true }, { d: 'M105 95 H85' }, { d: 'M195 95 H215' }, { d: 'M150 112 V146' }],
    },
  },
  {
    id: 'nivaran',
    line: 'Report a civic issue with a photo and GPS; the database ranks it and citizens verify the fix.',
    tags: ['React', 'Supabase', 'PostgreSQL', 'FCM'],
    mini: {
      boxes: [
        { x: 90, y: 10, w: 120, text: 'Web app' }, { x: 45, y: 78, w: 210, text: 'Supabase + triggers' },
        { x: 5, y: 146, w: 120, text: 'Edge Function' }, { x: 175, y: 146, w: 120, text: 'FCM' },
      ],
      arrows: [{ d: 'M150 44 V78' }, { d: 'M120 112 L65 146' }, { d: 'M125 163 H175' }, { d: 'M245 146 Q 296 80 210 27', dashed: true }],
    },
  },
];
