import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { LikesGrille, type LikeRecu } from '@/components/LikesGrille';
import { MemberNav } from '@/components/MemberNav';
import { HeartIcon } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { urlsPhotos } from '@/lib/photos';
import { getT } from '@/lib/lang';
import { Stories } from '@/components/Stories';
import { chargerStories } from '@/lib/stories';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

type Ligne = { id: string; prenom: string; age: number; ville: string; verification_level: number; photo_path: string | null; note: string | null };

export default async function Likes() {
  const { supabase, user } = await requireComplet();
  const t = await getT();
  const [{ data }, { data: abo }, { data: moi }, groupesStories] = await Promise.all([
    supabase.rpc('likes_recus'),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('account_status').eq('id', user.id).single(),
    chargerStories(supabase),
  ]);
  const liste = (data ?? []) as Ligne[];
  const premium = Boolean(abo && abo.plan === 'premium' && new Date(abo.expires_at) > new Date());
  // Sans offre Premium, ni nom ni photo n’est envoyé au navigateur : le flou ne peut pas être contourné.
  const urls = premium ? await urlsPhotos(supabase, liste.map((l) => l.photo_path)) : new Map<string, string>();
  const likes: LikeRecu[] = liste.map((l) => premium
    ? { id: l.id, prenom: l.prenom, age: l.age, ville: l.ville, note: l.note, photo: l.photo_path ? urls.get(l.photo_path) ?? null : null }
    : { id: l.id, prenom: null, age: null, ville: null, note: l.note ? t('likes.msgIn') : null, photo: null });

  return (
    <>
      <main className="mb">
        <header className="mb-top"><Logo width={34} /><h1>{t('likes.title')}</h1></header>
        <Stories groupes={groupesStories} />
        {moi?.account_status !== 'active' && <div className="erreur">{t('likes.needActive')}</div>}
        {liste.length === 0 ? (
          <div className="vide">
            <div className="rond-deco"><HeartIcon size={38} /></div>
            <h2>{t('likes.emptyT')}</h2>
            <p>{t('likes.emptyP')}</p>
            <Link className="cta" style={{ maxWidth: 300 }} href="/decouvrir">{t('likes.keepSwiping')}</Link>
            <small className="vide-ou">{t('c.or')}</small>
            <Link className="cta ghost" style={{ maxWidth: 300 }} href="/moi/modifier">{t('likes.improve')}</Link>
          </div>
        ) : (
          <>
            {!premium && (
              <div className="bandeau">
                <h2>{t.n('likes.banner', liste.length)}</h2>
                <p>{t('likes.bannerP')}</p>
                <Link className="cta or" href="/abonnement">{t('likes.premium')}</Link>
              </div>
            )}
            <LikesGrille likes={likes} premium={premium} />
          </>
        )}
      </main>
      <MemberNav actif="likes" />
    </>
  );
}
