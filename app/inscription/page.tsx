'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { Turnstile } from '@/components/Turnstile';
import { passwordRules, passwordStrength } from '@/lib/password';

export default function Inscription() {
  const router = useRouter();
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
      setErreur('Connexion impossible. Vérifie ton réseau et réessaie.');
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <main className="ph">
      <Link className="back" href="/">‹ Retour</Link>
      <div className="bar"><i className="on"></i><i></i><i></i><i></i><i></i></div>
      <h1>Crée ton compte</h1>
      <form onSubmit={envoyer} className="col" style={{ gap: 14 }} noValidate>
        <div className="field">
          <label className="lbl" htmlFor="email">Email</label>
          <input id="email" className="in" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom@exemple.com" />
          <span className="hint">Nous t'envoyons un lien de confirmation.</span>
        </div>
        <div className="field">
          <label className="lbl" htmlFor="pw">Mot de passe</label>
          <input id="pw" className="in" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="meter" aria-hidden="true">{[1, 2, 3, 4].map((i) => <i key={i} className={force >= i ? 'on' : ''} />)}</div>
          <div className="rules">
            <span>{regles.longueur ? <b>✓</b> : '•'} 8 caractères minimum</span>
            <span>{regles.lettre ? <b>✓</b> : '•'} Une lettre</span>
            <span>{regles.chiffre ? <b>✓</b> : '•'} Un chiffre</span>
          </div>
        </div>
        <div className="field">
          <label className="lbl" htmlFor="pw2">Confirme le mot de passe</label>
          <input id="pw2" className={`in${confirm ? (identiques ? ' ok' : ' err') : ''}`} type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {confirm && !identiques && <span className="hint err">Les mots de passe ne sont pas identiques.</span>}
        </div>
        {/* Piège à robots : invisible pour les humains */}
        <div className="hp" aria-hidden="true">
          <label>Site web<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
        </div>
        <label className="check">
          <input type="checkbox" checked={cgu} onChange={(e) => setCgu(e.target.checked)} />
          <span>J'ai 18 ans ou plus et j'accepte les conditions d'utilisation et la politique de confidentialité.</span>
        </label>
        <Turnstile onToken={onToken} />
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" type="submit" disabled={!pret || envoi}>{envoi ? 'Création…' : 'Créer mon compte'}</button>
      </form>
    </main>
  );
}
