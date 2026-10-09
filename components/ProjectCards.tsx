import Link from 'next/link';
import { cards, type Card } from '@/content/cards';
import { formatMonth } from './Changelog';

type Item = { id: string; title: string; version: string; date: string; status?: 'current' };

function Thumb({ mini }: { mini: Card['mini'] }) {
  return (
    <svg className="diag mini" viewBox="0 0 300 190" fill="none" stroke="var(--blue-ink)" strokeWidth="1.4">
      <defs><marker id="mar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="var(--blue-ink)" /></marker></defs>
      {mini.boxes.map((b) => (
        <g key={b.text}>
          <rect x={b.x} y={b.y} width={b.w} height="34" fill="var(--paper)" strokeDasharray={b.dashed ? '4 3' : undefined} />
          <text x={b.x + b.w / 2} y={b.y + 22} textAnchor="middle">{b.text}</text>
        </g>
      ))}
      {mini.arrows.map((a) => <path key={a.d} d={a.d} strokeDasharray={a.dashed ? '4 3' : undefined} markerEnd="url(#mar)" />)}
    </svg>
  );
}

export function ProjectCards({ items, pens }: { items: Item[]; pens: Record<string, string | undefined> }) {
  return (
    <ul className="cards">
      {cards.map((c) => {
        const it = items.find((i) => i.id === c.id);
        if (!it) return null;
        return (
          <li className="card" key={c.id}>
            <div className="thumb grid" aria-hidden="true"><Thumb mini={c.mini} /></div>
            <div className="body">
              <div className="head">
                <h3><Link href={`/work/${c.id}`}>{it.title}</Link></h3>
                <span className="meta"><span className="v">{it.version}</span> · {it.status === 'current' ? 'current' : formatMonth(it.date)}</span>
              </div>
              <p>{c.line}</p>
              <ul className="tags">{c.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              <div className="foot">
                <span className="go">Read case study →</span>
                {c.ext ? <a className="ext" href={c.ext.href}>{c.ext.label}</a> : null}
                {pens[c.id] ? <span className="pen">← {pens[c.id]}</span> : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
