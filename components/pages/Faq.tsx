import { InfoPage } from '@/components/InfoPage';
import { FAQ } from '@/lib/site';
import { tr, type Lang } from '@/lib/i18n';

export function Faq({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <InfoPage lang={lang} path="/faq" titre={t('Questions fréquentes', 'Frequently asked questions')} intro={t('Vérification, vie privée, compte, abonnement.', 'Verification, privacy, account, subscription.')}>
      {FAQ[lang].map((g) => (
        <section key={g.groupe}>
          <h2 className="lp-doc-h2">{g.groupe}</h2>
          <div className="lp-faq" style={{ marginTop: 8 }}>
            {g.items.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.r}</p></details>)}
          </div>
        </section>
      ))}
    </InfoPage>
  );
}
