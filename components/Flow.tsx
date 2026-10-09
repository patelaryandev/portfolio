// "How this page reached you" as one top-to-bottom story: my push, the CI run, the edge, your browser.
// Drawn from build.json, so the numbers and links are whatever this build really did.
import type { BuildStamp } from '@/lib/stamp';

export const X = 12, W = 316, H = 44, GAP = 96, ARROW_X = 44;
export const tops = [8, 8 + GAP, 8 + GAP * 2, 8 + GAP * 3];

type Box = { y: number; label: string; detail: string; href: string | null; cls?: string };
type Arrow = { d: string; label: string; y: number };

export function flowLayout(stamp: BuildStamp, colo: string, tests: number | null) {
  const ci = stamp.via === 'github-actions';
  const boxes: Box[] = [
    { y: tops[0], label: stamp.steps[0], detail: stamp.sha, href: stamp.commitUrl ?? null },
    ci
      ? { y: tops[1], label: 'GitHub Actions', detail: tests ? `${tests} tests pass, then build` : 'tests, then build', href: stamp.runUrl }
      : { y: tops[1], label: 'wrangler deploy', detail: 'from my laptop', href: null },
    { y: tops[2], label: `Cloudflare · ${colo}`, detail: 'Worker + files', href: null, cls: 'edge' },
    { y: tops[3], label: 'Your browser', detail: 'you are here', href: null, cls: 'dest' },
  ];
  const labels = [
    ci ? 'on every push' : 'by hand',
    stamp.deploySeconds ? `push to live: ~${stamp.deploySeconds} s` : 'deploys to the edge',
    'round trip',
  ];
  const arrows: Arrow[] = labels.map((label, i) => ({
    d: `M${ARROW_X} ${tops[i] + H} V${tops[i + 1]}`, label, y: tops[i] + H + (GAP - H) / 2 + 4,
  }));
  return { boxes, arrows };
}

export function Flow({ stamp, colo, tests }: { stamp: BuildStamp; colo: string; tests: number | null }) {
  const { boxes, arrows } = flowLayout(stamp, colo, tests);
  return (
    <>
      {arrows.map((a) => (
        <g key={a.d}>
          <path d={a.d} markerEnd="url(#ar)" />
          <text className="al" x={ARROW_X + 12} y={a.y}>{a.label}</text>
        </g>
      ))}
      {boxes.map((b) => {
        const face = (
          <>
            <rect className={`face ${b.cls ?? ''}`} x={X} y={b.y} width={W} height={H} fill="var(--paper)" />
            <text x={X + 14} y={b.y + 27}>{b.label}</text>
            <text className="sub" x={X + W - 12} y={b.y + 27} textAnchor="end">{b.detail}{b.href ? ' ↗' : ''}</text>
          </>
        );
        return b.href ? (
          <a key={b.label} href={b.href} className="hit">
            <rect className="shadow" x={X + 3} y={b.y + 3} width={W} height={H} fill="var(--ink)" stroke="none" />
            <g className="lift">{face}</g>
          </a>
        ) : <g key={b.label}>{face}</g>;
      })}
    </>
  );
}
