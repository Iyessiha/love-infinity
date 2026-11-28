import Link from 'next/link';
import { Parametres } from '@/components/Parametres';
import { MemberNav } from '@/components/MemberNav';
import { ChevronLeft } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { getT } from '@/lib/lang';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

export default async function Reglages() {
  const { supabase, user } = await requireComplet();
  const [{ data: pr }, { data: abo }] = await Promise.all([
    supabase.from('profiles').select('en_pause,vue_anonyme').eq('id', user.id).single(),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
  ]);
  const premium = Boolean(abo && abo.plan === 'premium' && new Date(abo.expires_at) > new Date());
  const t = await getT();
  return (
    <>
      <main className="mb">
        <header className="mb-top"><Link className="mb-ico" href="/moi" aria-label={t('c.back')}><ChevronLeft /></Link><h1 style={{ fontSize: 24 }}>{t('set.title')}</h1></header>
        <Parametres email={user.email ?? ''} pause={Boolean(pr?.en_pause)} anon={Boolean(pr?.vue_anonyme)} premium={premium} />
      </main>
      <MemberNav actif="moi" />
    </>
  );
}
