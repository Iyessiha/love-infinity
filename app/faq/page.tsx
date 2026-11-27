import type { Metadata } from 'next';
import { Faq } from '@/components/pages/Faq';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Questions fréquentes – Love Infinity',
  description: 'Vérification, vie privée, compte et abonnement : les réponses aux questions courantes.',
  alternates: alternates('fr', '/faq'),
};

export default function Page() {
  return <Faq lang="fr" />;
}
