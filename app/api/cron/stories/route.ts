import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/** Appelé chaque heure par Vercel Cron : efface les stories expirées (lignes + fichiers). */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  const admin = supabaseAdmin();
  const { data, error } = await admin.rpc('purger_stories');
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  const lignes = (data ?? []) as { path: string | null; kind: string }[];
  const photos = lignes.filter((l) => l.kind === 'photo' && l.path).map((l) => l.path as string);
  const clips = lignes.filter((l) => l.kind === 'video' && l.path).map((l) => l.path as string);
  if (photos.length) await admin.storage.from('photos').remove(photos);
  if (clips.length) await admin.storage.from('clips').remove(clips);
  return NextResponse.json({ ok: true, supprimees: lignes.length });
}
