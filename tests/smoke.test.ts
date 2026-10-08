import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static export', () => {
  it('writes out/index.html with the name', () => {
    expect(existsSync('out/index.html')).toBe(true);
    expect(readFileSync('out/index.html', 'utf8')).toContain('Aryan Patel');
  });
});
