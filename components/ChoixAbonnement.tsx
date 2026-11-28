'use client';
import { useEffect, useRef, useState } from 'react';
import { useT } from '@/components/I18n';

type Plan = 'essentiel' | 'premium';
type Prix = { brut: number; remise_duree_pct: number; remise_promo_pct: number; total: number; code_ok: boolean };
const MOIS = [1, 3, 6, 12] as const;
type Mois = (typeof MOIS)[number];

/** Choix du plan, de la durée, du code promo, puis paiement. Les prix viennent de la base (calculer_prix). */
export function ChoixAbonnement({ initial, mensuels, remises, labelRenew }: { initial: Plan; mensuels: Record<Plan, number>; remises: Record<Mois, number>; labelRenew?: boolean }) {
  const t = useT();
  const loc = t.lang === 'en' ? 'en-GB' : 'fr-FR';
  const [plan, setPlan] = useState<Plan>(initial);
  const [mois, setMois] = useState<Mois>(3);
  const [code, setCode] = useState('');
  const [prix, setPrix] = useState<Prix>();
  const [envoi, setEnvoi] = useState(false);
  const [err, setErr] = useState<string>();
  const seq = useRef(0);

  useEffect(() => {
    const id = ++seq.current;
    const h = setTimeout(async () => {
      try {
        const r = await fetch('/api/paiement/prix', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan, mois, code: code.trim() || undefined }) });
        const j = await r.json();
        if (id === seq.current && j.ok) setPrix(j);
      } catch { /* l'aperçu est facultatif : le vrai prix est recalculé au paiement */ }
    }, code ? 350 : 0);
    return () => clearTimeout(h);
  }, [plan, mois, code]);

  const f = (n: number) => n.toLocaleString(loc);
  const mensuelRemise = (m: Mois, p: Plan = plan) => Math.round((mensuels[p] * (100 - remises[m])) / 100 / 50) * 50;

  async function payer() {
    setEnvoi(true); setErr(undefined);
    try {
      const r = await fetch('/api/paiement/creer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan, mois, code: code.trim() || undefined }) });
      const j = await r.json();
      if (!j.ok) { setErr(j.message); setEnvoi(false); return; }
      window.location.href = j.url;
    } catch { setErr(t('c.netErr')); setEnvoi(false); }
  }

  const nom = plan === 'premium' ? t('me.premium') : t('me.essential');
  return (
    <section className="pk" aria-label={t('pk.title')}>
      <div className="pk-plans" role="radiogroup" aria-label={t('pk.plan')}>
        {(['essentiel', 'premium'] as const).map((p) => (
          <button key={p} type="button" role="radio" aria-checked={plan === p} className={`pk-plan${plan === p ? ' on' : ''}`} onClick={() => setPlan(p)}>
            <b>{p === 'premium' ? t('me.premium') : t('me.essential')}</b>
            <span>{t('pk.from', { n: f(mensuelRemise(12, p)) })}</span>
          </button>
        ))}
      </div>

      <div className="pk-durees" role="radiogroup" aria-label={t('pk.duration')}>
        {MOIS.map((m) => (
          <button key={m} type="button" role="radio" aria-checked={mois === m} className={`pk-duree${mois === m ? ' on' : ''}`} onClick={() => setMois(m)}>
            {m === 6 && <i className="pk-best">{t('pk.best')}</i>}
            <b>{t.n('pk.months', m)}</b>
            <span className="pk-mens">{f(mensuelRemise(m))} <small>{t('pk.perMonth')}</small></span>
            {remises[m] > 0 ? <em>{t('pk.save', { n: remises[m] })}</em> : <em className="neutre">{t('pk.noCommit')}</em>}
          </button>
        ))}
      </div>

      <label className="pk-code">
        <span>{t('pk.promo')}</span>
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24))} placeholder={t('pk.promoPh')} autoCapitalize="characters" autoComplete="off" spellCheck={false} />
        {code && prix && <small className={prix.code_ok ? 'ok' : 'ko'} role="status">{prix.code_ok ? t('pk.promoOk', { n: prix.remise_promo_pct }) : t('pk.promoKo')}</small>}
      </label>

      <div className="pk-total" aria-live="polite">
        <div>
          <span>{t('pk.total')}</span>
          {prix && prix.total < prix.brut && <s>{f(prix.brut)} FCFA</s>}
        </div>
        <b>{prix ? f(prix.total) : '…'} <small>FCFA</small></b>
      </div>

      <button type="button" className="of-cta or pk-go" onClick={payer} disabled={envoi || !prix}>
        {envoi ? t('ab.redirect') : labelRenew ? t('pk.renew', { plan: nom }) : t('pk.go', { plan: nom })}
      </button>
      {err && <div className="alert" role="alert">{err}</div>}

      <div className="pk-modes">
        <p>{t('pk.local')}</p>
        <ul><li>Wave</li><li>Orange Money</li><li>MTN Money</li><li>Moov Money</li></ul>
        <p>{t('pk.intl')}</p>
        <ul><li>Visa</li><li>Mastercard</li></ul>
      </div>
      <p className="pk-note">{t('pk.note')}</p>
    </section>
  );
}
