import Link from 'next/link';
import { MemberNav } from '@/components/MemberNav';
import { MsgIcon } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { urlsPhotos } from '@/lib/photos';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

type Match = { match_id: string; autre_id: string; prenom: string; photo_path: string | null; cree_le: string; dernier_message: string | null; dernier_le: string | null; non_lus: number };

function quand(iso: string) {
  const d = new Date(iso);
  const jours = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (jours < 1) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (jours < 7) return d.toLocaleDateString('fr-FR', { weekday: 'short' });
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default async function Matchs() {
  const { supabase } = await requireComplet();
  const { data } = await supabase.rpc('mes_matchs');
  const liste = (data ?? []) as Match[];
  const urls = await urlsPhotos(supabase, liste.map((m) => m.photo_path));
  const img = (m: Match) => (m.photo_path ? urls.get(m.photo_path) : undefined);
  const nouveaux = liste.filter((m) => !m.dernier_message);
  const convs = liste.filter((m) => m.dernier_message);

  return (
    <>
      <main className="mb">
        <header className="mb-top"><h1>Messages</h1></header>
        {liste.length === 0 ? (
          <div className="vide">
            <div className="rond-deco"><MsgIcon size={36} /></div>
            <h2>Aucun match pour l’instant</h2>
            <p>Quand toi et quelqu’un vous aimez mutuellement, la conversation apparaît ici. Continue à découvrir des profils.</p>
            <Link className="cta" style={{ maxWidth: 300 }} href="/decouvrir">Découvrir des profils</Link>
          </div>
        ) : (
          <>
            {nouveaux.length > 0 && (
              <section aria-label="Nouveaux matchs">
                <h2 style={{ fontSize: 17, marginBottom: 8 }}>Nouveaux matchs</h2>
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
              <section aria-label="Conversations" className="col" style={{ gap: 10 }}>
                <h2 style={{ fontSize: 17 }}>Conversations</h2>
                {convs.map((m) => (
                  <Link key={m.match_id} href={`/matchs/${m.match_id}`} className="conv">
                    <div className="av">{/* eslint-disable-next-line @next/next/no-img-element */ img(m) && <img src={img(m)} alt="" />}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <b>{m.prenom}</b>
                      <p className={`dern${m.non_lus ? ' nl' : ''}`}>{m.dernier_message}</p>
                    </div>
                    <div className="meta">{m.dernier_le && quand(m.dernier_le)}{m.non_lus > 0 && <span className="pastille-nl">{m.non_lus}</span>}</div>
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
