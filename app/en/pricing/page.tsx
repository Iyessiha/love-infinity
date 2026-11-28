import type { Metadata } from 'next';
import { Tarifs } from '@/components/pages/Tarifs';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Pricing – Love Infinity',
  description: 'Free to start, subscriptions with no automatic renewal. Mobile Money or card.',
  alternates: alternates('en', '/tarifs'),
};

export const revalidate = 3600;

export default function Page() {
  return <Tarifs lang="en" />;
}
