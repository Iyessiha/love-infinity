import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { CompassIcon, HeartIcon, MsgIcon, UserIcon } from '@/components/Icons';

export type Onglet = 'decouvrir' | 'likes' | 'matchs' | 'moi';

/** Barre de navigation du membre : Découvrir, Likes reçus, Messages, Mon profil. Les pastilles comptent likes et messages non lus. */
export async function MemberNav({ actif }: { actif: Onglet }) {
  const supabase = await supabaseServer();
  const [{ data: likes }, { data: matchs }] = await Promise.all([supabase.rpc('likes_recus'), supabase.rpc('mes_matchs')]);
  const nbLikes = (likes ?? []).length;
  const nbMsgs = ((matchs ?? []) as { non_lus: number }[]).reduce((n, m) => n + (m.non_lus ?? 0), 0);
  const items: { id: Onglet; href: string; label: string; icone: React.ReactNode; n: number }[] = [
    { id: 'decouvrir', href: '/decouvrir', label: 'Découvrir', icone: <CompassIcon />, n: 0 },
    { id: 'likes', href: '/likes', label: 'Likes', icone: <HeartIcon filled={false} />, n: nbLikes },
    { id: 'matchs', href: '/matchs', label: 'Messages', icone: <MsgIcon />, n: nbMsgs },
    { id: 'moi', href: '/moi', label: 'Moi', icone: <UserIcon />, n: 0 },
  ];
  return (
    <nav className="nav" aria-label="Menu principal">
      <div className="nav-in">
        {items.map((it) => (
          <Link key={it.id} href={it.href} className={it.id === actif ? 'on' : ''} aria-current={it.id === actif ? 'page' : undefined}>
            {it.icone}
            {it.label}
            {it.n > 0 && <span className="pt" aria-label={`${it.n} nouveau${it.n > 1 ? 'x' : ''}`}>{it.n > 9 ? '9+' : it.n}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}
