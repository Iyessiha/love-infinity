import Link from 'next/link';
import { EditerProfil } from '@/components/EditerProfil';
import { MemberNav } from '@/components/MemberNav';
import { ChevronLeft } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { urlsPhotos } from '@/lib/photos';
import { getT } from '@/lib/lang';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

export default async function Modifier() {
  const { supabase, user } = await requireComplet();
  const t = await getT();
  const [{ data: p }, { data: photos }, { data: abo }] = await Promise.all([
    supabase.from('profiles').select('bio,profession,taille_cm,etudes,langues,intention,enfants,tabac,alcool,religion,interets,theme,prompts').eq('id', user.id).single(),
    supabase.from('profile_photos').select('path').eq('user_id', user.id).order('position'),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
  ]);
  const premium = Boolean(abo && abo.plan === 'premium' && new Date(abo.expires_at) > new Date());
  const urls = await urlsPhotos(supabase, (photos ?? []).map((x) => x.path));
  const liste = (photos ?? []).map((x) => urls.get(x.path)).filter((x): x is string => !!x);

  return (
    <>
      <main className="mb">
        <header className="mb-top"><Link className="mb-ico" href="/moi" aria-label={t('c.back')}><ChevronLeft /></Link><h1 style={{ fontSize: 24 }}>{t('ed.title')}</h1></header>
        <EditerProfil init={{
          bio: p?.bio ?? '', profession: p?.profession ?? '', taille: p?.taille_cm ? String(p.taille_cm) : '', etudes: p?.etudes ?? '',
          langues: p?.langues ?? [], intention: p?.intention ?? '', enfants: p?.enfants ?? '', tabac: p?.tabac ?? 'Non', alcool: p?.alcool ?? 'Non',
          religion: p?.religion ?? 'Je préfère ne pas dire', interets: p?.interets ?? [],
        }} photos={liste} theme={p?.theme ?? 'classique'} prompts={(p?.prompts as { q: string; a: string }[]) ?? []} premium={premium} />
      </main>
      <MemberNav actif="moi" />
    </>
  );
}
