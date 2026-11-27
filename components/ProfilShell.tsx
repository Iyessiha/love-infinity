import Link from 'next/link';
import { Check, Chevron } from '@/components/Icons';

const TITRES = { 1: 'Présente-toi', 2: 'À propos de toi', 3: 'Ton style de vie' } as const;

export function ProfilShell({ step, back, children }: { step: 1 | 2 | 3; back?: string; children: React.ReactNode }) {
  return (
    <main className="ph" style={{ gap: 12 }}>
      {back ? <Link className="back" href={back}><Chevron /> Retour</Link> : <span className="back">&nbsp;</span>}
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i></i></div>
      <div className="row"><h1>{TITRES[step]}</h1><div className="sp"></div><span className="small" style={{ whiteSpace: 'nowrap' }}>Profil · {step}/3</span></div>
      {children}
    </main>
  );
}
