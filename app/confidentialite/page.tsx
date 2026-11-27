import type { Metadata } from 'next';
import { Confidentialite } from '@/components/pages/Confidentialite';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Politique de confidentialité – Love Infinity',
  description: 'Quelles données nous collectons, pourquoi, combien de temps et comment exercer tes droits.',
  alternates: alternates('fr', '/confidentialite'),
};

export default function Page() {
  return <Confidentialite lang="fr" />;
}
