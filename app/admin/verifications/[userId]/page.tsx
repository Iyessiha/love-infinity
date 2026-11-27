import Link from 'next/link';
import { notFound } from 'next/navigation';
import { age as calcAge, dateHeure, nombre, pays, requireAdmin } from '@/lib/admin';
import { DOCS, GENRE_LABEL, KIND_LABEL, NIVEAU_LABEL, RAISONS_PAR_TYPE, type DocType, type Kind } from '@/lib/verification';
import { decider, toutValider } from '../actions';

export const dynamic = 'force-dynamic';

const LIEN_SECONDES = 600;
const MESSAGES: Record<string, string> = {
  approved: 'Demande validée.',
  rejected: 'Demande refusée.',
  erreur: 'La décision n’a pas pu être enregistrée. Recharge la page et réessaie.',
};
const ORDRE: Kind[] = ['photos', 'selfie', 'document'];
const CONSIGNES: Record<Kind, string[]> = {
  photos: ['Un vrai visage, bien visible', 'Une seule personne par photo', 'Rien de choquant ni de publicitaire'],
  selfie: ['Le visage de la vidéo est celui des photos', 'Le geste demandé est bien réalisé', 'La vidéo est nette et en direct'],
  document: ['Le visage de la pièce est celui des photos', 'Le nom et l’âge correspondent au profil', 'Le document est lisible et non expiré'],
};

