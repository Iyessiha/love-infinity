import type { Metadata } from 'next';
import { InfoPage } from '@/components/InfoPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Conditions d’utilisation – Love Infinity', description: 'Les règles d’utilisation de Love Infinity : compte, comportement, vérification, abonnement et responsabilités.' };

export default function Page() {
  return (
    <InfoPage titre="Conditions d’utilisation" maj={SITE.maj} cta={false} intro="En créant un compte sur Love Infinity, tu acceptes ces conditions. Elles existent pour que la communauté reste sûre et sincère.">
      <h2 className="lp-doc-h2">1. Le service</h2>
      <p>Love Infinity, édité par {SITE.editeur}, est un service de rencontres en ligne. Il te permet de créer un profil, de découvrir d’autres membres vérifiés et d’échanger avec ceux qui te correspondent.</p>

      <h2 className="lp-doc-h2">2. Conditions pour s’inscrire</h2>
      <ul>
        <li>Avoir 18 ans révolus.</li>
        <li>Créer un seul compte, à ton nom, avec une adresse email et un numéro de téléphone qui t’appartiennent.</li>
        <li>Fournir des informations exactes, et des photos qui te représentent réellement et récemment.</li>
      </ul>

      <h2 className="lp-doc-h2">3. Vérification</h2>
      <p>Ton compte s’active après l’approbation de tes photos. Nous pouvons te demander un selfie vidéo et une pièce d’identité pour vérifier ton profil. Nous pouvons refuser ou retirer un badge si les informations ne correspondent pas. Les documents sont supprimés après la décision, comme expliqué dans la <a href="/confidentialite">politique de confidentialité</a>.</p>

      <h2 className="lp-doc-h2">4. Comportement attendu</h2>
      <p>Tu t’engages à respecter les autres membres. Sont interdits :</p>
      <ul>
        <li>le faux profil, l’usurpation d’identité et l’utilisation des photos d’autrui ;</li>
        <li>les demandes d’argent, les arnaques et toute tentative de tromper un membre ;</li>
        <li>le harcèlement, les menaces, les propos haineux ou discriminatoires ;</li>
        <li>les contenus sexuellement explicites, violents ou illégaux ;</li>
        <li>toute relation avec une personne mineure ;</li>
        <li>l’usage commercial du service, la prospection, le démarchage et la collecte de données sur les membres ;</li>
        <li>le contournement des protections et des limites du service.</li>
      </ul>

      <h2 className="lp-doc-h2">5. Modération</h2>
      <p>Tu peux bloquer et signaler un membre à tout moment. Nous examinons les signalements. En cas de manquement à ces conditions, nous pouvons avertir, limiter, suspendre ou supprimer un compte, avec ou sans préavis selon la gravité. Les faits graves peuvent être signalés aux autorités.</p>

      <h2 className="lp-doc-h2">6. Abonnements et paiements</h2>
      <ul>
        <li>L’inscription, la vérification et 5 likes par jour sont gratuits.</li>
        <li>Les abonnements sont payés en FCFA, pour une période de 30 jours, sans renouvellement automatique.</li>
        <li>Un renouvellement avant la fin de la période ajoute 30 jours à la date d’expiration en cours.</li>
        <li>Le paiement est traité par notre partenaire GeniusPay. L’abonnement s’active à la confirmation du paiement.</li>
        <li>Si un paiement est débité sans activation de l’abonnement, nous corrigeons ou nous remboursons.</li>
        <li>Un compte supprimé pour manquement aux conditions ne donne pas droit au remboursement de la période en cours.</li>
      </ul>

      <h2 className="lp-doc-h2">7. Ton contenu</h2>
      <p>Tes photos et textes restent les tiens. Tu nous autorises à les afficher dans le service, aux membres concernés, tant que ton compte existe. Tu garantis que tu as le droit de les publier.</p>

      <h2 className="lp-doc-h2">8. Responsabilité</h2>
      <p>Nous vérifions les profils pour réduire les risques, mais nous ne pouvons pas garantir l’intention ou le comportement de chaque membre. Rencontre les personnes avec prudence : lieu public, proche prévenu, jamais d’argent envoyé. Le service est fourni tel quel, sans garantie de disponibilité continue. Dans la limite permise par la loi, notre responsabilité est limitée aux dommages directs.</p>

      <h2 className="lp-doc-h2">9. Suppression du compte</h2>
      <p>Tu peux demander la suppression de ton compte à tout moment à <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>.</p>

      <h2 className="lp-doc-h2">10. Modifications et droit applicable</h2>
      <p>Nous pouvons modifier ces conditions. Les changements importants te sont annoncés dans l’application ou par email, et la date de mise à jour figure en haut de cette page. Continuer à utiliser le service après un changement vaut acceptation. Pour les membres résidant en Côte d’Ivoire, les présentes conditions sont soumises au droit ivoirien, sans préjudice des droits que la loi du pays du membre lui reconnaît.</p>

      <h2 className="lp-doc-h2">Contact</h2>
      <p><a href={`mailto:${SITE.contact}`}>{SITE.contact}</a></p>
    </InfoPage>
  );
}
