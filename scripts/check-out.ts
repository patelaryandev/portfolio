// scripts/check-out.ts — scan every built file; fail the build on a hit.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { scanText } from '../lib/scan.ts';

const TEXT = /\.(html|txt|js|css|json|xml|svg)$/;
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? files(join(dir, d.name)) : [join(dir, d.name)]));

const hits = files('out').filter((f) => TEXT.test(f)).flatMap((f) => scanText(readFileSync(f, 'utf8')).map((r) => `${f}: ${r}`));
if (hits.length) {
  console.error('check-out: blocked\n' + hits.join('\n'));
  process.exit(1);
}
console.log('check-out: clean');
