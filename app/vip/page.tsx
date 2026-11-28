import { Logo } from '@/components/Logo';
import { VipGrille, type VipCarte } from '@/components/VipGrille';
import { MemberNav } from '@/components/MemberNav';
import { requireComplet } from '@/lib/auth';
import { urlsPhotos } from '@/lib/photos';
import { getT } from '@/lib/lang';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

type Ligne = { id: string; prenom: string; age: number; ville: string; verification_level: number; photo_path: string | null; premium: boolean };

export default async function Vip() {
  const { supabase, user } = await requireComplet();
  const t = await getT();
  const [{ data }, { data: abo }, { data: moi }] = await Promise.all([
    supabase.rpc('selection_vip', { p_limit: 24 }),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('account_status').eq('id', user.id).single(),
  ]);
  const premium = Boolean(abo && abo.plan === 'premium' && new Date(abo.expires_at) > new Date());
  const liste = (data ?? []) as Ligne[];
  // Sans offre Premium, aucune photo n'est envoyée au navigateur : le flou ne peut pas être contourné.
  const urls = premium ? await urlsPhotos(supabase, liste.map((l) => l.photo_path)) : new Map<string, string>();
  const cartes: VipCarte[] = liste.map((l) => ({ id: l.id, prenom: l.prenom, age: l.age, ville: l.ville, niveau: l.verification_level, photo: premium && l.photo_path ? urls.get(l.photo_path) ?? null : null }));

  return (
    <>
      <main className="mb">
        <header className="mb-top"><Logo width={34} /><h1>{t('vip.title')}</h1></header>
        <p className="vip-intro">{t('vip.intro')}</p>
        {moi?.account_status !== 'active' && <div className="erreur">{t('likes.needActive')}</div>}
        <VipGrille cartes={cartes} premium={premium} />
      </main>
      <MemberNav actif="vip" />
    </>
  );
}
