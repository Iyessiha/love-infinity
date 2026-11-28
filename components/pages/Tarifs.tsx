import { InfoPage } from '@/components/InfoPage';
import { Offres } from '@/components/Offres';
import { href, tr, type Lang } from '@/lib/i18n';

export function Tarifs({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <InfoPage lang={lang} path="/tarifs" titre={t('Tarifs', 'Pricing')} intro={t('Gratuit pour commencer. Des abonnements simples, sans pièces qui expirent.', 'Free to start. Simple subscriptions, no coins that expire.')}>
      <Offres
        lang={lang}
        plans={[{ code: 'essentiel', prix: 5000, jours: 30 }, { code: 'premium', prix: 9000, jours: 30 }]}
        cta={(code) => <a className={`of-cta${code === 'premium' ? ' or' : ''}`} href="/inscription">{code === 'gratuit' ? t('Commencer gratuitement', 'Start for free') : t('Créer mon compte', 'Create my account')}</a>}
      />
      <h2 className="lp-doc-h2">{t('Paiement', 'Payment')}</h2>
      <p>{t('Mobile Money (Wave, Orange Money, MTN, Moov) ou carte, sur la page de paiement sécurisée de notre partenaire GeniusPay. Les moyens proposés dépendent de ton pays. Nous ne voyons jamais ton code secret ni ton numéro de carte.', 'Mobile Money (Wave, Orange Money, MTN, Moov) or card, on the secure payment page of our partner GeniusPay. The options offered depend on your country. We never see your PIN or your card number.')}</p>
      <h2 className="lp-doc-h2">{t('Renouvellement', 'Renewal')}</h2>
      <p>{t('Aucun renouvellement automatique : tu paies une période (30 jours) et tu décides de continuer. Si tu renouvelles avant la fin, les jours restants sont ajoutés à ta nouvelle période.', 'No automatic renewal: you pay for a period (30 days) and decide whether to continue. If you renew before it ends, your remaining days are added to your new period.')}</p>
      <h2 className="lp-doc-h2">{t('Un souci de paiement ?', 'A payment problem?')}</h2>
      <p>{t('Si un paiement est débité sans que ton abonnement s’active, écris-nous : nous corrigeons ou nous remboursons. Nos coordonnées sont sur la page ', 'If a payment is charged but your subscription does not activate, write to us: we fix it or refund you. Our contact details are on the ')}<a href={href(lang, '/confidentialite')}>{t('Confidentialité', 'Privacy')}</a>{t('.', ' page.')}</p>
    </InfoPage>
  );
}
