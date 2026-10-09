// components/Drawing.tsx — a hand-drawn-style architecture sheet with real, selectable text.
import type { DrawingSpec } from '@/content/case-studies';

export function Drawing({ spec }: { spec: DrawingSpec }) {
  return (
    <div className="drawing grid">
      <svg className="diag" viewBox={spec.viewBox} fill="none" stroke="var(--blue-ink)" strokeWidth="1.4" role="img" aria-label={spec.label}>
        <defs><marker id="dar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="var(--blue-ink)" /></marker></defs>
        {spec.frames?.map((f) => (
          <g key={f.text}>
            <rect className="frame" x={f.x} y={f.y} width={f.w} height={f.h} strokeDasharray="6 4" />
            <text className="frame-l" x={f.x + f.w - 10} y={f.y + 16} textAnchor="end">{f.text}</text>
          </g>
        ))}
        {spec.boxes.map((b) => (
          <g key={b.text}>
            <rect x={b.x} y={b.y} width={b.w} height={b.sub ? 54 : 40} fill="var(--paper)" strokeDasharray={b.dashed ? '4 3' : undefined} />
            <text x={b.x + 12} y={b.y + (b.sub ? 23 : 25)}>{b.text}</text>
            {b.sub ? <text className="sub" x={b.x + 12} y={b.y + 41}>{b.sub}</text> : null}
          </g>
        ))}
        {spec.arrows.map((a) => (
          <g key={a.d}>
            <path d={a.d} strokeDasharray={a.dashed ? '4 3' : undefined} markerEnd="url(#dar)" />
            {a.label ? <text className="al" x={a.label[0]} y={a.label[1]} textAnchor={a.anchor ?? 'start'}>{a.label[2]}</text> : null}
          </g>
        ))}
      </svg>
      {spec.notes.map((n) => <span key={n.text} className="pen drawing-note" style={{ left: `${n.x}%`, top: `${n.y}%` }}>{n.text}</span>)}
    </div>
  );
}
