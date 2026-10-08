// components/Drawing.tsx — a hand-drawn-style architecture sheet with real, selectable text.
import type { DrawingSpec } from '@/content/case-studies';

export function Drawing({ spec }: { spec: DrawingSpec }) {
  return (
    <div className="drawing grid">
      <svg className="diag" viewBox={spec.viewBox} fill="none" stroke="var(--blue-ink)" strokeWidth="1.4" role="img" aria-label={spec.label}>
        <defs><marker id="dar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="var(--blue-ink)" /></marker></defs>
        {spec.boxes.map((b) => (
          <g key={b.text}>
            <rect x={b.x} y={b.y} width={b.w} height="40" fill="var(--paper)" strokeDasharray={b.dashed ? '4 3' : undefined} />
            <text x={b.x + 12} y={b.y + 25}>{b.text}</text>
          </g>
        ))}
        {spec.arrows.map((a) => <path key={a.d} d={a.d} strokeDasharray={a.dashed ? '4 3' : undefined} markerEnd="url(#dar)" />)}
      </svg>
      {spec.notes.map((n) => <span key={n.text} className="pen drawing-note" style={{ left: `${n.x}%`, top: `${n.y}%` }}>{n.text}</span>)}
    </div>
  );
}
