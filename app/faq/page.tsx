import type { Metadata } from 'next';
import { InfoPage } from '@/components/InfoPage';
import { FAQ } from '@/lib/site';

export const metadata: Metadata = { title: 'Questions fréquentes – Love Infinity', description: 'Vérification, vie privée, compte et abonnement : les réponses aux questions courantes.' };

export default function Page() {
  const groupes = [...new Set(FAQ.map((f) => f.groupe))];
  return (
    <InfoPage titre="Questions fréquentes" intro="Vérification, vie privée, compte, abonnement.">
      {groupes.map((g) => (
        <section key={g}>
          <h2 className="lp-doc-h2">{g}</h2>
          <div className="lp-faq" style={{ marginTop: 8 }}>
            {FAQ.filter((f) => f.groupe === g).map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.r}</p></details>)}
          </div>
        </section>
      ))}
    </InfoPage>
  );
}
