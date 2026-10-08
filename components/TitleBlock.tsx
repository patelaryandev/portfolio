export function TitleBlock({ cells }: { cells: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="tblock">
      {cells.map((c) => <div key={c.label}>{c.label}<b>{c.value}</b></div>)}
    </div>
  );
}
