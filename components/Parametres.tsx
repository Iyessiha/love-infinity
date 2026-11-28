'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { LangSwitch, useT } from '@/components/I18n';
import '@/app/membre.css';

export function Parametres({ email, pause: pause0, anon: anon0, premium }: { email: string; pause: boolean; anon: boolean; premium: boolean }) {
  const t = useT();
  const router = useRouter();
  const [pause, setPause] = useState(pause0);
  const [anon, setAnon] = useState(anon0);
  async function basculerAnon() {
    const nv = !anon;
    const { error } = await supabaseBrowser().rpc('regler_vue_anonyme', { p_actif: nv });
    if (!error) setAnon(nv);
  }
  async function basculer() {
    const nv = !pause;
    const { error } = await supabaseBrowser().rpc('mettre_en_pause', { p_pause: nv });
    if (!error) { setPause(nv); router.refresh(); }
  }
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
        <h2>{t('set.pauseT')} <span className="small">· {pause ? t('set.pauseOn') : t('set.pauseOff')}</span></h2>
        <p>{t('set.pauseP')}</p>
        <button type="button" className="cta ghost" onClick={basculer}>{pause ? t('set.pauseBtnOn') : t('set.pauseBtnOff')}</button>
      </section>
      <section className="reglage">
        <h2>{t('set.anonT')}</h2>
        <p>{t('set.anonP')}</p>
        {premium
          ? <button type="button" className="cta ghost" onClick={basculerAnon}>{anon ? t('set.anonOn') : t('set.anonOff')}</button>
          : <Link className="cta ghost" href="/abonnement">{t('set.anonLock')}</Link>}
      </section>
      <section className="reglage">
        <h2>{t('set.blockedT')}</h2>
        <p>{t('set.blockedP')}</p>
        <Link className="cta ghost" href="/moi/parametres/bloques">{t('set.blockedOpen')}</Link>
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
