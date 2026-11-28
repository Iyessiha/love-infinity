import { redirect } from 'next/navigation';
import { requireComplet, requireUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Point d'entrée après connexion : les administrateurs arrivent sur le tableau de bord, les autres sur leur profil. */
export default async function Espace() {
  const { supabase } = await requireUser();
  const { data: admin } = await supabase.rpc('is_admin');
  if (admin) redirect('/admin');
  const { supabase: sb, user } = await requireComplet();
  const { data: profil } = await sb.from('profiles').select('account_status,prenom').eq('id', user.id).single();
  // Profil déjà rempli : on arrive directement dans l'application.
  redirect(profil?.prenom ? '/decouvrir' : '/profil');
}
