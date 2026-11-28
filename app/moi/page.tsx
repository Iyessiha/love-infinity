import Link from 'next/link';
import { MemberNav } from '@/components/MemberNav';
import { ShieldIcon, HeartIcon, UserIcon, LockIcon, FlagIcon } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { INTENTIONS, NIVEAUX, urlsPhotos } from '@/lib/photos';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';

const STATUT: Record<string, string> = { pending: 'En attente de validation', active: 'Profil actif', suspended: 'Compte suspendu', banned: 'Compte banni' };

export default async function Moi() {
  const { supabase, user } = await requireComplet();
  const [{ data: p }, { data: photos }, { data: abo }, { data: restants }, { data: likes }, { data: matchs }] = await Promise.all([
    supabase.from('profiles').select('prenom,birth_date,ville,bio,intention,profession,verification_level,account_status').eq('id', user.id).single(),
    supabase.from('profile_photos').select('path').eq('user_id', user.id).order('position'),
    supabase.from('subscriptions').select('plan,expires_at').eq('user_id', user.id).maybeSingle(),
    supabase.rpc('likes_restants'),
    supabase.rpc('likes_recus'),
    supabase.rpc('mes_matchs'),
  ]);
  const urls = await urlsPhotos(supabase, (photos ?? []).map((x) => x.path));
  const photo = photos?.[0]?.path ? urls.get(photos[0].path) : undefined;
  const age = p?.birth_date ? Math.floor((Date.now() - new Date(p.birth_date).getTime()) / 31557600000) : null;
  const actif = Boolean(abo && new Date(abo.expires_at) > new Date());
  const niveau = p?.verification_level ?? 0;

  return (
    <>
      <main className="mb">
        <header className="mb-top"><h1>Mon profil</h1></header>

        <div className="moi-carte">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo && <img src={photo} alt="Ma photo principale" />}
          <div className="t">
            <b>{p?.prenom}{age ? `, ${age}` : ''}</b>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{[p?.ville, p?.profession].filter(Boolean).join(' · ')}</span>
          </div>
        </div>

        <div className="stats">
          <div><b>{(matchs ?? []).length}</b><span>Matchs</span></div>
          <div><b>{(likes ?? []).length}</b><span>Likes reçus</span></div>
          <div><b>{restants === null ? '∞' : restants}</b><span>Likes restants</span></div>
        </div>

        <section className="card col" style={{ gap: 12 }}>
          <div className="row"><h2 style={{ fontSize: 18 }}>Confiance</h2><span className="sp" /><span className="small">{STATUT[p?.account_status ?? 'pending']}</span></div>
          <div className="niveaux">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`nv-ligne${niveau >= n ? ' ok' : ''}`}><span className="pt"><ShieldIcon size={14} /></span>{NIVEAUX[n]}{niveau >= n ? '' : <span className="small" style={{ marginLeft: 'auto' }}>à faire</span>}</div>
            ))}
          </div>
          {niveau < 3 && <Link className="cta ghost" style={{ height: 46, fontSize: 15 }} href="/verification">Compléter ma vérification</Link>}
        </section>

        {p?.bio && <section className="card"><h2 style={{ fontSize: 18, marginBottom: 6 }}>À propos de moi</h2><p>{p.bio}</p>{p.intention && <p className="small" style={{ marginTop: 8 }}>Je cherche : {INTENTIONS[p.intention]}</p>}</section>}

        <div className="liste-lien">
          <Link href="/moi/modifier"><UserIcon size={20} /> Modifier mon profil</Link>
          <Link href="/abonnement"><HeartIcon size={20} /> Abonnement <span className="fin">{actif ? (abo?.plan === 'premium' ? 'Premium' : 'Essentiel') : 'Gratuit'}</span></Link>
          <Link href="/securite"><LockIcon size={20} /> Sécurité et confidentialité</Link>
          <Link href="/faq"><FlagIcon size={20} /> Aide et sécurité</Link>
          <form action="/auth/signout" method="post"><button type="submit">Se déconnecter</button></form>
        </div>
      </main>
      <MemberNav actif="moi" />
    </>
  );
}
