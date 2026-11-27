import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/** Lien de confirmation d'email : échange le code contre une session, puis étape suivante. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (code) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    // Seule la réinitialisation du mot de passe a une destination différente ; tout le reste est ignoré.
    const suite = url.searchParams.get('next') === '/nouveau-mot-de-passe' ? '/nouveau-mot-de-passe' : '/telephone';
    if (!error) return NextResponse.redirect(new URL(suite, url.origin));
  }
  return NextResponse.redirect(new URL('/inscription?lien=invalide', url.origin));
}
