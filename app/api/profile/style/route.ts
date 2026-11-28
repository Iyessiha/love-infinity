import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';

const Body = z.object({
  theme: z.enum(['classique', 'nuit', 'or', 'soleil', 'lagune']),
  prompts: z.array(z.object({ q: z.string().max(20), a: z.string().trim().min(1).max(160) })).max(3),
});

/** Thème et questions signature : les règles (Premium requis pour un thème, 3 questions maximum) sont appliquées par la base. */
export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, code: 'auth' }, { status: 401 });
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, code: 'invalide' }, { status: 400 });
  const { error } = await supabase.rpc('maj_style', { p_theme: p.data.theme, p_prompts: p.data.prompts });
  if (error) return NextResponse.json({ ok: false, code: error.message.includes('premium_requis') ? 'premium' : 'erreur' }, { status: error.message.includes('premium_requis') ? 403 : 400 });
  return NextResponse.json({ ok: true });
}
