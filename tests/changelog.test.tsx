import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Changelog, formatMonth } from '@/components/Changelog';

const item = { id: 'p', title: 'Prometheus', summary: 'Expense Tracker API', date: '2026-08-14', kind: 'project' as const, stack: [], page: 'prometheus' as const, version: 'v4.7.0' };

describe('Changelog', () => {
  it('formats months', () => expect(formatMonth('2025-06')).toBe('Jun 2025'));
  it('links rows that have a page and shows the version', () => {
    const html = renderToStaticMarkup(<Changelog items={[item]} />);
    expect(html).toContain('href="/work/prometheus"');
    expect(html).toContain('v4.7.0');
    expect(html).toContain('Aug 2026');
  });
  it('shows "current" for ongoing work', () => {
    expect(renderToStaticMarkup(<Changelog items={[{ ...item, status: 'current' }]} />)).toContain('current');
  });
});
