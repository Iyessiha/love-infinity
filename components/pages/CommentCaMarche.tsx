import { InfoPage } from '@/components/InfoPage';
import { href, tr, type Lang } from '@/lib/i18n';

export function CommentCaMarche({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <InfoPage lang={lang} path="/comment-ca-marche" titre={t('Comment ça marche', 'How it works')} intro={t('Quatre étapes, de l’inscription au premier message. Tout est gratuit jusqu’à la découverte.', 'Four steps, from sign-up to your first message. Everything is free up to discovery.')}>
      <ol className="lp-pas">
        <li><h2>{t('Crée ton compte', 'Create your account')}</h2><p>{t('Avec ton email et un mot de passe. Tu choisis ton pays et tu enregistres ton numéro de téléphone. Aucun SMS à attendre : nous te confirmons par email.', 'With your email and a password. You pick your country and add your phone number. No SMS to wait for: we confirm by email.')}</p></li>
        <li><h2>{t('Présente-toi', 'Introduce yourself')}</h2><p>{t('Ajoute 2 à 6 photos, ton prénom, ton nom (gardé privé), ta date de naissance et ta ville. Dis ce que tu cherches : relation sérieuse, mariage, amitié ou découverte. Tu peux ensuite parler de toi : profession, langues, religion, enfants, centres d’intérêt.', 'Add 2 to 6 photos, your first name, your last name (kept private), your date of birth and your city. Say what you are looking for: a serious relationship, marriage, friendship or discovery. Then tell us more: job, languages, religion, children, interests.')}</p></li>
        <li><h2>{t('Fais-toi vérifier', 'Get verified')}</h2><p>{t('Notre équipe examine tes photos : ton compte s’active à leur approbation. Tu peux aller plus loin avec un selfie vidéo, puis une pièce d’identité, pour obtenir des badges.', 'Our team reviews your photos: your account activates once they are approved. You can go further with a video selfie, then an ID document, to earn badges.')}</p></li>
        <li><h2>{t('Découvre, aime, écris', 'Discover, like, chat')}</h2><p>{t('Tu vois des profils compatibles avec ce que tu cherches. Tu aimes ou tu passes. Quand l’autre personne t’aime aussi, c’est un match : vous pouvez vous écrire, à condition d’avoir validé le selfie vidéo.', 'You see profiles that fit what you are looking for. You like or pass. When the other person likes you back, it is a match: you can message each other, as long as you have passed the video selfie.')}</p></li>
      </ol>
      <h2 className="lp-doc-h2">{t('Ce qui est gratuit', 'What is free')}</h2>
      <p>{t('L’inscription, la vérification, la découverte avec 5 likes par jour et la réception de tes matchs. Pour liker sans limite, consulte nos ', 'Sign-up, verification, discovery with 5 likes per day and receiving your matches. For unlimited likes, see our ')}<a href={href(lang, '/tarifs')}>{t('tarifs', 'pricing')}</a>.</p>
      <h2 className="lp-doc-h2">{t('Pour en savoir plus', 'Learn more')}</h2>
      <p>{t('Le détail de la vérification est sur la page ', 'The details of verification are on the ')}<a href={href(lang, '/securite')}>{t('Sécurité et vérification', 'Safety and verification')}</a>{t('. Les réponses aux questions courantes sont dans la ', ' page. Answers to common questions are in the ')}<a href={href(lang, '/faq')}>FAQ</a>.</p>
    </InfoPage>
  );
}
