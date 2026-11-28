'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Chevron } from '@/components/Icons';
import { LangSwitch, useT } from '@/components/I18n';

export default function Connexion() {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState<string>();
  const [envoi, setEnvoi] = useState(false);

  async function entrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(undefined);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setEnvoi(false);
    if (error) {
      // Message volontairement général : on ne dit pas si l'email existe
      return setErreur(error.message.toLowerCase().includes('confirm') ? t('auth.confirmFirst') : t('auth.bad'));
    }
    router.push('/espace');
    router.refresh();
  }

  return (
    <main className="ph">
      <Link className="back" href="/"><Chevron /> {t('c.back')}</Link>
      <h1>{t('auth.welcome')}</h1>
      <form onSubmit={entrer} className="col" style={{ gap: 14 }}>
        <div className="field"><label className="lbl" htmlFor="email">{t('auth.email')}</label><input id="email" className="in" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label className="lbl" htmlFor="pw">{t('auth.password')}</label><input id="pw" className="in" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" type="submit" disabled={!email || !password || envoi}>{envoi ? t('auth.loggingIn') : t('auth.login')}</button>
        <Link className="link" href="/mot-de-passe-oublie">{t('auth.forgot')}</Link>
        <Link className="link" href="/inscription">{t('auth.create')}</Link>
      </form>
      <LangSwitch />
    </main>
  );
}
