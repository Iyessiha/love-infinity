import Link from 'next/link';

export type Apercu = { id: string; prenom: string; age: number; ville: string | null; intention: string | null; verification_level: number; photo: string | null };

const INTENTIONS: Record<string, string> = { relation_serieuse: 'Relation sérieuse', mariage: 'Mariage', amitie: 'Amitié', decouverte: 'Découverte' };
const NIVEAUX = ['', 'Photos vérifiées', 'Selfie vérifié', 'Identité vérifiée'];

/** Aperçu en lecture seule pour un membre en attente de validation : on regarde, on ne peut pas encore liker ni écrire. */
export function ApercuProfils({ profils }: { profils: Apercu[] }) {
  return (
    <div className="col" style={{ gap: 14 }}>
      <div className="card col" style={{ gap: 6, background: '#FBF0D9', borderColor: '#E8CF9A' }} role="note">
        <b>Aperçu avant validation</b>
        <p className="small">Voici {profils.length} profil(s) du jour. Tu pourras liker et écrire dès que tes photos seront validées. Ton profil n’est visible de personne en attendant.</p>
      </div>
      {profils.length === 0 && <p className="sub">Pas encore de profil à te montrer. Reviens bientôt.</p>}
      {profils.map((p) => (
        <article key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {p.photo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={p.photo} alt={`Photo de ${p.prenom}`} style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', display: 'block' }} />
            : <div style={{ aspectRatio: '4 / 5', background: '#EFE3DA' }} />}
          <div className="col" style={{ padding: 16, gap: 4 }}>
            <b style={{ fontSize: 20 }}>{p.prenom}, {p.age}</b>
            <span className="small">{[p.ville, p.intention ? INTENTIONS[p.intention] : null].filter(Boolean).join(' · ')}</span>
            {p.verification_level > 0 && <span className="small" style={{ color: '#1F6B41' }}>{NIVEAUX[p.verification_level]}</span>}
          </div>
        </article>
      ))}
      <Link className="btn ghost" href="/verification">Retour à mon dossier</Link>
    </div>
  );
}
