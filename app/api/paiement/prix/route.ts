import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';

const Body = z.object({ plan: z.enum(['essentiel', 'premium']), mois: z.union([z.literal(1), z.literal(3), z.literal(6), z.literal(12)]), code: z.string().max(24).optional() });

/** Aperçu du prix (le vrai prix est recalculé au paiement). */
export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false }, { status: 400 });
  const { data } = await supabase.rpc('calculer_prix', { p_plan: p.data.plan, p_mois: p.data.mois, p_code: p.data.code ?? null }).single<{ brut: number; remise_duree_pct: number; remise_promo_pct: number; total: number; code_ok: boolean }>();
  if (!data) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, ...data });
}
