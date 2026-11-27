import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Tableau de bord d'administration : tous les outils au même endroit. Réservé aux administrateurs. */
export default async function Admin() {
  const { supabase, user } = await requireUser();
  const { data: admin } = await supabase.rpc('is_admin');
  if (!admin) notFound();

  const { count: enAttente } = await supabase.from('verifications').select('id', { count: 'exact', head: true }).eq('status', 'pending');
  const { count: membres } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
  const chiffres = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL;

  return (
    <main className="shell" style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px 64px' }}>
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", color: '#4A0E2E', margin: 0 }}>Administration</h1>
        <form action="/auth/signout" method="post"><button className="link" style={{ background: 'none', border: 0, cursor: 'pointer' }}>Me déconnecter</button></form>
      </div>
      <p className="sub">Connecté en tant que {user.email}.</p>

      <div className="col" style={{ marginTop: 20 }}>
        <Link href="/admin/verifications" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <b style={{ fontSize: 20, color: '#4A0E2E' }}>Vérifications à traiter</b>
              <p className="sub" style={{ margin: '4px 0 0' }}>Photos, selfies vidéo et pièces d’identité en attente.</p>
            </div>
            <span style={{ fontWeight: 800, fontSize: 28, color: (enAttente ?? 0) > 0 ? '#D4A24C' : '#236B43' }}>{enAttente ?? 0}</span>
          </div>
        </Link>

        <div className="card">
          <b style={{ fontSize: 20, color: '#4A0E2E' }}>Membres inscrits</b>
          <p className="sub" style={{ margin: '4px 0 0' }}>{membres ?? 0} profil(s) créé(s).</p>
        </div>

        {chiffres ? (
          <a href={chiffres} target="_blank" rel="noopener noreferrer" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <b style={{ fontSize: 20, color: '#4A0E2E' }}>Tableau de bord des chiffres</b>
            <p className="sub" style={{ margin: '4px 0 0' }}>Inscriptions, paiements et signalements, ouvert dans Claude.</p>
          </a>
        ) : null}
      </div>
    </main>
  );
}
