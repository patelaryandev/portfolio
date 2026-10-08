export type DayCount = { day: string; count: number };

// One record holds only today's count, so a new UTC day starts over at 1.
export function nextCount(stored: DayCount | undefined, day: string): DayCount {
  return stored?.day === day ? { day, count: stored.count + 1 } : { day, count: 1 };
}
