'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FicheProfil } from '@/components/FicheProfil';
import { HeartIcon, InfoIcon, MsgIcon, PinIcon, ShieldIcon, SlidersIcon, XIcon, SendIcon } from '@/components/Icons';
import { useT } from '@/components/I18n';
import '@/app/membre.css';

export type Carte = {
  id: string; prenom: string; age: number; ville: string; bio: string | null; intention: string | null;
  profession: string | null; interets: string[]; langues: string[]; verification_level: number;
  taille_cm: number | null; etudes: string | null; membre_depuis: string; photos: string[];
};
export type Filtres = { age_min: number; age_max: number; ville: string; intention: string };
type Action = 'like' | 'pass';

const SEUIL = 110;

export function Pile({ cartes, restants, moi, filtres, peutEcrire }: {
  cartes: Carte[]; restants: number | null; moi: { prenom: string; photo: string | null }; filtres: Filtres; peutEcrire: boolean;
}) {
  const router = useRouter();
  const t = useT();
  const [i, setI] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [reste, setReste] = useState(restants);
  const [match, setMatch] = useState<{ c: Carte; id: string | null } | null>(null);
  const [erreur, setErreur] = useState<{ message: string; abo?: boolean }>();
  const [envoi, setEnvoi] = useState(false);
  const [fiche, setFiche] = useState(false);
  const [ecrire, setEcrire] = useState(false);
  const [filtreOuvert, setFiltreOuvert] = useState(false);
  const [dx, setDx] = useState(0);
  const [mode, setMode] = useState<'' | 'glisse' | 'vole' | 'retour'>('');
  const depart = useRef<{ x: number } | null>(null);
  const bouge = useRef(false);
  const c = cartes[i];
  const suivante = cartes[i + 1];
  const nbFiltres = (filtres.age_min > 18 ? 1 : 0) + (filtres.age_max < 99 ? 1 : 0) + (filtres.ville ? 1 : 0) + (filtres.intention ? 1 : 0);

  const agir = useCallback(async (action: Action, note?: string): Promise<boolean> => {
    if (!c || envoi) return false;
    setEnvoi(true);
    setErreur(undefined);
    try {
      const r = await fetch('/api/swipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: c.id, action, note }) });
      if (r.status === 401) { router.push('/connexion'); return false; }
      const j = await r.json();
      if (!j.ok) { setErreur({ message: j.message, abo: j.code === 'limite' }); return false; }
      if (j.restants !== undefined) setReste(j.restants);
      if (j.match) setMatch({ c, id: j.matchId ?? null });
      setI((n) => n + 1);
      setPhoto(0);
      return true;
    } catch {
      setErreur({ message: t('c.netErr') });
      return false;
    } finally {
      setEnvoi(false);
    }
  }, [c, envoi, router, t]);

  /** Fait sortir la carte puis enregistre le choix ; si la base refuse, la carte revient. */
  const envoler = useCallback(async (action: Action) => {
    if (!c || envoi) return;
    setFiche(false);
    setMode('vole');
    setDx(action === 'like' ? 700 : -700);
    await new Promise((r) => setTimeout(r, 260));
    const ok = await agir(action);
    setMode(ok ? '' : 'retour');
    setDx(0);
    if (!ok) setTimeout(() => setMode(''), 260);
  }, [c, envoi, agir]);

  async function envoyerMessage(note: string) {
    const ok = await agir('like', note);
    if (ok) setEcrire(false);
    return ok;
  }

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (fiche || ecrire || filtreOuvert || match) return;
      if (e.key === 'ArrowRight') envoler('like');
      if (e.key === 'ArrowLeft') envoler('pass');
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [envoler, fiche, ecrire, filtreOuvert, match]);

  function bas(e: React.PointerEvent<HTMLDivElement>) {
    if (envoi || mode === 'vole' || (e.target as HTMLElement).closest('button')) return;
    depart.current = { x: e.clientX };
    bouge.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    setMode('glisse');
  }
  function deplace(e: React.PointerEvent<HTMLDivElement>) {
    if (!depart.current) return;
    const d = e.clientX - depart.current.x;
    if (Math.abs(d) > 8) bouge.current = true;
    setDx(d);
  }
  function lache() {
    if (!depart.current) return;
    depart.current = null;
    if (dx > SEUIL) envoler('like');
    else if (dx < -SEUIL) envoler('pass');
    else { setMode('retour'); setDx(0); setTimeout(() => setMode(''), 250); }
  }
  function toucher(e: React.MouseEvent<HTMLDivElement>) {
    if (bouge.current || !c) return;
    const r = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - r.left) / r.width;
    const n = c.photos.length;
    if (rel < 0.34 && photo > 0) setPhoto(photo - 1);
    else if (rel > 0.66 && photo < n - 1) setPhoto(photo + 1);
    else if (rel >= 0.34 && rel <= 0.66) setFiche(true);
  }

  const haut = (
    <header className="mb-top">
      <span className="mb-marque">{t('pile.title')}</span>
      <span className="sp" />
      <button className="mb-ico" onClick={() => setFiltreOuvert(true)} aria-label={t('pile.filters')}>
        <SlidersIcon />{nbFiltres > 0 && <span className="pt">{nbFiltres}</span>}
      </button>
    </header>
  );

  const overlays = (
    <>
      {filtreOuvert && <FeuilleFiltres f={filtres} onClose={() => setFiltreOuvert(false)} />}
      {match && <EcranMatch c={match.c} moi={moi} matchId={match.id} onClose={() => setMatch(null)} />}
    </>
  );

  if (!c) {
    return (
      <div className="dk">
        {haut}
        <div className="vide" style={{ flex: 1, justifyContent: 'center' }}>
          <div className="rond-deco"><HeartIcon size={38} /></div>
          <h2>{t('pile.seenAll')}</h2>
          <p>{nbFiltres ? t('pile.seenFilters') : t('pile.seenNone')}</p>
          <div className="col" style={{ width: '100%', maxWidth: 300 }}>
            {nbFiltres > 0 && <button className="cta" onClick={() => setFiltreOuvert(true)}>{t('pile.editFilters')}</button>}
            <button className={`cta${nbFiltres ? ' ghost' : ''}`} onClick={() => router.refresh()}>{t('pile.refresh')}</button>
          </div>
        </div>
        {overlays}
      </div>
    );
  }

  const rot = dx / 18;
  const p = Math.max(0, Math.min(1, Math.abs(dx) / SEUIL));
  const style: React.CSSProperties = { transform: `translateX(${dx}px) rotate(${rot}deg)`, opacity: mode === 'vole' ? 0 : 1 };

  return (
    <div className="dk">
      {haut}
      <div className="dk-scene">
        {suivante && <div className="dk-next" aria-hidden="true" />}
        <div
          key={c.id}
          className={`dk-card ${mode} ${mode === '' ? 'arrive' : ''}`}
          style={style}
          onPointerDown={bas} onPointerMove={deplace} onPointerUp={lache} onPointerCancel={lache}
          onClick={toucher}
          role="group" aria-label={t('pile.profileOf', { name: c.prenom, age: c.age })}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {c.photos[photo] && <img className="dk-img" src={c.photos[photo]} alt={t('pile.photoN', { n: photo + 1, name: c.prenom })} draggable={false} />}
          {c.photos.length > 1 && <div className="dk-bars" aria-hidden="true">{c.photos.map((_, n) => <i key={n} className={n === photo ? 'on' : ''} />)}</div>}
          {c.verification_level > 0 && <span className="dk-verif"><ShieldIcon size={14} />{t(`lvl.${c.verification_level}`)}</span>}
          <span className="dk-stamp l" style={{ opacity: dx > 0 ? p : 0 }}>{t('pile.like')}</span>
          <span className="dk-stamp p" style={{ opacity: dx < 0 ? p : 0 }}>{t('pile.pass')}</span>
          <div className="dk-info">
            <div className="dk-nom">{c.prenom}<span>{c.age}</span></div>
            <div className="dk-ligne"><PinIcon size={15} />{c.ville}{c.profession ? ` · ${c.profession}` : ''}</div>
            <div className="dk-chips">
              {c.intention && <span>{t.v(c.intention)}</span>}
              {c.interets.slice(0, 2).map((x) => <span key={x}>{t.v(x)}</span>)}
            </div>
          </div>
          <button className="dk-more" onClick={(e) => { e.stopPropagation(); setFiche(true); }} aria-label={t('pile.seeAll', { name: c.prenom })}><InfoIcon size={22} /></button>
        </div>
      </div>

      {erreur && (
        <div className="erreur" role="alert">
          {erreur.message}{erreur.abo && <> <Link href="/abonnement" style={{ color: '#4A0E2E', fontWeight: 800 }}>{t('pile.offers')}</Link></>}
        </div>
      )}
      <div className="dk-actions">
        <button className="rond pass" disabled={envoi} onClick={() => envoler('pass')} aria-label={t('pile.passAria', { name: c.prenom })}><XIcon size={28} /></button>
        <button className="rond msg" disabled={envoi} onClick={() => setEcrire(true)} aria-label={t('pile.writeAria', { name: c.prenom })}><MsgIcon size={24} /></button>
        <button className="rond like" disabled={envoi} onClick={() => envoler('like')} aria-label={t('pile.likeAria', { name: c.prenom })}><HeartIcon size={34} /></button>
      </div>
      <p className="dk-reste" role="status">{reste === null ? t('pile.unlimited') : <><b>{reste}</b> {t.n('pile.left', reste)}</>}</p>

      {fiche && <FicheProfil c={c} occupe={envoi} onClose={() => setFiche(false)} onPass={() => envoler('pass')} onLike={() => envoler('like')} onMessage={() => { setFiche(false); setEcrire(true); }} onSignale={() => { setFiche(false); setI((n) => n + 1); }} />}
      {ecrire && <FeuilleMessage c={c} peutEcrire={peutEcrire} envoi={envoi} erreur={erreur?.message} onClose={() => setEcrire(false)} onEnvoyer={envoyerMessage} />}
      {overlays}
    </div>
  );
}

