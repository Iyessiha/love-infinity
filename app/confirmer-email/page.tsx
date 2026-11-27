import Link from 'next/link';
import { Check, Chevron } from '@/components/Icons';

export default async function ConfirmerEmail({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const masque = e ? e.replace(/^(.).*(@.*)$/, '$1***$2') : 'ton adresse';
  return (
    <main className="ph">
      <Link className="back" href="/inscription"><Chevron /> Retour</Link>
      <div className="bar"><i className="on"></i><i className="on"></i><i></i><i></i><i></i></div>
      <div className="col center" style={{ flex: 1, justifyContent: 'center', gap: 18 }}>
        <h1 style={{ textAlign: 'center' }}>Vérifie ton email</h1>
        <p className="sub" style={{ textAlign: 'center' }}>Nous avons envoyé un lien de confirmation à <b>{masque}</b>. Ouvre-le pour continuer.</p>
        <p className="small" style={{ textAlign: 'center' }}>Pense à regarder tes courriers indésirables.</p>
      </div>
    </main>
  );
}
