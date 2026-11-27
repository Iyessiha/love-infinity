import type { Metadata } from 'next';
import { Tarifs } from '@/components/pages/Tarifs';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Tarifs – Love Infinity',
  description: 'Gratuit pour commencer, abonnements sans renouvellement automatique. Mobile Money ou carte.',
  alternates: alternates('fr', '/tarifs'),
};

export default function Page() {
  return <Tarifs lang="fr" />;
}
