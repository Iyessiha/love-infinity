'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Chips } from '@/components/Chips';
import { ProfilShell } from '@/components/ProfilShell';
import { sauverEtape } from '@/lib/save';

export default function Bases() {
  const router = useRouter();
  const [f, setF] = useState({ prenom: '', nom: '', birth_date: '', ville: 'Abidjan', genre: '' as '' | 'homme' | 'femme', recherche: '' as '' | 'homme' | 'femme' });
  const [erreur, setErreur] = useState<string>();
  const [envoi, setEnvoi] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const pret = f.prenom.length > 1 && f.nom.length > 1 && f.birth_date && f.ville && f.genre && f.recherche;

  async function suite(e: React.FormEvent) {
    e.preventDefault();
    if (!pret || envoi) return;
    setEnvoi(true);
    setErreur(undefined);
    const err = await sauverEtape(1, f, router.push);
    setEnvoi(false);
    if (err) return setErreur(err);
    router.push('/profil/apropos');
  }

  return (
    <ProfilShell step={1}>
      <p className="sub" style={{ fontSize: 14, marginTop: -4 }}>Les informations privées sont indiquées sous chaque champ.</p>
      <form onSubmit={suite} className="col" style={{ gap: 12 }}>
        <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="prenom">Prénom</label><input id="prenom" className="in" value={f.prenom} onChange={(e) => set('prenom')(e.target.value)} autoComplete="given-name" /></div>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="nom">Nom</label><input id="nom" className="in" value={f.nom} onChange={(e) => set('nom')(e.target.value)} autoComplete="family-name" /></div>
        </div>
        <span className="hint" style={{ marginTop: -6 }}>Seul ton prénom est affiché. Ton nom reste privé : il sert à vérifier ton identité.</span>
        <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="naiss">Date de naissance</label><input id="naiss" className="in" type="date" value={f.birth_date} onChange={(e) => set('birth_date')(e.target.value)} autoComplete="bday" /></div>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="ville">Ville</label><input id="ville" className="in" value={f.ville} onChange={(e) => set('ville')(e.target.value)} /></div>
        </div>
        <span className="hint" style={{ marginTop: -6 }}>18 ans minimum. Seul ton âge est affiché.</span>
        <div className="field"><span className="lbl">Je suis</span><Chips options={[['homme', 'Un homme'], ['femme', 'Une femme']] as const} value={f.genre || undefined} onChange={set('genre')} /></div>
        <div className="field"><span className="lbl">Je veux rencontrer</span><Chips options={[['homme', 'Un homme'], ['femme', 'Une femme']] as const} value={f.recherche || undefined} onChange={set('recherche')} /></div>
        <span className="hint">Les photos arrivent à l'étape de vérification.</span>
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" style={{ flex: 'none' }} type="submit" disabled={!pret || envoi}>{envoi ? 'Enregistrement…' : 'Continuer'}</button>
      </form>
    </ProfilShell>
  );
}
