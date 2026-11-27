import type { Metadata } from 'next';
import { CommentCaMarche } from '@/components/pages/CommentCaMarche';
import { alternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Comment ça marche – Love Infinity',
  description: 'De l’inscription au premier message : les étapes pour rencontrer des personnes vérifiées.',
  alternates: alternates('fr', '/comment-ca-marche'),
};

export default function Page() {
  return <CommentCaMarche lang="fr" />;
}
