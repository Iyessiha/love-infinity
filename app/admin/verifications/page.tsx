import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { RAISONS } from '@/lib/verification';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const LIEN_SECONDES = 120;

/** Décision : met à jour la demande puis supprime les fichiers sensibles. Seul un administrateur peut aboutir. */
async function decider(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const decision = String(formData.get('decision'));
  const raison = decision === 'rejected' ? String(formData.get('raison') || 'Autre') : null;
  const supabase = await supabaseServer();

  const { data: fichiers } = await supabase.from('verification_files').select('file_path').eq('verification_id', id);
  const { error } = await supabase.rpc('decider_verification', { p_id: id, p_decision: decision, p_reason: raison });
  if (error) return;

  const chemins = (fichiers ?? []).map((f) => f.file_path);
  if (chemins.length) await supabase.storage.from('verifications').remove(chemins);
  await supabase.from('verification_files').delete().eq('verification_id', id);
  revalidatePath('/admin/verifications');
}

const LABELS: Record<string, string> = { photos: 'Photos', selfie: 'Selfie vidéo', document: 'Pièce d’identité' };

export default async function Admin() {
  const { supabase } = await requireUser();
  const { data: admin } = await supabase.rpc('is_admin');
  if (!admin) notFound();

  const { data: demandes } = await supabase
    .from('verifications')
    .select('id, user_id, kind, doc_type, gesture, created_at')
    .eq('status', 'pending')
    .order('created_at');

  const cartes = await Promise.all(
    (demandes ?? []).map(async (d) => {
      const [{ data: p }, { data: photos }, { data: fichiers }] = await Promise.all([
        supabase.from('profiles').select('prenom, nom, birth_date, genre').eq('id', d.user_id).single(),
        supabase.from('profile_photos').select('path').eq('user_id', d.user_id).order('position'),
        supabase.from('verification_files').select('side, file_path').eq('verification_id', d.id),
      ]);
      const signer = async (bucket: string, path: string) =>
        (await supabase.storage.from(bucket).createSignedUrl(path, LIEN_SECONDES)).data?.signedUrl;
      return {
        d, p,
        photos: (await Promise.all((photos ?? []).map((x) => signer('photos', x.path)))).filter(Boolean) as string[],
        fichiers: (await Promise.all((fichiers ?? []).map(async (f) => ({ side: f.side, url: await signer('verifications', f.file_path) })))).filter((f) => f.url) as { side: string; url: string }[],
      };
    }),
  );

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'Nunito, system-ui, sans-serif', color: '#2B1B22' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#4A0E2E' }}>Vérifications en attente ({cartes.length})</h1>
      <p className="small">Les liens des images expirent après {LIEN_SECONDES} secondes : recharge la page si besoin. Les fichiers sont supprimés dès la décision.</p>
      {cartes.length === 0 && <p>Rien à vérifier pour le moment.</p>}
      {cartes.map(({ d, p, photos, fichiers }) => {
        const age = p?.birth_date ? Math.floor((Date.now() - new Date(p.birth_date).getTime()) / 31557600000) : '?';
        return (
          <section key={d.id} className="card" style={{ margin: '16px 0', display: 'grid', gap: 12 }}>
            <div className="row">
              <b>{LABELS[d.kind]}{d.doc_type ? ` · ${d.doc_type}` : ''}</b>
              <div className="sp"></div>
              <span className="small">{new Date(d.created_at).toLocaleString('fr-FR')}</span>
            </div>
            <div>{p?.prenom} {p?.nom} · {age} ans · {p?.genre}</div>
            {d.gesture && <div className="alert">Geste demandé : <b>{d.gesture}</b></div>}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {photos.map((u) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={u} src={u} alt="Photo de profil" style={{ height: 160, borderRadius: 10 }} />)}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {fichiers.map((f) => f.side === 'video'
                ? <video key={f.url} src={f.url} controls playsInline style={{ height: 260, borderRadius: 10 }} />
                // eslint-disable-next-line @next/next/no-img-element
                : <img key={f.url} src={f.url} alt={f.side === 'front' ? 'Recto' : 'Verso'} style={{ height: 260, borderRadius: 10 }} />)}
            </div>
            <form action={decider} className="row" style={{ flexWrap: 'wrap' }}>
              <input type="hidden" name="id" value={d.id} />
              <button className="btn" style={{ width: 160 }} name="decision" value="approved">Valider</button>
              <select className="in" name="raison" style={{ width: 280 }} defaultValue={RAISONS[0]}>
                {RAISONS.map((r) => <option key={r}>{r}</option>)}
              </select>
              <button className="btn ghost" style={{ width: 160 }} name="decision" value="rejected">Refuser</button>
            </form>
          </section>
        );
      })}
    </main>
  );
}
