import Link from 'next/link';
import { LikesGrille, type LikeRecu } from '@/components/LikesGrille';
import { MemberNav } from '@/components/MemberNav';
import { HeartIcon } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { urlsPhotos } from '@/lib/photos';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

type Ligne = { id: string; prenom: string; age: number; ville: string; verification_level: number; photo_path: string | null; note: string | null };

export default async function Likes() {
  const { supabase, user } = await requireComplet();
  const [{ data }, { data: abo }, { data: moi }] = await Promise.all([
    supabase.rpc('likes_recus'),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('account_status').eq('id', user.id).single(),
  ]);
  const liste = (data ?? []) as Ligne[];
  const premium = Boolean(abo && abo.plan === 'premium' && new Date(abo.expires_at) > new Date());
  // Sans offre Premium, ni nom ni photo n’est envoyé au navigateur : le flou ne peut pas être contourné.
  const urls = premium ? await urlsPhotos(supabase, liste.map((l) => l.photo_path)) : new Map<string, string>();
  const likes: LikeRecu[] = liste.map((l) => premium
    ? { id: l.id, prenom: l.prenom, age: l.age, ville: l.ville, note: l.note, photo: l.photo_path ? urls.get(l.photo_path) ?? null : null }
    : { id: l.id, prenom: null, age: null, ville: null, note: l.note ? 'Message reçu' : null, photo: null });

  return (
    <>
      <main className="mb">
        <header className="mb-top"><h1>Likes reçus</h1></header>
        {moi?.account_status !== 'active' && <div className="erreur">Ton profil doit être validé pour recevoir et voir des likes.</div>}
        {liste.length === 0 ? (
          <div className="vide">
            <div className="rond-deco"><HeartIcon size={38} /></div>
            <h2>Pas encore de like</h2>
            <p>Complète ton profil et ajoute des photos : les profils soignés reçoivent bien plus de likes.</p>
            <Link className="cta" style={{ maxWidth: 300 }} href="/moi/modifier">Améliorer mon profil</Link>
          </div>
        ) : (
          <>
            {!premium && (
              <div className="bandeau">
                <h2>{liste.length} personne{liste.length > 1 ? 's' : ''} t’{liste.length > 1 ? 'ont' : 'a'} liké</h2>
                <p>Passe en Premium pour voir qui c’est, lire leurs messages et liker en retour pour matcher tout de suite.</p>
                <Link className="cta or" href="/abonnement">Découvrir Premium</Link>
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