function FeuilleMessage({ c, peutEcrire, envoi, erreur, onClose, onEnvoyer }: {
  c: Carte; peutEcrire: boolean; envoi: boolean; erreur?: string; onClose: () => void; onEnvoyer: (t: string) => Promise<boolean>;
}) {
  const t = useT();
  const [texte, setTexte] = useState('');
  const idees = [
    t('msg.i1', { name: c.prenom }),
    c.interets[0] ? t('msg.i2', { x: t.v(c.interets[0]).toLowerCase() }) : t('msg.i2b', { name: c.prenom }),
    c.ville ? t('msg.i3', { city: c.ville.split(',')[0] }) : t('msg.i3b'),
  ];
  return (
    <div className="voile" onClick={onClose}>
      <div className="feuille" role="dialog" aria-modal="true" aria-label={t('msg.dialog', { name: c.prenom })} onClick={(e) => e.stopPropagation()}>
        <div className="poignee" />
        <h2>{t('msg.title', { name: c.prenom })}</h2>
        <p className="small" style={{ color: '#5E4A53', fontSize: 14 }}>{t('msg.explain', { name: c.prenom })}</p>
        {!peutEcrire ? (
          <>
            <div className="erreur">{t('msg.needVerif')}</div>
            <Link className="cta" href="/verification">{t('msg.verifyCta')}</Link>
          </>
        ) : (
          <>
            <textarea className="zone" value={texte} maxLength={280} onChange={(e) => setTexte(e.target.value)} placeholder={t('msg.ph', { name: c.prenom })} aria-label={t('msg.yours')} autoFocus />
            <div className="small" style={{ textAlign: 'right', marginTop: -8 }}>{texte.length}/280</div>
            <div className="pastilles" aria-label={t('msg.ideas')}>{idees.map((t) => <button key={t} className="pastille" onClick={() => setTexte(t)}>{t}</button>)}</div>
            {erreur && <div className="erreur" role="alert">{erreur}</div>}
            <button className="cta or" disabled={envoi || !texte.trim()} onClick={() => onEnvoyer(texte.trim())}><SendIcon size={18} /> {envoi ? t('msg.sending') : t('msg.send')}</button>
          </>
        )}
      </div>
    </div>
  );
}

