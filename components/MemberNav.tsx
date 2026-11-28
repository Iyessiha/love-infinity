import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { getT } from '@/lib/lang';
import { CrownIcon, CompassIcon, HeartIcon, MsgIcon, UserIcon } from '@/components/Icons';

export type Onglet = 'decouvrir' | 'likes' | 'vip' | 'matchs' | 'moi';

/** Barre de navigation du membre : Découvrir, Likes reçus, Messages, Mon profil. Les pastilles comptent likes et messages non lus. */
export async function MemberNav({ actif }: { actif: Onglet }) {
  const supabase = await supabaseServer();
  const t = await getT();
  const [{ data: likes }, { data: matchs }] = await Promise.all([supabase.rpc('likes_recus'), supabase.rpc('mes_matchs')]);
  const nbLikes = (likes ?? []).length;
  const nbMsgs = ((matchs ?? []) as { non_lus: number }[]).reduce((n, m) => n + (m.non_lus ?? 0), 0);
  const items: { id: Onglet; href: string; label: string; icone: React.ReactNode; n: number }[] = [
    { id: 'decouvrir', href: '/decouvrir', label: t('nav.discover'), icone: <CompassIcon />, n: 0 },
    { id: 'likes', href: '/likes', label: t('nav.likes'), icone: <HeartIcon filled={false} />, n: nbLikes },
    { id: 'vip', href: '/vip', label: t('nav.vip'), icone: <CrownIcon />, n: 0 },
    { id: 'matchs', href: '/matchs', label: t('nav.messages'), icone: <MsgIcon />, n: nbMsgs },
    { id: 'moi', href: '/moi', label: t('nav.me'), icone: <UserIcon />, n: 0 },
  ];
  return (
    <nav className="nav" aria-label={t('nav.menu')}>
      <div className="nav-in">
        {items.map((it) => (
          <Link key={it.id} href={it.href} className={it.id === actif ? 'on' : ''} aria-current={it.id === actif ? 'page' : undefined}>
            {it.icone}
            {it.label}
            {it.n > 0 && <span className="pt" aria-label={t('nav.badge', { n: it.n })}>{it.n > 9 ? '9+' : it.n}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}
