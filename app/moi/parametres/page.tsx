import Link from 'next/link';
import { Parametres } from '@/components/Parametres';
import { MemberNav } from '@/components/MemberNav';
import { ChevronLeft } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { getT } from '@/lib/lang';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

export default async function Reglages() {
  const { user } = await requireComplet();
  const t = await getT();
  return (
    <>
      <main className="mb">
        <header className="mb-top"><Link className="mb-ico" href="/moi" aria-label={t('c.back')}><ChevronLeft /></Link><h1 style={{ fontSize: 24 }}>{t('set.title')}</h1></header>
        <Parametres email={user.email ?? ''} />
      </main>
      <MemberNav actif="moi" />
    </>
  );
}
