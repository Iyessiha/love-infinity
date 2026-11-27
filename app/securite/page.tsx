import type { Metadata } from 'next';
import { InfoPage } from '@/components/InfoPage';

export const metadata: Metadata = { title: 'Sécurité et vérification – Love Infinity', description: 'Les trois niveaux de vérification, la protection contre les faux profils et ce que nous faisons de tes documents.' };

export default function Page() {
  return (
    <InfoPage titre="Sécurité et vérification" intro="Un badge affiché sur un profil correspond à une vérification réellement faite par notre équipe. Voici comment elle se déroule.">
      <h2 className="lp-doc-h2">Les trois niveaux</h2>
      <ol className="lp-pas">
        <li><h3>Niveau 1, photos vérifiées</h3><p>Nous contrôlons que ton visage est visible et que les photos te représentent. Ce niveau active ton compte.</p></li>
        <li><h3>Niveau 2, selfie vidéo</h3><p>Tu filmes environ 8 secondes en faisant un geste tiré au hasard par notre système. Une photo volée ne permet pas de le reproduire. Ce niveau est nécessaire pour écrire à tes matchs.</p></li>
        <li><h3>Niveau 3, identité vérifiée</h3><p>Tu envoies une carte d’identité, un permis (recto et verso) ou la page photo d’un passeport. Notre équipe compare avec ton profil. C’est le badge vert.</p></li>
      </ol>
      <h2 className="lp-doc-h2">Ce que nous faisons de tes documents</h2>
      <ul>
        <li>Ta vidéo et ta pièce d’identité sont stockées dans un espace privé, lisible seulement par les administrateurs.</li>
        <li>Elles sont supprimées dès que la décision est prise, acceptée ou refusée.</li>
        <li>Tes photos de profil sont conservées tant que ton compte existe.</li>
      </ul>
      <h2 className="lp-doc-h2">Contre les faux comptes</h2>
      <ul>
        <li>Une adresse email ne crée qu’un seul compte, y compris avec les variantes d’une même adresse.</li>
        <li>Les adresses email jetables sont refusées.</li>
        <li>Un numéro de téléphone ne peut servir qu’à un seul compte.</li>
        <li>Des protections automatiques limitent les inscriptions en masse.</li>
        <li>Les demandes de vérification sont limitées à 3 par jour et par type.</li>
      </ul>
      <h2 className="lp-doc-h2">Signaler et bloquer</h2>
      <p>Dans chaque conversation, tu peux bloquer ou signaler une personne : faux profil, arnaque, harcèlement, contenu inapproprié ou personne mineure. Une personne signalée est bloquée immédiatement pour toi, et notre équipe examine le signalement.</p>
      <h2 className="lp-doc-h2">Nos conseils</h2>
      <ul>
        <li>N’envoie jamais d’argent à une personne rencontrée en ligne, quelle que soit la raison.</li>
        <li>Ne communique pas de code reçu par message ou par email.</li>
        <li>Pour un premier rendez-vous, choisis un lieu public et préviens un proche.</li>
      </ul>
    </InfoPage>
  );
}
