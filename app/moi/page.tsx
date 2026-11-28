import Link from 'next/link';
import { MemberNav } from '@/components/MemberNav';
import { CrownIcon, ShieldIcon, HeartIcon, UserIcon, LockIcon, FlagIcon, SettingsIcon, ChevronRight } from '@/components/Icons';
import { requireComplet } from '@/lib/auth';
import { urlsPhotos } from '@/lib/photos';
import { getT } from '@/lib/lang';
import '@/app/membre.css';

export const dynamic = 'force-dynamic';


export default async function Moi() {
  const { supabase, user } = await requireComplet();
  const t = await getT();
  const [{ data: p }, { data: photos }, { data: abo }, { data: restants }, { data: likes }, { data: matchs }] = await Promise.all([
    supabase.from('profiles').select('prenom,birth_date,ville,bio,intention,profession,verification_level,account_status,taille_cm,etudes,langues,interets').eq('id', user.id).single(),
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
  const nbPhotos = (photos ?? []).length;
  const points = Math.min(3, nbPhotos) * 8 + (p?.bio ? 15 : 0) + (p?.profession ? 8 : 0) + (p?.taille_cm ? 4 : 0) + (p?.etudes ? 5 : 0) + ((p?.langues ?? []).length ? 5 : 0) + ((p?.interets ?? []).length >= 3 ? 12 : 0) + niveau * 9;
  const force = Math.min(100, points);
  const R = 26, C = 2 * Math.PI * R;

  return (
    <>
      <main className="mb">
        <header className="mb-top"><h1>{t('me.title')}</h1><span className="sp" /><Link className="mb-ico" href="/moi/parametres" aria-label={t('me.settings')}><SettingsIcon /></Link></header>

        <div className="moi-carte">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo && <img src={photo} alt={t('me.mainPhoto')} />}
          {actif && abo?.plan === 'premium' && <em className="badge-prem moi-prem"><CrownIcon size={13} />{t('badge.premium')}</em>}
          <div className="t">
            <b>{p?.prenom}{age ? `, ${age}` : ''}</b>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{[p?.ville, p?.profession].filter(Boolean).join(' · ')}</span>
          </div>
        </div>

        <div className="stats">
          <div><b>{(matchs ?? []).length}</b><span>{t('me.matches')}</span></div>
          <div><b>{(likes ?? []).length}</b><span>{t('me.likesIn')}</span></div>
          <div><b>{restants === null ? '∞' : restants}</b><span>{t('me.likesLeft')}</span></div>
        </div>

        <section className="moi-style" aria-label={t('me.styleT')}>
          <h2>{t('me.styleT')}</h2>
          <p>{actif && abo?.plan === 'premium' ? t('me.styleOn') : t('me.styleOff')}</p>
          <div className="moi-motifs" aria-hidden="true">
            {['#C8372D', '#F6C453', '#1B7F4B', '#0F5E73', '#D8C48A'].map((c) => <i key={c} style={{ background: c }} />)}
          </div>
          <Link className="cta" href={actif && abo?.plan === 'premium' ? '/moi/style' : '/abonnement'}>{actif && abo?.plan === 'premium' ? t('me.styleCta') : t('me.styleCtaOff')}</Link>
        </section>

        {force < 100 && (
          <Link href="/moi/modifier" className="force">
            <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r={R} fill="none" stroke="rgba(74,14,46,.12)" strokeWidth="6" /><circle cx="32" cy="32" r={R} fill="none" stroke="#D4A24C" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - force / 100)} transform="rotate(-90 32 32)" /></svg>
            <div><b>{t('me.strength', { n: force })}</b><span>{t('me.strengthTip')}</span></div>
            <ChevronRight />
          </Link>
        )}

        <section className="card col" style={{ gap: 12 }}>
          <div className="row"><h2 style={{ fontSize: 18 }}>{t('me.trust')}</h2><span className="sp" /><span className="small">{t(`me.st.${p?.account_status ?? 'pending'}`)}</span></div>
          <div className="niveaux">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`nv-ligne${niveau >= n ? ' ok' : ''}`}><span className="pt"><ShieldIcon size={14} /></span>{t(`lvl.${n}`)}{niveau >= n ? '' : <span className="small" style={{ marginLeft: 'auto' }}>{t('me.todo')}</span>}</div>
            ))}
          </div>
          {niveau < 3 && <Link className="cta ghost" style={{ height: 46, fontSize: 15 }} href="/verification">{t('me.complete')}</Link>}
        </section>

        {p?.bio && <section className="card"><h2 style={{ fontSize: 18, marginBottom: 6 }}>{t('me.aboutMe')}</h2><p>{p.bio}</p>{p.intention && <p className="small" style={{ marginTop: 8 }}>{t('me.looking', { x: t.v(p.intention) })}</p>}</section>}

        <div className="liste-lien">
          <Link href="/moi/modifier"><UserIcon size={20} /> {t('me.edit')}</Link>
          <Link href="/abonnement"><HeartIcon size={20} /> {t('me.sub')} <span className="fin">{actif ? (abo?.plan === 'premium' ? t('me.premium') : t('me.essential')) : t('me.free')}</span></Link>
          <Link href="/securite"><LockIcon size={20} /> {t('me.security')}</Link>
          <Link href="/faq"><FlagIcon size={20} /> {t('me.help')}</Link>
          <Link href="/moi/parametres"><SettingsIcon size={20} /> {t('me.settings')}</Link>
          <form action="/auth/signout" method="post"><button type="submit">{t('me.signout')}</button></form>
        </div>
      </main>
      <MemberNav actif="moi" />
    </>
  );
}
