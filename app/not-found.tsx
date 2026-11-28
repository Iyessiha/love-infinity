import Link from 'next/link';
import { getT } from '@/lib/lang';

export default async function NotFound() {
  const t = await getT();
  return (
    <main className="etat">
      <div className="etat-in">
        <p className="etat-code" aria-hidden="true">404</p>
        <h1>{t('nf.t')}</h1>
        <p>{t('nf.p')}</p>
        <div className="etat-actions">
          <Link href="/decouvrir">{t('nf.app')}</Link>
          <Link className="ghost" href="/">{t('nf.home')}</Link>
        </div>
      </div>
    </main>
  );
}
