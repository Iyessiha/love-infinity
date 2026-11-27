import { createClient } from '@supabase/supabase-js';

/** Clé de service : serveur seulement, jamais dans le navigateur. */
export function supabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
