import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/** Suppression définitive du compte de l'utilisateur connecté : fichiers du stockage puis compte (le reste part en cascade). */
export async function POST() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const admin = supabaseAdmin();
  try {
    for (const bucket of ['photos', 'verifications']) {
      const { data } = await admin.storage.from(bucket).list(user.id, { limit: 1000 });
      const chemins = (data ?? []).map((f) => `${user.id}/${f.name}`);
      if (chemins.length) await admin.storage.from(bucket).remove(chemins);
    }
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
