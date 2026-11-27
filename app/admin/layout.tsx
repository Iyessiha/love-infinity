import Link from 'next/link';
import AdminNav from '@/components/AdminNav';
import { requireAdmin } from '@/lib/admin';
import './admin.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Administration · Love Infinity', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { supabase } = await requireAdmin();
  const [{ count: verifs }, { count: signalements }] = await Promise.all([
    supabase.from('verifications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'open'),
  ]);

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top-in">
          <Link href="/admin" className="adm-brand">Love Infinity<small>ADMIN</small></Link>
          <AdminNav
            items={[
              { href: '/admin', label: 'Vue d’ensemble' },
              { href: '/admin/verifications', label: 'Vérifications', badge: verifs ?? 0 },
              { href: '/admin/signalements', label: 'Signalements', badge: signalements ?? 0 },
              { href: '/admin/membres', label: 'Membres' },
              { href: '/admin/paiements', label: 'Paiements' },
            ]}
          />
          <form action="/auth/signout" method="post"><button className="adm-out" type="submit">Me déconnecter</button></form>
        </div>
      </header>
      <main className="adm-wrap">{children}</main>
    </div>
  );
}
