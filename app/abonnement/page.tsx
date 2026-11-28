import Link from 'next/link';
import { Acheter } from '@/components/Acheter';
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
  const [{ data: plans }, { data: abo }] = await Promise.all([
    supabase.from('plans').select('code,prix_xof,duree_jours').order('prix_xof'),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
  ]);
  const actif = abo && new Date(abo.expires_at) > new Date();
  const nomPlan = abo?.plan === 'premium' ? t('me.premium') : t('me.essential');
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
      <Offres
        lang={t.lang}
        plans={prix}
        actif={actif ? (abo?.plan as 'essentiel' | 'premium') : null}
        cta={(code) => code === 'gratuit'
          ? <span className="of-cta" style={{ opacity: .55, cursor: 'default' }}>{actif ? t('ab.free') : t('ab.current')}</span>
          : <Acheter plan={code} libelle={actif && abo?.plan === code ? t('ab.renew') : t('ab.choose', { plan: code === 'premium' ? t('me.premium') : t('me.essential') })} gold={code === 'premium'} />}
      />
      <p className="of-pay">{t('ab.methods')}</p>
    </main>
  );
}
