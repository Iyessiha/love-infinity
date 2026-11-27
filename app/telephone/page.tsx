import { headers } from 'next/headers';
import { Telephone } from '@/components/Telephone';

export const dynamic = 'force-dynamic';

/** Le pays est présélectionné d'après la connexion du visiteur (modifiable). */
export default async function Page() {
  const h = await headers();
  return <Telephone defaut={(h.get('x-vercel-ip-country') ?? '').toUpperCase()} />;
}
