import build from '../content/build.json';
import { handlePing, handleVisit, notFound } from './handlers';
import type { VisitCounter } from './visit-counter';

export { VisitCounter } from './visit-counter';

interface Env {
  ASSETS: Fetcher;
  VISIT_COUNTER: DurableObjectNamespace<VisitCounter>;
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/ping') return handlePing(request);
    if (pathname === '/api/visit') {
      const counter = env.VISIT_COUNTER.get(env.VISIT_COUNTER.idFromName('global'));
      return handleVisit(request, (day) => counter.hit(day), { sha: build.sha, time: build.time });
    }
    if (pathname.startsWith('/api/')) return notFound();
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
