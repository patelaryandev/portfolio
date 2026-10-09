import { site } from '@/content/site';

// Photo, name and three facts, in the side panel on wide screens.
export function Profile() {
  return (
    <div className="profile profile-panel grid">
      <div className="profile-head">
        <img src="/aryan-patel.jpg" width="96" height="96" alt={`Photo of ${site.name}`} />
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

// On phones the panel sits at the bottom, so the photo and role go above the name instead.
export function MeLine() {
  return (
    <div className="me-line">
      <img src="/aryan-patel.jpg" width="84" height="84" alt={`Photo of ${site.name}`} />
      <p><b>{site.title}</b><span>{site.profile.currently}</span><span>{site.place}</span></p>
    </div>
  );
}

export function OpenTo() {
  return <p className="open-to"><span className="dot" />Open to {site.profile.lookingFor}</p>;
}
