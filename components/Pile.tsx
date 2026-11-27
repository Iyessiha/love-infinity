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
        <div className="ok-badge" aria-hidden="true">♥</div>
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
      <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 360, background: 'linear-gradient(160deg,#E8B4B8,#D4A24C)', position: 'relative' }}>
          {c.photo && /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.photo} alt={`Photo de ${c.prenom}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          {c.verification_level > 0 && (
            <span className="tag" style={{ position: 'absolute', left: 12, top: 12, background: '#2E8B57', color: '#FBF6EE' }}>✓ {NIVEAUX[c.verification_level]}</span>
          )}
        </div>
        <div className="col" style={{ padding: 16, gap: 8 }}>
          <div className="row"><h2>{c.prenom}, {c.age}</h2><div className="sp"></div><span className="small">{c.ville}</span></div>
          {c.profession && <span className="small">{c.profession}</span>}
          {c.intention && <span className="chip on" style={{ alignSelf: 'flex-start' }}>{INTENTIONS[c.intention]}</span>}
          {c.bio && <p style={{ fontSize: 14 }}>{c.bio}</p>}
          <div className="wrap">{c.interets.map((x) => <span key={x} className="chip">{x}</span>)}</div>
        </div>
      </div>
      {erreur && <div className="alert" role="alert">{erreur}</div>}
      <div className="row" style={{ gap: 12 }}>
        <button className="btn ghost" disabled={envoi} onClick={() => agir('pass')}>Passer</button>
        <button className="btn gold" disabled={envoi} onClick={() => agir('like')}>J'aime</button>
      </div>
      <p className="small" style={{ textAlign: 'center' }}>{reste === null ? 'Likes illimités' : `${reste} like${reste > 1 ? 's' : ''} restant${reste > 1 ? 's' : ''} aujourd'hui`}</p>
    </>
  );
}