function FeuilleFiltres({ f, onClose }: { f: Filtres; onClose: () => void }) {
  const router = useRouter();
  const t = useT();
  const [min, setMin] = useState(String(f.age_min));
  const [max, setMax] = useState(String(f.age_max));
  const [ville, setVille] = useState(f.ville);
  const [intention, setIntention] = useState(f.intention);

  function appliquer(reset = false) {
    const q = new URLSearchParams();
    if (!reset) {
      const a = Math.max(18, Math.min(99, parseInt(min, 10) || 18));
      const b = Math.max(a, Math.min(99, parseInt(max, 10) || 99));
      if (a > 18) q.set('min', String(a));
      if (b < 99) q.set('max', String(b));
      if (ville.trim()) q.set('ville', ville.trim());
      if (intention) q.set('but', intention);
    }
    onClose();
    router.push(`/decouvrir${q.size ? `?${q}` : ''}`);
  }

  return (
    <div className="voile" onClick={onClose}>
      <div className="feuille" role="dialog" aria-modal="true" aria-label={t('flt.title')} onClick={(e) => e.stopPropagation()}>
        <div className="poignee" />
        <h2>{t('flt.title')}</h2>
        <div>
          <label className="small" style={{ fontWeight: 800, display: 'block', marginBottom: 6 }} htmlFor="f-min">{t('flt.age')}</label>
          <div className="champ-num"><input id="f-min" inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, '').slice(0, 2))} aria-label={t('flt.min')} /><span>{t('flt.to')}</span><input inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, '').slice(0, 2))} aria-label={t('flt.max')} /></div>
        </div>
        <div>
          <label className="small" style={{ fontWeight: 800, display: 'block', marginBottom: 6 }} htmlFor="f-ville">{t('flt.city')}</label>
          <div className="champ-num"><input id="f-ville" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Abidjan, Bouaké…" /></div>
        </div>
        <div>
          <span className="small" style={{ fontWeight: 800, display: 'block', marginBottom: 6 }}>{t('flt.looking')}</span>
          <div className="pastilles">
            <button className={`pastille${intention === '' ? ' on' : ''}`} onClick={() => setIntention('')}>{t('flt.any')}</button>
            {['relation_serieuse', 'mariage', 'amitie', 'decouverte'].map((k) => <button key={k} className={`pastille${intention === k ? ' on' : ''}`} onClick={() => setIntention(k)}>{t.v(k)}</button>)}
          </div>
        </div>
        <button className="cta" onClick={() => appliquer()}>{t('flt.apply')}</button>
        <button className="cta ghost" onClick={() => appliquer(true)}>{t('flt.reset')}</button>
      </div>
    </div>
  );
}

