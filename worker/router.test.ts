import { describe, expect, it, vi } from 'vitest';
import worker from './index';

vi.mock('cloudflare:workers', () => ({ DurableObject: class {} }));

const hit = vi.fn().mockResolvedValue(3);
const assets = vi.fn().mockResolvedValue(new Response('asset'));
const env = {
  ASSETS: { fetch: assets },
  VISIT_COUNTER: { idFromName: () => 'id', get: () => ({ hit }) },
} as never;
const call = (path: string, method = 'GET') =>
  worker.fetch(new Request(`https://patelaryan.dev${path}`, { method }) as never, env);

describe('worker router', () => {
  it('GET /api/visit dispatches to visit', async () => {
    const res = await call('/api/visit');
    expect(res.status).toBe(200);
    expect(((await res.json()) as { visitsToday: number }).visitsToday).toBe(3);
    expect(hit).toHaveBeenCalledOnce();
  });
  it('HEAD /api/ping returns 204', async () => expect((await call('/api/ping', 'HEAD')).status).toBe(204));
  it('unknown /api/foo returns JSON 404', async () => {
    const res = await call('/api/foo');
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toContain('json');
  });
  it('other paths go to assets', async () => {
    await call('/work');
    expect(assets).toHaveBeenCalledOnce();
  });
});
