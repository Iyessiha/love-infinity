import type { Metadata } from 'next';
import { Securite } from '@/components/pages/Securite';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Safety and verification – Love Infinity',
  description: 'The three verification levels, protection against fake profiles and what we do with your documents.',
  alternates: alternates('en', '/securite'),
};

export default function Page() {
  return <Securite lang="en" />;
}
