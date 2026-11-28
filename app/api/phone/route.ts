import { getT } from '@/lib/lang';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hmac } from '@/lib/hash';
import { COUNTRIES, normalizePhone } from '@/lib/phone';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';

const Body = z.object({
  country: z.enum(COUNTRIES.map((c) => c.code) as [string, ...string[]]),
  phone: z.string().trim().min(6).max(25),
});

const rep = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

/** Enregistre le numéro (sans SMS) : normalisé, unique, marqué « non confirmé ». */
export async function POST(req: Request) {
  const t = await getT();
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email_confirmed_at) return rep(401, { ok: false, message: t('err.confirm') });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return rep(400, { ok: false, message: t('err.phone') });
  const { country, phone } = parsed.data;
  const admin = supabaseAdmin();

  const pays = COUNTRIES.find((c) => c.code === country)!;
  if (!pays.ouvert) {
    // Pas encore ouvert dans ce pays : liste d'attente, pas de compte actif
    await admin.from('waitlist').upsert({ email_canonical: user.email!.toLowerCase(), country });
    return rep(200, { ok: true, waitlist: true });
  }

  const e164 = normalizePhone(phone, country as 'CI');
  if (!e164) return rep(400, { ok: false, message: t('err.phoneCountry') });

  const { data: bloque } = await admin.from('blocked_phones').select('phone_hash').eq('phone_hash', hmac(e164)).maybeSingle();
  if (bloque) return rep(400, { ok: false, message: t('err.phoneBlocked') });

  const { error } = await admin
    .from('profiles')
    .update({ phone_country: country, phone_e164: e164, phone_verified_at: null })
    .eq('id', user.id);

  if (error?.code === '23505') {
    return rep(409, { ok: false, message: t('err.phoneUsed') });
  }
  if (error) return rep(500, { ok: false, message: t('err.save') });
  return rep(200, { ok: true });
}
