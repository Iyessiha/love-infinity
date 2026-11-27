import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { hmac } from '@/lib/hash';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';
import { age, dateCourte, pays, requireAdmin, STATUT_COMPTE, nombre } from '@/lib/admin';
import { GENRE_LABEL, NIVEAU_LABEL } from '@/lib/verification';

const MESSAGES: Record<string, string> = {
  active: 'Compte réactivé.',
  suspended: 'Compte suspendu : le membre ne peut plus utiliser l’application.',
  banned: 'Compte banni : son numéro de téléphone est aussi bloqué pour de futures inscriptions.',
  erreur: 'Action impossible. Tu ne peux pas agir sur ton propre compte ni sur un autre administrateur, et un compte sans numéro ne peut pas être réactivé.',
};
const FILTRES = [['', 'Tous'], ['active', 'Actifs'], ['pending', 'En attente'], ['suspended', 'Suspendus'], ['banned', 'Bannis']] as const;

async function changer(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const statut = String(formData.get('statut'));
  const retour = String(formData.get('retour') || '/admin/membres');
  const base = retour.startsWith('/admin/membres') ? retour.split('?')[0] : '/admin/membres';
  const supabase = await supabaseServer();
  const { data: profil } = await supabase.from('profiles').select('phone_e164').eq('id', id).maybeSingle();
  const { error } = await supabase.rpc('changer_statut_membre', { p_id: id, p_statut: statut });
  if (error) redirect(`${base}?m=erreur`);
  // Bannir bloque aussi le numéro (empreinte seulement) ; réactiver le débloque.
  if (profil?.phone_e164) {
    try {
      const h = hmac(profil.phone_e164);
      const admin = supabaseAdmin();
      if (statut === 'banned') await admin.from('blocked_phones').upsert({ phone_hash: h });
      else await admin.from('blocked_phones').delete().eq('phone_hash', h);
    } catch { /* HASH_SECRET absent : le statut est quand même changé */ }
  }
  revalidatePath('/admin', 'layout');
  redirect(`${base}?m=${statut}`);
}

export default async function Membres({ searchParams }: { searchParams: Promise<{ m?: string; statut?: string; q?: string }> }) {
  const { m: msg, statut = '', q = '' } = await searchParams;
  const { supabase, user } = await requireAdmin();
  const { data: admins } = await supabase.from('admins').select('user_id');
  const idsAdmins = new Set((admins ?? []).map((a) => a.user_id));

  let req = supabase
    .from('profiles')
    .select('id, prenom, nom, genre, birth_date, ville, phone_country, verification_level, account_status, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(200);
  if (['active', 'pending', 'suspended', 'banned'].includes(statut)) req = req.eq('account_status', statut);
  const terme = q.trim().replace(/[%,()*]/g, ' ').slice(0, 40);
  if (terme) req = req.or(`prenom.ilike.%${terme}%,nom.ilike.%${terme}%,ville.ilike.%${terme}%`);
  const { data: membres, count } = await req;

  const lienFiltre = (s: string) => `/admin/membres${s || terme ? '?' : ''}${[s ? `statut=${s}` : '', terme ? `q=${encodeURIComponent(terme)}` : ''].filter(Boolean).join('&')}`;
  const retour = `/admin/membres${statut ? `?statut=${statut}` : ''}`;

  return (
    <>
      <header>
        <h1>Membres inscrits</h1>
        <p className="lede">{nombre(count)} membre(s){statut || terme ? ' correspondant à ta recherche' : ''}. Les 200 plus récents sont affichés. Les emails et numéros de téléphone ne sont pas montrés ici.</p>
      </header>
      {msg && MESSAGES[msg] && <div className={msg === 'erreur' ? 'adm-alert' : 'adm-ok'} role="status">{MESSAGES[msg]}</div>}

      <div className="adm-row">
        <div className="adm-chips" role="group" aria-label="Filtrer par statut">
          {FILTRES.map(([v, l]) => <Link key={v} href={lienFiltre(v)} aria-current={statut === v}>{l}</Link>)}
        </div>
        <div className="adm-sp" />
        <form method="get" className="adm-row" style={{ gap: 8 }}>
          {statut && <input type="hidden" name="statut" value={statut} />}
          <label className="muted" htmlFor="q">Chercher</label>
          <input id="q" name="q" className="adm-input" defaultValue={terme} placeholder="Prénom, nom ou ville" />
          <button className="adm-btn ghost" type="submit">Chercher</button>
        </form>
      </div>

      <div className="adm-card">
        {(membres ?? []).length === 0 ? <p className="adm-empty">Aucun membre ne correspond.</p> : (
          <div className="adm-table-wrap">
            <table>
              <thead>
                <tr>{['Nom', 'Âge', 'Genre', 'Ville', 'Pays', 'Vérification', 'Compte', 'Inscrit le', 'Action'].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {(membres ?? []).map((mb) => {
                  const classe = mb.account_status === 'active' ? 'good' : mb.account_status === 'pending' ? 'warn' : 'bad';
                  return (
                    <tr key={mb.id}>
                      <td><b>{mb.prenom ?? '—'}</b> {mb.nom}</td>
                      <td>{age(mb.birth_date) ?? '—'}</td>
                      <td>{GENRE_LABEL[mb.genre ?? ''] ?? '—'}</td>
                      <td>{mb.ville ?? '—'}</td>
                      <td>{pays(mb.phone_country)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>Niveau {mb.verification_level} · {NIVEAU_LABEL[mb.verification_level]}</td>
                      <td><span className={`adm-pill ${classe}`}>{STATUT_COMPTE[mb.account_status] ?? mb.account_status}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{dateCourte(mb.created_at)}</td>
                      <td>
                        {mb.id === user.id || idsAdmins.has(mb.id) ? <span className="muted">Administrateur</span> : (
                          <form action={changer} className="adm-row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                            <input type="hidden" name="id" value={mb.id} />
                            <input type="hidden" name="retour" value={retour} />
                            {mb.account_status === 'active' || mb.account_status === 'pending'
                              ? <>
                                  <button className="adm-btn ghost sm" name="statut" value="suspended">Suspendre</button>
                                  <button className="adm-btn danger sm" name="statut" value="banned">Bannir</button>
                                </>
                              : <button className="adm-btn sm" name="statut" value="active">Réactiver</button>}
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
