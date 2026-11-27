import Link from 'next/link';
import AutoRefresh from '@/components/AutoRefresh';
import { requireUser } from '@/lib/auth';
import { Check } from '@/components/Icons';

export const dynamic = 'force-dynamic';

type V = { kind: string; status: string; reason: string | null; created_at: string };
type Dossier = { demandes: { kind: string; depuis: string }[]; position: number | null; total: number; delai_h: number | null };

const NIVEAUX = [
  { kind: 'photos', n: 1, titre: 'Photos', texte: 'Nos équipes vérifient que tes photos sont réelles et nettes.', href: '/verification/photos' },
  { kind: 'selfie', n: 2, titre: 'Selfie vidéo', texte: 'Une courte vidéo avec un geste au hasard prouve que c’est bien toi.', href: '/verification/selfie' },
  { kind: 'document', n: 3, titre: 'Pièce d’identité', texte: 'Recto et verso de ta pièce. Supprimée dès la décision.', href: '/verification/document' },
] as const;
const NOMS: Record<string, string> = { photos: 'tes photos', selfie: 'ton selfie vidéo', document: 'ta pièce d’identité' };

function delai(h: number | null) {
  if (h === null) return 'sous 24 heures';
  if (h < 1) return 'moins d’une heure';
  if (h <= 36) return `environ ${h} h`;
  return `environ ${Math.round(h / 24)} jours`;
}

