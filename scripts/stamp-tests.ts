// CI only, after the tests pass: adds the passed-test count to the stamp the Worker serves.
import { readFileSync, writeFileSync } from 'node:fs';
import { passedTests } from '../lib/stamp.ts';

const stamp = JSON.parse(readFileSync('content/build.json', 'utf8'));
stamp.tests = passedTests(JSON.parse(readFileSync('test-results/vitest.json', 'utf8')));
writeFileSync('content/build.json', JSON.stringify(stamp, null, 2) + '\n');
console.log(`stamp: ${stamp.tests} tests passed`);
