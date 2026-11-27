import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pile, type Carte } from '@/components/Pile';
import { requireComplet } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Decouvrir() {
  const { supabase, user } = await requireComplet();
  const { data: moi } = await supabase.from('profiles').select('account_status').eq('id', user.id).single();
  if (moi?.account_status !== 'active') redirect('/verification');

  const [{ data: profils }, { data: restants }] = await Promise.all([
    supabase.rpc('decouvrir', { p_limit: 10 }),
    supabase.rpc('likes_restants'),
  ]);

  const liste = (profils ?? []) as {
    id: string; prenom: string; age: number; ville: string; bio: string | null; intention: string | null;
    profession: string | null; interets: string[]; verification_level: number; photo_path: string | null;
  }[];
  const chemins = liste.map((p) => p.photo_path).filter(Boolean) as string[];
  const signees = chemins.length ? (await supabase.storage.from('photos').createSignedUrls(chemins, 3600)).data ?? [] : [];
  const url = (path: string | null) => signees.find((s) => s.path === path)?.signedUrl ?? null;

  const cartes: Carte[] = liste.map((p) => ({ ...p, interets: p.interets ?? [], photo: url(p.photo_path) }));

  return (
    <main className="ph" style={{ gap: 12 }}>
      <div className="row"><h1>Découvrir</h1><div className="sp"></div><Link className="link" href="/matchs">Mes matchs</Link></div>
      <Pile cartes={cartes} restants={restants ?? null} />
    </main>
  );
}
