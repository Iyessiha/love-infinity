'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Chips } from '@/components/Chips';
import { ProfilShell } from '@/components/ProfilShell';
import { sauverEtape } from '@/lib/save';
import { useT } from '@/components/I18n';

export default function Bases() {
  const router = useRouter();
  const t = useT();
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
      <p className="sub" style={{ fontSize: 14, marginTop: -4 }}>{t('pf.privNote')}</p>
      <form onSubmit={suite} className="col" style={{ gap: 12 }}>
        <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="prenom">{t('pf.first')}</label><input id="prenom" className="in" value={f.prenom} onChange={(e) => set('prenom')(e.target.value)} autoComplete="given-name" /></div>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="nom">{t('pf.last')}</label><input id="nom" className="in" value={f.nom} onChange={(e) => set('nom')(e.target.value)} autoComplete="family-name" /></div>
        </div>
        <span className="hint" style={{ marginTop: -6 }}>{t('pf.nameHint')}</span>
        <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="naiss">{t('pf.birth')}</label><input id="naiss" className="in" type="date" value={f.birth_date} onChange={(e) => set('birth_date')(e.target.value)} autoComplete="bday" /></div>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="ville">{t('pf.city')}</label><input id="ville" className="in" value={f.ville} onChange={(e) => set('ville')(e.target.value)} /></div>
        </div>
        <span className="hint" style={{ marginTop: -6 }}>{t('pf.ageHint')}</span>
        <div className="field"><span className="lbl">{t('pf.iam')}</span><Chips options={[['homme', 'Un homme'], ['femme', 'Une femme']] as const} value={f.genre || undefined} onChange={set('genre')} /></div>
        <div className="field"><span className="lbl">{t('pf.meet')}</span><Chips options={[['homme', 'Un homme'], ['femme', 'Une femme']] as const} value={f.recherche || undefined} onChange={set('recherche')} /></div>
        <span className="hint">{t('pf.photosHint')}</span>
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" style={{ flex: 'none' }} type="submit" disabled={!pret || envoi}>{envoi ? t('c.saving') : t('c.continue')}</button>
      </form>
    </ProfilShell>
  );
}
