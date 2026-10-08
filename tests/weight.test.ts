// tests/weight.test.ts
import { describe, expect, it } from 'vitest';
import { JS_BUDGET, assetsOf, overBudget } from '@/lib/weight';

const html = `<html><head>
<link rel="stylesheet" href="/_next/static/css/a1.css" data-precedence="next"/>
<link rel="preload" href="/_next/static/media/f1.p.woff2" as="font" crossorigin="" type="font/woff2"/>
<script src="/_next/static/chunks/main-1.js" async=""></script>
<script src="/_next/static/chunks/main-1.js" async=""></script>
<script>self.__next_f.push([1,""])</script>
</head></html>`;

describe('assetsOf', () => {
  it('finds stylesheets, preloaded fonts and script files once each, ignoring inline scripts', () => {
    expect(assetsOf(html)).toEqual({
      css: ['/_next/static/css/a1.css'],
      fonts: ['/_next/static/media/f1.p.woff2'],
      js: ['/_next/static/chunks/main-1.js'],
    });
  });
});

describe('overBudget', () => {
  it('is false at the budget and true one byte over', () => {
    expect(overBudget(JS_BUDGET)).toBe(false);
    expect(overBudget(JS_BUDGET + 1)).toBe(true);
  });
});
