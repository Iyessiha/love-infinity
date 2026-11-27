import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Point d'entrée après connexion : les administrateurs arrivent sur le tableau de bord, les autres sur leur profil. */
export default async function Espace() {
  const { supabase } = await requireUser();
  const { data: admin } = await supabase.rpc('is_admin');
  redirect(admin ? '/admin' : '/profil');
}
