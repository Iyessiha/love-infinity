import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { StoryGroup } from '@/components/Stories';

type Ligne = { user_id: string; prenom: string; story_id: string; path: string | null; created_at: string; est_moi: boolean; kind: string; texte: string | null; fond: number };

/** Stories actives visibles par le membre connecté, regroupées par auteur, avec liens signés. */
export async function chargerStories(supabase: SupabaseClient): Promise<StoryGroup[]> {
  const { data } = await supabase.rpc('stories_actives');
  const lignes = (data ?? []) as Ligne[];
  if (!lignes.length) return [];
  const adm = supabaseAdmin();
  const sign = async (bucket: string, video: boolean) => {
    const ch = lignes.filter((l) => l.path && (l.kind === 'video') === video).map((l) => l.path as string);
    return ch.length ? (await adm.storage.from(bucket).createSignedUrls(ch, 3600)).data ?? [] : [];
  };
  const signees = [...(await sign('photos', false)), ...(await sign('clips', true))];
  const groupes: StoryGroup[] = [];
  for (const l of lignes) {
    const url = l.kind === 'texte' ? '' : signees.find((s) => s.path === l.path)?.signedUrl ?? undefined;
    if (url === undefined) continue;
    let g = groupes.find((x) => x.user_id === l.user_id);
    if (!g) groupes.push((g = { user_id: l.user_id, prenom: l.prenom, est_moi: l.est_moi, items: [] }));
    g.items.push({ id: l.story_id, url, created_at: l.created_at, kind: l.kind === 'video' ? 'video' : l.kind === 'texte' ? 'texte' : 'photo', texte: l.texte, fond: l.fond, path: l.path ?? undefined });
  }
  return groupes;
}
