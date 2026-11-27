import { InfoPage } from '@/components/InfoPage';
import { SITE } from '@/lib/site';
import { tr, type Lang } from '@/lib/i18n';

export function Confidentialite({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const mail = <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>;
  return (
    <InfoPage lang={lang} path="/confidentialite" titre={t('Politique de confidentialité', 'Privacy policy')} maj={SITE.maj[lang]} cta={false} intro={t('Nous collectons seulement ce qui sert à faire fonctionner Love Infinity et à protéger ses membres. Cette page explique quoi, pourquoi et pour combien de temps.', 'We collect only what is needed to run Love Infinity and protect its members. This page explains what, why and for how long.')}>
      <h2 className="lp-doc-h2">{t('Qui est responsable de tes données', 'Who is responsible for your data')}</h2>
      <p>{SITE.editeur}{t(', société de droit américain (Nouveau-Mexique) exploitant Love Infinity depuis Abidjan, Côte d’Ivoire. Contact : ', ', a US company (New Mexico) operating Love Infinity from Abidjan, Côte d’Ivoire. Contact: ')}{mail}.</p>

      <h2 className="lp-doc-h2">{t('Les données que nous collectons', 'The data we collect')}</h2>
      <ul>
        <li><b>{t('Compte :', 'Account:')}</b> {t('adresse email, mot de passe (stocké sous forme chiffrée, que nous ne pouvons pas lire), pays et numéro de téléphone.', 'email address, password (stored in hashed form, which we cannot read), country and phone number.')}</li>
        <li><b>{t('Profil :', 'Profile:')}</b> {t('prénom, nom (jamais affiché), date de naissance, ville, genre, ce que tu recherches, photos, biographie et les informations facultatives que tu choisis de renseigner (profession, études, langues, religion, enfants, tabac, alcool, centres d’intérêt).', 'first name, last name (never displayed), date of birth, city, gender, what you are looking for, photos, bio and the optional details you choose to add (job, education, languages, religion, children, smoking, alcohol, interests).')}</li>
        <li><b>{t('Vérification :', 'Verification:')}</b> {t('vidéo selfie et pièce d’identité (recto et verso ou page photo).', 'video selfie and ID document (front and back, or photo page).')}</li>
        <li><b>{t('Utilisation :', 'Usage:')}</b> {t('likes, passes, matchs, messages, blocages et signalements.', 'likes, passes, matches, messages, blocks and reports.')}</li>
        <li><b>{t('Paiement :', 'Payment:')}</b> {t('le montant, la date et l’état de tes paiements. Les données de carte ou de Mobile Money sont traitées par notre partenaire de paiement GeniusPay et ne passent pas par nos serveurs.', 'the amount, date and status of your payments. Card and Mobile Money details are handled by our payment partner GeniusPay and never pass through our servers.')}</li>
        <li><b>{t('Sécurité :', 'Security:')}</b> {t('une empreinte chiffrée de ton adresse IP et de ton numéro pour lutter contre les faux comptes. L’adresse IP elle-même n’est pas conservée en clair.', 'a hashed fingerprint of your IP address and your number to fight fake accounts. The IP address itself is not stored in clear.')}</li>
      </ul>
      <p>{t('Certaines de ces informations, comme la religion, la vie de famille ou les photos, peuvent être sensibles. Tu es libre de ne pas les renseigner, et tu choisis ce qui apparaît sur ton profil.', 'Some of this information, such as religion, family life or photos, can be sensitive. You are free not to provide it, and you choose what appears on your profile.')}</p>

      <h2 className="lp-doc-h2">{t('Pourquoi nous les utilisons', 'Why we use it')}</h2>
      <ul>
        <li>{t('Créer ton compte et te proposer des profils compatibles.', 'Create your account and suggest compatible profiles.')}</li>
        <li>{t('Vérifier que les profils sont réels et protéger les membres contre les faux comptes, les arnaques et le harcèlement.', 'Check that profiles are real and protect members from fake accounts, scams and harassment.')}</li>
        <li>{t('Permettre les conversations entre personnes qui se sont plu mutuellement.', 'Allow conversations between people who liked each other.')}</li>
        <li>{t('Gérer les abonnements et les paiements.', 'Manage subscriptions and payments.')}</li>
        <li>{t('Respecter nos obligations légales et traiter les signalements.', 'Meet our legal obligations and handle reports.')}</li>
      </ul>
      <p>{t('Nous ne vendons pas tes données et nous ne les utilisons pas pour de la publicité de tiers.', 'We do not sell your data and we do not use it for third-party advertising.')}</p>

      <h2 className="lp-doc-h2">{t('Ce que les autres membres voient', 'What other members see')}</h2>
      <p>{t('Ton prénom, ton âge, ta ville, tes photos, ta biographie, tes centres d’intérêt, ton intention et tes badges de vérification. Ils ne voient jamais ton nom de famille, ton email, ton numéro de téléphone ni tes documents d’identité.', 'Your first name, age, city, photos, bio, interests, intention and verification badges. They never see your last name, email, phone number or identity documents.')}</p>

      <h2 className="lp-doc-h2">{t('Combien de temps nous les gardons', 'How long we keep it')}</h2>
      <ul>
        <li><b>{t('Vidéo selfie et pièce d’identité :', 'Video selfie and ID:')}</b> {t('supprimées dès la décision de vérification.', 'deleted as soon as the verification decision is made.')}</li>
        <li><b>{t('Profil, photos et messages :', 'Profile, photos and messages:')}</b> {t('tant que ton compte existe.', 'as long as your account exists.')}</li>
        <li><b>{t('Après suppression du compte :', 'After account deletion:')}</b> {t('tes données sont effacées, sauf celles que la loi nous oblige à conserver, par exemple les traces de paiement et les éléments liés à un signalement.', 'your data is erased, except what the law requires us to keep, for example payment records and items linked to a report.')}</li>
      </ul>

      <h2 className="lp-doc-h2">{t('Avec qui nous partageons des données', 'Who we share data with')}</h2>
      <p>{t('Uniquement avec les prestataires nécessaires au service : l’hébergement et la base de données (Vercel et Supabase), le paiement (GeniusPay) et l’envoi des emails. Ils n’utilisent pas tes données pour leur propre compte. Nous pouvons aussi communiquer des informations si une autorité compétente l’exige légalement.', 'Only with the providers needed to run the service: hosting and database (Vercel and Supabase), payment (GeniusPay) and email delivery. They do not use your data for their own purposes. We may also disclose information if a competent authority legally requires it.')}</p>

      <h2 className="lp-doc-h2">{t('Tes droits', 'Your rights')}</h2>
      <p>{t('Tu peux demander l’accès à tes données, leur correction, leur suppression, ou t’opposer à certains usages. Écris-nous à ', 'You can ask for access to your data, its correction or deletion, or object to certain uses. Write to us at ')}{mail}{t(' depuis l’adresse de ton compte. Nous répondons dans un délai raisonnable. Tu peux aussi saisir l’autorité de protection des données de ton pays. En Côte d’Ivoire, il s’agit de l’ARTCI, en application de la loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel.', ' from your account address. We reply within a reasonable time. You can also contact the data protection authority of your country. In Côte d’Ivoire this is the ARTCI, under Law No. 2013-450 of 19 June 2013 on the protection of personal data.')}</p>

      <h2 className="lp-doc-h2">{t('Cookies', 'Cookies')}</h2>
      <p>{t('Nous utilisons uniquement les cookies nécessaires à ta connexion. Nous n’utilisons pas de cookies publicitaires.', 'We only use the cookies needed to keep you logged in. We do not use advertising cookies.')}</p>

      <h2 className="lp-doc-h2">{t('Âge minimum', 'Minimum age')}</h2>
      <p>{t('Love Infinity est réservé aux personnes de 18 ans et plus. Si nous découvrons qu’un compte appartient à une personne mineure, nous le supprimons.', 'Love Infinity is for people aged 18 and over. If we find that an account belongs to a minor, we delete it.')}</p>

      <h2 className="lp-doc-h2">{t('Modifications', 'Changes')}</h2>
      <p>{t('Si nous changeons cette politique de façon importante, nous te prévenons dans l’application ou par email. La date de dernière mise à jour figure en haut de la page.', 'If we make a significant change to this policy, we will tell you in the app or by email. The date of the last update is at the top of the page.')}</p>
    </InfoPage>
  );
}
