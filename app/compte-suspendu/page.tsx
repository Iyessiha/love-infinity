import { requireUser } from '@/lib/auth';
import { getT } from '@/lib/lang';

export const dynamic = 'force-dynamic';

export default async function CompteSuspendu() {
  const { user } = await requireUser();
  const t = await getT();
  return (
    <main className="ph">
      <h1>{t('cs.title')}</h1>
      <p className="sub">{t('cs.text', { email: user.email ?? '' })}</p>
      <form action="/auth/signout" method="post"><button className="btn ghost" type="submit">{t('me.signout')}</button></form>
    </main>
  );
}
