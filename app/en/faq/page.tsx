import type { Metadata } from 'next';
import { Faq } from '@/components/pages/Faq';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'FAQ – Love Infinity',
  description: 'Verification, privacy, account and subscription: answers to common questions.',
  alternates: alternates('en', '/faq'),
};

export default function Page() {
  return <Faq lang="en" />;
}
