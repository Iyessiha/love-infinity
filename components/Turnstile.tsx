'use client';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => void };
  }
}

/** Widget anti-robot Cloudflare. Affiché seulement si la clé de site est configurée. */
export function Turnstile({ onToken }: { onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!key) return;
    const t = setInterval(() => {
      if (window.turnstile && ref.current) {
        clearInterval(t);
        window.turnstile.render(ref.current, { sitekey: key, callback: onToken, language: 'fr' });
      }
    }, 200);
    return () => clearInterval(t);
  }, [key, onToken]);

  if (!key) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div ref={ref} />
    </>
  );
}