export default async function Dossier({ params, searchParams }: { params: Promise<{ userId: string }>; searchParams: Promise<{ m?: string; kind?: string }> }) {
  const { userId } = await params;
  const { m, kind: filtre = '' } = await searchParams;
  const { supabase } = await requireAdmin();

  const [{ data: p }, { data: photos }, { data: demandes }, { count: restants }] = await Promise.all([
    supabase.from('profiles').select('prenom, nom, birth_date, genre, ville, phone_country, verification_level, created_at').eq('id', userId).maybeSingle(),
    supabase.from('profile_photos').select('path').eq('user_id', userId).order('position'),
    supabase.from('verifications').select('id, kind, doc_type, gesture, created_at').eq('user_id', userId).eq('status', 'pending').order('created_at'),
    supabase.from('verifications').select('user_id', { count: 'exact', head: true }).eq('status', 'pending').neq('user_id', userId),
  ]);
  if (!p) notFound();

  if (!demandes || demandes.length === 0) {
    return (
      <>
        <Link href="/admin/verifications" className="muted">← File d’attente</Link>
        <h1>{p.prenom} {p.nom}</h1>
        <div className="adm-ok">Ce dossier est déjà traité. Il n’y a plus de demande en attente pour ce membre.</div>
        <Link href="/admin/verifications" className="adm-btn" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>Retour à la file d’attente</Link>
      </>
    );
  }

  const signer = async (bucket: string, path: string) => (await supabase.storage.from(bucket).createSignedUrl(path, LIEN_SECONDES)).data?.signedUrl;
  const urlsPhotos = (await Promise.all((photos ?? []).map((x) => signer('photos', x.path)))).filter(Boolean) as string[];
  const items = await Promise.all(
    [...demandes].sort((a, b) => ORDRE.indexOf(a.kind as Kind) - ORDRE.indexOf(b.kind as Kind)).map(async (d) => {
      const { data: fichiers } = await supabase.from('verification_files').select('side, file_path').eq('verification_id', d.id);
      const fs = (await Promise.all((fichiers ?? []).map(async (f) => ({ side: f.side, url: await signer('verifications', f.file_path) })))).filter((f) => f.url) as { side: string; url: string }[];
      return { d, fichiers: fs };
    }),
  );
  const ans = calcAge(p.birth_date);
  const attente = Math.round((Date.now() - new Date(demandes[0].created_at).getTime()) / 3600000);

  return (
    <>
      <div className="adm-row">
        <Link href={`/admin/verifications${filtre ? `?kind=${filtre}` : ''}`} className="muted">← File d’attente</Link>
        <div className="adm-sp" />
        <span className="muted">{nombre(restants)} autre(s) dossier(s) en attente</span>
      </div>
      {m && MESSAGES[m] && <div className={m === 'erreur' ? 'adm-alert' : 'adm-ok'} role="status">{MESSAGES[m]}</div>}

      <header className="adm-card adm-fiche">
        <div className="adm-row">
          <h1 style={{ margin: 0 }}>{p.prenom} {p.nom}</h1>
          <span className={`adm-pill ${attente >= 48 ? 'bad' : attente >= 24 ? 'warn' : ''}`}>Attend depuis {attente < 1 ? 'moins d’1 h' : attente < 48 ? `${attente} h` : `${Math.floor(attente / 24)} jours`}</span>
          <div className="adm-sp" />
          {items.length > 1 && (
            <form action={toutValider}>
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="filtre" value={filtre} />
              <button className="adm-btn" type="submit">Tout valider ({items.length})</button>
            </form>
          )}
        </div>
        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '10px 20px', margin: 0 }}>
          {[
            ['Âge', ans !== null ? `${ans} ans` : '—'],
            ['Genre', GENRE_LABEL[p.genre ?? ''] ?? '—'],
            ['Ville', p.ville ?? '—'],
            ['Pays du numéro', pays(p.phone_country)],
            ['Niveau actuel', `${p.verification_level} · ${NIVEAU_LABEL[p.verification_level]}`],
            ['Inscrit le', dateHeure(p.created_at)],
          ].map(([t, v]) => (
            <div key={t}><dt className="muted">{t}</dt><dd style={{ margin: 0, fontWeight: 700 }}>{v}</dd></div>
          ))}
        </dl>
      </header>

      <section className="adm-card" aria-labelledby="h-ph">
        <h2 id="h-ph">Photos du profil (référence)</h2>
        {urlsPhotos.length === 0 ? <p className="adm-empty">Aucune photo.</p> : (
          <div className="adm-photos">
            {urlsPhotos.map((u) => (
              <a key={u} href={u} target="_blank" rel="noopener noreferrer" aria-label="Agrandir la photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="Photo de profil" style={{ height: 240 }} />
              </a>
            ))}
          </div>
        )}
        <p className="note">Clique sur une image pour l’agrandir. Les images restent visibles {LIEN_SECONDES / 60} minutes.</p>
      </section>

      {items.map(({ d, fichiers }) => {
        const kind = d.kind as Kind;
        return (
          <section key={d.id} className="adm-card adm-fiche" aria-labelledby={`h-${d.id}`}>
            <div className="adm-row">
              <h2 id={`h-${d.id}`} style={{ margin: 0 }}>{KIND_LABEL[kind]}{kind === 'document' && d.doc_type ? ` : ${DOCS[d.doc_type as DocType]?.label ?? d.doc_type}` : ''}</h2>
              <div className="adm-sp" />
              <span className="muted">Envoyé le {dateHeure(d.created_at)}</span>
            </div>

            {d.gesture && <div className="adm-alert">Geste demandé au membre : <b>{d.gesture}</b></div>}
            {kind === 'document' && <div className="adm-alert">À comparer avec le document : <b>{p.prenom} {p.nom}</b>, {ans !== null ? `${ans} ans` : 'âge inconnu'}.</div>}

            {fichiers.length > 0 && (
              <div className="adm-photos">
                {fichiers.map((f) => f.side === 'video'
                  ? <video key={f.url} src={f.url} controls playsInline style={{ height: 320 }} />
                  : (
                    <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer" aria-label={`Agrandir ${f.side === 'front' ? 'le recto' : 'le verso'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.url} alt={f.side === 'front' ? 'Recto' : 'Verso'} style={{ height: 300 }} />
                    </a>
                  ))}
              </div>
            )}

            <ul className="muted" style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              {CONSIGNES[kind].map((c) => <li key={c}>{c}</li>)}
            </ul>

            <form action={decider} className="adm-row">
              <input type="hidden" name="id" value={d.id} />
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="filtre" value={filtre} />
              <button className="adm-btn" name="decision" value="approved">Valider</button>
              <div className="adm-sp" />
              <label className="muted" htmlFor={`r-${d.id}`}>Si refus, motif</label>
              <select id={`r-${d.id}`} className="adm-select" name="raison" defaultValue={RAISONS_PAR_TYPE[kind][0]}>
                {RAISONS_PAR_TYPE[kind].map((r) => <option key={r}>{r}</option>)}
              </select>
              <button className="adm-btn danger" name="decision" value="rejected">Refuser</button>
            </form>
          </section>
        );
      })}
      <p className="note">Après ta décision, le dossier suivant s’ouvre automatiquement. Les fichiers envoyés par le membre sont supprimés dès que tu décides.</p>
    </>
  );
}