function EcranMatch({ c, moi, matchId, onClose }: { c: Carte; moi: { prenom: string; photo: string | null }; matchId: string | null; onClose: () => void }) {
  const t = useT();
  return (
    <div className="match" role="dialog" aria-modal="true" aria-label={t('match.aria')}>
      <div className="coeurs" aria-hidden="true">{Array.from({ length: 10 }, (_, n) => <i key={n} style={{ left: `${6 + n * 9.5}%`, animationDelay: `${(n % 5) * 0.5}s` }}><HeartIcon size={18 + (n % 3) * 8} /></i>)}</div>
      <div className="match-ph">
        <div>{/* eslint-disable-next-line @next/next/no-img-element */ moi.photo && <img src={moi.photo} alt={moi.prenom} />}</div>
        <div>{/* eslint-disable-next-line @next/next/no-img-element */ c.photos[0] && <img src={c.photos[0]} alt={c.prenom} />}</div>
      </div>
      <h1>{t('match.title')}</h1>
      <p style={{ maxWidth: 300 }}>{t('match.text', { name: c.prenom })}</p>
      {matchId ? <Link className="cta or" href={`/matchs/${matchId}`}>{t('match.send')}</Link> : <Link className="cta or" href="/matchs">{t('match.see')}</Link>}
      <button className="cta ghost" style={{ color: '#FBF6EE', borderColor: 'rgba(251,246,238,.6)' }} onClick={onClose}>{t('match.keep')}</button>
    </div>
  );
}
