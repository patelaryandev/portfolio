// lib/scan.ts — things that must never ship (spec §2).
const RULES: [string, RegExp][] = [
  ['phone', /(?<![\w.])(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?!\w)/],
  ['old-nivaran-repo', /(?:witharyan|patelaryandev)\/Nivaran(?![A-Za-z])/],
  ['flutter', /\bFlutter\b/i],
  ['dart', /\bDart\b/],
  ['ported', /\bported\b/i],
  ['react-native', /\bReact[\s-]?Native\b/i],
  ['mobile-app', /\bmobile app\b/i],
  ['tech-head', /\bTech Head\b/i],
];

// Numbers written with any spaces, hyphens or dots between digits.
const PHONE_LOOSE = /(?<!\d)(?:91)?[6-9]\d{9}(?!\d)/;
const looseHit = (text: string) => PHONE_LOOSE.test(text.replace(/(?<=\d)[\s.-]+(?=\d)/g, ''));

export const scanText = (text: string) =>
  RULES.filter(([name, re]) => re.test(text) || (name === 'phone' && looseHit(text))).map(([name]) => name);
