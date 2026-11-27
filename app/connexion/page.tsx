'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Check, Chevron } from '@/components/Icons';

export default function Connexion() {
  const router = useRouter();
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
      return setErreur(error.message.toLowerCase().includes('confirm') ? 'Confirme d’abord ton email avec le lien reçu.' : 'Email ou mot de passe incorrect.');
    }
    router.push('/profil');
    router.refresh();
  }

  return (
    <main className="ph">
      <Link className="back" href="/"><Chevron /> Retour</Link>
      <h1>Content de te revoir</h1>
      <form onSubmit={entrer} className="col" style={{ gap: 14 }}>
        <div className="field"><label className="lbl" htmlFor="email">Email</label><input id="email" className="in" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label className="lbl" htmlFor="pw">Mot de passe</label><input id="pw" className="in" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" type="submit" disabled={!email || !password || envoi}>{envoi ? 'Connexion…' : 'Me connecter'}</button>
        <Link className="link" href="/inscription">Créer un compte</Link>
      </form>
    </main>
  );
}
