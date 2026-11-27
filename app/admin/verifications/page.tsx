import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { DOCS, GENRE_LABEL, KIND_LABEL, RAISONS_PAR_TYPE, type DocType, type Kind } from '@/lib/verification';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const LIEN_SECONDES = 300;
const MESSAGES: Record<string, string> = {
  approved: 'Demande validée. Les fichiers ont été supprimés.',
  rejected: 'Demande refusée. Les fichiers ont été supprimés.',
  erreur: 'La décision n’a pas pu être enregistrée. Recharge la page et réessaie.',
};

/** Décision : met à jour la demande puis supprime les fichiers sensibles. Seul un administrateur peut aboutir. */
async function decider(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const decision = String(formData.get('decision'));
  const kind = String(formData.get('kind')) as Kind;
  const choisie = String(formData.get('raison') || 'Autre');
  const raison = decision === 'rejected' ? (RAISONS_PAR_TYPE[kind]?.includes(choisie) ? choisie : 'Autre') : null;
  const supabase = await supabaseServer();

  const { data: fichiers } = await supabase.from('verification_files').select('file_path').eq('verification_id', id);
  const { error } = await supabase.rpc('decider_verification', { p_id: id, p_decision: decision, p_reason: raison });
  if (error) redirect('/admin/verifications?m=erreur');

  const chemins = (fichiers ?? []).map((f) => f.file_path);
  if (chemins.length) await supabase.storage.from('verifications').remove(chemins);
  await supabase.from('verification_files').delete().eq('verification_id', id);
  revalidatePath('/admin/verifications');
  revalidatePath('/admin');
  redirect(`/admin/verifications?m=${decision === 'approved' ? 'approved' : 'rejected'}`);
}

const ORDRE: Kind[] = ['photos', 'selfie', 'document'];

