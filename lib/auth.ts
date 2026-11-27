import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

/** Page protégée : renvoie l'utilisateur connecté ou redirige vers la connexion. */
export async function requireUser() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');
  return { supabase, user };
}

/** Page réservée aux comptes complets : sans pays et numéro de téléphone enregistrés, retour à l'étape téléphone. */
export async function requireComplet() {
  const { supabase, user } = await requireUser();
  const { data: profil } = await supabase.from('profiles').select('phone_e164').eq('id', user.id).maybeSingle();
  if (!profil?.phone_e164) redirect('/telephone');
  return { supabase, user };
}
