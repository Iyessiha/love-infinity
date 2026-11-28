import { dateHeure, fcfa, nombre, requireAdmin, STATUT_PAIEMENT, type Stats } from '@/lib/admin';

type Paiement = { id: string; prenom: string | null; plan: string; montant_xof: number; statut: string; cree_le: string; paye_le: string | null };

export default async function Paiements() {
  const { supabase } = await requireAdmin();
  const [{ data: liste }, { data: stats }, { data: plans }] = await Promise.all([
    supabase.rpc('admin_paiements', { p_limite: 100 }),
    supabase.rpc('admin_stats'),
    supabase.from('plans').select('code, nom, prix_xof, duree_jours, actif').order('prix_xof'),
  ]);
  const s = stats as Stats | null;
  const paiements = (liste ?? []) as Paiement[];

  return (
    <>
      <header>
        <h1>Paiements et abonnements</h1>
        <p className="lede">Les 100 derniers paiements. Seul le prénom du membre est affiché, jamais son email ni son numéro.</p>
      </header>

      <div className="adm-tiles">
        <div className="adm-tile good"><b>{nombre(s?.kpis.revenus)}</b><span>Revenus encaissés (FCFA)</span></div>
        <div className="adm-tile"><b>{nombre(s?.kpis.revenus_30j)}</b><span>Revenus des 30 derniers jours (FCFA)</span></div>
        <div className="adm-tile"><b>{nombre(s?.kpis.abonnes)}</b><span>Abonnés actifs</span></div>
      </div>

      <div className="adm-grid">
        <section className="adm-card" aria-labelledby="h-plans">
          <h2 id="h-plans">Formules proposées</h2>
          {(plans ?? []).length === 0 ? <p className="adm-empty">Aucune formule.</p> : (
            <div className="adm-table-wrap"><table>
              <thead><tr><th>Formule</th><th className="num">Prix</th><th className="num">Durée</th><th>Statut</th></tr></thead>
              <tbody>{(plans ?? []).map((p) => (
                <tr key={p.code}><td>{p.nom}</td><td className="num">{fcfa(p.prix_xof)} / mois</td><td className="num">{p.duree_jours} j</td><td><span className={`adm-pill ${p.actif ? 'good' : ''}`}>{p.actif ? 'En vente' : 'Désactivée'}</span></td></tr>
              ))}</tbody>
            </table></div>
          )}
          <p className="note">Pour modifier les prix, les remises et les codes promo : onglet « Offres et promos ».</p>
        </section>

        <section className="adm-card" aria-labelledby="h-mois">
          <h2 id="h-mois">Revenus par mois</h2>
          {!s || s.revenus_mois.length === 0 ? <p className="adm-empty">Aucun paiement encaissé pour l’instant.</p> : (
            <div className="adm-table-wrap"><table>
              <thead><tr><th>Mois</th><th className="num">Paiements</th><th className="num">Montant</th></tr></thead>
              <tbody>{s.revenus_mois.map((v) => <tr key={v.mois}><td>{v.mois}</td><td className="num">{nombre(v.n)}</td><td className="num">{fcfa(v.xof)}</td></tr>)}</tbody>
            </table></div>
          )}
        </section>
      </div>

      <section className="adm-card" aria-labelledby="h-liste">
        <h2 id="h-liste">Derniers paiements</h2>
        {paiements.length === 0 ? <p className="adm-empty">Aucun paiement pour l’instant.</p> : (
          <div className="adm-table-wrap"><table>
            <thead><tr><th>Date</th><th>Membre</th><th>Formule</th><th className="num">Montant</th><th>Statut</th></tr></thead>
            <tbody>{paiements.map((p) => (
              <tr key={p.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{dateHeure(p.paye_le ?? p.cree_le)}</td>
                <td>{p.prenom ?? '—'}</td>
                <td>{p.plan}</td>
                <td className="num">{fcfa(p.montant_xof)}</td>
                <td><span className={`adm-pill ${p.statut === 'paid' ? 'good' : p.statut === 'pending' ? 'warn' : p.statut === 'failed' || p.statut === 'refunded' ? 'bad' : ''}`}>{STATUT_PAIEMENT[p.statut] ?? p.statut}</span></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
    </>
  );
}
