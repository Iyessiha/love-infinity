'use client';
import Link from 'next/link';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function MotDePasseOublie() {
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
      <Link className="back" href="/connexion">‹ Retour</Link>
      <h1>Mot de passe oublié</h1>
      {envoye ? (
        <div className="col" style={{ gap: 14 }}>
          <p className="sub">Si un compte existe avec cette adresse, un lien de réinitialisation vient d’être envoyé. Pense à regarder tes courriers indésirables. Le lien est valable peu de temps.</p>
          <Link className="btn" href="/connexion">Retour à la connexion</Link>
        </div>
      ) : (
        <form onSubmit={envoyer} className="col" style={{ gap: 14 }}>
          <p className="sub">Entre l’email de ton compte. Nous t’envoyons un lien pour choisir un nouveau mot de passe.</p>
          <div className="field"><label className="lbl" htmlFor="email">Email</label><input id="email" className="in" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <button className="btn" type="submit" disabled={!email || envoi}>{envoi ? 'Envoi…' : 'Envoyer le lien'}</button>
        </form>
      )}
    </main>
  );
}
