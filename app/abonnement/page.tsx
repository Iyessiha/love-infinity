import Link from 'next/link';
import { ChoixAbonnement } from '@/components/ChoixAbonnement';
import { Offres, type PlanPrix } from '@/components/Offres';
import { Chevron } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { getT } from '@/lib/lang';
import '@/app/offres.css';

export const dynamic = 'force-dynamic';

export default async function Abonnement({ searchParams }: { searchParams: Promise<{ paiement?: string }> }) {
  const { paiement } = await searchParams;
  const { supabase, user } = await requireComplet();
  const t = await getT();
  const [{ data: plans }, { data: durees }, { data: abo }] = await Promise.all([
    supabase.from('plans').select('code,prix_xof,duree_jours').order('prix_xof'),
    supabase.from('plan_durees').select('mois,remise_pct'),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
  ]);
  const actif = abo && new Date(abo.expires_at) > new Date();
  const nomPlan = abo?.plan === 'premium' ? t('me.premium') : t('me.essential');
  const mensuels = { essentiel: 5000, premium: 9000, ...Object.fromEntries((plans ?? []).map((p) => [p.code, p.prix_xof])) } as Record<'essentiel' | 'premium', number>;
  const remises = { 1: 0, 3: 15, 6: 25, 12: 35, ...Object.fromEntries((durees ?? []).map((d) => [d.mois, d.remise_pct])) } as Record<1 | 3 | 6 | 12, number>;
  const prix: PlanPrix[] = (plans ?? []).map((p) => ({ code: p.code as PlanPrix['code'], prix: p.prix_xof, jours: p.duree_jours }));

  return (
    <main className="of-page">
      <Link className="back" href="/moi"><Chevron /> {t('c.back')}</Link>
      <header className="of-tete">
        <h1>{t('ab.heroT')}</h1>
        <p>{t('ab.heroP')}</p>
      </header>
      {paiement === 'ok' && <div className="alert" role="status">{t('ab.ok')}</div>}
      {paiement === 'echec' && <div className="alert" role="alert">{t('ab.fail')}</div>}
      {actif && <div className="card">{t('ab.active', { plan: nomPlan, date: t.date(abo.expires_at, { day: 'numeric', month: 'long', year: 'numeric' }) })}</div>}
      <div id="choix"><ChoixAbonnement initial={abo?.plan === 'essentiel' ? 'essentiel' : 'premium'} mensuels={mensuels} remises={remises} labelRenew={Boolean(actif)} /></div>
      <Offres lang={t.lang} plans={prix} actif={actif ? (abo?.plan as 'essentiel' | 'premium') : null} cartes={false} cta={() => null} />
      <p className="of-pay">{t('ab.methods')}</p>
    </main>
  );
}
