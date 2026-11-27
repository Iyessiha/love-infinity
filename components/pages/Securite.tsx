import { InfoPage } from '@/components/InfoPage';
import { tr, type Lang } from '@/lib/i18n';

export function Securite({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <InfoPage lang={lang} path="/securite" titre={t('Sécurité et vérification', 'Safety and verification')} intro={t('Un badge affiché sur un profil correspond à une vérification réellement faite par notre équipe. Voici comment elle se déroule.', 'A badge shown on a profile means our team really carried out that check. Here is how it works.')}>
      <h2 className="lp-doc-h2">{t('Les trois niveaux', 'The three levels')}</h2>
      <ol className="lp-pas">
        <li><h3>{t('Niveau 1, photos vérifiées', 'Level 1, verified photos')}</h3><p>{t('Nous contrôlons que ton visage est visible et que les photos te représentent. Ce niveau active ton compte.', 'We check that your face is visible and that the photos are really you. This level activates your account.')}</p></li>
        <li><h3>{t('Niveau 2, selfie vidéo', 'Level 2, video selfie')}</h3><p>{t('Tu filmes environ 8 secondes en faisant un geste tiré au hasard par notre système. Une photo volée ne permet pas de le reproduire. Ce niveau est nécessaire pour écrire à tes matchs.', 'You film about 8 seconds while making a gesture picked at random by our system. A stolen photo cannot reproduce it. This level is required to message your matches.')}</p></li>
        <li><h3>{t('Niveau 3, identité vérifiée', 'Level 3, verified identity')}</h3><p>{t('Tu envoies une carte d’identité, un permis (recto et verso) ou la page photo d’un passeport. Notre équipe compare avec ton profil. C’est le badge vert.', 'You send an ID card, a driving licence (front and back) or the photo page of a passport. Our team compares it with your profile. This is the green badge.')}</p></li>
      </ol>
      <h2 className="lp-doc-h2">{t('Ce que nous faisons de tes documents', 'What we do with your documents')}</h2>
      <ul>
        <li>{t('Ta vidéo et ta pièce d’identité sont stockées dans un espace privé, lisible seulement par les administrateurs.', 'Your video and ID are stored in a private space that only administrators can read.')}</li>
        <li>{t('Elles sont supprimées dès que la décision est prise, acceptée ou refusée.', 'They are deleted as soon as a decision is made, accepted or refused.')}</li>
        <li>{t('Tes photos de profil sont conservées tant que ton compte existe.', 'Your profile photos are kept as long as your account exists.')}</li>
      </ul>
      <h2 className="lp-doc-h2">{t('Contre les faux comptes', 'Against fake accounts')}</h2>
      <ul>
        <li>{t('Une adresse email ne crée qu’un seul compte, y compris avec les variantes d’une même adresse.', 'One email address creates one account only, including variants of the same address.')}</li>
        <li>{t('Les adresses email jetables sont refusées.', 'Disposable email addresses are refused.')}</li>
        <li>{t('Un numéro de téléphone ne peut servir qu’à un seul compte.', 'A phone number can only be used for one account.')}</li>
        <li>{t('Des protections automatiques limitent les inscriptions en masse.', 'Automatic protections limit mass sign-ups.')}</li>
        <li>{t('Les demandes de vérification sont limitées à 3 par jour et par type.', 'Verification requests are limited to 3 per day per type.')}</li>
      </ul>
      <h2 className="lp-doc-h2">{t('Signaler et bloquer', 'Report and block')}</h2>
      <p>{t('Dans chaque conversation, tu peux bloquer ou signaler une personne : faux profil, arnaque, harcèlement, contenu inapproprié ou personne mineure. Une personne signalée est bloquée immédiatement pour toi, et notre équipe examine le signalement.', 'In every conversation you can block or report someone: fake profile, scam, harassment, inappropriate content or a minor. A reported person is blocked for you immediately, and our team reviews the report.')}</p>
      <h2 className="lp-doc-h2">{t('Nos conseils', 'Our advice')}</h2>
      <ul>
        <li>{t('N’envoie jamais d’argent à une personne rencontrée en ligne, quelle que soit la raison.', 'Never send money to someone you met online, whatever the reason.')}</li>
        <li>{t('Ne communique pas de code reçu par message ou par email.', 'Never share a code you received by message or email.')}</li>
        <li>{t('Pour un premier rendez-vous, choisis un lieu public et préviens un proche.', 'For a first date, choose a public place and tell someone close to you.')}</li>
      </ul>
    </InfoPage>
  );
}
