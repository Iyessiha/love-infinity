import Link from 'next/link';
import { requireUser } from '@/lib/auth';

type V = { kind: string; status: string; reason: string | null; created_at: string };

const NIVEAUX = [
  { kind: 'photos', n: 1, titre: 'Photos', texte: 'Nos équipes vérifient que tes photos sont réelles et nettes.', href: '/verification/photos' },
  { kind: 'selfie', n: 2, titre: 'Selfie vidéo', texte: 'Une courte vidéo avec un geste au hasard prouve que c’est bien toi.', href: '/verification/selfie' },
  { kind: 'document', n: 3, titre: 'Pièce d’identité', texte: 'Recto et verso de ta pièce. Supprimée dès la décision.', href: '/verification/document' },
] as const;

export default async function Verification() {
  const { supabase, user } = await requireUser();
  const [{ data: profil }, { data: demandes }] = await Promise.all([
    supabase.from('profiles').select('verification_level, account_status, phone_e164').eq('id', user.id).single(),
    supabase.from('verifications').select('kind, status, reason, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);
  const derniere = (kind: string) => (demandes as V[] | null)?.find((d) => d.kind === kind);
  const niveau = profil?.verification_level ?? 0;

  return (
    <main className="ph">
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <h1>Vérifie ton profil</h1>
      <p className="sub">Chaque niveau rassure les autres membres. Tu peux t'arrêter au niveau 1 pour commencer.</p>
      <div className="col" style={{ gap: 14 }}>
        {NIVEAUX.map((n) => {
          const d = derniere(n.kind);
          const fait = niveau >= n.n && d?.status === 'approved';
          const attente = d?.status === 'pending';
          const refuse = d?.status === 'rejected';
          return (
            <div key={n.kind} className="card col" style={{ gap: 8 }}>
              <div className="lvl">
                <div className={`n${fait ? ' g' : ''}`}>{fait ? '✓' : n.n}</div>
                <div><b>{n.titre}</b><span>{n.texte}</span></div>
              </div>
              {attente && <p className="small">En cours de vérification (sous 24 heures).</p>}
              {refuse && <p className="small" style={{ color: '#B3261E' }}>Refusé : {d?.reason ?? 'raison non précisée'}. Tu peux réessayer.</p>}
              {fait && <p className="small" style={{ color: '#1F6B41' }}>Validé</p>}
              {!attente && !fait && <Link className="btn ghost" style={{ height: 46 }} href={n.href}>{refuse ? 'Réessayer' : 'Commencer'}</Link>}
            </div>
          );
        })}
      </div>
      <div className="sp"></div>
      {profil?.account_status === 'active'
        ? <Link className="btn gold" href="/decouvrir">Découvrir des profils</Link>
        : <p className="small" style={{ textAlign: 'center' }}>Ton compte sera activé dès que tes photos seront validées. Nous te prévenons par email.</p>}
    </main>
  );
}
