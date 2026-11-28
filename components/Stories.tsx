'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useT } from '@/components/I18n';

export type StoryItem = { id: string; url: string; created_at: string };
export type StoryGroup = { user_id: string; prenom: string; est_moi: boolean; items: StoryItem[] };

/** Réduit la photo à 1080 px max, en JPEG : stockage léger et envoi rapide. */
async function reduire(f: File): Promise<Blob> {
  const bmp = await createImageBitmap(f);
  const k = Math.min(1, 1080 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return await new Promise((ok, ko) => c.toBlob((b) => (b ? ok(b) : ko(new Error('blob'))), 'image/jpeg', 0.82));
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
      const path = `${user.id}/stories/${crypto.randomUUID()}.jpg`;
      const up = await sb.storage.from('photos').upload(path, await reduire(f), { contentType: 'image/jpeg' });
      if (up.error) throw up.error;
      const { error } = await sb.rpc('ajouter_story', { p_path: path });
      if (error) {
        await sb.storage.from('photos').remove([path]);
        setErreur(error.message.includes('limite_stories') ? t('st.limit') : t('st.err'));
      } else router.refresh();
    } catch { setErreur(t('st.err')); }
    setEnvoi(false);
  }

  async function supprimer(id: string) {
    await supabaseBrowser().from('stories').delete().eq('id', id);
    setOuvert(null); router.refresh();
  }

  const [vues, setVues] = useState<{ nb: number; noms: { id: string; prenom: string }[] } | null>(null);
  const [panneau, setPanneau] = useState(false);

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
    setVues(null); setPanneau(false);
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
    const tm = setTimeout(suivant, 6000);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOuvert(null); if (e.key === 'ArrowRight') suivant(); if (e.key === 'ArrowLeft') precedent(); };
    window.addEventListener('keydown', key);
    return () => { clearTimeout(tm); window.removeEventListener('keydown', key); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvert, panneau]);

  return (
    <section aria-label={t('st.title')} className="stories">
      <div className="st-rail">
        <div className="st-item">
          <button type="button" className={`st-ring${moi ? ' vu' : ' ajout'}`} onClick={() => (moi ? setOuvert({ g: groupes.indexOf(moi), i: 0 }) : undefined)} aria-label={t('st.add')} disabled={!moi}>
            {moi ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={moi.items[0].url} alt="" /> : <span>+</span>}
          </button>
          <label className="st-plus" aria-label={t('st.addP')}>
            {envoi ? '…' : '+'}
            <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={ajouter} disabled={envoi} />
          </label>
          <small>{envoi ? t('st.sending') : t('st.add')}</small>
        </div>
        {autres.map((a) => (
          <div className="st-item" key={a.user_id}>
            <button type="button" className="st-ring" onClick={() => setOuvert({ g: groupes.indexOf(a), i: 0 })} aria-label={a.prenom}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.items[0].url} alt="" />
            </button>
            <small>{a.prenom}</small>
          </div>
        ))}
      </div>
      {erreur && <div className="alert" role="alert">{erreur}</div>}
      {it && g && ouvert && (
        <div className="st-view" role="dialog" aria-modal="true" aria-label={g.prenom}>
          <div className="st-bars">{g.items.map((_, k) => <i key={k} className={k < ouvert.i ? 'fait' : k === ouvert.i ? 'cours' : ''} />)}</div>
          <div className="st-head"><b>{g.est_moi ? t('st.add') : g.prenom}</b><small>{t('st.hint')}</small>
            <button type="button" onClick={() => setOuvert(null)} aria-label={t('st.close')}>✕</button></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={it.id} src={it.url} alt="" />
          <button type="button" className="st-z st-g" onClick={precedent} aria-label="‹" />
          <button type="button" className="st-z st-d" onClick={suivant} aria-label="›" />
          {g.est_moi && (
            <div className="st-pied">
              <button type="button" className="st-vues" onClick={() => setPanneau((v) => !v)} aria-expanded={panneau}>👁 {t.n('st.viewsN', vues?.nb ?? 0)}</button>
              <button type="button" className="st-del" onClick={() => supprimer(it.id)}>{t('st.del')}</button>
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
