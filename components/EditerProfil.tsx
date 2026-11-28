'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Chips } from '@/components/Chips';
import { ENFANTS, ETUDES, FREQ, INTENTIONS, INTERETS, LANGUES, RELIGIONS } from '@/lib/profile';
import { sauverEtape } from '@/lib/save';

type Init = { bio: string; profession: string; taille: string; etudes: string; langues: string[]; intention: string; enfants: string; tabac: string; alcool: string; religion: string; interets: string[] };

export function EditerProfil({ init, photos }: { init: Init; photos: string[] }) {
  const router = useRouter();
  const [f, setF] = useState<Init>({
    ...init,
    langues: init.langues.filter((x) => (LANGUES as readonly string[]).includes(x)),
    interets: init.interets.filter((x) => (INTERETS as readonly string[]).includes(x)),
    etudes: (ETUDES as readonly string[]).includes(init.etudes) ? init.etudes : '',
  });
  const [erreur, setErreur] = useState<string>();
  const [ok, setOk] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const set = <K extends keyof Init>(k: K) => (v: Init[K]) => { setOk(false); setF((s) => ({ ...s, [k]: v })); };
  const pret = f.intention && f.enfants;

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (!pret || envoi) return;
    setEnvoi(true); setErreur(undefined); setOk(false);
    const e2 = await sauverEtape(2, { bio: f.bio, profession: f.profession, taille_cm: f.taille ? Number(f.taille) : undefined, etudes: f.etudes || undefined, langues: f.langues }, router.push);
    const e3 = e2 ?? await sauverEtape(3, { intention: f.intention, enfants: f.enfants, tabac: f.tabac, alcool: f.alcool, religion: f.religion, interets: f.interets }, router.push);
    setEnvoi(false);
    if (e3) return setErreur(e3);
    setOk(true);
    router.refresh();
  }

  return (
    <form className="ed" onSubmit={enregistrer}>
      <section>
        <span className="lib">Mes photos</span>
        <div className="ed-photos">{photos.map((p, i) => <div key={p}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p} alt={`Ma photo ${i + 1}`} /></div>)}</div>
        <Link className="cta ghost" style={{ height: 46, fontSize: 15 }} href="/verification">Gérer mes photos et ma vérification</Link>
      </section>

      <section>
        <label className="lib" htmlFor="bio">À propos de moi</label>
        <textarea id="bio" className="zone" maxLength={300} value={f.bio} onChange={(e) => set('bio')(e.target.value)} placeholder="Quelques mots qui te ressemblent…" />
        <span className="small" style={{ textAlign: 'right' }}>{f.bio.length} / 300</span>
        <div className="rang">
          <div><label className="lib" htmlFor="metier">Profession</label><input id="metier" className="zone" value={f.profession} onChange={(e) => set('profession')(e.target.value)} /></div>
          <div><label className="lib" htmlFor="taille">Taille (cm)</label><input id="taille" className="zone" type="number" inputMode="numeric" min={120} max={230} value={f.taille} onChange={(e) => set('taille')(e.target.value)} /></div>
        </div>
        <div><label className="lib" htmlFor="etudes">Études</label>
          <select id="etudes" className="zone" value={f.etudes} onChange={(e) => set('etudes')(e.target.value)}><option value="">Non précisé</option>{ETUDES.map((x) => <option key={x} value={x}>{x}</option>)}</select></div>
        <div><span className="lib">Langues parlées</span><div style={{ marginTop: 8 }}><Chips options={LANGUES} value={f.langues} onChange={set('langues')} /></div></div>
      </section>

      <section>
        <div><span className="lib">Je cherche</span><div style={{ marginTop: 8 }}><Chips options={INTENTIONS} value={f.intention || undefined} onChange={set('intention')} /></div></div>
        <div><span className="lib">Enfants</span><div style={{ marginTop: 8 }}><Chips options={ENFANTS} value={f.enfants || undefined} onChange={set('enfants')} /></div></div>
        <div className="rang">
          <div><label className="lib" htmlFor="tabac">Tabac</label><select id="tabac" className="zone" value={f.tabac} onChange={(e) => set('tabac')(e.target.value)}>{FREQ.map((x) => <option key={x}>{x}</option>)}</select></div>
          <div><label className="lib" htmlFor="alcool">Alcool</label><select id="alcool" className="zone" value={f.alcool} onChange={(e) => set('alcool')(e.target.value)}>{FREQ.map((x) => <option key={x}>{x}</option>)}</select></div>
        </div>
        <div><span className="lib">Religion <span className="small">· facultatif</span></span><div style={{ marginTop: 8 }}><Chips options={RELIGIONS} value={f.religion} onChange={set('religion')} /></div></div>
        <div><span className="lib">Centres d’intérêt (5 maximum)</span><div style={{ marginTop: 8 }}><Chips options={INTERETS} value={f.interets} onChange={set('interets')} max={5} /></div></div>
      </section>

      {erreur && <div className="erreur" role="alert">{erreur}</div>}
      {ok && <div className="ok-msg" role="status">Profil enregistré.</div>}
      <div className="ed-barre"><button className="cta" type="submit" disabled={!pret || envoi}>{envoi ? 'Enregistrement…' : 'Enregistrer'}</button></div>
    </form>
  );
}
