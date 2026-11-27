import type { Metadata } from 'next';
import { Securite } from '@/components/pages/Securite';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Sécurité et vérification – Love Infinity',
  description: 'Les trois niveaux de vérification, la protection contre les faux profils et ce que nous faisons de tes documents.',
  alternates: alternates('fr', '/securite'),
};

export default function Page() {
  return <Securite lang="fr" />;
}
