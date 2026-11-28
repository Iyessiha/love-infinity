import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';
import { dateHeure, MOTIFS_SIGNALEMENT, nombre, requireAdmin, STATUT_COMPTE } from '@/lib/admin';

const MESSAGES: Record<string, string> = {
  handled: 'Signalement classé comme traité.',
  suspended: 'Membre signalé suspendu et signalement classé.',
  erreur: 'Action impossible. Recharge la page et réessaie. Un administrateur ne peut pas être suspendu.',
};

async function traiter(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const suspendre = formData.get('action') === 'suspendre';
  const supabase = await supabaseServer();
  const { data: r } = await supabase.from('reports').select('reported_id').eq('id', id).eq('status', 'open').maybeSingle();
  if (!r) redirect('/admin/signalements?m=erreur');
  if (suspendre) {
    const { error } = await supabase.rpc('changer_statut_membre', { p_id: r.reported_id, p_statut: 'suspended' });
    if (error) redirect('/admin/signalements?m=erreur');
  }
  const { error } = await supabase.from('reports').update({ status: 'handled' }).eq('id', id);
  if (error) redirect('/admin/signalements?m=erreur');
  revalidatePath('/admin', 'layout');
  redirect(`/admin/signalements?m=${suspendre ? 'suspended' : 'handled'}`);
}

export default async function Signalements({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: ouverts } = await supabase
    .from('reports')
    .select('id, reporter_id, reported_id, reason, details, created_at')
    .eq('status', 'open')
    .order('created_at');
  const ids = [...new Set((ouverts ?? []).flatMap((r) => [r.reporter_id, r.reported_id]))];
  const { data: profils } = ids.length
    ? await supabase.from('profiles').select('id, prenom, nom, account_status').in('id', ids)
    : { data: [] as { id: string; prenom: string | null; nom: string | null; account_status: string }[] };
  const nom = new Map((profils ?? []).map((p) => [p.id, p]));
  const lib = (id: string) => { const p = nom.get(id); return p ? `${p.prenom ?? ''} ${p.nom ?? ''}`.trim() || 'Sans nom' : 'Compte supprimé'; };
  // Un même membre signalé plusieurs fois remonte en premier.
  const nbParMembre = new Map<string, number>();
  (ouverts ?? []).forEach((r) => nbParMembre.set(r.reported_id, (nbParMembre.get(r.reported_id) ?? 0) + 1));

  return (
    <>
      <header>
        <h1>Signalements ouverts ({nombre(ouverts?.length)})</h1>
        <p className="lede">Lis le motif et le message, puis classe le signalement ou suspends le membre signalé. Un signalement pour « personne mineure » est prioritaire.</p>
      </header>
      {m && MESSAGES[m] && <div className={m === 'erreur' ? 'adm-alert' : 'adm-ok'} role="status">{MESSAGES[m]}</div>}
      {(ouverts ?? []).length === 0 && <div className="adm-card"><p className="adm-empty">Aucun signalement ouvert.</p></div>}

      {(ouverts ?? []).map((r) => {
        const p = nom.get(r.reported_id);
        const deja = p && p.account_status !== 'active' && p.account_status !== 'pending';
        return (
          <section key={r.id} className="adm-card adm-fiche" aria-label={`Signalement : ${MOTIFS_SIGNALEMENT[r.reason] ?? r.reason}`}>
            <div className="adm-row">
              <span className={`adm-pill ${r.reason === 'mineur' || r.reason === 'arnaque' ? 'bad' : 'warn'}`}>{MOTIFS_SIGNALEMENT[r.reason] ?? r.reason}</span>
              {(nbParMembre.get(r.reported_id) ?? 0) > 1 && <span className="adm-pill bad">{nbParMembre.get(r.reported_id)} signalements sur ce membre</span>}
              <div className="adm-sp" />
              <span className="muted">{dateHeure(r.created_at)}</span>
            </div>
            <div>Membre signalé : <b>{lib(r.reported_id)}</b>{p ? <span className="muted"> · compte {STATUT_COMPTE[p.account_status]?.toLowerCase()}</span> : null}</div>
            <div className="muted">Signalé par {lib(r.reporter_id)}</div>
            {r.details ? <blockquote style={{ margin: 0, padding: '10px 14px', background: '#FBF6EE', borderLeft: '3px solid #E8873A', borderRadius: 8 }}>{r.details}</blockquote> : <p className="muted" style={{ margin: 0 }}>Aucun message joint.</p>}
            <form action={traiter} className="adm-row">
              <input type="hidden" name="id" value={r.id} />
              <button className="adm-btn" name="action" value="classer">Classer comme traité</button>
              {!deja && <button className="adm-btn danger" name="action" value="suspendre">Suspendre le membre et classer</button>}
            </form>
          </section>
        );
      })}
    </>
  );
}
