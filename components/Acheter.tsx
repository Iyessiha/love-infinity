'use client';
import { useState } from 'react';

export function Acheter({ plan, libelle, gold }: { plan: 'essentiel' | 'premium'; libelle: string; gold?: boolean }) {
  const [envoi, setEnvoi] = useState(false);
  const [err, setErr] = useState<string>();
  async function payer() {
    setEnvoi(true); setErr(undefined);
    try {
      const r = await fetch('/api/paiement/creer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan }) });
      const j = await r.json();
      if (!j.ok) { setErr(j.message); setEnvoi(false); return; }
      window.location.href = j.url;
    } catch { setErr('Connexion impossible. Réessaie.'); setEnvoi(false); }
  }
  return (
    <>
      <button className={`btn${gold ? ' gold' : ''}`} onClick={payer} disabled={envoi}>{envoi ? 'Redirection…' : libelle}</button>
      {err && <div className="alert" role="alert">{err}</div>}
    </>
  );
}
