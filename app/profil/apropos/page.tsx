'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Chips } from '@/components/Chips';
import { ProfilShell } from '@/components/ProfilShell';
import { ETUDES, LANGUES } from '@/lib/profile';
import { sauverEtape } from '@/lib/save';

export default function APropos() {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [profession, setProfession] = useState('');
  const [taille, setTaille] = useState('');
  const [etudes, setEtudes] = useState('');
  const [langues, setLangues] = useState<string[]>(['Français']);
  const [erreur, setErreur] = useState<string>();
  const [envoi, setEnvoi] = useState(false);

  async function suite(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(undefined);
    const err = await sauverEtape(
      2,
      { bio, profession, taille_cm: taille ? Number(taille) : undefined, etudes: etudes || undefined, langues },
      router.push,
    );
    setEnvoi(false);
    if (err) return setErreur(err);
    router.push('/profil/style');
  }

  return (
    <ProfilShell step={2} back="/profil">
      <form onSubmit={suite} className="col" style={{ gap: 12 }}>
        <div className="field">
          <label className="lbl" htmlFor="bio">Un mot sur toi</label>
          <textarea id="bio" className="in" maxLength={300} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Passionnée de cuisine et de voyages. Je cherche quelqu'un de sincère…" />
          <span className="hint" style={{ textAlign: 'right' }}>{bio.length} / 300</span>
        </div>
        <div className="field"><label className="lbl" htmlFor="metier">Profession</label><input id="metier" className="in" value={profession} onChange={(e) => setProfession(e.target.value)} /></div>
        <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="taille">Taille (cm)</label><input id="taille" className="in" type="number" inputMode="numeric" min={120} max={230} value={taille} onChange={(e) => setTaille(e.target.value)} placeholder="168" /></div>
          <div className="field" style={{ flex: 1 }}>
            <label className="lbl" htmlFor="etudes">Études</label>
            <select id="etudes" className="in" value={etudes} onChange={(e) => setEtudes(e.target.value)}>
              <option value="">Choisir</option>
              {ETUDES.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <div className="field"><span className="lbl">Langues parlées</span><Chips options={LANGUES} value={langues} onChange={setLangues} /></div>
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" style={{ flex: 'none' }} type="submit" disabled={envoi}>{envoi ? 'Enregistrement…' : 'Continuer'}</button>
      </form>
    </ProfilShell>
  );
}
