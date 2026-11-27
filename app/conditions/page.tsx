import type { Metadata } from 'next';
import { Conditions } from '@/components/pages/Conditions';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Conditions d’utilisation – Love Infinity',
  description: 'Les règles d’utilisation de Love Infinity : compte, comportement, vérification, abonnement.',
  alternates: alternates('fr', '/conditions'),
};

export default function Page() {
  return <Conditions lang="fr" />;
}
