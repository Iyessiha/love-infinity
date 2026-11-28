import { getT } from '@/lib/lang';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { creerPaiement } from '@/lib/geniuspay';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';

const Body = z.object({ plan: z.enum(['essentiel', 'premium']) });
const rep = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

/** Le prix vient toujours de la base, jamais du navigateur. */
export async function POST(req: Request) {
  const t = await getT();
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return rep(401, { ok: false, message: t('err.login') });
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return rep(400, { ok: false, message: t('err.badreq') });

  const { data: plan } = await supabase.from('plans').select('code,nom,prix_xof,duree_jours').eq('code', p.data.plan).single();
  if (!plan) return rep(404, { ok: false, message: t('err.plan') });

  const admin = supabaseAdmin();
  const { data: ligne, error } = await admin.from('paiements')
    .insert({ user_id: user.id, plan: plan.code, montant_xof: plan.prix_xof, duree_jours: plan.duree_jours })
    .select('id').single();
  if (error || !ligne) return rep(500, { ok: false, message: t('err.pay') });

  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  try {
    const g = await creerPaiement({
      amount: plan.prix_xof, description: `Love Infinity – ${plan.nom} (${plan.duree_jours} jours)`, email: user.email,
      successUrl: `${site}/abonnement?paiement=ok`, errorUrl: `${site}/abonnement?paiement=echec`,
      metadata: { paiement_id: ligne.id, user_id: user.id, plan: plan.code },
    });
    await admin.from('paiements').update({ genius_id: String(g.id), genius_reference: g.reference }).eq('id', ligne.id);
    const url = g.checkout_url ?? g.payment_url;
    if (!url) throw new Error('pas_de_lien');
    return rep(200, { ok: true, url });
  } catch {
    await admin.from('paiements').update({ statut: 'failed' }).eq('id', ligne.id);
    return rep(502, { ok: false, message: t('err.payDown') });
  }
}
