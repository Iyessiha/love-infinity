import { InfoPage } from '@/components/InfoPage';
import { SITE } from '@/lib/site';
import { href, tr, type Lang } from '@/lib/i18n';

export function Conditions({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const mail = <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>;
  return (
    <InfoPage lang={lang} path="/conditions" titre={t('Conditions d’utilisation', 'Terms of use')} maj={SITE.maj[lang]} cta={false} intro={t('En créant un compte sur Love Infinity, tu acceptes ces conditions. Elles existent pour que la communauté reste sûre et sincère.', 'By creating an account on Love Infinity you accept these terms. They exist to keep the community safe and sincere.')}>
      <h2 className="lp-doc-h2">{t('1. Le service', '1. The service')}</h2>
      <p>{t('Love Infinity, édité par ', 'Love Infinity, published by ')}{SITE.editeur}{t(', est un service de rencontres en ligne. Il te permet de créer un profil, de découvrir d’autres membres vérifiés et d’échanger avec ceux qui te correspondent.', ', is an online dating service. It lets you create a profile, discover other verified members and chat with those who match you.')}</p>

      <h2 className="lp-doc-h2">{t('2. Conditions pour s’inscrire', '2. Eligibility')}</h2>
      <ul>
        <li>{t('Avoir 18 ans révolus.', 'Be at least 18 years old.')}</li>
        <li>{t('Créer un seul compte, à ton nom, avec une adresse email et un numéro de téléphone qui t’appartiennent.', 'Create a single account, in your own name, with an email address and phone number that belong to you.')}</li>
        <li>{t('Fournir des informations exactes, et des photos qui te représentent réellement et récemment.', 'Provide accurate information and photos that genuinely and recently show you.')}</li>
      </ul>

      <h2 className="lp-doc-h2">{t('3. Vérification', '3. Verification')}</h2>
      <p>{t('Ton compte s’active après l’approbation de tes photos. Nous pouvons te demander un selfie vidéo et une pièce d’identité pour vérifier ton profil. Nous pouvons refuser ou retirer un badge si les informations ne correspondent pas. Les documents sont supprimés après la décision, comme expliqué dans la ', 'Your account activates once your photos are approved. We may ask for a video selfie and an ID document to verify your profile. We may refuse or remove a badge if the information does not match. Documents are deleted after the decision, as explained in the ')}<a href={href(lang, '/confidentialite')}>{t('politique de confidentialité', 'privacy policy')}</a>.</p>

      <h2 className="lp-doc-h2">{t('4. Comportement attendu', '4. Expected behaviour')}</h2>
      <p>{t('Tu t’engages à respecter les autres membres. Sont interdits :', 'You agree to respect other members. The following are prohibited:')}</p>
      <ul>
        <li>{t('le faux profil, l’usurpation d’identité et l’utilisation des photos d’autrui ;', 'fake profiles, impersonation and using someone else’s photos;')}</li>
        <li>{t('les demandes d’argent, les arnaques et toute tentative de tromper un membre ;', 'requests for money, scams and any attempt to deceive a member;')}</li>
        <li>{t('le harcèlement, les menaces, les propos haineux ou discriminatoires ;', 'harassment, threats, hateful or discriminatory speech;')}</li>
        <li>{t('les contenus sexuellement explicites, violents ou illégaux ;', 'sexually explicit, violent or illegal content;')}</li>
        <li>{t('toute relation avec une personne mineure ;', 'any contact with a minor;')}</li>
        <li>{t('l’usage commercial du service, la prospection, le démarchage et la collecte de données sur les membres ;', 'commercial use of the service, solicitation, canvassing and collecting data on members;')}</li>
        <li>{t('le contournement des protections et des limites du service.', 'bypassing the protections and limits of the service.')}</li>
      </ul>

      <h2 className="lp-doc-h2">{t('5. Modération', '5. Moderation')}</h2>
      <p>{t('Tu peux bloquer et signaler un membre à tout moment. Nous examinons les signalements. En cas de manquement à ces conditions, nous pouvons avertir, limiter, suspendre ou supprimer un compte, avec ou sans préavis selon la gravité. Les faits graves peuvent être signalés aux autorités.', 'You can block and report a member at any time. We review reports. If these terms are breached, we may warn, restrict, suspend or delete an account, with or without notice depending on severity. Serious matters may be reported to the authorities.')}</p>

      <h2 className="lp-doc-h2">{t('6. Abonnements et paiements', '6. Subscriptions and payments')}</h2>
      <ul>
        <li>{t('L’inscription, la vérification et 5 likes par jour sont gratuits.', 'Sign-up, verification and 5 likes per day are free.')}</li>
        <li>{t('Les abonnements sont payés pour une période de 30 jours, sans renouvellement automatique.', 'Subscriptions are paid for a 30-day period, with no automatic renewal.')}</li>
        <li>{t('Un renouvellement avant la fin de la période ajoute 30 jours à la date d’expiration en cours.', 'Renewing before the period ends adds 30 days to the current expiry date.')}</li>
        <li>{t('Le paiement est traité par notre partenaire GeniusPay. L’abonnement s’active à la confirmation du paiement.', 'Payment is processed by our partner GeniusPay. The subscription activates once payment is confirmed.')}</li>
        <li>{t('Si un paiement est débité sans activation de l’abonnement, nous corrigeons ou nous remboursons.', 'If a payment is charged without the subscription activating, we fix it or refund you.')}</li>
        <li>{t('Un compte supprimé pour manquement aux conditions ne donne pas droit au remboursement de la période en cours.', 'An account deleted for breaching these terms is not entitled to a refund of the current period.')}</li>
      </ul>

      <h2 className="lp-doc-h2">{t('7. Ton contenu', '7. Your content')}</h2>
      <p>{t('Tes photos et textes restent les tiens. Tu nous autorises à les afficher dans le service, aux membres concernés, tant que ton compte existe. Tu garantis que tu as le droit de les publier.', 'Your photos and text remain yours. You allow us to display them in the service, to the relevant members, as long as your account exists. You guarantee that you have the right to publish them.')}</p>

      <h2 className="lp-doc-h2">{t('8. Responsabilité', '8. Liability')}</h2>
      <p>{t('Nous vérifions les profils pour réduire les risques, mais nous ne pouvons pas garantir l’intention ou le comportement de chaque membre. Rencontre les personnes avec prudence : lieu public, proche prévenu, jamais d’argent envoyé. Le service est fourni tel quel, sans garantie de disponibilité continue. Dans la limite permise par la loi, notre responsabilité est limitée aux dommages directs.', 'We verify profiles to reduce risk, but we cannot guarantee the intentions or behaviour of every member. Meet people with care: public place, someone told, never send money. The service is provided as is, with no guarantee of continuous availability. To the extent permitted by law, our liability is limited to direct damages.')}</p>

      <h2 className="lp-doc-h2">{t('9. Suppression du compte', '9. Account deletion')}</h2>
      <p>{t('Tu peux demander la suppression de ton compte à tout moment à ', 'You can ask to delete your account at any time by writing to ')}{mail}.</p>

      <h2 className="lp-doc-h2">{t('10. Modifications et droit applicable', '10. Changes and governing law')}</h2>
      <p>{t('Nous pouvons modifier ces conditions. Les changements importants te sont annoncés dans l’application ou par email, et la date de mise à jour figure en haut de cette page. Continuer à utiliser le service après un changement vaut acceptation. Pour les membres résidant en Côte d’Ivoire, les présentes conditions sont soumises au droit ivoirien, sans préjudice des droits que la loi du pays du membre lui reconnaît.', 'We may change these terms. Significant changes will be announced in the app or by email, and the update date is at the top of this page. Continuing to use the service after a change means you accept it. For members living in Côte d’Ivoire, these terms are governed by Ivorian law, without prejudice to the rights granted to the member by the law of their own country.')}</p>

      <h2 className="lp-doc-h2">Contact</h2>
      <p>{mail}</p>
    </InfoPage>
  );
}
