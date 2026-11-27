'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { COUNTRIES } from '@/lib/phone';

export default function Telephone() {
  const router = useRouter();
  const [country, setCountry] = useState('CI');
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
        <h1>Bientôt chez toi</h1>
        <p className="sub">Love Infinity ouvre d'abord à Abidjan. Nous gardons ton email et nous te prévenons dès l'ouverture dans ton pays.</p>
      </main>
    );
  }

  return (
    <main className="ph">
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i></i><i></i></div>
      <h1>Ton numéro de téléphone</h1>
      <p className="sub">Un numéro ne peut servir qu'à un seul compte. Il nous permet de te contacter si besoin. Aucun SMS ne t'est envoyé.</p>
      <form onSubmit={envoyer} className="col" style={{ gap: 14 }}>
        <div className="field">
          <label className="lbl" htmlFor="pays">Ton pays</label>
          <select id="pays" className="in" value={country} onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.nom}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="lbl" htmlFor="tel">Numéro de téléphone</label>
          <div className="row" style={{ gap: 8 }}>
            <div className="in" style={{ width: 112, flex: 'none', justifyContent: 'center', whiteSpace: 'nowrap' }}>{pays.indicatif}</div>
            <input id="tel" className="in" type="tel" inputMode="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07 00 00 00 00" />
          </div>
          <span className="hint">Ton numéro reste privé : il n'apparaît jamais sur ton profil.</span>
        </div>
        {!pays.ouvert && <div className="alert">Love Infinity ouvre d'abord à Abidjan. Nous gardons ton email et te prévenons dès l'ouverture chez toi.</div>}
        {erreur && <div className="alert" role="alert">{erreur}</div>}
        <button className="btn" type="submit" disabled={envoi || phone.length < 6}>{envoi ? 'Enregistrement…' : 'Enregistrer mon numéro'}</button>
      </form>
    </main>
  );
}
