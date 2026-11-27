import { NextResponse } from 'next/server';
import { signatureValide } from '@/lib/geniuspay';
import { supabaseAdmin } from '@/lib/supabase/admin';

const STATUTS: Record<string, string> = {
  'payment.failed': 'failed', 'payment.cancelled': 'cancelled', 'payment.expired': 'expired', 'payment.refunded': 'refunded',
};

/** Reçoit les notifications GeniusPay. Signature vérifiée sur le corps brut avant tout traitement. */
export async function POST(req: Request) {
  const corps = await req.text();
  if (!signatureValide(corps, req.headers.get('x-webhook-timestamp'), req.headers.get('x-webhook-signature'))) {
    return NextResponse.json({ detail: 'Signature invalide' }, { status: 401 });
  }
  let evt: { data?: { id?: string | number; reference?: string; amount?: number; currency?: string; metadata?: { paiement_id?: string } } };
  try { evt = JSON.parse(corps); } catch { return NextResponse.json({ detail: 'Corps invalide' }, { status: 400 }); }

  const type = req.headers.get('x-webhook-event') ?? '';
  const d = evt.data ?? (evt as never);
  const paiementId = (d as { metadata?: { paiement_id?: string } }).metadata?.paiement_id;
  if (!paiementId) return NextResponse.json({ ok: true });

  const admin = supabaseAdmin();
  if (type === 'payment.success') {
    const montant = Number((d as { amount?: number }).amount);
    const { data, error } = await admin.rpc('activer_paiement', { p_paiement: paiementId, p_montant: montant });
    if (error) return NextResponse.json({ detail: 'Erreur' }, { status: 500 });
    return NextResponse.json({ ok: true, resultat: data });
  }
  const statut = STATUTS[type];
  if (statut) await admin.from('paiements').update({ statut }).eq('id', paiementId).neq('statut', 'paid');
  return NextResponse.json({ ok: true });
}
