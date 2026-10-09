import type { Metadata, Viewport } from 'next';
import { fontVars } from './fonts';
import { Nav } from '@/components/Nav';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://patelaryan.dev'),
  title: { default: 'Aryan Patel · Full-Stack & DevOps Engineer', template: '%s · Aryan Patel' },
  description: 'Full-Stack & DevOps Engineer. I build web apps in React and the pipelines that put them in production. Vice President, GFG Campus Body RKGIT.',
  openGraph: { type: 'website', url: 'https://patelaryan.dev', siteName: 'patelaryan.dev', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Aryan Patel, Full-Stack & DevOps Engineer' }] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F3F0E8' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body><Nav />{children}</body>
    </html>
  );
}
