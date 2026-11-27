import Link from 'next/link';
import { Acheter } from '@/components/Acheter';
import { Chevron } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const AVANTAGES: Record<string, string[]> = {
  essentiel: ['Likes illimités', 'Messages avec tous tes matchs'],
  premium: ['Tout Essentiel', 'Profil mis en avant', 'Voir qui t’a liké'],
};
const fcfa = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`;

export default async function Abonnement({ searchParams }: { searchParams: Promise<{ paiement?: string }> }) {
  const { paiement } = await searchParams;
  const { supabase, user } = await requireComplet();
  const [{ data: plans }, { data: abo }] = await Promise.all([
    supabase.from('plans').select('code,nom,prix_xof,duree_jours').order('prix_xof'),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
  ]);
  const actif = abo && new Date(abo.expires_at) > new Date();

  return (
    <main className="ph">
      <Link className="back" href="/decouvrir"><Chevron /> Découvrir</Link>
      <h1>Abonnement</h1>
      {paiement === 'ok' && <div className="alert" role="status">Merci ! Ton paiement est en cours de confirmation. Ton abonnement s’active en quelques secondes.</div>}
      {paiement === 'echec' && <div className="alert" role="alert">Le paiement n’a pas abouti. Aucun montant n’est débité en cas d’échec. Tu peux réessayer.</div>}
      {actif && <div className="card">Abonnement <b>{abo.plan === 'premium' ? 'Premium' : 'Essentiel'}</b> actif jusqu’au {new Date(abo.expires_at).toLocaleDateString('fr-FR')}. Renouveler ajoute 30 jours à cette date.</div>}
      <p className="sub">Paiement par Wave, Orange Money, MTN, Moov ou carte. Pas de pièces qui expirent.</p>
      <div className="col">
        {(plans ?? []).map((p) => (
          <div key={p.code} className="card col" style={{ gap: 8 }}>
            <div className="row"><h2>{p.nom}</h2><div className="sp"></div><b>{fcfa(p.prix_xof)}</b></div>
            <p className="small">pour {p.duree_jours} jours</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>{(AVANTAGES[p.code] ?? []).map((a) => <li key={a}>{a}</li>)}</ul>
            <Acheter plan={p.code as 'essentiel' | 'premium'} libelle={actif ? 'Renouveler' : `Choisir ${p.nom}`} gold={p.code === 'premium'} />
          </div>
        ))}
      </div>
    </main>
  );
}
