import Link from 'next/link';
import type { Entry } from '@/content/projects';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatMonth = (date: string) => `${MONTHS[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`;

type Item = Entry & { version: string; github?: { stars: number; url: string } | null };

export function Changelog({ items, showPens = false }: { items: Item[]; showPens?: boolean }) {
  return (
    <ol className="log hover">
      {items.map((e) => {
        const title = e.page ? <Link className="stretch" href={`/work/${e.page}`}>{e.title}</Link>
          : e.url ? <a className="stretch" href={e.url}>{e.title}</a>
          : e.title;
        return (
          <li className="row" key={e.id}>
            <span className="v">{e.version}</span>
            <span>
              {title}: {e.summary}
              {showPens && e.pen ? <span className="pen row-pen">← {e.pen}</span> : null}
              {e.github ? <> · <a className="above" href={e.github.url}>code</a>{e.github.stars > 0 ? ` ★ ${e.github.stars}` : ''}</> : null}
            </span>
            <span className="d">{e.status === 'current' ? 'current' : formatMonth(e.date)}</span>
          </li>
        );
      })}
    </ol>
  );
}
