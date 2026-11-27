import Link from 'next/link';
import { requireUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Matchs() {
  const { supabase } = await requireUser();
  const { data } = await supabase.rpc('mes_matchs');
  const liste = (data ?? []) as { match_id: string; autre_id: string; prenom: string; photo_path: string | null; cree_le: string }[];
  const chemins = liste.map((m) => m.photo_path).filter(Boolean) as string[];
  const signees = chemins.length ? (await supabase.storage.from('photos').createSignedUrls(chemins, 3600)).data ?? [] : [];

  return (
    <main className="ph">
      <Link className="back" href="/decouvrir">‹ Découvrir</Link>
      <h1>Mes matchs</h1>
      {liste.length === 0 && <p className="sub">Pas encore de match. Continue à découvrir des profils.</p>}
      <div className="col">
        {liste.map((m) => {
          const src = signees.find((s) => s.path === m.photo_path)?.signedUrl;
          return (
            <div key={m.match_id} className="card row">
              <div style={{ width: 56, height: 56, borderRadius: 28, overflow: 'hidden', background: 'linear-gradient(160deg,#E8B4B8,#D4A24C)', flex: 'none' }}>
                {src && /* eslint-disable-next-line @next/next/no-img-element */ <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div><b>{m.prenom}</b><p className="small">Match du {new Date(m.cree_le).toLocaleDateString('fr-FR')}</p></div>
            </div>
          );
        })}
      </div>
      {liste.length > 0 && <p className="small" style={{ textAlign: 'center' }}>La messagerie arrive bientôt.</p>}
    </main>
  );
}
