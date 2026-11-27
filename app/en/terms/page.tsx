import type { Metadata } from 'next';
import { Conditions } from '@/components/pages/Conditions';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Terms of use – Love Infinity',
  description: 'The rules of using Love Infinity: account, behaviour, verification, subscription.',
  alternates: alternates('en', '/conditions'),
};

export default function Page() {
  return <Conditions lang="en" />;
}
