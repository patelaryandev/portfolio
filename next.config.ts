import { readFileSync } from 'node:fs';
import type { NextConfig } from 'next';

// Same id for both build passes (page weight is measured by comparing them), new id per stamped build.
const buildId = () => {
  try { return String(JSON.parse(readFileSync('content/build.json', 'utf8')).time).replace(/\W/g, ''); }
  catch { return 'dev'; }
};

const config: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  generateBuildId: async () => buildId(),
};

export default config;
