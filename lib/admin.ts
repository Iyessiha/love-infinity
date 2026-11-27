import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { COUNTRIES } from '@/lib/phone';

/** Réservé aux administrateurs : toute autre personne voit une page introuvable. */
export async function requireAdmin() {
  const { supabase, user } = await requireUser();
  const { data: admin } = await supabase.rpc('is_admin');
  if (!admin) notFound();
  return { supabase, user };
}

export const nombre = (n: number | string | null | undefined) => new Intl.NumberFormat('fr-FR').format(Number(n ?? 0));
export const fcfa = (n: number | string | null | undefined) => `${nombre(n)} FCFA`;
export const pays = (code: string | null | undefined) => COUNTRIES.find((c) => c.code === code)?.nom ?? code ?? '—';
export const dateCourte = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString('fr-FR', { timeZone: 'Africa/Abidjan' }) : '—');
export const dateHeure = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan', dateStyle: 'short', timeStyle: 'short' }) : '—';
export const age = (d: string | null | undefined) => (d ? Math.floor((Date.now() - new Date(d).getTime()) / 31557600000) : null);

export const MOTIFS_SIGNALEMENT: Record<string, string> = {
  faux_profil: 'Faux profil', arnaque: 'Arnaque', harcelement: 'Harcèlement',
  contenu_inapproprie: 'Contenu inapproprié', mineur: 'Personne mineure', autre: 'Autre',
};
export const STATUT_COMPTE: Record<string, string> = { pending: 'En attente', active: 'Actif', suspended: 'Suspendu', banned: 'Banni' };
export const STATUT_PAIEMENT: Record<string, string> = {
  pending: 'En attente', paid: 'Payé', failed: 'Échoué', cancelled: 'Annulé', refunded: 'Remboursé', expired: 'Expiré',
};

export type Stats = {
  kpis: Record<'profils' | 'actifs' | 'en_attente' | 'suspendus' | 'niveau1' | 'niveau2' | 'niveau3' | 'inscrits_7j' | 'verifs' | 'signalements' | 'matchs' | 'messages' | 'abonnes' | 'revenus' | 'revenus_30j' | 'liste_attente', number>;
  inscriptions: { jour: string; n: number }[];
  verifs: { kind: string; n: number; heures: number }[];
  signalements: { reason: string; n: number }[];
  revenus_mois: { mois: string; n: number; xof: number }[];
  pays: { country: string; n: number }[];
  attente_pays: { country: string; n: number }[];
};
