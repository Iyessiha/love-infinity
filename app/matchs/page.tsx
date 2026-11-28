import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { MemberNav } from '@/components/MemberNav';
import { MsgIcon, ShieldIcon } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { urlsPhotos } from '@/lib/photos';
import { getT } from '@/lib/lang';
import type { T } from '@/lib/dict';
import { Stories } from '@/components/Stories';
import { chargerStories } from '@/lib/stories';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

type Match = { match_id: string; autre_id: string; prenom: string; photo_path: string | null; cree_le: string; dernier_message: string | null; dernier_le: string | null; non_lus: number };

function quand(iso: string, t: T) {
  const d = new Date(iso);
  const jours = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (jours < 1) return t.time(d);
  if (jours < 7) return t.date(d, { weekday: 'short' });
  return t.date(d, { day: 'numeric', month: 'short' });
}

export default async function Matchs() {
  const { supabase } = await requireComplet();
  const t = await getT();
  const { data } = await supabase.rpc('mes_matchs');
  const liste = (data ?? []) as Match[];
  const urls = await urlsPhotos(supabase, liste.map((m) => m.photo_path));
  const img = (m: Match) => (m.photo_path ? urls.get(m.photo_path) : undefined);
  const groupes = await chargerStories(supabase);
  const nouveaux = liste.filter((m) => !m.dernier_message);
  const convs = liste.filter((m) => m.dernier_message);

  return (
    <>
      <main className="mb">
        <header className="mb-top"><Logo width={34} /><h1>{t('msgs.title')}</h1></header>
        <Stories groupes={groupes} />
        <Link href="/faq" className="conv officiel">
          <div className="av"><Logo width={30} blanc /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <b>Love Infinity <span className="coche" aria-label={t('off.verified')}><ShieldIcon size={13} /></span></b>
            <p className="dern">{t('off.sub')}</p>
          </div>
        </Link>
        {liste.length === 0 ? (
          <div className="vide">
            <div className="rond-deco"><MsgIcon size={36} /></div>
            <h2>{t('msgs.emptyT')}</h2>
            <p>{t('msgs.emptyP')}</p>
            <Link className="cta" style={{ maxWidth: 300 }} href="/decouvrir">{t('msgs.discover')}</Link>
            <small className="vide-ou">{t('c.or')}</small>
            <Link className="cta ghost" style={{ maxWidth: 300 }} href="/moi/modifier">{t('likes.improve')}</Link>
          </div>
        ) : (
          <>
            {nouveaux.length > 0 && (
              <section aria-label={t('msgs.new')}>
                <h2 style={{ fontSize: 17, marginBottom: 8 }}>{t('msgs.new')}</h2>
                <div className="nouveaux">
                  {nouveaux.map((m) => (
                    <Link key={m.match_id} className="nv" href={`/matchs/${m.match_id}`}>
                      <div className="av">{/* eslint-disable-next-line @next/next/no-img-element */ img(m) ? <img src={img(m)} alt="" /> : <div />}</div>
                      {m.prenom}
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {convs.length > 0 && (
              <section aria-label={t('msgs.convs')} className="col" style={{ gap: 10 }}>
                <h2 style={{ fontSize: 17 }}>{t('msgs.convs')}</h2>
                {convs.map((m) => (
                  <Link key={m.match_id} href={`/matchs/${m.match_id}`} className="conv">
                    <div className="av">{/* eslint-disable-next-line @next/next/no-img-element */ img(m) && <img src={img(m)} alt="" />}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <b>{m.prenom}</b>
                      <p className={`dern${m.non_lus ? ' nl' : ''}`}>{m.dernier_message}</p>
                    </div>
                    <div className="meta">{m.dernier_le && quand(m.dernier_le, t)}{m.non_lus > 0 && <span className="pastille-nl">{m.non_lus}</span>}</div>
                  </Link>
                ))}
              </section>
            )}
          </>
        )}
      </main>
      <MemberNav actif="matchs" />
    </>
  );
}
