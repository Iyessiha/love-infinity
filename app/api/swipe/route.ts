import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';

const Body = z.object({ to: z.string().uuid(), action: z.enum(['like', 'pass']), note: z.string().trim().max(280).optional() });
const rep = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

/** Like ou passe. Les règles (compte actif, compatibilité, blocage, limite de 5 likes) sont appliquées par la base. */
export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return rep(401, { ok: false, message: 'Connecte-toi pour continuer.' });

  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return rep(400, { ok: false, message: 'Requête invalide.' });

  const { error } = await supabase.from('swipes').insert({ from_user: user.id, to_user: p.data.to, action: p.data.action, note: p.data.action === 'like' && p.data.note ? p.data.note : null });
  if (error) {
    if (error.message.includes('limite_likes')) return rep(429, { ok: false, code: 'limite', message: 'Tu as utilisé tes 5 likes du jour. Reviens demain ou passe à un abonnement.' });
    if (error.message.includes('verification_requise')) return rep(403, { ok: false, message: 'Vérifie ton selfie vidéo pour pouvoir écrire un message.' });
    if (error.message.includes('compte_inactif')) return rep(403, { ok: false, message: 'Ton compte n’est pas encore activé.' });
    if (error.code === '23505') return rep(200, { ok: true, match: false });
    return rep(400, { ok: false, message: 'Ce profil n’est plus disponible.' });
  }

  let match = false;
  let matchId: string | null = null;
  if (p.data.action === 'like') {
    const [a, b] = [user.id, p.data.to].sort();
    const { data } = await supabase.from('matches').select('id').eq('user_a', a).eq('user_b', b).maybeSingle();
    match = Boolean(data);
    matchId = data?.id ?? null;
  }
  const { data: restants } = await supabase.rpc('likes_restants');
  return rep(200, { ok: true, match, matchId, restants });
}
