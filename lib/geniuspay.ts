import { createHmac, timingSafeEqual } from 'node:crypto';

const BASE = 'https://geniuspay.ci/api/v1/merchant';

export type CreationPaiement = { id: string; reference: string; checkout_url?: string; payment_url?: string };

/** Crée un lien de paiement (page GeniusPay : Wave, Orange, MTN, Moov, carte). Serveur seulement. */
export async function creerPaiement(args: {
  amount: number; description: string; email?: string | null; successUrl: string; errorUrl: string; metadata: Record<string, string>;
}): Promise<CreationPaiement> {
  const r = await fetch(`${BASE}/payments`, {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.GENIUSPAY_API_KEY!,
      'X-API-Secret': process.env.GENIUSPAY_API_SECRET!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: args.amount, currency: 'XOF', description: args.description,
      customer: args.email ? { email: args.email, country: 'CI' } : undefined,
      success_url: args.successUrl, error_url: args.errorUrl, metadata: args.metadata,
    }),
    cache: 'no-store',
  });
  const j = await r.json().catch(() => null);
  if (!r.ok || !j?.data) throw new Error(`geniuspay_${r.status}`);
  return j.data as CreationPaiement;
}

/** Signature : HMAC-SHA256(timestamp + "." + corps brut, secret). Refuse au-delà de 300 s. */
export function signatureValide(corps: string, timestamp: string | null, signature: string | null): boolean {
  const secret = process.env.GENIUSPAY_WEBHOOK_SECRET;
  if (!secret || !timestamp || !signature) return false;
  const t = Number(timestamp);
  if (!Number.isFinite(t) || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const attendu = createHmac('sha256', secret).update(`${timestamp}.${corps}`).digest('hex');
  const a = Buffer.from(attendu), b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
