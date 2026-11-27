import { InfoPage } from '@/components/InfoPage';
import { href, tr, type Lang } from '@/lib/i18n';

export function Tarifs({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <InfoPage lang={lang} path="/tarifs" titre={t('Tarifs', 'Pricing')} intro={t('Gratuit pour commencer. Des abonnements simples, sans pièces qui expirent.', 'Free to start. Simple subscriptions, no coins that expire.')}>
      <div className="lp-plans">
        <section className="lp-plan">
          <h2>{t('Gratuit', 'Free')}</h2>
          <ul>
            <li>{t('Inscription et vérification', 'Sign-up and verification')}</li>
            <li>{t('Découverte de profils', 'Profile discovery')}</li>
            <li>{t('5 likes par jour', '5 likes per day')}</li>
            <li>{t('Réception de tes matchs', 'Receiving your matches')}</li>
          </ul>
        </section>
        <section className="lp-plan fort">
          <h2>{t('Abonnement', 'Subscription')}</h2>
          <ul>
            <li>{t('Likes illimités', 'Unlimited likes')}</li>
            <li>{t('Les offres Essentiel et Premium sont affichées dans l’application, une fois connecté(e), avec leur prix dans la monnaie de ton pays', 'The Essential and Premium plans are shown in the app once you are logged in, with their price in your country’s currency')}</li>
          </ul>
        </section>
      </div>
      <h2 className="lp-doc-h2">{t('Paiement', 'Payment')}</h2>
      <p>{t('Mobile Money (Wave, Orange Money, MTN, Moov) ou carte, sur la page de paiement sécurisée de notre partenaire GeniusPay. Les moyens proposés dépendent de ton pays. Nous ne voyons jamais ton code secret ni ton numéro de carte.', 'Mobile Money (Wave, Orange Money, MTN, Moov) or card, on the secure payment page of our partner GeniusPay. The options offered depend on your country. We never see your PIN or your card number.')}</p>
      <h2 className="lp-doc-h2">{t('Renouvellement', 'Renewal')}</h2>
      <p>{t('Aucun renouvellement automatique : tu paies une période (30 jours) et tu décides de continuer. Si tu renouvelles avant la fin, les jours restants sont ajoutés à ta nouvelle période.', 'No automatic renewal: you pay for a period (30 days) and decide whether to continue. If you renew before it ends, your remaining days are added to your new period.')}</p>
      <h2 className="lp-doc-h2">{t('Un souci de paiement ?', 'A payment problem?')}</h2>
      <p>{t('Si un paiement est débité sans que ton abonnement s’active, écris-nous : nous corrigeons ou nous remboursons. Nos coordonnées sont sur la page ', 'If a payment is charged but your subscription does not activate, write to us: we fix it or refund you. Our contact details are on the ')}<a href={href(lang, '/confidentialite')}>{t('Confidentialité', 'Privacy')}</a>{t('.', ' page.')}</p>
    </InfoPage>
  );
}
