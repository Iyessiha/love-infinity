import AdminOverview from '@/components/AdminOverview';
import { requireAdmin, type Stats } from '@/lib/admin';

/** Tableau de bord : chiffres clés, courbe d'inscriptions et files à traiter. */
export default async function Admin() {
  const { supabase, user } = await requireAdmin();
  const { data, error } = await supabase.rpc('admin_stats');
  if (error || !data) {
    return (
      <>
        <h1>Vue d’ensemble</h1>
        <div className="adm-alert" role="alert">Les statistiques n’ont pas pu être chargées. Recharge la page. Si le problème continue, vérifie que les migrations Supabase sont appliquées.</div>
      </>
    );
  }
  return <AdminOverview s={data as Stats} email={user.email} lien={process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL} />;
}
