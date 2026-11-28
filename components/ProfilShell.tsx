'use client';
import Link from 'next/link';
import { useT } from '@/components/I18n';
import { Check, Chevron } from '@/components/Icons';


export function ProfilShell({ step, back, children }: { step: 1 | 2 | 3; back?: string; children: React.ReactNode }) {
  const t = useT();
  return (
    <main className="ph" style={{ gap: 12 }}>
      {back ? <Link className="back" href={back}><Chevron /> {t('c.back')}</Link> : <span className="back">&nbsp;</span>}
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i></i></div>
      <div className="row"><h1>{t(`pf.t${step}`)}</h1><div className="sp"></div><span className="small" style={{ whiteSpace: 'nowrap' }}>{t('pf.step', { n: step })}</span></div>
      {children}
    </main>
  );
}
