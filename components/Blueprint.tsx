// components/Blueprint.tsx
'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { BuildStamp } from '@/lib/stamp';
import { LAND_MS, fetchVisit, initialLive, liveReducer, timeRequest } from '@/lib/live';
import { DeployColumn } from './DeployColumn';
import { TitleBlock } from './TitleBlock';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Blueprint({ stamp, siteVersion, builtAt, variant = 'panel' }: { stamp: BuildStamp; siteVersion: string; builtAt: string; variant?: 'panel' | 'sheet' }) {
  const [live, dispatch] = useReducer(liveReducer, initialLive);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={rootRef} className={`blueprint grid ${variant} ${down ? 'is-down' : ''} ${mounted ? 'mounted' : ''}`}>
      <h2 className="bp-title">How this page reached you</h2>
      <p className="bp-sub">{down ? 'Live data unavailable right now.' : live.status === 'live' ? 'Live. Measured on your visit, not a picture.' : 'Connecting…'}</p>
      <div className="stage">
        <svg className="diag" viewBox="0 0 340 330" fill="none" stroke="var(--blue-ink)" strokeWidth="1.4" role="img"
          aria-label={`Your browser, then Cloudflare ${colo}, then the site files on a Worker. Deploys: ${stamp.steps.join(', then ')}.`}>
          <defs><marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="var(--blue-ink)" /></marker></defs>
          <text x="12" y="14">your visit</text><text x="196" y="14">my deploys</text>
          <rect x="12" y="26" width="140" height="40" fill="var(--paper)" /><text x="26" y="51">Your browser</text>
          <rect className="edge" x="12" y="126" width="140" height="40" fill="var(--paper)" strokeWidth="2" /><text x="26" y="151">Cloudflare · {colo}</text>
          <rect className="dest" x="12" y="226" width="140" height="40" fill="var(--paper)" /><text x="20" y="251">Site files (Worker)</text>
          <path d="M82 66 V126" markerEnd="url(#ar)" /><path d="M82 166 V226" markerEnd="url(#ar)" />
          <DeployColumn steps={stamp.steps} />
          <text x="328" y="300" textAnchor="end">built {builtAt}</text>
        </svg>
        <div className="pkt t2" aria-hidden="true" /><div className="pkt t1" aria-hidden="true" />
        <div className="pkt" ref={dotRef} aria-hidden="true" /><div className="ripple" aria-hidden="true" />
        <div className="pen note-ms" aria-hidden="true">{live.ms !== null ? `← ${live.ms} ms` : ''}</div>
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
        <dt>Visits today</dt><dd>{live.visitsToday?.toLocaleString('en-IN') ?? '–'}</dd>
        <dt>Pipeline</dt><dd>{stamp.steps.join(' → ')}</dd>
      </dl>
      <TitleBlock cells={[
        { label: 'Revision', value: siteVersion },
        { label: 'Build', value: stamp.sha },
        { label: 'Status', value: live.status === 'live' ? <><span className="dot" />live</> : 'static' },
      ]} />
    </div>
  );
}
