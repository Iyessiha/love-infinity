'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Chips } from '@/components/Chips';
import { ProfilShell } from '@/components/ProfilShell';
import { ENFANTS, FREQ, INTENTIONS, INTERETS, RELIGIONS } from '@/lib/profile';
import { sauverEtape } from '@/lib/save';
import { useT } from '@/components/I18n';

export default function Style() {
  const router = useRouter();
  const t = useT();
  const [intention, setIntention] = useState('');
  const [enfants, setEnfants] = useState('');
  const [tabac, setTabac] = useState('Non');
  const [alcool, setAlcool] = useState('Non');
  const [religion, setReligion] = useState<string>('Je préfère ne pas dire');
  const [interets, setInterets] = useState<string[]>([]);
  const [erreur, setErreur] = useState<string>();
  const [envoi, setEnvoi] = useState(false);
  const pret = intention && enfants;

  async function suite(e: React.FormEvent) {
    e.preventDefault();
    if (!pret || envoi) return;
    setEnvoi(true);
    setErreur(undefined);
    const err = await sauverEtape(3, { intention, enfants, tabac, alcool, religion, interets }, router.push);
    setEnvoi(false);
    if (err) return setErreur(err);
    router.push('/verification');
  }

  return (
    <ProfilShell step={3} back="/profil/apropos">
      <form onSubmit={suite} className="col" style={{ gap: 12 }}>
        <div className="field"><span className="lbl">{t('ed.looking')}</span><Chips options={INTENTIONS} value={intention || undefined} onChange={setIntention} /><span className="hint">{t('pf.intentHint')}</span></div>
        <div className="field"><span className="lbl">{t('ed.kids')}</span><Chips options={ENFANTS} value={enfants || undefined} onChange={setEnfants} /></div>
        <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="tabac">{t('ed.tobacco')}</label><select id="tabac" className="in" value={tabac} onChange={(e) => setTabac(e.target.value)}>{FREQ.map((x) => <option key={x} value={x}>{t.v(x)}</option>)}</select></div>
          <div className="field" style={{ flex: 1 }}><label className="lbl" htmlFor="alcool">{t('ed.alcohol')}</label><select id="alcool" className="in" value={alcool} onChange={(e) => setAlcool(e.target.value)}>{FREQ.map((x) => <option key={x} value={x}>{t.v(x)}</option>)}</select></div>
        </div>
        <div className="field"><span className="lbl">{t('ed.religion')} <span className="small" style={{ fontWeight: 600 }}>· {t('c.optional')}</span></span><Chips options={RELIGIONS} value={religion} onChange={setReligion} /><span className="hint">{t('pf.relHint')}</span></div>
        <div className="field"><span className="lbl">{t('ed.interests')}</span><Chips options={INTERETS} value={interets} onChange={setInterets} max={5} /></div>
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" style={{ flex: 'none' }} type="submit" disabled={!pret || envoi}>{envoi ? t('c.saving') : t('c.continue')}</button>
      </form>
    </ProfilShell>
  );
}
