import { notFound } from 'next/navigation';
import { Chat } from '@/components/Chat';
import { requireComplet } from '@/lib/auth';
import { urlsPhotos } from '@/lib/photos';
import { getT } from '@/lib/lang';
import { I18nProvider } from '@/components/I18n';

export const dynamic = 'force-dynamic';

export default async function Conversation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase, user } = await requireComplet();
  const t = await getT();

  const { data: matchs } = await supabase.rpc('mes_matchs');
  const m = (matchs ?? []).find((x: { match_id: string }) => x.match_id === id) as { autre_id: string; prenom: string; photo_path: string | null; cree_le: string } | undefined;
  if (!m) notFound();

  const [{ data: msgs }, urls] = await Promise.all([
    supabase.from('messages').select('id,sender_id,body,created_at,read_at').eq('match_id', id).order('created_at', { ascending: true }).limit(200),
    urlsPhotos(supabase, [m.photo_path]),
  ]);

  return (
    <I18nProvider lang={t.lang}>
    <main className="mb chatpage">
      <Chat matchId={id} moi={user.id} prenom={m.prenom} autreId={m.autre_id} initial={msgs ?? []} photo={m.photo_path ? urls.get(m.photo_path) ?? null : null} depuis={t.date(m.cree_le)} />
    </main>
    </I18nProvider>
  );
}
