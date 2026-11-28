import IntlLayout from '@/components/IntlLayout';
import { requireComplet } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireComplet();
  return <IntlLayout>{children}</IntlLayout>;
}
