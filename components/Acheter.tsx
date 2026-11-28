'use client';
import { useState } from 'react';
import { useT } from '@/components/I18n';

export function Acheter({ plan, libelle, gold }: { plan: 'essentiel' | 'premium'; libelle: string; gold?: boolean }) {
  const t = useT();
  const [envoi, setEnvoi] = useState(false);
  const [err, setErr] = useState<string>();
  async function payer() {
    setEnvoi(true); setErr(undefined);
    try {
      const r = await fetch('/api/paiement/creer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan }) });
      const j = await r.json();
      if (!j.ok) { setErr(j.message); setEnvoi(false); return; }
      window.location.href = j.url;
    } catch { setErr(t('c.netErr')); setEnvoi(false); }
  }
  return (
    <>
      <button className={`btn${gold ? ' gold' : ''}`} onClick={payer} disabled={envoi}>{envoi ? t('ab.redirect') : libelle}</button>
      {err && <div className="alert" role="alert">{err}</div>}
    </>
  );
}
