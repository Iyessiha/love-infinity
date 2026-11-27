import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function traiter(formData: FormData) {
  'use server';
  const supabase = await supabaseServer();
  await supabase.from('reports').update({ status: 'handled' }).eq('id', String(formData.get('id')));
  revalidatePath('/admin/signalements');
}

const LABELS: Record<string, string> = {
  faux_profil: 'Faux profil', arnaque: 'Arnaque', harcelement: 'Harcèlement',
  contenu_inapproprie: 'Contenu inapproprié', mineur: 'Personne mineure', autre: 'Autre',
};

export default async function Signalements() {
  const { supabase } = await requireUser();
  const { data: admin } = await supabase.rpc('is_admin');
  if (!admin) notFound();

  const { data } = await supabase.from('reports').select('id,reporter_id,reported_id,reason,details,status,created_at').order('status').order('created_at', { ascending: false }).limit(100);
  const ids = [...new Set((data ?? []).map((r) => r.reported_id))];
  const { data: profils } = ids.length ? await supabase.from('profiles').select('id,prenom,nom').in('id', ids) : { data: [] };
  const nom = (id: string) => { const p = profils?.find((x) => x.id === id); return p ? `${p.prenom} ${p.nom ?? ''}` : id.slice(0, 8); };

  return (
    <main className="ph">
      <h1>Signalements</h1>
      {(data ?? []).length === 0 && <p className="sub">Aucun signalement.</p>}
      <div className="col">
        {(data ?? []).map((r) => (
          <div key={r.id} className="card col" style={{ gap: 6 }}>
            <div className="row"><b>{nom(r.reported_id)}</b><div className="sp"></div><span className="tag">{LABELS[r.reason]}</span></div>
            {r.details && <p className="small">{r.details}</p>}
            <p className="small">{new Date(r.created_at).toLocaleString('fr-FR')} · {r.status === 'open' ? 'À traiter' : 'Traité'}</p>
            {r.status === 'open' && <form action={traiter}><input type="hidden" name="id" value={r.id} /><button className="btn ghost" style={{ height: 44 }}>Marquer comme traité</button></form>}
          </div>
        ))}
      </div>
    </main>
  );
}
