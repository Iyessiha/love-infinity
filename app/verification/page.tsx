import Link from 'next/link';
import AutoRefresh from '@/components/AutoRefresh';
import { requireUser } from '@/lib/auth';
import { Check } from '@/components/Icons';
import { getT } from '@/lib/lang';
import type { T } from '@/lib/dict';

export const dynamic = 'force-dynamic';

type V = { kind: string; status: string; reason: string | null; created_at: string };
type Dossier = { demandes: { kind: string; depuis: string }[]; position: number | null; total: number; delai_h: number | null };

const NIVEAUX = [
  { kind: 'photos', n: 1, href: '/verification/photos' },
  { kind: 'selfie', n: 2, href: '/verification/selfie' },
  { kind: 'document', n: 3, href: '/verification/document' },
] as const;

function delai(h: number | null, t: T) {
  if (h === null) return t('vf.d.none');
  if (h < 1) return t('vf.d.lt1');
  if (h <= 36) return t('vf.d.h', { n: h });
  return t('vf.d.d', { n: Math.round(h / 24) });
}

export default async function Verification() {
  const { supabase, user } = await requireUser();
  const t = await getT();
  const [{ data: profil }, { data: demandes }, { data: dossier }, { count: nbPhotos }] = await Promise.all([
    supabase.from('profiles').select('verification_level, account_status, bio, profession, taille_cm, etudes, langues, intention, interets').eq('id', user.id).single(),
    supabase.from('verifications').select('kind, status, reason, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.rpc('mon_dossier'),
    supabase.from('profile_photos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);
  const liste = (demandes ?? []) as V[];
  const derniere = (kind: string) => liste.find((d) => d.kind === kind);
  const niveau = profil?.verification_level ?? 0;
  const actif = profil?.account_status === 'active';
  const d = (dossier ?? null) as Dossier | null;
  const enCours = (d?.demandes ?? []).length > 0;
  const photosEnvoyees = liste.some((x) => x.kind === 'photos');

  // Complétude du profil : un profil riche rassure et donne plus de matchs.
  const etapes = [
    { ok: (nbPhotos ?? 0) >= 3, texte: t('vf.s1'), href: '/profil' },
    { ok: Boolean(profil?.bio && profil.bio.trim().length >= 40), texte: t('vf.s2'), href: '/profil/apropos' },
    { ok: Boolean(profil?.profession), texte: t('vf.s3'), href: '/profil/apropos' },
    { ok: Boolean(profil?.intention), texte: t('vf.s4'), href: '/profil/style' },
    { ok: (profil?.interets?.length ?? 0) >= 3, texte: t('vf.s5'), href: '/profil/style' },
  ];
  const fait = etapes.filter((e) => e.ok).length;
  const pct = Math.round((fait / etapes.length) * 100);

  return (
    <main className="ph">
      {enCours && <AutoRefresh />}
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i></div>

      {actif && !enCours && (
        <div className="card col" style={{ gap: 10, background: '#E6F3EA', borderColor: '#9CCBAA' }} role="status">
          <b style={{ fontSize: 18, color: '#1F6B41' }}>{t('vf.okT')}</b>
          <p className="small">{t('vf.okP')}</p>
          <Link className="btn gold" href="/decouvrir">{t('vf.discover')}</Link>
        </div>
      )}

      {enCours && d && (
        <section className="card col" style={{ gap: 14 }} aria-labelledby="h-dossier" aria-live="polite">
          <h2 id="h-dossier" style={{ margin: 0 }}>{t('vf.reviewT')}</h2>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {[
              [t('vf.r1'), t('vf.r1p', { x: d.demandes.map((x) => t(`vf.n.${x.kind}`)).join(', ') }), 'fait'],
              [t('vf.r2'), d.position && d.position > 1 ? t('vf.r2q', { n: d.position, total: d.total }) : t('vf.r2n'), 'cours'],
              [t('vf.r3'), t('vf.r3p'), 'attente'],
            ].map(([t, s, etat]) => (
              <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: 13, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13,
                  background: etat === 'fait' ? '#236B43' : etat === 'cours' ? '#E8873A' : '#E6D6CC', color: etat === 'attente' ? '#5E4A53' : '#fff' }}>
                  {etat === 'fait' ? <Check /> : etat === 'cours' ? '…' : ''}
                </span>
                <div><b>{t}</b><div className="small">{s}</div></div>
              </li>
            ))}
          </ol>
          <p className="small"><b>{t('vf.delay', { d: delai(d.delai_h, t) })}</b> {t('vf.delayP')}</p>
          {photosEnvoyees && !actif && <Link className="btn ghost" style={{ height: 46 }} href="/decouvrir">{t('vf.preview')}</Link>}
        </section>
      )}

      {!actif && enCours && pct < 100 && (
        <section className="card col" style={{ gap: 10 }} aria-labelledby="h-prof">
          <div className="row"><h2 id="h-prof" style={{ margin: 0, fontSize: 18 }}>{t('vf.waitT')}</h2><div className="sp"></div><b style={{ color: '#4A0E2E' }}>{pct} %</b></div>
          <p className="small">{t('vf.waitP')}</p>
          <div style={{ height: 8, background: '#EFE3DA', borderRadius: 4, overflow: 'hidden' }} aria-hidden="true"><div style={{ width: `${pct}%`, height: '100%', background: '#4A0E2E' }} /></div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {etapes.map((e) => (
              <li key={e.texte} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 15 }}>
                <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 10, flex: 'none', background: e.ok ? '#236B43' : '#E6D6CC', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{e.ok ? <Check /> : null}</span>
                {e.ok ? <span style={{ color: '#5E4A53', textDecoration: 'line-through' }}>{e.texte}</span> : <Link className="link" href={e.href}>{e.texte}</Link>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <h1>{enCours || actif ? t('vf.levels') : t('vf.verify')}</h1>
      {!enCours && !actif && <p className="sub">{t('vf.sub')}</p>}
      <div className="col" style={{ gap: 14 }}>
        {NIVEAUX.map((n) => {
          const dem = derniere(n.kind);
          const valide = niveau >= n.n && dem?.status === 'approved';
          const attente = dem?.status === 'pending';
          const refuse = dem?.status === 'rejected';
          return (
            <div key={n.kind} className="card col" style={{ gap: 8 }}>
              <div className="lvl">
                <div className={`n${valide ? ' g' : ''}`}>{valide ? <Check /> : n.n}</div>
                <div><b>{t(`vf.lvl${n.n}`)}</b><span>{t(`vf.lvl${n.n}t`)}</span></div>
              </div>
              {attente && <p className="small">{t('vf.pending')}</p>}
              {refuse && <p className="small" style={{ color: '#B3261E' }}>{t('vf.rejected', { r: dem?.reason ? t.v(dem.reason) : t('vf.noReason') })}</p>}
              {valide && <p className="small" style={{ color: '#1F6B41' }}>{t('vf.approved')}</p>}
              {!attente && !valide && <Link className="btn ghost" style={{ height: 46 }} href={n.href}>{refuse ? t('vf.retry') : t('vf.start')}</Link>}
            </div>
          );
        })}
      </div>
      <div className="sp"></div>
      {actif && enCours && <Link className="btn gold" href="/decouvrir">{t('vf.discover')}</Link>}
      {!actif && !enCours && <p className="small" style={{ textAlign: 'center' }}>{t('vf.footer')}</p>}
    </main>
  );
}
