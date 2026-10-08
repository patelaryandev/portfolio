import { Archivo, JetBrains_Mono, Newsreader, Reenie_Beanie, Schibsted_Grotesk } from 'next/font/google';

export const serif = Newsreader({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
export const sans = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-sans', display: 'swap' });
export const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap', preload: false });
export const draft = Archivo({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-draft', display: 'swap', preload: false });
export const pencil = Reenie_Beanie({ subsets: ['latin'], weight: '400', variable: '--font-pencil', display: 'swap', preload: false });

export const fontVars = [serif, sans, mono, draft, pencil].map((f) => f.variable).join(' ');