export default async function Verification() {
  const { supabase, user } = await requireUser();
  const [{ data: profil }, { data: demandes }, { data: dossier }, { count: nbPhotos }] = await Promise.all([
    supabase.from('profiles').select('verification_level, account_status, bio, profession, taille_cm, etudes, langues, intention, interets').eq('id', user.id).single(),
    supabase.from('verifications').select('kind, status, reason, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.rpc('mon_dossier'),
    supabase.from('profile_photos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);
  const liste = (demandes ?? []) as V[];
  const derniere = (kind: string) => liste.find((d) => d.kind === kind);
  const niveau = profil?.verification_level ?? 0;
  const actif = profil?.account_status === 'active';
  const d = (dossier ?? null) as Dossier | null;
  const enCours = (d?.demandes ?? []).length > 0;
  const photosEnvoyees = liste.some((x) => x.kind === 'photos');

  // Complétude du profil : un profil riche rassure et donne plus de matchs.
  const etapes = [
    { ok: (nbPhotos ?? 0) >= 3, texte: 'Ajouter au moins 3 photos', href: '/profil' },
    { ok: Boolean(profil?.bio && profil.bio.trim().length >= 40), texte: 'Écrire une présentation d’au moins 40 caractères', href: '/profil/apropos' },
    { ok: Boolean(profil?.profession), texte: 'Indiquer ta profession', href: '/profil/apropos' },
    { ok: Boolean(profil?.intention), texte: 'Dire ce que tu recherches', href: '/profil/style' },
    { ok: (profil?.interets?.length ?? 0) >= 3, texte: 'Choisir au moins 3 centres d’intérêt', href: '/profil/style' },
  ];
  const fait = etapes.filter((e) => e.ok).length;
  const pct = Math.round((fait / etapes.length) * 100);

  return (
    <main className="ph">
      {enCours && <AutoRefresh />}
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i></div>

      {actif && !enCours && (
        <div className="card col" style={{ gap: 10, background: '#E6F3EA', borderColor: '#9CCBAA' }} role="status">
          <b style={{ fontSize: 18, color: '#1F6B41' }}>Ton profil est validé</b>
          <p className="small">Bienvenue ! Tu peux découvrir des profils dès maintenant.</p>
          <Link className="btn gold" href="/decouvrir">Découvrir des profils</Link>
        </div>
      )}

      {enCours && d && (
        <section className="card col" style={{ gap: 14 }} aria-labelledby="h-dossier" aria-live="polite">
          <h2 id="h-dossier" style={{ margin: 0 }}>Ton dossier est en cours d’examen</h2>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {[
              ['Dossier reçu', 'Nous avons bien reçu ' + d.demandes.map((x) => NOMS[x.kind] ?? x.kind).join(', ') + '.', 'fait'],
              ['Examen par notre équipe', d.position && d.position > 1 ? `Tu es n° ${d.position} sur ${d.total} dans la file.` : 'Ton dossier est le prochain à être examiné.', 'cours'],
              ['Décision', 'Cette page se met à jour toute seule dès que c’est décidé.', 'attente'],
            ].map(([t, s, etat]) => (
              <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: 13, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13,
                  background: etat === 'fait' ? '#236B43' : etat === 'cours' ? '#D4A24C' : '#E6D6CC', color: etat === 'attente' ? '#5E4A53' : '#fff' }}>
                  {etat === 'fait' ? <Check /> : etat === 'cours' ? '…' : ''}
                </span>
                <div><b>{t}</b><div className="small">{s}</div></div>
              </li>
            ))}
          </ol>
          <p className="small"><b>Délai habituel : {delai(d.delai_h)}.</b> Tu peux fermer cette page : le statut sera à jour à ton retour.</p>
          {photosEnvoyees && !actif && <Link className="btn ghost" style={{ height: 46 }} href="/decouvrir">Voir un aperçu des profils</Link>}
        </section>
      )}

      {!actif && enCours && pct < 100 && (
        <section className="card col" style={{ gap: 10 }} aria-labelledby="h-prof">
          <div className="row"><h2 id="h-prof" style={{ margin: 0, fontSize: 18 }}>Profite de l’attente</h2><div className="sp"></div><b style={{ color: '#4A0E2E' }}>{pct} %</b></div>
          <p className="small">Un profil complet reçoit plus de likes. Termine-le pendant que nous vérifions.</p>
          <div style={{ height: 8, background: '#EFE3DA', borderRadius: 4, overflow: 'hidden' }} aria-hidden="true"><div style={{ width: `${pct}%`, height: '100%', background: '#4A0E2E' }} /></div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {etapes.map((e) => (
              <li key={e.texte} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 15 }}>
                <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 10, flex: 'none', background: e.ok ? '#236B43' : '#E6D6CC', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{e.ok ? <Check /> : null}</span>
                {e.ok ? <span style={{ color: '#5E4A53', textDecoration: 'line-through' }}>{e.texte}</span> : <Link className="link" href={e.href}>{e.texte}</Link>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <h1>{enCours || actif ? 'Tes niveaux de vérification' : 'Vérifie ton profil'}</h1>
      {!enCours && !actif && <p className="sub">Chaque niveau rassure les autres membres. Tu peux t'arrêter au niveau 1 pour commencer.</p>}
      <div className="col" style={{ gap: 14 }}>
        {NIVEAUX.map((n) => {
          const dem = derniere(n.kind);
          const valide = niveau >= n.n && dem?.status === 'approved';
          const attente = dem?.status === 'pending';
          const refuse = dem?.status === 'rejected';
          return (
            <div key={n.kind} className="card col" style={{ gap: 8 }}>
              <div className="lvl">
                <div className={`n${valide ? ' g' : ''}`}>{valide ? <Check /> : n.n}</div>
                <div><b>{n.titre}</b><span>{n.texte}</span></div>
              </div>
              {attente && <p className="small">En cours de vérification.</p>}
              {refuse && <p className="small" style={{ color: '#B3261E' }}>Refusé : {dem?.reason ?? 'raison non précisée'}. Tu peux réessayer.</p>}
              {valide && <p className="small" style={{ color: '#1F6B41' }}>Validé</p>}
              {!attente && !valide && <Link className="btn ghost" style={{ height: 46 }} href={n.href}>{refuse ? 'Réessayer' : 'Commencer'}</Link>}
            </div>
          );
        })}
      </div>
      <div className="sp"></div>
      {actif && enCours && <Link className="btn gold" href="/decouvrir">Découvrir des profils</Link>}
      {!actif && !enCours && <p className="small" style={{ textAlign: 'center' }}>Ton compte sera activé dès que tes photos seront validées.</p>}
    </main>
  );
}
