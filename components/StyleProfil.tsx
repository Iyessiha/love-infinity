'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useT } from '@/components/I18n';
import { LockIcon } from '@/components/Icons';
import { QUESTIONS, THEMES } from '@/lib/dict';

export type Prompt = { q: string; a: string };

/** Édition du style du profil : questions signature (tous) et thème (Premium). */
export function StyleProfil({ theme: t0, prompts: p0, premium }: { theme: string; prompts: Prompt[]; premium: boolean }) {
  const t = useT();
  const router = useRouter();
  const [theme, setTheme] = useState(t0);
  const [prompts, setPrompts] = useState<Prompt[]>(p0);
  const [envoi, setEnvoi] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; texte: string }>();
  const pris = new Set(prompts.map((p) => p.q));
  const maj = (i: number, a: string) => { setMsg(undefined); setPrompts((l) => l.map((p, n) => (n === i ? { ...p, a: a.slice(0, 160) } : p))); };

  async function enregistrer() {
    setEnvoi(true); setMsg(undefined);
    const garde = prompts.filter((p) => p.q && p.a.trim());
    try {
      const r = await fetch('/api/profile/style', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme, prompts: garde }) });
      const j = await r.json().catch(() => null);
      if (j?.ok) { setPrompts(garde); setMsg({ ok: true, texte: t('ed.saved') }); router.refresh(); }
      else setMsg({ ok: false, texte: j?.code === 'premium' ? t('sty.errPremium') : t('sty.err') });
    } catch { setMsg({ ok: false, texte: t('sty.err') }); }
    setEnvoi(false);
  }

  return (
    <section className="ed-style">
      <h2 className="ed-h2">{t('sty.prompts')}</h2>
      <p className="small">{t('sty.promptsP')}</p>
      {prompts.map((p, i) => (
        <div key={i} className="qa">
          <select className="zone" aria-label={t('sty.pick')} value={p.q} onChange={(e) => setPrompts((l) => l.map((x, n) => (n === i ? { ...x, q: e.target.value } : x)))}>
            <option value="">{t('sty.pick')}</option>
            {QUESTIONS.filter((q) => q === p.q || !pris.has(q)).map((q) => <option key={q} value={q}>{t(`q.${q}`)}</option>)}
          </select>
          <textarea className="zone" aria-label={t('sty.answer')} placeholder={t('sty.answer')} value={p.a} onChange={(e) => maj(i, e.target.value)} />
          <div className="row"><span className="small">{p.a.length} / 160</span><span className="sp" /><button type="button" className="lien-doux" onClick={() => setPrompts((l) => l.filter((_, n) => n !== i))}>{t('sty.remove')}</button></div>
        </div>
      ))}
      {prompts.length < 3 && <button type="button" className="cta ghost" style={{ height: 46, fontSize: 15 }} onClick={() => setPrompts((l) => [...l, { q: '', a: '' }])}>{t('sty.add')}</button>}

      <h2 className="ed-h2" style={{ marginTop: 10 }}>{t('sty.theme')}</h2>
      <p className="small">{t('sty.themeP')}</p>
      <div className="themes" role="radiogroup" aria-label={t('sty.theme')}>
        {THEMES.map((k) => {
          const verrou = k !== 'classique' && !premium;
          return (
            <button key={k} type="button" role="radio" aria-checked={theme === k} disabled={verrou} className={`theme${theme === k ? ' on' : ''}`} data-theme={k} onClick={() => { setTheme(k); setMsg(undefined); }}>
              <span className="theme-demo"><i /><i /><i /></span>
              <b>{t(`th.${k}`)}</b>
              {verrou && <em><LockIcon size={12} /> {t('sty.locked')}</em>}
            </button>
          );
        })}
      </div>
      {!premium && <Link className="lien-doux" href="/abonnement">{t('sty.unlock')}</Link>}
      {msg && <div className={msg.ok ? 'ok-msg' : 'erreur'} role={msg.ok ? 'status' : 'alert'}>{msg.texte}</div>}
      <button type="button" className="cta" disabled={envoi} onClick={enregistrer}>{envoi ? t('c.saving') : t('c.save')}</button>
    </section>
  );
}
