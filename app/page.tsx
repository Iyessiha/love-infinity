import type { Metadata } from 'next';
import { Home } from '@/components/pages/Home';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Love Infinity – Ici, tout le monde est vrai',
  description: 'Rencontres sérieuses avec des profils vérifiés. Inscription gratuite.',
  alternates: alternates('fr', '/'),
};

export default function Page() {
  return <Home lang="fr" />;
}
