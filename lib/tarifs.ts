import { supabaseAdmin } from '@/lib/supabase/admin';
import type { PlanPrix } from '@/components/Offres';

export type Remises = Record<1 | 3 | 6 | 12, number>;
const PLANS_DEF: PlanPrix[] = [{ code: 'essentiel', prix: 5000, jours: 30 }, { code: 'premium', prix: 9000, jours: 30 }];
const REMISES_DEF: Remises = { 1: 0, 3: 15, 6: 25, 12: 35 };

/** Prix mensuel après remise de durée, arrondi à 50 FCFA (même règle que calculer_prix en base). */
export const mensuelRemise = (mensuel: number, remisePct: number) => Math.round((mensuel * (100 - remisePct)) / 100 / 50) * 50;

/** Plans et remises lus dans la base (source unique) ; valeurs par défaut si la base est injoignable. */
export async function lireTarifs(): Promise<{ plans: PlanPrix[]; remises: Remises }> {
  try {
    const db = supabaseAdmin();
    const [{ data: p }, { data: d }] = await Promise.all([
      db.from('plans').select('code,prix_xof,duree_jours').eq('actif', true).in('code', ['essentiel', 'premium']),
      db.from('plan_durees').select('mois,remise_pct'),
    ]);
    const plans = PLANS_DEF.map((x) => {
      const l = (p ?? []).find((r) => r.code === x.code);
      return l ? { code: x.code, prix: l.prix_xof as number, jours: l.duree_jours as number } : x;
    });
    const remises = { ...REMISES_DEF, ...Object.fromEntries((d ?? []).map((r) => [r.mois, r.remise_pct])) } as Remises;
    return { plans, remises };
  } catch { return { plans: PLANS_DEF, remises: REMISES_DEF }; }
}
