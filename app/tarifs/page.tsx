import type { Metadata } from 'next';
import { InfoPage } from '@/components/InfoPage';

export const metadata: Metadata = { title: 'Tarifs – Love Infinity', description: 'Gratuit pour commencer, abonnements en FCFA sans renouvellement automatique. Paiement par Mobile Money ou carte.' };

export default function Page() {
  return (
    <InfoPage titre="Tarifs" intro="Gratuit pour commencer. Des abonnements simples, en FCFA, sans pièces qui expirent.">
      <div className="lp-plans">
        <section className="lp-plan">
          <h2>Gratuit</h2>
          <ul>
            <li>Inscription et vérification</li>
            <li>Découverte de profils</li>
            <li>5 likes par jour</li>
            <li>Réception de tes matchs</li>
          </ul>
        </section>
        <section className="lp-plan fort">
          <h2>Abonnement</h2>
          <ul>
            <li>Likes illimités</li>
            <li>Les offres Essentiel et Premium, avec leur prix en FCFA, sont affichées dans l’application une fois connecté(e)</li>
          </ul>
        </section>
      </div>
      <h2 className="lp-doc-h2">Paiement</h2>
      <p>Wave, Orange Money, MTN, Moov ou carte, sur la page de paiement sécurisée de notre partenaire GeniusPay. Nous ne voyons jamais ton code secret ni ton numéro de carte.</p>
      <h2 className="lp-doc-h2">Renouvellement</h2>
      <p>Aucun renouvellement automatique : tu paies une période (30 jours) et tu décides de continuer. Si tu renouvelles avant la fin, les jours restants sont ajoutés à ta nouvelle période.</p>
      <h2 className="lp-doc-h2">Un souci de paiement ?</h2>
      <p>Si un paiement est débité sans que ton abonnement s’active, écris-nous : nous corrigeons ou nous remboursons. Nos coordonnées sont sur la page <a href="/confidentialite">Confidentialité</a>.</p>
    </InfoPage>
  );
}
