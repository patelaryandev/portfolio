import type { MetadataRoute } from 'next';
import build from '@/content/build.json';
import { caseStudies } from '@/content/case-studies';

export const dynamic = 'force-static';

// Every page Google should know about, dated by the last build.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(build.time);
  const paths = ['', '/work', ...caseStudies.map((c) => `/work/${c.slug}`), '/how-its-built'];
  return paths.map((p) => ({ url: `https://patelaryan.dev${p}`, lastModified }));
}
