import type { Metadata } from 'next';
import { CommentCaMarche } from '@/components/pages/CommentCaMarche';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'How it works – Love Infinity',
  description: 'From sign-up to your first message: the steps to meet verified people.',
  alternates: alternates('en', '/comment-ca-marche'),
};

export default function Page() {
  return <CommentCaMarche lang="en" />;
}
