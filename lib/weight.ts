// lib/weight.ts
export const JS_BUDGET = 150 * 1024; // gzipped bytes for the homepage, React runtime included

export type Weight = { measured: true; page: '/'; html: number; css: number; js: number; fonts: number; total: number; budgetJs: number };

const uniq = (xs: string[]) => [...new Set(xs)];
const attrs = (html: string, re: RegExp) => uniq([...html.matchAll(re)].map((m) => m[1]));

export function assetsOf(html: string) {
  return {
    css: attrs(html, /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g),
    fonts: attrs(html, /<link[^>]+rel="preload"[^>]+href="([^"]+)"[^>]+as="font"/g),
    // noModule scripts are the legacy-browser polyfill bundle; modern browsers never download it
    js: attrs(html, /<script(?![^>]*\bnoModule\b)[^>]+src="([^"]+)"/g),
  };
}

export const overBudget = (jsBytes: number) => jsBytes > JS_BUDGET;
