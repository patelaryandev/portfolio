import Link from 'next/link';
import { site } from '@/content/site';

export function Nav({ current }: { current?: 'work' | 'how' }) {
  const cur = (on: boolean) => (on ? { 'aria-current': 'page' as const } : {});
  return (
    <nav className="nav" aria-label="Main">
      <Link className="brand" href="/"><b>{site.name}</b><span>{site.title} · {site.place}</span></Link>
      <ul>
        <li><Link href="/work" {...cur(current === 'work')}>Work</Link></li>
        <li><Link href="/how-its-built" {...cur(current === 'how')}>How it&apos;s built</Link></li>
        <li><a className="nav-cv" href="/resume.pdf">Resume ↓</a></li>
      </ul>
    </nav>
  );
}
