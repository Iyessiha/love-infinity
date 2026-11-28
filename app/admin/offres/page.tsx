import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { dateCourte, fcfa, requireAdmin } from '@/lib/admin';

const MESSAGES: Record<string, string> = {
  prix: 'Prix enregistré.', remises: 'Remises enregistrées.', promo: 'Code promo créé.', maj: 'Code promo mis à jour.', suppr: 'Code promo supprimé.',
  erreur: 'Action impossible : vérifie les valeurs saisies (un code promo déjà utilisé ne peut pas être recréé).',
};
const entier = (v: FormDataEntryValue | null, min: number, max: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
};
const fin = (m: string) => redirect(`/admin/offres?m=${m}`);

async function majPrix(fd: FormData) {
  'use server';
  await requireAdmin();
  const code = String(fd.get('code'));
  const prix = entier(fd.get('prix'), 1000, 100000);
  if (!['essentiel', 'premium'].includes(code) || prix === null) return fin('erreur');
  const { error } = await supabaseAdmin().from('plans').update({ prix_xof: prix, actif: fd.get('actif') === 'on' }).eq('code', code);
  revalidatePath('/', 'layout');
  fin(error ? 'erreur' : 'prix');
}

async function majRemises(fd: FormData) {
  'use server';
  await requireAdmin();
  const db = supabaseAdmin();
  for (const mois of [1, 3, 6, 12]) {
    const pct = entier(fd.get(`m${mois}`), 0, 60);
    if (pct === null) return fin('erreur');
    const { error } = await db.from('plan_durees').update({ remise_pct: pct }).eq('mois', mois);
    if (error) return fin('erreur');
  }
  revalidatePath('/', 'layout');
  fin('remises');
}

async function creerPromo(fd: FormData) {
  'use server';
  await requireAdmin();
  const code = String(fd.get('code') ?? '').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const pct = entier(fd.get('pct'), 1, 90);
  const max = fd.get('max') ? entier(fd.get('max'), 1, 100000) : null;
  const exp = String(fd.get('expire') ?? '');
  if (code.length < 3 || code.length > 24 || pct === null || (fd.get('max') && max === null)) return fin('erreur');
  const { error } = await supabaseAdmin().from('codes_promo').insert({ code, pct, max_utilisations: max, expire_le: exp ? new Date(`${exp}T23:59:59+00:00`).toISOString() : null });
  fin(error ? 'erreur' : 'promo');
}

async function actionPromo(fd: FormData) {
  'use server';
  await requireAdmin();
  const code = String(fd.get('code'));
  const op = String(fd.get('op'));
  const db = supabaseAdmin();
  if (op === 'supprimer') {
    const { error } = await db.from('codes_promo').delete().eq('code', code);
    return fin(error ? 'erreur' : 'suppr');
  }
  const { error } = await db.from('codes_promo').update({ actif: op === 'activer' }).eq('code', code);
  fin(error ? 'erreur' : 'maj');
}

