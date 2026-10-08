// scripts/weigh.ts — measure what the homepage really ships; fail the build over the JS budget.
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { JS_BUDGET, assetsOf, overBudget, type Weight } from '../lib/weight.ts';

const gz = (path: string) => gzipSync(readFileSync(`out${path}`), { level: 9 }).length;
const sum = (paths: string[]) => paths.reduce((n, p) => n + gz(p), 0);

const html = readFileSync('out/index.html', 'utf8');
const a = assetsOf(html);
const w: Weight = { measured: true, page: '/', html: gz('/index.html'), css: sum(a.css), js: sum(a.js), fonts: sum(a.fonts), total: 0, budgetJs: JS_BUDGET };
w.total = w.html + w.css + w.js + w.fonts;

if (overBudget(w.js)) {
  console.error(`weigh: homepage JS is ${(w.js / 1024).toFixed(1)} KB gz, over the ${JS_BUDGET / 1024} KB budget`);
  process.exit(1);
}

if (process.argv.includes('--verify')) {
  const prev = JSON.parse(readFileSync('content/weight.json', 'utf8'));
  if (JSON.stringify(prev) !== JSON.stringify(w)) {
    console.error('weigh: homepage changed between passes', prev, w);
    process.exit(1);
  }
  console.log('weigh: verified');
} else {
  writeFileSync('content/weight.json', JSON.stringify(w, null, 2) + '\n');
  console.log(`weigh: ${(w.total / 1024).toFixed(1)} KB gz total, JS ${(w.js / 1024).toFixed(1)} KB`);
}
