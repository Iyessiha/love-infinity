import type { Metadata } from 'next';
import { InfoPage } from '@/components/InfoPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Politique de confidentialité – Love Infinity', description: 'Quelles données nous collectons, pourquoi, combien de temps nous les gardons et comment exercer tes droits.' };

export default function Page() {
  return (
    <InfoPage titre="Politique de confidentialité" maj={SITE.maj} cta={false} intro="Nous collectons seulement ce qui sert à faire fonctionner Love Infinity et à protéger ses membres. Cette page explique quoi, pourquoi et pour combien de temps.">
      <h2 className="lp-doc-h2">Qui est responsable de tes données</h2>
      <p>{SITE.editeur}, société de droit américain (Nouveau-Mexique) exploitant Love Infinity depuis Abidjan, Côte d’Ivoire. Contact : <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>.</p>

      <h2 className="lp-doc-h2">Les données que nous collectons</h2>
      <ul>
        <li><b>Compte :</b> adresse email, mot de passe (stocké sous forme chiffrée, que nous ne pouvons pas lire), pays et numéro de téléphone.</li>
        <li><b>Profil :</b> prénom, nom (jamais affiché), date de naissance, ville, genre, ce que tu recherches, photos, biographie et les informations facultatives que tu choisis de renseigner (profession, études, langues, religion, enfants, tabac, alcool, centres d’intérêt).</li>
        <li><b>Vérification :</b> vidéo selfie et pièce d’identité (recto et verso ou page photo).</li>
        <li><b>Utilisation :</b> likes, passes, matchs, messages, blocages et signalements.</li>
        <li><b>Paiement :</b> le montant, la date et l’état de tes paiements. Les données de carte ou de Mobile Money sont traitées par notre partenaire de paiement GeniusPay et ne passent pas par nos serveurs.</li>
        <li><b>Sécurité :</b> une empreinte chiffrée de ton adresse IP et de ton numéro pour lutter contre les faux comptes. L’adresse IP elle-même n’est pas conservée en clair.</li>
      </ul>
      <p>Certaines de ces informations, comme la religion, la vie de famille ou les photos, peuvent être sensibles. Tu es libre de ne pas les renseigner, et tu choisis ce qui apparaît sur ton profil.</p>

      <h2 className="lp-doc-h2">Pourquoi nous les utilisons</h2>
      <ul>
        <li>Créer ton compte et te proposer des profils compatibles.</li>
        <li>Vérifier que les profils sont réels et protéger les membres contre les faux comptes, les arnaques et le harcèlement.</li>
        <li>Permettre les conversations entre personnes qui se sont plu mutuellement.</li>
        <li>Gérer les abonnements et les paiements.</li>
        <li>Respecter nos obligations légales et traiter les signalements.</li>
      </ul>
      <p>Nous ne vendons pas tes données et nous ne les utilisons pas pour de la publicité de tiers.</p>

      <h2 className="lp-doc-h2">Ce que les autres membres voient</h2>
      <p>Ton prénom, ton âge, ta ville, tes photos, ta biographie, tes centres d’intérêt, ton intention et tes badges de vérification. Ils ne voient jamais ton nom de famille, ton email, ton numéro de téléphone ni tes documents d’identité.</p>

      <h2 className="lp-doc-h2">Combien de temps nous les gardons</h2>
      <ul>
        <li><b>Vidéo selfie et pièce d’identité :</b> supprimées dès la décision de vérification.</li>
        <li><b>Profil, photos et messages :</b> tant que ton compte existe.</li>
        <li><b>Après suppression du compte :</b> tes données sont effacées, sauf celles que la loi nous oblige à conserver, par exemple les traces de paiement et les éléments liés à un signalement.</li>
      </ul>

      <h2 className="lp-doc-h2">Avec qui nous partageons des données</h2>
      <p>Uniquement avec les prestataires nécessaires au service : l’hébergement et la base de données (Vercel et Supabase), le paiement (GeniusPay) et l’envoi des emails. Ils n’utilisent pas tes données pour leur propre compte. Nous pouvons aussi communiquer des informations si une autorité compétente l’exige légalement.</p>

      <h2 className="lp-doc-h2">Tes droits</h2>
      <p>Tu peux demander l’accès à tes données, leur correction, leur suppression, ou t’opposer à certains usages. Écris-nous à <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a> depuis l’adresse de ton compte. Nous répondons dans un délai raisonnable. Tu peux aussi saisir l’autorité ivoirienne de protection des données, l’ARTCI, en application de la loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel.</p>

      <h2 className="lp-doc-h2">Cookies</h2>
      <p>Nous utilisons uniquement les cookies nécessaires à ta connexion. Nous n’utilisons pas de cookies publicitaires.</p>

      <h2 className="lp-doc-h2">Âge minimum</h2>
      <p>Love Infinity est réservé aux personnes de 18 ans et plus. Si nous découvrons qu’un compte appartient à une personne mineure, nous le supprimons.</p>

      <h2 className="lp-doc-h2">Modifications</h2>
      <p>Si nous changeons cette politique de façon importante, nous te prévenons dans l’application ou par email. La date de dernière mise à jour figure en haut de la page.</p>
    </InfoPage>
  );
}
