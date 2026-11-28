import Link from 'next/link';
import { Acheter } from '@/components/Acheter';
import { Chevron } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { getT } from '@/lib/lang';

export const dynamic = 'force-dynamic';

const AVANTAGES: Record<string, string[]> = {
  essentiel: ['ab.adv.e1', 'ab.adv.e2'],
  premium: ['ab.adv.p1', 'ab.adv.p2', 'ab.adv.p3'],
};

export default async function Abonnement({ searchParams }: { searchParams: Promise<{ paiement?: string }> }) {
  const { paiement } = await searchParams;
  const { supabase, user } = await requireComplet();
  const t = await getT();
  const fcfa = (n: number) => `${n.toLocaleString(t.lang === 'en' ? 'en-GB' : 'fr-FR')} FCFA`;
  const nomPlan = (code: string, nom: string) => (code === 'premium' ? t('me.premium') : code === 'essentiel' ? t('me.essential') : nom);
  const [{ data: plans }, { data: abo }] = await Promise.all([
    supabase.from('plans').select('code,nom,prix_xof,duree_jours').order('prix_xof'),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
  ]);
  const actif = abo && new Date(abo.expires_at) > new Date();

  return (
    <main className="ph">
      <Link className="back" href="/decouvrir"><Chevron /> {t('nav.discover')}</Link>
      <h1>{t('ab.title')}</h1>
      {paiement === 'ok' && <div className="alert" role="status">{t('ab.ok')}</div>}
      {paiement === 'echec' && <div className="alert" role="alert">{t('ab.fail')}</div>}
      {actif && <div className="card">{t('ab.active', { plan: nomPlan(abo.plan, abo.plan), date: t.date(abo.expires_at, { day: 'numeric', month: 'long', year: 'numeric' }) })}</div>}
      <p className="sub">{t('ab.methods')}</p>
      <div className="col">
        {(plans ?? []).map((p) => (
          <div key={p.code} className="card col" style={{ gap: 8 }}>
            <div className="row"><h2>{nomPlan(p.code, p.nom)}</h2><div className="sp"></div><b>{fcfa(p.prix_xof)}</b></div>
            <p className="small">{t('ab.for', { n: p.duree_jours })}</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>{(AVANTAGES[p.code] ?? []).map((a) => <li key={a}>{t(a)}</li>)}</ul>
            <Acheter plan={p.code as 'essentiel' | 'premium'} libelle={actif ? t('ab.renew') : t('ab.choose', { plan: nomPlan(p.code, p.nom) })} gold={p.code === 'premium'} />
          </div>
        ))}
      </div>
    </main>
  );
}
