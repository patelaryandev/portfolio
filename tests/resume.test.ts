import { describe, expect, it } from 'vitest';
import { formatResumeDate } from '@/lib/resume';

describe('formatResumeDate', () => {
  it('writes day, short month and year', () => expect(formatResumeDate('2026-10-09T10:57:11+05:30')).toBe('9 Oct 2026'));
  it('drops the leading zero on the day', () => expect(formatResumeDate('2026-01-05T00:00:00Z')).toBe('5 Jan 2026'));
});
