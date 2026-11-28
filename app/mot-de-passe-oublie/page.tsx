'use client';
import Link from 'next/link';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useT } from '@/components/I18n';

export default function MotDePasseOublie() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    await supabaseBrowser().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/nouveau-mot-de-passe`,
    });
    setEnvoi(false);
    // Même réponse que l'email existe ou non : on ne révèle pas qui a un compte.
    setEnvoye(true);
  }

  return (
    <main className="ph">
      <Link className="back" href="/connexion">‹ {t('c.back')}</Link>
      <h1>{t('fg.title')}</h1>
      {envoye ? (
        <div className="col" style={{ gap: 14 }}>
          <p className="sub">{t('fg.sent')}</p>
          <Link className="btn" href="/connexion">{t('fg.backLogin')}</Link>
        </div>
      ) : (
        <form onSubmit={envoyer} className="col" style={{ gap: 14 }}>
          <p className="sub">{t('fg.intro')}</p>
          <div className="field"><label className="lbl" htmlFor="email">{t('auth.email')}</label><input id="email" className="in" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <button className="btn" type="submit" disabled={!email || envoi}>{envoi ? t('fg.sending') : t('fg.send')}</button>
        </form>
      )}
    </main>
  );
}
