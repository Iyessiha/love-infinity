'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useT } from '@/components/I18n';

export type StoryItem = { id: string; url: string; created_at: string; kind: 'photo' | 'video' | 'texte'; texte?: string | null; fond?: number; path?: string | null };
export type StoryGroup = { user_id: string; prenom: string; est_moi: boolean; items: StoryItem[] };

/** Réduit la photo à 1080 px max, en JPEG : stockage léger et envoi rapide. */
const MAX_VIDEO = 12 * 1024 * 1024;
const DUREE_MAX = 10.5;

function dureeVideo(f: File): Promise<number> {
  return new Promise((ok, ko) => {
    const v = document.createElement('video');
    const u = URL.createObjectURL(f);
    v.preload = 'metadata';
    v.onloadedmetadata = () => { URL.revokeObjectURL(u); ok(v.duration); };
    v.onerror = () => { URL.revokeObjectURL(u); ko(new Error('video')); };
    v.src = u;
  });
}

async function reduire(f: File): Promise<Blob> {
  const bmp = await createImageBitmap(f);
  const k = Math.min(1, 1080 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return await new Promise((ok, ko) => c.toBlob((b) => (b ? ok(b) : ko(new Error('blob'))), 'image/jpeg', 0.82));
}

function Mini({ it }: { it: StoryItem }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (it.kind === 'texte') return <span className={`st-fond f${it.fond ?? 0}`}>Aa</span>;
  return it.kind === 'video' ? <video src={`${it.url}#t=0.1`} muted playsInline preload="metadata" /> : <img src={it.url} alt="" />;
}

export function Stories({ groupes }: { groupes: StoryGroup[] }) {
  const t = useT();
  const router = useRouter();
  const [ouvert, setOuvert] = useState<{ g: number; i: number } | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string>();
  const moi = groupes.find((g) => g.est_moi);
  const autres = groupes.filter((g) => !g.est_moi);

  async function ajouter(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setEnvoi(true); setErreur(undefined);
    try {
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return router.push('/connexion');
      const video = f.type.startsWith('video/');
      if (video) {
        if (f.size > MAX_VIDEO) return setErreur(t('st.errBig'));
        if ((await dureeVideo(f)) > DUREE_MAX) return setErreur(t('st.errLong'));
      }
      const bucket = video ? 'clips' : 'photos';
      const ext = video ? (f.type === 'video/webm' ? 'webm' : f.type === 'video/quicktime' ? 'mov' : 'mp4') : 'jpg';
      const path = `${user.id}/stories/${crypto.randomUUID()}.${ext}`;
      const up = await sb.storage.from(bucket).upload(path, video ? f : await reduire(f), { contentType: video ? f.type : 'image/jpeg' });
      if (up.error) throw up.error;
      const { error } = await sb.rpc('ajouter_story', { p_path: path, p_kind: video ? 'video' : 'photo' });
      if (error) {
        await sb.storage.from(bucket).remove([path]);
        setErreur(error.message.includes('limite_stories') ? t('st.limit') : t('st.err'));
      } else router.refresh();
    } catch { setErreur(t('st.err')); } finally { setEnvoi(false); }
  }

  async function supprimer(it: StoryItem) {
    const sb = supabaseBrowser();
    await sb.from('stories').delete().eq('id', it.id);
    if (it.path) await sb.storage.from(it.kind === 'video' ? 'clips' : 'photos').remove([it.path]);
    setOuvert(null); router.refresh();
  }

  const [vues, setVues] = useState<{ nb: number; noms: { id: string; prenom: string }[] } | null>(null);
  const [panneau, setPanneau] = useState(false);
  const [muet, setMuet] = useState(true);
  const [compose, setCompose] = useState(false);
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [info, setInfo] = useState<{ msg: string; lien?: string }>();

  async function aimer(g: StoryGroup) {
    setInfo(undefined);
    try {
      const r = await fetch('/api/swipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: g.user_id, action: 'like' }) });
      if (r.status === 401) return router.push('/connexion');
      const j = await r.json();
      if (!j.ok) return setInfo({ msg: j.message ?? t('c.actionErr'), lien: j.code === 'limite' ? '/abonnement' : undefined });
      setLikes((x) => new Set(x).add(g.user_id));
      if (j.match) setInfo({ msg: t('st.match', { name: g.prenom }), lien: j.matchId ? `/matchs/${j.matchId}` : '/matchs' });
    } catch { setInfo({ msg: t('c.netErr') }); }
  }

  const [texte, setTexte] = useState('');
  const [fond, setFond] = useState(0);

  async function publierTexte() {
    setEnvoi(true); setErreur(undefined);
    const { error } = await supabaseBrowser().rpc('ajouter_story_texte', { p_texte: texte, p_fond: fond });
    setEnvoi(false);
    if (error) {
      setErreur(error.message.includes('limite_stories') ? t('st.limit') : error.message.includes('contact_interdit') ? t('st.errContact') : t('st.err'));
      return;
    }
    setCompose(false); setTexte(''); router.refresh();
  }

  const g = ouvert ? groupes[ouvert.g] : null;
  const it = g && ouvert ? g.items[ouvert.i] : null;

  function suivant() {
    if (!ouvert || !g) return;
    if (ouvert.i + 1 < g.items.length) setOuvert({ g: ouvert.g, i: ouvert.i + 1 });
    else if (ouvert.g + 1 < groupes.length) setOuvert({ g: ouvert.g + 1, i: 0 });
    else setOuvert(null);
  }
  function precedent() {
    if (!ouvert) return;
    if (ouvert.i > 0) setOuvert({ g: ouvert.g, i: ouvert.i - 1 });
    else if (ouvert.g > 0) setOuvert({ g: ouvert.g - 1, i: 0 });
  }
  useEffect(() => {
    setVues(null); setPanneau(false); setInfo(undefined);
    if (!it || !g) return;
    const sb = supabaseBrowser();
    if (g.est_moi) {
      sb.rpc('vues_story', { p_story: it.id }).then(({ data }) => {
        const l = (data ?? []) as { nb: number; viewer_id: string | null; prenom: string | null }[];
        setVues({ nb: Number(l[0]?.nb ?? 0), noms: l.filter((x) => x.viewer_id).map((x) => ({ id: x.viewer_id!, prenom: x.prenom ?? '' })) });
      });
    } else void sb.rpc('marquer_story_vue', { p_story: it.id });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [it?.id]);

  useEffect(() => {
    if (!it || panneau) return;
    const tm = it.kind === 'video' ? undefined : setTimeout(suivant, 6000);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOuvert(null); if (e.key === 'ArrowRight') suivant(); if (e.key === 'ArrowLeft') precedent(); };
    window.addEventListener('keydown', key);
    return () => { if (tm) clearTimeout(tm); window.removeEventListener('keydown', key); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvert, panneau]);

  return (
    <section aria-label={t('st.title')} className="stories">
      <div className="st-rail">
        <div className="st-item">
          <button type="button" className={`st-ring${moi ? ' vu' : ' ajout'}`} onClick={() => (moi ? setOuvert({ g: groupes.indexOf(moi), i: 0 }) : undefined)} aria-label={t('st.add')} disabled={!moi}>
            {moi ? <Mini it={moi.items[0]} /> : <span>+</span>}
          </button>
          <label className="st-plus" aria-label={t('st.addP')}>
            {envoi ? '…' : '+'}
            <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" hidden onChange={ajouter} disabled={envoi} />
          </label>
          <button type="button" className="st-aa" onClick={() => setCompose(true)} aria-label={t('st.text')}>Aa</button>
          <small>{envoi ? t('st.sending') : t('st.add')}</small>
        </div>
        {autres.map((a) => (
          <div className="st-item" key={a.user_id}>
            <button type="button" className="st-ring" onClick={() => setOuvert({ g: groupes.indexOf(a), i: 0 })} aria-label={a.prenom}>
              <Mini it={a.items[0]} />
            </button>
            <small>{a.prenom}</small>
          </div>
        ))}
      </div>
      {erreur && <div className="alert" role="alert">{erreur}</div>}
      {compose && (
        <div className="st-view st-compose" role="dialog" aria-modal="true" aria-label={t('st.text')}>
          <div className={`st-texte st-fond f${fond}`}>
            <textarea value={texte} onChange={(e) => setTexte(e.target.value.slice(0, 200))} placeholder={t('st.textPh')} maxLength={200} autoFocus aria-label={t('st.text')} />
          </div>
          <div className="st-outils">
            <div className="st-fonds" role="radiogroup" aria-label={t('st.bg')}>
              {[0, 1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={fond === n} aria-label={`${t('st.bg')} ${n + 1}`} className={`st-fond f${n}${fond === n ? ' on' : ''}`} onClick={() => setFond(n)} />)}
            </div>
            <small>{texte.length}/200</small>
            <button type="button" className="st-annule" onClick={() => setCompose(false)}>{t('st.close')}</button>
            <button type="button" className="st-pub" disabled={!texte.trim() || envoi} onClick={publierTexte}>{envoi ? t('st.sending') : t('st.publish')}</button>
          </div>
          {erreur && <div className="alert" role="alert" style={{ position: 'absolute', top: 12, left: 12, right: 12 }}>{erreur}</div>}
        </div>
      )}
      {it && g && ouvert && (
        <div className="st-view" role="dialog" aria-modal="true" aria-label={g.prenom}>
          <div className="st-bars">{g.items.map((_, k) => <i key={k} className={k < ouvert.i ? 'fait' : k === ouvert.i ? (it.kind === 'video' ? 'cours video' : 'cours') : ''} />)}</div>
          <div className="st-head"><b>{g.est_moi ? t('st.add') : g.prenom}</b><small>{t('st.hint')}</small>
            <button type="button" onClick={() => setOuvert(null)} aria-label={t('st.close')}>✕</button></div>
          {it.kind === 'texte'
            ? <div key={it.id} className={`st-texte st-fond f${it.fond ?? 0}`}><p>{it.texte}</p></div>
            : it.kind === 'video'
            ? <video key={it.id} src={it.url} autoPlay playsInline muted={muet} onEnded={suivant} />
            : /* eslint-disable-next-line @next/next/no-img-element */ <img key={it.id} src={it.url} alt="" />}
          {it.kind === 'video' && <button type="button" className="st-son" onClick={() => setMuet((m) => !m)} aria-label={t(muet ? 'st.soundOn' : 'st.soundOff')}>{muet ? '🔇' : '🔊'}</button>}
          <button type="button" className="st-z st-g" onClick={precedent} aria-label="‹" />
          <button type="button" className="st-z st-d" onClick={suivant} aria-label="›" />
          {!g.est_moi && (
            <div className="st-pied">
              <button type="button" className={`st-like${likes.has(g.user_id) ? ' on' : ''}`} disabled={likes.has(g.user_id)} onClick={() => aimer(g)}>♥ {likes.has(g.user_id) ? t('st.liked') : t('st.like', { name: g.prenom })}</button>
            </div>
          )}
          {info && <div className="st-info" role="status">{info.msg}{info.lien && <> <Link href={info.lien}>{t('st.see')}</Link></>}</div>}
          {g.est_moi && (
            <div className="st-pied">
              <button type="button" className="st-vues" onClick={() => setPanneau((v) => !v)} aria-expanded={panneau}>👁 {t.n('st.viewsN', vues?.nb ?? 0)}</button>
              <button type="button" className="st-del" onClick={() => supprimer(it)}>{t('st.del')}</button>
            </div>
          )}
          {g.est_moi && panneau && (
            <div className="st-panneau">
              <b>{t('st.seenBy')}</b>
              {vues && vues.nb === 0 && <p>{t('st.noViews')}</p>}
              {vues && vues.noms.length > 0 && <ul>{vues.noms.map((n) => <li key={n.id}>{n.prenom}</li>)}</ul>}
              {vues && vues.nb > 0 && vues.noms.length === 0 && <Link href="/abonnement" className="st-up">{t('st.premiumSee')}</Link>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
