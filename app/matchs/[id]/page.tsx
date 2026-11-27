import { notFound } from 'next/navigation';
import { Chat } from '@/components/Chat';
import { Chevron } from '@/components/Icons';
import { requireUser } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Conversation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase, user } = await requireUser();

  const { data: matchs } = await supabase.rpc('mes_matchs');
  const m = (matchs ?? []).find((x: { match_id: string }) => x.match_id === id) as { autre_id: string; prenom: string } | undefined;
  if (!m) notFound();

  const { data: msgs } = await supabase.from('messages').select('id,sender_id,body,created_at,read_at').eq('match_id', id).order('created_at', { ascending: true }).limit(200);

  return (
    <main className="ph" style={{ gap: 10 }}>
      <Link className="back" href="/matchs"><Chevron /> Mes matchs</Link>
      <Chat matchId={id} moi={user.id} prenom={m.prenom} autreId={m.autre_id} initial={msgs ?? []} />
    </main>
  );
}