export default async function Offres({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  await requireAdmin();
  const db = supabaseAdmin();
  const [{ data: plans }, { data: durees }, { data: promos }] = await Promise.all([
    db.from('plans').select('code, nom, prix_xof, duree_jours, actif').in('code', ['essentiel', 'premium']).order('prix_xof'),
    db.from('plan_durees').select('mois, remise_pct').order('mois'),
    db.from('codes_promo').select('code, pct, actif, expire_le, max_utilisations, utilisations').order('code'),
  ]);
  const maintenant = Date.now();

  return (
    <>
      <header>
        <h1>Offres et codes promo</h1>
        <p className="lede">Les prix, les remises de durée et les codes promo se règlent ici. Le site public, la page d’abonnement et le paiement utilisent ces valeurs. Le prix mensuel est arrondi à 50 FCFA.</p>
      </header>
      {m && MESSAGES[m] && <div className={m === 'erreur' ? 'adm-alert' : 'adm-ok'} role="status">{MESSAGES[m]}</div>}

      <div className="adm-grid">
        <section className="adm-card" aria-labelledby="h-prix">
          <h2 id="h-prix">Prix par mois</h2>
          {(plans ?? []).map((p) => (
            <form key={p.code} action={majPrix} className="adm-row" style={{ gap: 10, marginBottom: 12 }}>
              <input type="hidden" name="code" value={p.code} />
              <label htmlFor={`prix-${p.code}`} style={{ minWidth: 80 }}><b>{p.nom}</b></label>
              <input id={`prix-${p.code}`} className="adm-input" name="prix" type="number" min={1000} max={100000} step={50} defaultValue={p.prix_xof} style={{ width: 110 }} aria-label={`Prix mensuel ${p.nom} en FCFA`} />
              <span className="muted">FCFA</span>
              <label className="muted" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" name="actif" defaultChecked={p.actif} /> En vente</label>
              <button className="adm-btn sm" type="submit">Enregistrer</button>
            </form>
          ))}
        </section>

        <section className="adm-card" aria-labelledby="h-rem">
          <h2 id="h-rem">Remise selon la durée</h2>
          <form action={majRemises}>
            {(durees ?? []).map((d) => (
              <div key={d.mois} className="adm-row" style={{ gap: 10, marginBottom: 10 }}>
                <label htmlFor={`m${d.mois}`} style={{ minWidth: 80 }}><b>{d.mois} mois</b></label>
                <input id={`m${d.mois}`} className="adm-input" name={`m${d.mois}`} type="number" min={0} max={60} defaultValue={d.remise_pct} style={{ width: 80 }} />
                <span className="muted">% de remise</span>
              </div>
            ))}
            <button className="adm-btn sm" type="submit">Enregistrer les remises</button>
          </form>
        </section>
      </div>

      <section className="adm-card" aria-labelledby="h-promo">
        <h2 id="h-promo">Codes promo</h2>
        <form action={creerPromo} className="adm-row" style={{ gap: 10, marginBottom: 16 }}>
          <input className="adm-input" name="code" placeholder="CODE" aria-label="Code" required minLength={3} maxLength={24} style={{ width: 140, textTransform: 'uppercase' }} />
          <input className="adm-input" name="pct" type="number" min={1} max={90} placeholder="% de remise" aria-label="Pourcentage de remise" required style={{ width: 120 }} />
          <input className="adm-input" name="max" type="number" min={1} placeholder="Limite d’usages" aria-label="Nombre maximum d’utilisations" style={{ width: 140 }} />
          <label className="muted" htmlFor="expire">Expire le</label>
          <input id="expire" className="adm-input" name="expire" type="date" />
          <button className="adm-btn" type="submit">Créer le code</button>
        </form>
        {(promos ?? []).length === 0 ? <p className="adm-empty">Aucun code promo. Crée-en un pour une opération de lancement.</p> : (
          <div className="adm-table-wrap"><table>
            <thead><tr><th>Code</th><th className="num">Remise</th><th className="num">Utilisé</th><th>Expire</th><th>Statut</th><th>Action</th></tr></thead>
            <tbody>{(promos ?? []).map((c) => {
              const expire = c.expire_le && new Date(c.expire_le).getTime() < maintenant;
              const epuise = c.max_utilisations !== null && c.utilisations >= c.max_utilisations;
              const valide = c.actif && !expire && !epuise;
              return (
                <tr key={c.code}>
                  <td><b>{c.code}</b></td>
                  <td className="num">{c.pct} %</td>
                  <td className="num">{c.utilisations}{c.max_utilisations !== null ? ` / ${c.max_utilisations}` : ''}</td>
                  <td>{c.expire_le ? dateCourte(c.expire_le) : 'Jamais'}</td>
                  <td><span className={`adm-pill ${valide ? 'good' : 'bad'}`}>{valide ? 'Valide' : expire ? 'Expiré' : epuise ? 'Épuisé' : 'Désactivé'}</span></td>
                  <td>
                    <form action={actionPromo} className="adm-row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                      <input type="hidden" name="code" value={c.code} />
                      <button className="adm-btn ghost sm" name="op" value={c.actif ? 'desactiver' : 'activer'}>{c.actif ? 'Désactiver' : 'Activer'}</button>
                      {c.utilisations === 0 && <button className="adm-btn danger sm" name="op" value="supprimer">Supprimer</button>}
                    </form>
                  </td>
                </tr>
              );
            })}</tbody>
          </table></div>
        )}
        <p className="note">Un code déjà utilisé se désactive mais ne se supprime pas, pour garder l’historique des paiements. Exemple de prix avec 9 000 FCFA : {fcfa(9000)} / mois.</p>
      </section>
    </>
  );
}
