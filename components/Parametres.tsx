'use client';
import { useState } from 'react';
import { LangSwitch, useT } from '@/components/I18n';
import '@/app/membre.css';

export function Parametres({ email }: { email: string }) {
  const t = useT();
  const [mot, setMot] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [err, setErr] = useState<string>();
  const ok = mot.trim().toUpperCase() === t('set.deleteWord');

  async function supprimer() {
    if (!ok || envoi) return;
    setEnvoi(true); setErr(undefined);
    try {
      const r = await fetch('/api/compte/supprimer', { method: 'POST' });
      const j = await r.json().catch(() => null);
      if (!j?.ok) throw new Error();
      window.location.href = '/';
    } catch { setErr(t('set.deleteErr')); setEnvoi(false); }
  }

  return (
    <div className="col" style={{ gap: 14 }}>
      <section className="reglage">
        <h2>{t('set.language')}</h2>
        <p>{t('set.languageP')}</p>
        <LangSwitch />
      </section>
      <section className="reglage">
        <h2>{t('set.account')}</h2>
        <p><b>{t('set.email')}</b><br />{email}</p>
      </section>
      <section className="reglage danger">
        <h2>{t('set.deleteT')}</h2>
        <p>{t('set.deleteP')}</p>
        <label className="small" style={{ fontWeight: 800 }} htmlFor="del">{t('set.deleteAsk')}</label>
        <input id="del" className="zone" style={{ minHeight: 48, height: 48 }} value={mot} onChange={(e) => setMot(e.target.value)} autoComplete="off" />
        {err && <div className="erreur" role="alert">{err}</div>}
        <button className="cta rouge" disabled={!ok || envoi} onClick={supprimer}>{envoi ? t('set.deleting') : t('set.deleteGo')}</button>
      </section>
    </div>
  );
}
