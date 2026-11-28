import { getT } from '@/lib/lang';
import { NextResponse } from 'next/server';
import { SCHEMAS } from '@/lib/profile';
import { supabaseServer } from '@/lib/supabase/server';

const rep = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

/** Enregistre une étape du profil. RLS : chacun ne modifie que son profil, et seulement les colonnes autorisées. */
export async function POST(req: Request) {
  const t = await getT();
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return rep(401, { ok: false, message: t('err.login') });

  const body = await req.json().catch(() => null);
  const step = Number(body?.step) as 1 | 2 | 3;
  const schema = SCHEMAS[step];
  if (!schema) return rep(400, { ok: false, message: t('err.step') });

  const parsed = schema.safeParse(body.data);
  if (!parsed.success) {
    return rep(400, { ok: false, message: t('err.fields'), champs: parsed.error.flatten().fieldErrors });
  }

  const { error } = await supabase.from('profiles').update(parsed.data).eq('id', user.id);
  if (error) return rep(500, { ok: false, message: t('err.save') });
  return rep(200, { ok: true });
}
