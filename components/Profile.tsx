import { site } from '@/content/site';

// Photo, name and three facts. Rendered twice on the home page: in the side panel on wide screens, under the buttons on phones.
export function Profile({ where }: { where: 'panel' | 'inline' }) {
  return (
    <div className={`profile profile-${where} grid`}>
      <div className="profile-head">
        <img src="/aryan-patel.jpg" width="64" height="64" alt={`Photo of ${site.name}`} />
        <div><b>{site.name}</b><span className="ph-role">{site.title}</span><span className="ph-place">{site.place}</span></div>
      </div>
      <dl>
        <dt>Currently</dt><dd>{site.profile.currently}</dd>
        <dt>Looking for</dt><dd>{site.profile.lookingFor}</dd>
        <dt>Email</dt><dd>{site.email}</dd>
      </dl>
    </div>
  );
}
