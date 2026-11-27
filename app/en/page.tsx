import type { Metadata } from 'next';
import { Home } from '@/components/pages/Home';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Love Infinity – Here, everyone is real',
  description: 'Serious dating with verified profiles. Free to sign up.',
  alternates: alternates('en', '/'),
};

export default function Page() {
  return <Home lang="en" />;
}
