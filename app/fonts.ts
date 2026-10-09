import localFont from 'next/font/local';

// Latin subsets from Google Fonts, kept in app/fonts/ so the build never fetches fonts.
// Each font's licence (SIL OFL 1.1) sits next to it. The size-matched fallback faces
// live in globals.css, with the values next/font/google used to generate, and each face
// declares font-stretch: 100% as Google's CSS did.
const Newsreader = localFont({
  src: [
    { path: './fonts/newsreader-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/newsreader-italic.woff2', weight: '400', style: 'italic' },
  ],
  declarations: [{ prop: 'font-stretch', value: '100%' }],
  variable: '--font-serif', display: 'swap', adjustFontFallback: false, fallback: ['Newsreader Fallback'],
});
const Schibsted_Grotesk = localFont({
  src: [
    { path: './fonts/schibsted-grotesk-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/schibsted-grotesk-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/schibsted-grotesk-normal.woff2', weight: '700', style: 'normal' },
  ],
  declarations: [{ prop: 'font-stretch', value: '100%' }],
  variable: '--font-sans', display: 'swap', adjustFontFallback: false, fallback: ['Schibsted Grotesk Fallback'],
});
const JetBrains_Mono = localFont({
  src: [
    { path: './fonts/jetbrains-mono-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jetbrains-mono-normal.woff2', weight: '500', style: 'normal' },
  ],
  declarations: [{ prop: 'font-stretch', value: '100%' }],
  variable: '--font-mono', display: 'swap', preload: false, adjustFontFallback: false, fallback: ['JetBrains Mono Fallback'],
});
const Archivo = localFont({
  src: [
    { path: './fonts/archivo-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/archivo-normal.woff2', weight: '600', style: 'normal' },
  ],
  declarations: [{ prop: 'font-stretch', value: '100%' }],
  variable: '--font-draft', display: 'swap', preload: false, adjustFontFallback: false, fallback: ['Archivo Fallback'],
});
const Reenie_Beanie = localFont({
  src: './fonts/reenie-beanie-normal.woff2', weight: '400', style: 'normal',
  declarations: [{ prop: 'font-stretch', value: '100%' }],
  variable: '--font-pencil', display: 'swap', preload: false, adjustFontFallback: false, fallback: ['Reenie Beanie Fallback'],
});

export const serif = Newsreader;
export const sans = Schibsted_Grotesk;
export const mono = JetBrains_Mono;
export const draft = Archivo;
export const pencil = Reenie_Beanie;

export const fontVars = [serif, sans, mono, draft, pencil].map((f) => f.variable).join(' ');
