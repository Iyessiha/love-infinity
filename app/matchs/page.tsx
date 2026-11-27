import { Chevron } from '@/components/Icons';
import Link from 'next/link';
import { requireComplet } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Matchs() {
  const { supabase } = await requireComplet();
  const { data } = await supabase.rpc('mes_matchs');
  const liste = (data ?? []) as { match_id: string; autre_id: string; prenom: string; photo_path: string | null; cree_le: string; dernier_message: string | null; dernier_le: string | null; non_lus: number }[];
  const chemins = liste.map((m) => m.photo_path).filter(Boolean) as string[];
  const signees = chemins.length ? (await supabase.storage.from('photos').createSignedUrls(chemins, 3600)).data ?? [] : [];

  return (
    <main className="ph">
      <Link className="back" href="/decouvrir"><Chevron /> Découvrir</Link>
      <h1>Mes matchs</h1>
      {liste.length === 0 && <p className="sub">Pas encore de match. Continue à découvrir des profils.</p>}
      <div className="col">
        {liste.map((m) => {
          const src = signees.find((s) => s.path === m.photo_path)?.signedUrl;
          return (
            <Link key={m.match_id} href={`/matchs/${m.match_id}`} className="card row" style={{ textDecoration: 'none', color: 'inherit', minHeight: 72 }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, overflow: 'hidden', background: 'linear-gradient(160deg,#E8B4B8,#D4A24C)', flex: 'none' }}>
                {src && /* eslint-disable-next-line @next/next/no-img-element */ <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <b>{m.prenom}</b>
                <p className="small" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: m.non_lus ? 800 : 400 }}>{m.dernier_message ?? 'Nouveau match. Dis bonjour !'}</p>
              </div>
              {m.non_lus > 0 && <span className="tag" aria-label={`${m.non_lus} message(s) non lu(s)`}>{m.non_lus}</span>}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
