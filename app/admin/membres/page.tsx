import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { hmac } from '@/lib/hash';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';
import { GENRE_LABEL, NIVEAU_LABEL } from '@/lib/verification';

export const dynamic = 'force-dynamic';

const STATUT: Record<string, string> = { pending: 'En attente', active: 'Actif', suspended: 'Suspendu', banned: 'Banni' };

const MESSAGES: Record<string, string> = {
  active: 'Compte réactivé.',
  suspended: 'Compte suspendu : le membre ne peut plus utiliser l’application.',
  banned: 'Compte banni : son numéro de téléphone est aussi bloqué pour de futures inscriptions.',
  erreur: 'Action impossible. Tu ne peux pas agir sur ton propre compte ni sur un autre administrateur, et un compte sans numéro ne peut pas être réactivé.',
};

async function changer(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const statut = String(formData.get('statut'));
  const supabase = await supabaseServer();
  const { data: profil } = await supabase.from('profiles').select('phone_e164').eq('id', id).maybeSingle();
  const { error } = await supabase.rpc('changer_statut_membre', { p_id: id, p_statut: statut });
  if (error) redirect('/admin/membres?m=erreur');
  // Bannir bloque aussi le numéro (empreinte seulement) ; réactiver le débloque.
  if (profil?.phone_e164) {
    try {
      const h = hmac(profil.phone_e164);
      const admin = supabaseAdmin();
      if (statut === 'banned') await admin.from('blocked_phones').upsert({ phone_hash: h });
      else await admin.from('blocked_phones').delete().eq('phone_hash', h);
    } catch { /* HASH_SECRET absent : le statut est quand même changé */ }
  }
  revalidatePath('/admin/membres');
  redirect(`/admin/membres?m=${statut}`);
}

export default async function Membres({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m: msg } = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: admin } = await supabase.rpc('is_admin');
  if (!admin) notFound();
  const { data: admins } = await supabase.from('admins').select('user_id');
  const idsAdmins = new Set((admins ?? []).map((a) => a.user_id));

  const { data: membres } = await supabase
    .from('profiles')
    .select('id, prenom, nom, genre, birth_date, ville, phone_country, verification_level, account_status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'Nunito, system-ui, sans-serif', color: '#2B1B22' }}>
      <a href="/admin" style={{ color: '#4A0E2E', fontWeight: 800 }}>← Administration</a>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#4A0E2E' }}>Membres inscrits ({membres?.length ?? 0})</h1>
      <p className="small">Les 200 inscriptions les plus récentes. Les numéros de téléphone et les emails ne sont pas affichés ici.</p>
      {msg && MESSAGES[msg] && <div className="alert" role="status" style={{ margin: '12px 0' }}>{MESSAGES[msg]}</div>}
      {(membres ?? []).length === 0 && <p>Aucun membre pour le moment.</p>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #E6D6CC' }}>
              {['Nom', 'Âge', 'Genre', 'Ville', 'Pays', 'Vérification', 'Compte', 'Inscrit le', 'Action'].map((h) => <th key={h} style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(membres ?? []).map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #E6D6CC' }}>
                <td style={{ padding: '8px 10px' }}><b>{m.prenom ?? '—'}</b> {m.nom}</td>
                <td style={{ padding: '8px 10px' }}>{m.birth_date ? Math.floor((Date.now() - new Date(m.birth_date).getTime()) / 31557600000) : '—'}</td>
                <td style={{ padding: '8px 10px' }}>{GENRE_LABEL[m.genre ?? ''] ?? '—'}</td>
                <td style={{ padding: '8px 10px' }}>{m.ville ?? '—'}</td>
                <td style={{ padding: '8px 10px' }}>{m.phone_country ?? '—'}</td>
                <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>Niveau {m.verification_level} · {NIVEAU_LABEL[m.verification_level]}</td>
                <td style={{ padding: '8px 10px' }}>{STATUT[m.account_status] ?? m.account_status}</td>
                <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
                <td style={{ padding: '8px 10px' }}>
                  {m.id === user.id || idsAdmins.has(m.id) ? <span className="small">Administrateur</span> : (
                    <form action={changer} className="row" style={{ gap: 6 }}>
                      <input type="hidden" name="id" value={m.id} />
                      {m.account_status === 'active' || m.account_status === 'pending'
                        ? <>
                            <button className="btn ghost" style={{ padding: '6px 12px', minHeight: 0, width: 'auto' }} name="statut" value="suspended">Suspendre</button>
                            <button className="btn ghost" style={{ padding: '6px 12px', minHeight: 0, width: 'auto' }} name="statut" value="banned">Bannir</button>
                          </>
                        : <button className="btn" style={{ padding: '6px 12px', minHeight: 0, width: 'auto' }} name="statut" value="active">Réactiver</button>}
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
