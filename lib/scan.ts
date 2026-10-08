// lib/scan.ts — things that must never ship (spec §2).
const RULES: [string, RegExp][] = [
  ['phone', /(?<![\w.])(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?!\w)/],
  ['old-nivaran-repo', /witharyan\/Nivaran(?![A-Za-z])/],
  ['flutter', /\bFlutter\b/i],
  ['dart', /\bDart\b/],
  ['ported', /\bported\b/i],
  ['tech-head', /\bTech Head\b/i],
];

export const scanText = (text: string) => RULES.filter(([, re]) => re.test(text)).map(([name]) => name);
