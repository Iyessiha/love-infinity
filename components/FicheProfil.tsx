'use client';
import { useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { BriefcaseIcon, CapIcon, CrownIcon, FlagIcon, GlobeIcon, HeartIcon, MsgIcon, PinIcon, RulerIcon, ShieldIcon, TargetIcon, XIcon } from '@/components/Icons';
import { useT } from '@/components/I18n';
import type { Carte } from '@/components/Pile';

const RAISONS = ['faux_profil', 'arnaque', 'harcelement', 'contenu_inapproprie', 'mineur', 'autre'];

/** Fiche complète : toutes les photos, infos détaillées, actions. Défile de haut en bas. */
export function FicheProfil({ c, occupe, onClose, onPass, onLike, onMessage, onSignale }: {
  c: Carte; occupe: boolean; onClose: () => void; onPass: () => void; onLike: () => void; onMessage: () => void; onSignale: () => void;
}) {
  const t = useT();
  const [menu, setMenu] = useState(false);
  const [raison, setRaison] = useState('');
  const [msg, setMsg] = useState<string>();
  const sb = useRef(supabaseBrowser()).current;
  const [premiere, ...autres] = c.photos;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k); };
  }, [onClose]);

  async function signaler() {
    if (!raison) return;
    const { error } = await sb.rpc('signaler', { p_user: c.id, p_reason: raison });
    if (error) return setMsg(error.message.includes('trop_de') ? t('c.reportLimit') : t('c.actionErr'));
    onSignale();
  }

  const depuis = t.date(c.membre_depuis, { month: 'long', year: 'numeric' });
  const infos: { icone: React.ReactNode; label: string; val: string; large?: boolean }[] = [
    { icone: <PinIcon />, label: t('fiche.city'), val: c.ville },
    c.profession ? { icone: <BriefcaseIcon />, label: t('fiche.job'), val: c.profession } : null,
    c.etudes ? { icone: <CapIcon />, label: t('fiche.studies'), val: t.v(c.etudes) } : null,
    c.taille_cm ? { icone: <RulerIcon />, label: t('fiche.height'), val: `${c.taille_cm} cm` } : null,
    c.langues?.length ? { icone: <GlobeIcon />, label: t('fiche.langs'), val: c.langues.map(t.v).join(', '), large: true } : null,
    c.intention ? { icone: <TargetIcon />, label: t('fiche.looking'), val: t.v(c.intention), large: true } : null,
  ].filter(Boolean) as { icone: React.ReactNode; label: string; val: string; large?: boolean }[];

  return (
    <div className="fiche" data-theme={c.theme ?? 'classique'} role="dialog" aria-modal="true" aria-label={t('pile.profileOf', { name: c.prenom, age: c.age })}>
      <button className="fiche-close" onClick={onClose} aria-label={t('fiche.close')}><XIcon size={22} /></button>
      <div className="fiche-in">
        <div className="fiche-ph">{/* eslint-disable-next-line @next/next/no-img-element */ premiere && <img src={premiere} alt={t('pile.photoN', { n: 1, name: c.prenom })} />}</div>
        <div className="fiche-corps">
          <div>
            <div className="fiche-nom">{c.prenom}<span>{c.age}</span>{c.premium && <em className="badge-prem"><CrownIcon size={13} />{t('badge.premium')}</em>}</div>
            <div className="fiche-sous"><PinIcon />{c.ville}</div>
          </div>

          {c.bio && <section><h3>{t('fiche.about')}</h3><p className="fiche-bio">{c.bio}</p></section>}

          {(c.prompts ?? []).length > 0 && <section><h3>{t('fiche.prompts')}</h3><div className="col" style={{ gap: 10 }}>{(c.prompts ?? []).map((p) => <div key={p.q} className="qa-bloc"><small>{t(`q.${p.q}`)}</small><p>{p.a}</p></div>)}</div></section>}

          <section><h3>{t('fiche.info')}</h3>
            <div className="fiche-grille">
              {infos.map((i) => (
                <div key={i.label} className={`fiche-item${i.large ? ' large' : ''}`}><small>{i.icone}{i.label}</small><b>{i.val}</b></div>
              ))}
            </div>
          </section>

          {c.interets.length > 0 && <section><h3>{t('fiche.interests')}</h3><div className="dk-chips" style={{ gap: 8 }}>{c.interets.map((x) => <span key={x} className="pastille on" style={{ cursor: 'default' }}>{t.v(x)}</span>)}</div></section>}

          {autres.length > 0 && <section><h3>{t('fiche.photos')}</h3><div className="fiche-photos">{/* eslint-disable-next-line @next/next/no-img-element */ autres.map((p, i) => <img key={p} src={p} alt={t('pile.photoN', { n: i + 2, name: c.prenom })} loading="lazy" />)}</div></section>}

          <section><h3>{t('fiche.trust')}</h3>
            <div className="badges">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`badge${c.verification_level >= n ? '' : ' non'}`}><ShieldIcon />{t(`lvl.${n}`)}{c.verification_level >= n ? '' : t('fiche.notDone')}</div>
              ))}
              <p className="small" style={{ color: '#5E4A53', fontSize: 13 }}>{t('fiche.since', { date: depuis })}</p>
            </div>
          </section>

          <section>
            <button className="lien-doux" onClick={() => setMenu((v) => !v)} aria-expanded={menu}><FlagIcon size={16} /> {t('fiche.report', { name: c.prenom })}</button>
            {menu && (
              <div className="col" style={{ gap: 10, marginTop: 6 }}>
                <select className="zone" style={{ minHeight: 50, height: 50 }} value={raison} onChange={(e) => setRaison(e.target.value)} aria-label={t('fiche.reason')}>
                  <option value="">{t('fiche.pick')}</option>
                  {RAISONS.map((k) => <option key={k} value={k}>{t(`rs.${k}`)}</option>)}
                </select>
                {msg && <div className="erreur" role="alert">{msg}</div>}
                <button className="cta ghost" disabled={!raison} onClick={signaler}>{t('fiche.reportBtn')}</button>
              </div>
            )}
          </section>
        </div>
      </div>
      <div className="fiche-barre">
        <div>
          <button className="rond pass" disabled={occupe} onClick={onPass} aria-label={t('pile.passAria', { name: c.prenom })}><XIcon size={28} /></button>
          <button className="rond msg" disabled={occupe} onClick={onMessage} aria-label={t('pile.writeAria', { name: c.prenom })}><MsgIcon size={24} /></button>
          <button className="rond like" disabled={occupe} onClick={onLike} aria-label={t('pile.likeAria', { name: c.prenom })}><HeartIcon size={32} /></button>
        </div>
      </div>
    </div>
  );
}
