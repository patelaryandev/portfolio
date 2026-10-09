import localFont from 'next/font/local';

// Latin subsets from Google Fonts, kept in app/fonts/ so the build never fetches fonts.
// Each font's licence (SIL OFL 1.1) sits next to it.
const Newsreader = localFont({
  src: [
    { path: './fonts/newsreader-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/newsreader-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-serif', display: 'swap', adjustFontFallback: 'Times New Roman',
});
const Schibsted_Grotesk = localFont({
  src: [
    { path: './fonts/schibsted-grotesk-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/schibsted-grotesk-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/schibsted-grotesk-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans', display: 'swap',
});
const JetBrains_Mono = localFont({
  src: [
    { path: './fonts/jetbrains-mono-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jetbrains-mono-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono', display: 'swap', preload: false,
});
const Archivo = localFont({
  src: [
    { path: './fonts/archivo-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/archivo-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-draft', display: 'swap', preload: false,
});
const Reenie_Beanie = localFont({
  src: './fonts/reenie-beanie-normal.woff2', weight: '400', style: 'normal',
  variable: '--font-pencil', display: 'swap', preload: false,
});

export const serif = Newsreader;
export const sans = Schibsted_Grotesk;
export const mono = JetBrains_Mono;
export const draft = Archivo;
export const pencil = Reenie_Beanie;

export const fontVars = [serif, sans, mono, draft, pencil].map((f) => f.variable).join(' ');
