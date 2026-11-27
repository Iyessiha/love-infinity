'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { passwordOk } from '@/lib/password';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function NouveauMotDePasse() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [voir, setVoir] = useState(false);
  const [erreur, setErreur] = useState<string>();
  const [envoi, setEnvoi] = useState(false);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordOk(pw) || envoi) return;
    setEnvoi(true);
    setErreur(undefined);
    const { error } = await supabaseBrowser().auth.updateUser({ password: pw });
    setEnvoi(false);
    if (error) return setErreur('Le lien a expiré ou le mot de passe est refusé. Refais une demande depuis « Mot de passe oublié ».');
    router.push('/espace');
    router.refresh();
  }

  return (
    <main className="ph">
      <h1>Nouveau mot de passe</h1>
      <form onSubmit={enregistrer} className="col" style={{ gap: 14 }}>
        <div className="field">
          <label className="lbl" htmlFor="pw">Nouveau mot de passe</label>
          <input id="pw" className="in" type={voir ? 'text' : 'password'} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <span className="hint">8 caractères minimum, avec au moins une lettre et un chiffre. Note-le dans un endroit sûr.</span>
        </div>
        <label className="row" style={{ gap: 8, fontSize: 15 }}><input type="checkbox" checked={voir} onChange={(e) => setVoir(e.target.checked)} /> Afficher le mot de passe</label>
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" type="submit" disabled={!passwordOk(pw) || envoi}>{envoi ? 'Enregistrement…' : 'Enregistrer'}</button>
      </form>
    </main>
  );
}
