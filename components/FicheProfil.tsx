'use client';
import { useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { BriefcaseIcon, CapIcon, FlagIcon, GlobeIcon, HeartIcon, MsgIcon, PinIcon, RulerIcon, ShieldIcon, TargetIcon, XIcon } from '@/components/Icons';
import { INTENTIONS, NIVEAUX } from '@/lib/photos';
import type { Carte } from '@/components/Pile';

const RAISONS: [string, string][] = [['faux_profil', 'Faux profil'], ['arnaque', 'Arnaque ou demande d’argent'], ['harcelement', 'Harcèlement'], ['contenu_inapproprie', 'Contenu inapproprié'], ['mineur', 'Personne mineure'], ['autre', 'Autre']];

/** Fiche complète : toutes les photos, infos détaillées, actions. Défile de haut en bas. */
export function FicheProfil({ c, occupe, onClose, onPass, onLike, onMessage, onSignale }: {
  c: Carte; occupe: boolean; onClose: () => void; onPass: () => void; onLike: () => void; onMessage: () => void; onSignale: () => void;
}) {
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
    if (error) return setMsg(error.message.includes('trop_de') ? 'Limite de signalements atteinte pour aujourd’hui.' : 'Action impossible. Réessaie.');
    onSignale();
  }

  const depuis = new Date(c.membre_depuis).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const infos: { icone: React.ReactNode; label: string; val: string; large?: boolean }[] = [
    { icone: <PinIcon />, label: 'Ville', val: c.ville },
    c.profession ? { icone: <BriefcaseIcon />, label: 'Profession', val: c.profession } : null,
    c.etudes ? { icone: <CapIcon />, label: 'Études', val: c.etudes } : null,
    c.taille_cm ? { icone: <RulerIcon />, label: 'Taille', val: `${c.taille_cm} cm` } : null,
    c.langues?.length ? { icone: <GlobeIcon />, label: 'Langues', val: c.langues.join(', '), large: true } : null,
    c.intention ? { icone: <TargetIcon />, label: 'Je cherche', val: INTENTIONS[c.intention] ?? c.intention, large: true } : null,
  ].filter(Boolean) as { icone: React.ReactNode; label: string; val: string; large?: boolean }[];

  return (
    <div className="fiche" role="dialog" aria-modal="true" aria-label={`Profil de ${c.prenom}`}>
      <button className="fiche-close" onClick={onClose} aria-label="Fermer le profil"><XIcon size={22} /></button>
      <div className="fiche-in">
        <div className="fiche-ph">{/* eslint-disable-next-line @next/next/no-img-element */ premiere && <img src={premiere} alt={`Photo de ${c.prenom}`} />}</div>
        <div className="fiche-corps">
          <div>
            <div className="fiche-nom">{c.prenom}<span>{c.age}</span></div>
            <div className="fiche-sous"><PinIcon />{c.ville}</div>
          </div>

          {c.bio && <section><h3>À propos</h3><p className="fiche-bio">{c.bio}</p></section>}

          <section><h3>Infos</h3>
            <div className="fiche-grille">
              {infos.map((i) => (
                <div key={i.label} className={`fiche-item${i.large ? ' large' : ''}`}><small>{i.icone}{i.label}</small><b>{i.val}</b></div>
              ))}
            </div>
          </section>

          {c.interets.length > 0 && <section><h3>Centres d’intérêt</h3><div className="dk-chips" style={{ gap: 8 }}>{c.interets.map((x) => <span key={x} className="pastille on" style={{ cursor: 'default' }}>{x}</span>)}</div></section>}

          {autres.length > 0 && <section><h3>Photos</h3><div className="fiche-photos">{/* eslint-disable-next-line @next/next/no-img-element */ autres.map((p, i) => <img key={p} src={p} alt={`Photo ${i + 2} de ${c.prenom}`} loading="lazy" />)}</div></section>}

          <section><h3>Confiance</h3>
            <div className="badges">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`badge${c.verification_level >= n ? '' : ' non'}`}><ShieldIcon />{NIVEAUX[n]}{c.verification_level >= n ? '' : ' · non fait'}</div>
              ))}
              <p className="small" style={{ color: '#5E4A53', fontSize: 13 }}>Membre depuis {depuis}.</p>
            </div>
          </section>

          <section>
            <button className="lien-doux" onClick={() => setMenu((v) => !v)} aria-expanded={menu}><FlagIcon size={16} /> Signaler ou bloquer {c.prenom}</button>
            {menu && (
              <div className="col" style={{ gap: 10, marginTop: 6 }}>
                <select className="zone" style={{ minHeight: 50, height: 50 }} value={raison} onChange={(e) => setRaison(e.target.value)} aria-label="Raison du signalement">
                  <option value="">Choisir une raison</option>
                  {RAISONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                {msg && <div className="erreur" role="alert">{msg}</div>}
                <button className="cta ghost" disabled={!raison} onClick={signaler}>Signaler et bloquer</button>
              </div>
            )}
          </section>
        </div>
      </div>
      <div className="fiche-barre">
        <div>
          <button className="rond pass" disabled={occupe} onClick={onPass} aria-label={`Passer ${c.prenom}`}><XIcon size={28} /></button>
          <button className="rond msg" disabled={occupe} onClick={onMessage} aria-label={`Écrire à ${c.prenom}`}><MsgIcon size={24} /></button>
          <button className="rond like" disabled={occupe} onClick={onLike} aria-label={`Aimer ${c.prenom}`}><HeartIcon size={32} /></button>
        </div>
      </div>
    </div>
  );
}