export default async function Verifications({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const { supabase } = await requireUser();
  const { data: admin } = await supabase.rpc('is_admin');
  if (!admin) notFound();

  const { data: demandes } = await supabase
    .from('verifications')
    .select('id, user_id, kind, doc_type, gesture, created_at')
    .eq('status', 'pending')
    .order('created_at');

  // Une fiche par membre : toutes ses demandes en attente ensemble.
  const parMembre = new Map<string, NonNullable<typeof demandes>>();
  for (const d of demandes ?? []) parMembre.set(d.user_id, [...(parMembre.get(d.user_id) ?? []), d]);

  const signer = async (bucket: string, path: string) =>
    (await supabase.storage.from(bucket).createSignedUrl(path, LIEN_SECONDES)).data?.signedUrl;

  const fiches = await Promise.all(
    [...parMembre.entries()].map(async ([userId, liste]) => {
      const [{ data: p }, { data: photos }] = await Promise.all([
        supabase.from('profiles').select('prenom, nom, birth_date, genre, ville, verification_level').eq('id', userId).single(),
        supabase.from('profile_photos').select('path').eq('user_id', userId).order('position'),
      ]);
      const items = await Promise.all(
        liste.map(async (d) => {
          const { data: fichiers } = await supabase.from('verification_files').select('side, file_path').eq('verification_id', d.id);
          const fs = (await Promise.all((fichiers ?? []).map(async (f) => ({ side: f.side, url: await signer('verifications', f.file_path) })))).filter((f) => f.url) as { side: string; url: string }[];
          return { d, fichiers: fs };
        }),
      );
      items.sort((a, b) => ORDRE.indexOf(a.d.kind as Kind) - ORDRE.indexOf(b.d.kind as Kind));
      return {
        userId, p, items,
        photos: (await Promise.all((photos ?? []).map((x) => signer('photos', x.path)))).filter(Boolean) as string[],
      };
    }),
  );

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'Nunito, system-ui, sans-serif', color: '#2B1B22' }}>
      <a href="/admin" style={{ color: '#4A0E2E', fontWeight: 800 }}>← Administration</a>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#4A0E2E' }}>Vérifications en attente ({demandes?.length ?? 0})</h1>
      <p className="small">{fiches.length} membre(s) à examiner. Les images restent visibles {LIEN_SECONDES / 60} minutes : recharge la page si elles disparaissent. Les fichiers sont supprimés dès la décision.</p>
      {m && MESSAGES[m] && <div className="alert" role="status" style={{ margin: '12px 0' }}>{MESSAGES[m]}</div>}
      {fiches.length === 0 && <p>Rien à vérifier pour le moment.</p>}

      {fiches.map(({ userId, p, items, photos }) => {
        const age = p?.birth_date ? Math.floor((Date.now() - new Date(p.birth_date).getTime()) / 31557600000) : null;
        return (
          <section key={userId} className="card" style={{ margin: '20px 0', display: 'grid', gap: 14 }}>
            <div className="row" style={{ flexWrap: 'wrap' }}>
              <b style={{ fontSize: 20, color: '#4A0E2E' }}>{p?.prenom} {p?.nom}</b>
              <span className="small">{age !== null ? `${age} ans` : 'âge inconnu'} · {GENRE_LABEL[p?.genre ?? ''] ?? '—'}{p?.ville ? ` · ${p.ville}` : ''}</span>
            </div>
            <div>
              <div className="small" style={{ marginBottom: 6 }}>Photos du profil</div>
              {photos.length === 0 ? <span className="small">Aucune photo.</span> : (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {photos.map((u) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={u} src={u} alt="Photo de profil" style={{ height: 150, borderRadius: 10 }} />)}
                </div>
              )}
            </div>

            {items.map(({ d, fichiers }) => {
              const kind = d.kind as Kind;
              return (
                <div key={d.id} style={{ borderTop: '1px solid #E6D6CC', paddingTop: 14, display: 'grid', gap: 10 }}>
                  <div className="row">
                    <b>{KIND_LABEL[kind]}{kind === 'document' && d.doc_type ? ` : ${DOCS[d.doc_type as DocType]?.label ?? d.doc_type}` : ''}</b>
                    <div className="sp"></div>
                    <span className="small">{new Date(d.created_at).toLocaleString('fr-FR')}</span>
                  </div>
                  {kind === 'photos' && <p className="small" style={{ margin: 0 }}>Vérifie que les photos ci-dessus montrent une vraie personne, un visage visible, rien d’inapproprié.</p>}
                  {d.gesture && <div className="alert">Geste demandé : <b>{d.gesture}</b></div>}
                  {fichiers.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {fichiers.map((f) => f.side === 'video'
                        ? <video key={f.url} src={f.url} controls playsInline style={{ height: 260, borderRadius: 10 }} />
                        // eslint-disable-next-line @next/next/no-img-element
                        : <img key={f.url} src={f.url} alt={f.side === 'front' ? 'Recto' : 'Verso'} style={{ height: 260, borderRadius: 10 }} />)}
                    </div>
                  )}
                  <form action={decider} className="row" style={{ flexWrap: 'wrap' }}>
                    <input type="hidden" name="id" value={d.id} />
                    <input type="hidden" name="kind" value={kind} />
                    <button className="btn" style={{ width: 160 }} name="decision" value="approved">Valider</button>
                    <label className="small" htmlFor={`r-${d.id}`} style={{ marginLeft: 8 }}>Motif si refus</label>
                    <select id={`r-${d.id}`} className="in" name="raison" style={{ width: 260 }} defaultValue={RAISONS_PAR_TYPE[kind][0]}>
                      {RAISONS_PAR_TYPE[kind].map((r) => <option key={r}>{r}</option>)}
                    </select>
                    <button className="btn ghost" style={{ width: 160 }} name="decision" value="rejected">Refuser</button>
                  </form>
                </div>
              );
            })}
          </section>
        );
      })}
    </main>
  );
}
