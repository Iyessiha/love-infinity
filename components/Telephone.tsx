'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { COUNTRIES } from '@/lib/phone';
import { LangSwitch, useT } from '@/components/I18n';

export function Telephone({ defaut }: { defaut: string }) {
  const router = useRouter();
  const t = useT();
  const [country, setCountry] = useState(COUNTRIES.some((c) => c.code === defaut) ? defaut : 'CI');
  const [phone, setPhone] = useState('');
  const [erreur, setErreur] = useState<string>();
  const [attente, setAttente] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const pays = COUNTRIES.find((c) => c.code === country)!;

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(undefined);
    const r = await fetch('/api/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, phone }),
    });
    const j = await r.json();
    setEnvoi(false);
    if (!j.ok) return setErreur(j.message);
    if (j.waitlist) return setAttente(true);
    router.push('/profil');
  }

  if (attente) {
    return (
      <main className="ph" style={{ justifyContent: 'center' }}>
        <h1>{t('ph.soonT')}</h1>
        <p className="sub">{t('ph.soonP')}</p>
      </main>
    );
  }

  return (
    <main className="ph">
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i></i><i></i></div>
      <h1>{t('ph.title')}</h1>
      <p className="sub">{t('ph.intro')}</p>
      <form onSubmit={envoyer} className="col" style={{ gap: 14 }}>
        <div className="field">
          <label className="lbl" htmlFor="pays">{t('ph.country')}</label>
          <select id="pays" className="in" value={country} onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.nom}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="lbl" htmlFor="tel">{t('ph.number')}</label>
          <div className="row" style={{ gap: 8 }}>
            <div className="in" style={{ width: 112, flex: 'none', justifyContent: 'center', whiteSpace: 'nowrap' }}>{pays.indicatif}</div>
            <input id="tel" className="in" type="tel" inputMode="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07 00 00 00 00" />
          </div>
          <span className="hint">{t('ph.private')}</span>
        </div>
        {!pays.ouvert && <div className="alert">{t('ph.closed')}</div>}
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" type="submit" disabled={envoi || phone.length < 6}>{envoi ? t('c.saving') : t('ph.save')}</button>
      </form>
      <LangSwitch />
    </main>
  );
}
