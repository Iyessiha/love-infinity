import { redirect } from 'next/navigation';
import { Pile, type Carte } from '@/components/Pile';
import { requireComplet } from '@/lib/auth';
import { ApercuProfils, type Apercu } from '@/components/Apercu';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { MemberNav } from '@/components/MemberNav';
import { urlsPhotos } from '@/lib/photos';
import { getT } from '@/lib/lang';
import { ENFANTS, ETUDES, RELIGIONS } from '@/lib/profile';
import { Stories } from '@/components/Stories';
import { chargerStories } from '@/lib/stories';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

type SP = { min?: string; max?: string; ville?: string; but?: string; tmin?: string; tmax?: string; etu?: string; enf?: string; rel?: string; vf?: string };

export default async function Decouvrir({ searchParams }: { searchParams: Promise<SP> }) {
  const { supabase, user, profil } = await requireComplet();
  const sp = await searchParams;
  const t = await getT();
  if (profil?.account_status !== 'active') {
    // En attente de validation : aperçu en lecture seule, seulement si les photos ont été envoyées.
    const { count: envoyees } = await supabase.from('verifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('kind', 'photos');
    if (!envoyees) redirect('/verification');
    const { data: apercu } = await supabase.rpc('apercu_decouverte');
    type Ligne = Omit<Apercu, 'photo'> & { photo_path: string | null };
    const lignes = (apercu ?? []) as Ligne[];
    const chemins = lignes.map((p) => p.photo_path).filter((c): c is string => !!c && !c.startsWith('https://'));
    const signees = chemins.length ? (await supabaseAdmin().storage.from('photos').createSignedUrls(chemins, 900)).data ?? [] : [];
    const profils: Apercu[] = lignes.map((p) => ({ ...p, photo: p.photo_path?.startsWith('https://') ? p.photo_path : signees.find((s) => s.path === p.photo_path)?.signedUrl ?? null }));
    return (
      <main className="ph" style={{ gap: 12 }}>
        <div className="row"><h1>{t('ap.title')}</h1></div>
        <ApercuProfils profils={profils} />
      </main>
    );
  }

  const f = {
    age_min: Math.max(18, Math.min(99, parseInt(sp.min ?? '', 10) || 18)),
    age_max: Math.max(18, Math.min(99, parseInt(sp.max ?? '', 10) || 99)),
    ville: (sp.ville ?? '').slice(0, 60),
    intention: ['relation_serieuse', 'mariage', 'amitie', 'decouverte'].includes(sp.but ?? '') ? (sp.but as string) : '',
    tmin: parseInt(sp.tmin ?? '', 10) >= 120 ? parseInt(sp.tmin!, 10) : undefined,
    tmax: parseInt(sp.tmax ?? '', 10) >= 120 && parseInt(sp.tmax ?? '', 10) <= 230 ? parseInt(sp.tmax!, 10) : undefined,
    etu: (ETUDES as readonly string[]).includes(sp.etu ?? '') ? sp.etu : undefined,
    enf: ENFANTS.some(([k]) => k === sp.enf) ? sp.enf : undefined,
    rel: (RELIGIONS as readonly string[]).includes(sp.rel ?? '') ? sp.rel : undefined,
    vf: sp.vf === '1',
  };

  const [{ data: profils }, { data: restants }, { data: moiPhoto }, { data: moiProfil }, { data: abo }, { data: boostEtat }, groupesStories] = await Promise.all([
    supabase.rpc('decouvrir', { p_limit: 15, p_age_min: f.age_min, p_age_max: f.age_max, p_ville: f.ville || null, p_intention: f.intention || null, p_taille_min: f.tmin ?? null, p_taille_max: f.tmax ?? null, p_etudes: f.etu ?? null, p_enfants: f.enf ?? null, p_religion: f.rel ?? null, p_verif_min: f.vf ? 2 : null }),
    supabase.rpc('likes_restants'),
    supabase.from('profile_photos').select('path').eq('user_id', user.id).order('position').limit(1),
    supabase.from('profiles').select('prenom,verification_level').eq('id', user.id).single(),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
    supabase.rpc('etat_boost'),
    chargerStories(supabase),
  ]);
  const premium = Boolean(abo && abo.plan === 'premium' && new Date(abo.expires_at) > new Date());

  type Ligne = Omit<Carte, 'photos'> & { photos: string[] | null };
  const liste = (profils ?? []) as Ligne[];
  const urls = await urlsPhotos(supabase, [...liste.flatMap((p) => p.photos ?? []), moiPhoto?.[0]?.path]);
  const cartes: Carte[] = liste.map((p) => ({
    ...p,
    interets: p.interets ?? [],
    langues: p.langues ?? [],
    photos: (p.photos ?? []).map((x) => urls.get(x)).filter((x): x is string => !!x),
  }));

  return (
    <>
      <main className="mb" style={{ height: '100dvh' }}>
        <Pile cartes={cartes} restants={restants ?? null} filtres={f} moi={{ prenom: moiProfil?.prenom ?? '', photo: moiPhoto?.[0]?.path ? urls.get(moiPhoto[0].path) ?? null : null }} peutEcrire={(moiProfil?.verification_level ?? 0) >= 2} stories={<Stories groupes={groupesStories} />} premium={premium} boost={(boostEtat ?? [])[0] ?? undefined} />
      </main>
      <MemberNav actif="decouvrir" />
    </>
  );
}
