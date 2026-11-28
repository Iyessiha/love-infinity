import Link from 'next/link';
import { Bloques, type Bloque } from '@/components/Bloques';
import { MemberNav } from '@/components/MemberNav';
import { ChevronLeft } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { urlsPhotos } from '@/lib/photos';
import { getT } from '@/lib/lang';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

export default async function PageBloques() {
  const { supabase } = await requireComplet();
  const t = await getT();
  const { data } = await supabase.rpc('mes_bloques');
  const liste = (data ?? []) as { id: string; prenom: string; photo_path: string | null }[];
  const urls = await urlsPhotos(supabase, liste.map((l) => l.photo_path));
  const items: Bloque[] = liste.map((l) => ({ id: l.id, prenom: l.prenom, photo: l.photo_path ? urls.get(l.photo_path) ?? null : null }));
  return (
    <>
      <main className="mb">
        <header className="mb-top"><Link className="mb-ico" href="/moi/parametres" aria-label={t('c.back')}><ChevronLeft /></Link><h1 style={{ fontSize: 24 }}>{t('set.blockedT')}</h1></header>
        <Bloques items={items} />
      </main>
      <MemberNav actif="moi" />
    </>
  );
}
