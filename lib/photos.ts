import type { SupabaseClient } from '@supabase/supabase-js';

/** URLs affichables pour des chemins de photos : les liens https (démo) passent tels quels, les autres sont signés. */
export async function urlsPhotos(client: SupabaseClient, paths: (string | null | undefined)[], ttl = 3600) {
  const out = new Map<string, string>();
  const stockees: string[] = [];
  for (const p of new Set(paths.filter((x): x is string => !!x))) {
    if (p.startsWith('https://')) out.set(p, p);
    else stockees.push(p);
  }
  if (stockees.length) {
    const { data } = await client.storage.from('photos').createSignedUrls(stockees, ttl);
    data?.forEach((s) => { if (s.path && s.signedUrl) out.set(s.path, s.signedUrl); });
  }
  return out;
}

export const INTENTIONS: Record<string, string> = { relation_serieuse: 'Relation sérieuse', mariage: 'Mariage', amitie: 'Amitié', decouverte: 'Découverte' };
export const NIVEAUX = ['', 'Photos vérifiées', 'Selfie vérifié', 'Identité vérifiée'];
