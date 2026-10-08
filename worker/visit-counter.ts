import { DurableObject } from 'cloudflare:workers';
import { nextCount, type DayCount } from './counter';

// One global instance. Durable Object storage is strongly consistent, so two
// visits at the same moment never overwrite each other's count.
export class VisitCounter extends DurableObject {
  async hit(day: string): Promise<number> {
    const next = nextCount(await this.ctx.storage.get<DayCount>('today'), day);
    await this.ctx.storage.put('today', next);
    return next.count;
  }
}
