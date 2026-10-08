import type { Metadata } from 'next';
import Link from 'next/link';
import { Changelog } from '@/components/Changelog';
import { entries } from '@/content/projects';
import { attachRepos, loadRepos } from '@/lib/github';
import { withVersions } from '@/lib/version';

export const metadata: Metadata = { title: 'Every release', description: 'Every project and hackathon, newest first.' };

export default function Work() {
  const items = attachRepos(withVersions(entries), loadRepos());
  return (
    <main className="page wrap">
      <p className="top"><Link href="/">← Aryan Patel</Link></p>
      <h1 className="name">Every release</h1>
      <p className="lede">Projects and wins, newest first. The version is the semester I shipped it in.</p>
      <Changelog items={items} />
    </main>
  );
}
