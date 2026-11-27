'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type Carte = {
  id: string; prenom: string; age: number; ville: string; bio: string | null; intention: string | null;
  profession: string | null; interets: string[]; verification_level: number; photo: string | null;
};

const INTENTIONS: Record<string, string> = { relation_serieuse: 'Relation sérieuse', mariage: 'Mariage', amitie: 'Amitié', decouverte: 'Découverte' };
const NIVEAUX = ['', 'Photos vérifiées', 'Selfie vérifié', 'Identité vérifiée'];

export function Pile({ cartes, restants }: { cartes: Carte[]; restants: number | null }) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [reste, setReste] = useState(restants);
  const [match, setMatch] = useState<Carte | null>(null);
  const [erreur, setErreur] = useState<string>();
  const [envoi, setEnvoi] = useState(false);
  const c = cartes[i];

  async function agir(action: 'like' | 'pass') {
    if (!c || envoi) return;
    setEnvoi(true);
    setErreur(undefined);
    try {
      const r = await fetch('/api/swipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: c.id, action }) });
      if (r.status === 401) return router.push('/connexion');
      const j = await r.json();
      if (!j.ok) return setErreur(j.message);
      if (j.restants !== undefined) setReste(j.restants);
      if (j.match) setMatch(c);
      setI((n) => n + 1);
    } catch {
      setErreur('Connexion impossible. Réessaie.');
    } finally {
      setEnvoi(false);
    }
  }

  if (match) {
    return (
      <div className="col center" style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
        <div className="ok-badge" aria-hidden="true"><svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5.5 6.2 5.5c2 0 3.3 1.1 4.1 2.4l1.7 2.4 1.7-2.4c.8-1.3 2.1-2.4 4.1-2.4 3.2 0 5 3.1 3.7 6.3C19.5 16.4 12 21 12 21z"/></svg></div>
        <h1 style={{ textAlign: 'center' }}>C'est un match !</h1>
        <p className="sub" style={{ textAlign: 'center' }}>Toi et {match.prenom} vous êtes plu. Vous pourrez bientôt vous écrire.</p>
        <button className="btn" onClick={() => setMatch(null)}>Continuer</button>
        <Link className="link" href="/matchs">Voir mes matchs</Link>
      </div>
    );
  }

  if (!c) {
    return (
      <div className="col center" style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
        <h2>Tu as tout vu pour l'instant</h2>
        <p className="sub" style={{ textAlign: 'center' }}>De nouveaux profils arrivent chaque jour.</p>
        <button className="btn ghost" onClick={() => router.refresh()}>Actualiser</button>
      </div>
    );
  }

  return (
    <>
      <div key={c.id} className="card carte-entree" style={{ padding: 0, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="profil-photo">
          {c.photo && /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.photo} alt={`Photo de ${c.prenom}`} loading="lazy" />}
          {c.verification_level > 0 && <span className="badge-verif"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg> {NIVEAUX[c.verification_level]}</span>}
          <span className="profil-nom">{c.prenom}, {c.age}</span>
        </div>
        <div className="col" style={{ padding: 16, gap: 8 }}>
          <span className="small" style={{ color: '#5E4A53' }}>{c.ville}{c.profession ? ` · ${c.profession}` : ''}</span>
                    {c.intention && <span className="chip on" style={{ alignSelf: 'flex-start' }}>{INTENTIONS[c.intention]}</span>}
          {c.bio && <p style={{ fontSize: 14 }}>{c.bio}</p>}
          <div className="wrap">{c.interets.map((x) => <span key={x} className="chip">{x}</span>)}</div>
        </div>
      </div>
      {erreur && <div className="alert" role="alert">{erreur}</div>}
      <div className="actions">
        <button className="btn ghost" disabled={envoi} onClick={() => agir('pass')} aria-label={`Passer ${c.prenom}`}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg> Passer</button>
        <button className="btn gold" disabled={envoi} onClick={() => agir('like')} aria-label={`Aimer ${c.prenom}`}><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5.5 6.2 5.5c2 0 3.3 1.1 4.1 2.4l1.7 2.4 1.7-2.4c.8-1.3 2.1-2.4 4.1-2.4 3.2 0 5 3.1 3.7 6.3C19.500 16.400 12 21 12 21z"/></svg> J'aime</button>
      </div>
      <p className="small" role="status" style={{ textAlign: 'center' }}>{reste === null ? 'Likes illimités' : `${reste} like${reste > 1 ? 's' : ''} restant${reste > 1 ? 's' : ''} aujourd'hui`}</p>
    </>
  );
}
