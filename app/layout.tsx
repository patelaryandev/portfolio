import type { Metadata, Viewport } from 'next';
import { fontVars } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://witharyan.tech'),
  title: { default: 'Aryan Patel · web developer & DevOps', template: '%s · Aryan Patel' },
  description: 'I build web apps in React and the pipelines that put them in production. Vice President, GFG Campus Body RKGIT.',
  openGraph: { type: 'website', url: 'https://witharyan.tech', siteName: 'witharyan.tech' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F3F0E8' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
