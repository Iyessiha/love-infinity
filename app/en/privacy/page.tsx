import type { Metadata } from 'next';
import { Confidentialite } from '@/components/pages/Confidentialite';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Privacy policy – Love Infinity',
  description: 'What data we collect, why, for how long and how to exercise your rights.',
  alternates: alternates('en', '/confidentialite'),
};

export default function Page() {
  return <Confidentialite lang="en" />;
}
