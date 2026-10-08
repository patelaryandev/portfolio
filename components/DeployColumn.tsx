// "my deploys": drawn from build.json, so CI adds a box without a redesign.
const X = 196, W = 132, H = 40, TOP = 26, GAP = 100, DEST_Y = 226;

export function deployLayout(steps: string[]) {
  const boxes = steps.slice(0, 3).map((label, i) => ({ y: TOP + GAP * i, label }));
  const arrows = boxes.slice(1).map((b) => `M262 ${b.y - GAP + H} V${b.y}`);
  const last = boxes[boxes.length - 1];
  arrows.push(last.y === DEST_Y ? `M${X} ${DEST_Y + H / 2} H152` : `M262 ${last.y + H} V${DEST_Y + H / 2} H152`);
  return { boxes, arrows };
}

export function DeployColumn({ steps }: { steps: string[] }) {
  const { boxes, arrows } = deployLayout(steps);
  return (
    <g>
      {boxes.map((b) => (
        <g key={b.label}>
          <rect x={X} y={b.y} width={W} height={H} fill="var(--paper)" strokeDasharray="4 3" />
          <text x={X + 14} y={b.y + 25}>{b.label}</text>
        </g>
      ))}
      {arrows.map((d) => <path key={d} d={d} strokeDasharray="4 3" markerEnd="url(#ar)" />)}
    </g>
  );
}
