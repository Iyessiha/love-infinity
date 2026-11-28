'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/components/I18n';
import { CrownIcon, HeartIcon, LockIcon, ShieldIcon } from '@/components/Icons';

export type VipCarte = { id: string; prenom: string; age: number; ville: string; niveau: number; photo: string | null };

export function VipGrille({ cartes, premium }: { cartes: VipCarte[]; premium: boolean }) {
  const t = useT();
  const router = useRouter();
  const [aimes, setAimes] = useState<Set<string>>(new Set());
  const [info, setInfo] = useState<{ msg: string; lien?: string }>();

  async function aimer(c: VipCarte) {
    setInfo(undefined);
    try {
      const r = await fetch('/api/swipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: c.id, action: 'like' }) });
      if (r.status === 401) return router.push('/connexion');
      const j = await r.json();
      if (!j.ok) return setInfo({ msg: j.message ?? t('c.actionErr'), lien: j.code === 'limite' ? '/abonnement' : undefined });
      setAimes((x) => new Set(x).add(c.id));
      if (j.match) setInfo({ msg: t('st.match', { name: c.prenom }), lien: j.matchId ? `/matchs/${j.matchId}` : '/matchs' });
    } catch { setInfo({ msg: t('c.netErr') }); }
  }

  if (cartes.length === 0) return <div className="vide"><div className="rond-deco"><CrownIcon size={36} /></div><h2>{t('vip.emptyT')}</h2><p>{t('vip.emptyP')}</p></div>;

  return (
    <>
      {!premium && (
        <div className="bandeau">
          <h2>{t.n('vip.banner', cartes.length)}</h2>
          <p>{t('vip.bannerP')}</p>
          <Link className="cta" href="/abonnement#choix">{t('vip.unlock')}</Link>
        </div>
      )}
      {info && <div className="alert" role="status">{info.msg} {info.lien && <Link href={info.lien}>→</Link>}</div>}
      <ul className="vip-grille">
        {cartes.map((c) => {
          const contenu = (
            <>
              <span className="vip-tag"><CrownIcon size={13} />{t('vip.tag')}</span>
              {c.photo
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={c.photo} alt="" loading="lazy" />
                : <span className="vip-lock"><LockIcon size={26} /><b>{t('vip.locked')}</b><small>{t('vip.tapUnlock')}</small></span>}
              <span className="vip-nom">{c.prenom}, {c.age}<small>{c.ville}{c.niveau >= 3 && <> · <ShieldIcon size={12} /> {t('vip.idOk')}</>}</small></span>
            </>
          );
          return (
            <li key={c.id} className={`vip-carte${c.photo ? '' : ' flou'}`}>
              {premium
                ? <>{contenu}<button type="button" className={`vip-like${aimes.has(c.id) ? ' on' : ''}`} disabled={aimes.has(c.id)} onClick={() => aimer(c)} aria-label={t('st.like', { name: c.prenom })}><HeartIcon size={20} filled={aimes.has(c.id)} /></button></>
                : <Link href="/abonnement#choix" aria-label={t('vip.unlock')}>{contenu}</Link>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
