'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';
import { RAISONS_PAR_TYPE, type Kind } from '@/lib/verification';

type Client = Awaited<ReturnType<typeof supabaseServer>>;

/** Applique une décision, puis supprime les fichiers sensibles de la demande. Seul un administrateur peut aboutir. */
async function appliquer(supabase: Client, id: string, decision: 'approved' | 'rejected', raison: string | null) {
  const { data: fichiers } = await supabase.from('verification_files').select('file_path').eq('verification_id', id);
  const { error } = await supabase.rpc('decider_verification', { p_id: id, p_decision: decision, p_reason: raison });
  if (error) return false;
  const chemins = (fichiers ?? []).map((f) => f.file_path);
  if (chemins.length) await supabase.storage.from('verifications').remove(chemins);
  await supabase.from('verification_files').delete().eq('verification_id', id);
  return true;
}

/** Après une décision : dossier suivant dans la file (même filtre), ou retour à la file si elle est vide. */
async function suite(supabase: Client, userId: string, kind: string, msg: string) {
  revalidatePath('/admin', 'layout');
  const k = ['photos', 'selfie', 'document'].includes(kind) ? kind : null;
  const { data: suivant } = await supabase.rpc('admin_verif_suivant', { p_exclure: userId, p_kind: k });
  const q = `m=${msg}${k ? `&kind=${k}` : ''}`;
  redirect(suivant ? `/admin/verifications/${suivant}?${q}` : `/admin/verifications?${q}&fini=1`);
}

/** Valide ou refuse une demande précise (photos, selfie ou pièce). */
export async function decider(formData: FormData) {
  const id = String(formData.get('id'));
  const userId = String(formData.get('userId'));
  const decision = formData.get('decision') === 'approved' ? 'approved' : 'rejected';
  const kind = String(formData.get('kind')) as Kind;
  const filtre = String(formData.get('filtre') || '');
  const choisie = String(formData.get('raison') || 'Autre');
  const raison = decision === 'rejected' ? (RAISONS_PAR_TYPE[kind]?.includes(choisie) ? choisie : 'Autre') : null;
  const supabase = await supabaseServer();
  const ok = await appliquer(supabase, id, decision, raison);
  if (!ok) redirect(`/admin/verifications/${userId}?m=erreur`);

  // Reste-t-il d'autres demandes pour ce membre ? Alors on reste sur son dossier.
  const { count } = await supabase.from('verifications').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'pending');
  if ((count ?? 0) > 0) {
    revalidatePath('/admin', 'layout');
    redirect(`/admin/verifications/${userId}?m=${decision}${filtre ? `&kind=${filtre}` : ''}`);
  }
  await suite(supabase, userId, filtre, decision);
}

/** Valide d'un coup toutes les demandes en attente d'un membre. */
export async function toutValider(formData: FormData) {
  const userId = String(formData.get('userId'));
  const filtre = String(formData.get('filtre') || '');
  const supabase = await supabaseServer();
  const { data: demandes } = await supabase.from('verifications').select('id').eq('user_id', userId).eq('status', 'pending');
  let echec = false;
  for (const d of demandes ?? []) if (!(await appliquer(supabase, d.id, 'approved', null))) echec = true;
  if (echec) redirect(`/admin/verifications/${userId}?m=erreur`);
  await suite(supabase, userId, filtre, 'approved');
}
