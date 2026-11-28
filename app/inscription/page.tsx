'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { Turnstile } from '@/components/Turnstile';
import { passwordRules, passwordStrength } from '@/lib/password';
import { Check, Chevron } from '@/components/Icons';
import { LangSwitch, useT } from '@/components/I18n';
import { LogoComplet } from '@/components/Logo';
import { href } from '@/lib/i18n';

export default function Inscription() {
  const router = useRouter();
  const t = useT();
  const startedAt = useRef(Date.now());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [cgu, setCgu] = useState(false);
  const [website, setWebsite] = useState('');
  const [token, setToken] = useState<string>();
  const [erreur, setErreur] = useState<string>();
  const [envoi, setEnvoi] = useState(false);
  const onToken = useCallback((t: string) => setToken(t), []);

  const regles = passwordRules(password);
  const force = passwordStrength(password);
  const identiques = password.length > 0 && password === confirm;
  const captchaRequis = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const pret =
    /.+@.+\..+/.test(email) && Object.values(regles).every(Boolean) && identiques && cgu && (!captchaRequis || token);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!pret || envoi) return;
    setEnvoi(true);
    setErreur(undefined);
    try {
      const r = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, acceptCgu: cgu, website, startedAt: startedAt.current, captchaToken: token }),
      });
      const j = await r.json();
      if (j.ok) router.push(`/confirmer-email?e=${encodeURIComponent(email)}`);
      else setErreur(j.message);
    } catch {
      setErreur(t('su.netErr'));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <main className="ph">
      <Link className="back" href="/"><Chevron /> {t('c.back')}</Link>
      <div className="bar"><i className="on"></i><i></i><i></i><i></i><i></i></div>
      <div className="marque-ph"><LogoComplet width={170} /></div>
      <h1>{t('su.title')}</h1>
      <form onSubmit={envoyer} className="col" style={{ gap: 14 }} noValidate>
        <div className="field">
          <label className="lbl" htmlFor="email">{t('auth.email')}</label>
          <input id="email" className="in" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom@exemple.com" />
          <span className="hint">{t('su.emailHint')}</span>
        </div>
        <div className="field">
          <label className="lbl" htmlFor="pw">{t('auth.password')}</label>
          <input id="pw" className="in" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="meter" aria-hidden="true">{[1, 2, 3, 4].map((i) => <i key={i} className={force >= i ? 'on' : ''} />)}</div>
          <div className="rules">
            <span>{regles.longueur ? <b><Check size={14} /></b> : '•'} {t('su.r8')}</span>
            <span>{regles.lettre ? <b><Check size={14} /></b> : '•'} {t('su.rLetter')}</span>
            <span>{regles.chiffre ? <b><Check size={14} /></b> : '•'} {t('su.rDigit')}</span>
          </div>
        </div>
        <div className="field">
          <label className="lbl" htmlFor="pw2">{t('su.confirm')}</label>
          <input id="pw2" className={`in${confirm ? (identiques ? ' ok' : ' err') : ''}`} type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {confirm && !identiques && <span className="hint err">{t('su.mismatch')}</span>}
        </div>
        {/* Piège à robots : invisible pour les humains */}
        <div className="hp" aria-hidden="true">
          <label>{t('su.website')}<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
        </div>
        <label className="check">
          <input type="checkbox" checked={cgu} onChange={(e) => setCgu(e.target.checked)} />
          <span>{t('su.cgu1')}<Link href={href(t.lang, '/conditions')} target="_blank" className="link" style={{ fontSize: 14 }}>{t('su.cgu2')}</Link>{t('su.cgu3')}<Link href={href(t.lang, '/confidentialite')} target="_blank" className="link" style={{ fontSize: 14 }}>{t('su.cgu4')}</Link>.</span>
        </label>
        <Turnstile onToken={onToken} />
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" type="submit" disabled={!pret || envoi}>{envoi ? t('su.creating') : t('su.submit')}</button>
      </form>
      <LangSwitch />
    </main>
  );
}
