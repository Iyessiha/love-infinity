import Link from 'next/link';
import { StyleProfil } from '@/components/StyleProfil';
import { MemberNav } from '@/components/MemberNav';
import { ChevronLeft } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { getT } from '@/lib/lang';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

export default async function MonStyle() {
  const { supabase, user } = await requireComplet();
  const t = await getT();
  const [{ data: p }, { data: abo }] = await Promise.all([
    supabase.from('profiles').select('theme,prompts').eq('id', user.id).single(),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
  ]);
  const premium = Boolean(abo && abo.plan === 'premium' && new Date(abo.expires_at) > new Date());
  return (
    <>
      <main className="mb">
        <header className="mb-top"><Link className="mb-ico" href="/moi" aria-label={t('c.back')}><ChevronLeft /></Link><h1 style={{ fontSize: 24 }}>{t('me.styleT')}</h1></header>
        <StyleProfil theme={p?.theme ?? 'classique'} prompts={(p?.prompts as { q: string; a: string }[]) ?? []} premium={premium} />
      </main>
      <MemberNav actif="moi" />
    </>
  );
}
