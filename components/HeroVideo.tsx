'use client';
import { useEffect, useRef, useState } from 'react';

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [actif, setActif] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const econome = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setActif(!calme && !econome);
  }, []);
  return (
    <div className="lp-hero-media" aria-hidden="true" style={{ backgroundImage: `url(${poster})` }}>
      {actif && <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" />}
    </div>
  );
}
