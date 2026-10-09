// components/Blueprint.tsx
'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { aboutMinutes, type BuildStamp } from '@/lib/stamp';
import { LAND_MS, fetchVisit, initialLive, liveReducer, timeRequest } from '@/lib/live';
import { Flow } from './Flow';
import { TitleBlock } from './TitleBlock';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Blueprint({ stamp, siteVersion, builtAt, variant = 'panel' }: { stamp: BuildStamp; siteVersion: string; builtAt: string; variant?: 'panel' | 'sheet' }) {
  const [live, dispatch] = useReducer(liveReducer, initialLive);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const alive = useRef(true);

  const round = useCallback(async (land: boolean) => {
    if (document.hidden) return;
    const [ms] = await Promise.all([timeRequest('/api/ping'), land ? wait(LAND_MS) : null]);
    if (alive.current) dispatch(ms === null ? { type: 'ping-fail' } : { type: 'ping-ok', ms });
  }, []);

  useEffect(() => {
    alive.current = true;
    setMounted(true);
    const root = rootRef.current!, dot = dotRef.current!;
    const io = new IntersectionObserver(([e]) => root.classList.toggle('offscreen', !e.isIntersecting));
    io.observe(root);
    fetchVisit().then((v) => alive.current && dispatch(v ? { type: 'visit-ok', ...v } : { type: 'visit-fail' }));
    const onRound = () => void round(true);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) void round(false);
    dot.addEventListener('animationstart', onRound);
    dot.addEventListener('animationiteration', onRound);
    return () => {
      alive.current = false;
      io.disconnect();
      dot.removeEventListener('animationstart', onRound);
      dot.removeEventListener('animationiteration', onRound);
    };
  }, [round]);

  const down = live.status === 'down';
  const colo = live.colo ?? 'edge';
  const soon = aboutMinutes(stamp.deploySeconds);

  return (
    <div ref={rootRef} className={`blueprint grid bp-${variant} ${down ? 'is-down' : ''} ${mounted ? 'mounted' : ''}`}>
      <h2 className="bp-title">How this page reached you</h2>
      <p className="bp-plain">This site deploys itself: every push is tested, then goes live {soon ? `in ${soon}` : 'on its own'}.</p>
      <p className="bp-sub">{down ? 'Live data unavailable right now.' : live.status === 'live' ? 'Live. Measured on your visit, not a picture.' : 'Connecting…'}</p>
      <div className="stage">
        <svg className="diag" viewBox="0 0 340 344" fill="none" stroke="var(--blue-ink)" strokeWidth="1.4" role="group"
          aria-label={`My push, then ${stamp.via === 'github-actions' ? 'GitHub Actions' : 'wrangler deploy'}, then Cloudflare ${colo}, then your browser.`}>
          <defs><marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="var(--blue-ink)" /></marker></defs>
          <Flow stamp={stamp} colo={colo} tests={live.tests} />
          <circle className="ripple" cx="44" cy="296" r="6" stroke="var(--accent)" strokeWidth="1.5" aria-hidden="true" />
          <circle className="pkt t2" cx="44" cy="244" r="3" aria-hidden="true" />
          <circle className="pkt t1" cx="44" cy="244" r="4.5" aria-hidden="true" />
          <circle className="pkt" cx="44" cy="244" r="6" ref={dotRef} aria-hidden="true" />
        </svg>
        <div className="pen note-ms" aria-hidden="true">{live.ms !== null ? `${live.ms} ms` : ''}</div>
      </div>
      {variant === 'sheet' ? (
        <div className="bench">
          <button type="button" onClick={() => void round(false)} disabled={down}>ping again</button>
          <svg className="spark" viewBox="0 0 120 40" role="img" aria-label={`Last ${live.history.length} timings: ${live.history.join(', ')} ms`}>
            {live.history.map((ms, i) => {
              const h = Math.max(2, Math.min(36, ms / 5));
              return <rect key={i} x={i * 24 + 2} y={38 - h} width="16" height={h} />;
            })}
          </svg>
          <span className="mono">{live.history.join(' · ')}{live.history.length ? ' ms' : ''}</span>
        </div>
      ) : null}
      <dl className="facts">
        <dt>Last deploy</dt><dd>{builtAt}, from {stamp.branch}</dd>
        <dt>Push to live</dt><dd>{stamp.deploySeconds ? `${stamp.deploySeconds} s, typical of the last 10` : '–'}</dd>
        <dt>Visits today</dt><dd>{live.visitsToday?.toLocaleString('en-IN') ?? '–'}</dd>
      </dl>
      <TitleBlock cells={[
        { label: 'Revision', value: siteVersion },
        { label: 'Build', value: stamp.sha },
        { label: 'Status', value: live.status === 'live' ? <><span className="dot" />live</> : 'static' },
      ]} />
    </div>
  );
}
