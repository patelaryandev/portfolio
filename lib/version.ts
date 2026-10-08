// Semester = version: 4th year, 7th semester → v4.7. Semester 1 began Aug 2023.
const FIRST_YEAR = 2023;

export function semesterOf(date: string): { year: number; sem: number } {
  const [y, m] = date.split('-').map(Number);
  const sem = m >= 8 ? (y - FIRST_YEAR) * 2 + 1 : (y - FIRST_YEAR) * 2;
  return { year: Math.ceil(sem / 2), sem };
}

export function withVersions<T extends { date: string }>(entries: T[]): (T & { version: string })[] {
  const oldestFirst = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const patches = new Map<number, number>();
  const versioned = oldestFirst.map((e) => {
    const { year, sem } = semesterOf(e.date);
    const patch = patches.get(sem) ?? 0;
    patches.set(sem, patch + 1);
    return { ...e, version: `v${year}.${sem}.${patch}` };
  });
  return versioned.reverse();
}

export function siteVersion(now: Date): string {
  const { year, sem } = semesterOf(now.toISOString().slice(0, 7));
  return `${year}.${sem}`;
}
