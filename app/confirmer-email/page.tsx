import Link from 'next/link';
import { Chevron } from '@/components/Icons';
import { getT } from '@/lib/lang';

export default async function ConfirmerEmail({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const t = await getT();
  const masque = e ? e.replace(/^(.).*(@.*)$/, '$1***$2') : t('ce.addr');
  return (
    <main className="ph">
      <Link className="back" href="/inscription"><Chevron /> {t('c.back')}</Link>
      <div className="bar"><i className="on"></i><i className="on"></i><i></i><i></i><i></i></div>
      <div className="col center" style={{ flex: 1, justifyContent: 'center', gap: 18 }}>
        <h1 style={{ textAlign: 'center' }}>{t('ce.title')}</h1>
        <p className="sub" style={{ textAlign: 'center' }}>{t('ce.t1')}<b>{masque}</b>{t('ce.t2')}</p>
        <p className="small" style={{ textAlign: 'center' }}>{t('ce.spam')}</p>
      </div>
    </main>
  );
}
