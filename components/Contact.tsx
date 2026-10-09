import { site } from '@/content/site';

export function Contact() {
  return (
    <ul className="contact">
      <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
      <li><a href={site.github}>github.com/patelaryandev</a></li>
      <li><a href={site.linkedin}>LinkedIn</a></li>
    </ul>
  );
}
