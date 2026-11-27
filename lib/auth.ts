import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

/** Page protégée : renvoie l'utilisateur connecté ou redirige vers la connexion. */
export async function requireUser() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');
  return { supabase, user };
}
