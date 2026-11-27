import { createHmac } from 'crypto';

/** Empreinte HMAC : on ne stocke jamais l'adresse IP ni le numéro en clair pour les contrôles. */
export function hmac(value: string): string {
  const secret = process.env.HASH_SECRET;
  if (!secret) throw new Error('HASH_SECRET manquant');
  return createHmac('sha256', secret).update(value).digest('hex');
}
