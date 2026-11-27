import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin, age as calcAge, dateHeure } from '@/lib/admin';
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
  revalidatePath('/admin', 'layout');
  redirect(`/admin/verifications?m=${decision === 'approved' ? 'approved' : 'rejected'}`);
}

const ORDRE: Kind[] = ['photos', 'selfie', 'document'];

export default async function Verifications({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const { supabase } = await requireAdmin();

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
    <>
      <header>
        <h1>Vérifications en attente ({demandes?.length ?? 0})</h1>
        <p className="lede">{fiches.length} membre(s) à examiner. Les images restent visibles {LIEN_SECONDES / 60} minutes : recharge la page si elles disparaissent. Les fichiers sont supprimés dès la décision.</p>
      </header>
      {m && MESSAGES[m] && <div className={m === 'erreur' ? 'adm-alert' : 'adm-ok'} role="status">{MESSAGES[m]}</div>}
      {fiches.length === 0 && <div className="adm-card"><p className="adm-empty">Rien à vérifier pour le moment.</p></div>}

      {fiches.map(({ userId, p, items, photos }) => {
        const ans = calcAge(p?.birth_date);
        return (
          <section key={userId} className="adm-card adm-fiche" aria-label={`${p?.prenom ?? ''} ${p?.nom ?? ''}`}>
            <div className="adm-row">
              <b style={{ fontSize: 20, color: '#4A0E2E' }}>{p?.prenom} {p?.nom}</b>
              <span className="muted">{ans !== null ? `${ans} ans` : 'âge inconnu'} · {GENRE_LABEL[p?.genre ?? ''] ?? '—'}{p?.ville ? ` · ${p.ville}` : ''}</span>
            </div>
            <div>
              <div className="muted" style={{ marginBottom: 6 }}>Photos du profil</div>
              {photos.length === 0 ? <span className="muted">Aucune photo.</span> : (
                <div className="adm-photos">
                  {photos.map((u) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={u} src={u} alt="Photo de profil" style={{ height: 150 }} />)}
                </div>
              )}
            </div>

            {items.map(({ d, fichiers }) => {
              const kind = d.kind as Kind;
              return (
                <div key={d.id} className="adm-sub">
                  <div className="adm-row">
                    <b>{KIND_LABEL[kind]}{kind === 'document' && d.doc_type ? ` : ${DOCS[d.doc_type as DocType]?.label ?? d.doc_type}` : ''}</b>
                    <div className="adm-sp" />
                    <span className="muted">{dateHeure(d.created_at)}</span>
                  </div>
                  {kind === 'photos' && <p className="muted" style={{ margin: 0 }}>Vérifie que les photos ci-dessus montrent une vraie personne, un visage visible, rien d’inapproprié.</p>}
                  {d.gesture && <div className="adm-alert">Geste demandé : <b>{d.gesture}</b></div>}
                  {fichiers.length > 0 && (
                    <div className="adm-photos">
                      {fichiers.map((f) => f.side === 'video'
                        ? <video key={f.url} src={f.url} controls playsInline style={{ height: 260 }} />
                        // eslint-disable-next-line @next/next/no-img-element
                        : <img key={f.url} src={f.url} alt={f.side === 'front' ? 'Recto' : 'Verso'} style={{ height: 260 }} />)}
                    </div>
                  )}
                  <form action={decider} className="adm-row">
                    <input type="hidden" name="id" value={d.id} />
                    <input type="hidden" name="kind" value={kind} />
                    <button className="adm-btn" name="decision" value="approved">Valider</button>
                    <label className="muted" htmlFor={`r-${d.id}`}>Motif si refus</label>
                    <select id={`r-${d.id}`} className="adm-select" name="raison" defaultValue={RAISONS_PAR_TYPE[kind][0]}>
                      {RAISONS_PAR_TYPE[kind].map((r) => <option key={r}>{r}</option>)}
                    </select>
                    <button className="adm-btn danger" name="decision" value="rejected">Refuser</button>
                  </form>
                </div>
              );
            })}
          </section>
        );
      })}
    </>
  );
}
