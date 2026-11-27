import type { Metadata } from 'next';
import { InfoPage } from '@/components/InfoPage';

export const metadata: Metadata = { title: 'Comment ça marche – Love Infinity', description: 'De l’inscription au premier message : les étapes pour rencontrer des personnes vérifiées sur Love Infinity.' };

export default function Page() {
  return (
    <InfoPage titre="Comment ça marche" intro="Quatre étapes, de l’inscription au premier message. Tout est gratuit jusqu’à la découverte.">
      <ol className="lp-pas">
        <li><h2>Crée ton compte</h2><p>Avec ton email et un mot de passe. Tu choisis ton pays et tu enregistres ton numéro de téléphone. Aucun SMS à attendre : nous te confirmons par email.</p></li>
        <li><h2>Présente-toi</h2><p>Ajoute 2 à 6 photos, ton prénom, ton nom (gardé privé), ta date de naissance et ta ville. Dis ce que tu cherches : relation sérieuse, mariage, amitié ou découverte. Tu peux ensuite parler de toi : profession, langues, religion, enfants, centres d’intérêt.</p></li>
        <li><h2>Fais-toi vérifier</h2><p>Notre équipe examine tes photos : ton compte s’active à leur approbation. Tu peux aller plus loin avec un selfie vidéo, puis une pièce d’identité, pour obtenir des badges.</p></li>
        <li><h2>Découvre, aime, écris</h2><p>Tu vois des profils compatibles avec ce que tu cherches. Tu aimes ou tu passes. Quand l’autre personne t’aime aussi, c’est un match : vous pouvez vous écrire, à condition d’avoir validé le selfie vidéo.</p></li>
      </ol>
      <h2 className="lp-doc-h2">Ce qui est gratuit</h2>
      <p>L’inscription, la vérification, la découverte avec 5 likes par jour et la réception de tes matchs. Pour liker sans limite, consulte nos <a href="/tarifs">tarifs</a>.</p>
      <h2 className="lp-doc-h2">Pour en savoir plus</h2>
      <p>Le détail de la vérification est sur la page <a href="/securite">Sécurité et vérification</a>. Les réponses aux questions courantes sont dans la <a href="/faq">FAQ</a>.</p>
    </InfoPage>
  );
}
