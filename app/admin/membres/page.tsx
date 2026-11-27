import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { GENRE_LABEL, NIVEAU_LABEL } from '@/lib/verification';

export const dynamic = 'force-dynamic';

const STATUT: Record<string, string> = { pending: 'En attente', active: 'Actif', suspended: 'Suspendu', banned: 'Banni' };

export default async function Membres() {
  const { supabase } = await requireUser();
  const { data: admin } = await supabase.rpc('is_admin');
  if (!admin) notFound();

  const { data: membres } = await supabase
    .from('profiles')
    .select('id, prenom, nom, genre, birth_date, ville, phone_country, verification_level, account_status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'Nunito, system-ui, sans-serif', color: '#2B1B22' }}>
      <a href="/admin" style={{ color: '#4A0E2E', fontWeight: 800 }}>← Administration</a>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#4A0E2E' }}>Membres inscrits ({membres?.length ?? 0})</h1>
      <p className="small">Les 200 inscriptions les plus récentes. Les numéros de téléphone et les emails ne sont pas affichés ici.</p>
      {(membres ?? []).length === 0 && <p>Aucun membre pour le moment.</p>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #E6D6CC' }}>
              {['Nom', 'Âge', 'Genre', 'Ville', 'Pays', 'Vérification', 'Compte', 'Inscrit le'].map((h) => <th key={h} style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(membres ?? []).map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #E6D6CC' }}>
                <td style={{ padding: '8px 10px' }}><b>{m.prenom ?? '—'}</b> {m.nom}</td>
                <td style={{ padding: '8px 10px' }}>{m.birth_date ? Math.floor((Date.now() - new Date(m.birth_date).getTime()) / 31557600000) : '—'}</td>
                <td style={{ padding: '8px 10px' }}>{GENRE_LABEL[m.genre ?? ''] ?? '—'}</td>
                <td style={{ padding: '8px 10px' }}>{m.ville ?? '—'}</td>
                <td style={{ padding: '8px 10px' }}>{m.phone_country ?? '—'}</td>
                <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>Niveau {m.verification_level} · {NIVEAU_LABEL[m.verification_level]}</td>
                <td style={{ padding: '8px 10px' }}>{STATUT[m.account_status] ?? m.account_status}</td>
                <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
