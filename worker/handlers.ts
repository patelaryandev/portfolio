const NO_STORE = { 'cache-control': 'no-store' };

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...NO_STORE, ...headers } });

export const utcDay = (d: Date) => d.toISOString().slice(0, 10);

// The browser times this round trip. It never counts as a visit.
export function handlePing(req: Request): Response {
  if (req.method !== 'HEAD' && req.method !== 'GET') return json({ error: 'method not allowed' }, 405, { allow: 'GET, HEAD' });
  return new Response(null, { status: 204, headers: NO_STORE });
}

export async function handleVisit(
  req: Request,
  hit: (day: string) => Promise<number>,
  build: { sha: string; time: string },
  now = new Date(),
): Promise<Response> {
  if (req.method !== 'GET') return json({ error: 'method not allowed' }, 405, { allow: 'GET' });
  const colo = (req as Request & { cf?: { colo?: string } }).cf?.colo ?? null;
  let visitsToday: number | null = null;
  try {
    visitsToday = await hit(utcDay(now));
  } catch (err) {
    console.error('visit counter failed', err); // the panel shows "–"; the rest still works
  }
  return json({ colo, visitsToday, build });
}

export const notFound = () => json({ error: 'not found' }, 404);
