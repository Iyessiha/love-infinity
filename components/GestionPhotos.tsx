'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { MAX_IMAGE, extension } from '@/lib/verification';
import { useT } from '@/components/I18n';

export type PhotoItem = { path: string; url: string; attente: boolean };

async function reduire(f: File): Promise<Blob> {
  const bmp = await createImageBitmap(f);
  const k = Math.min(1, 1280 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return await new Promise((ok, ko) => c.toBlob((b) => (b ? ok(b) : ko(new Error('blob'))), 'image/jpeg', 0.82));
}

export function GestionPhotos({ items }: { items: PhotoItem[] }) {
  const t = useT();
  const router = useRouter();
  const [occupe, setOccupe] = useState(false);
  const [msg, setMsg] = useState<string>();
  const validees = items.filter((i) => !i.attente);
  const attente = items.filter((i) => i.attente);
  const sb = () => supabaseBrowser();

  async function run(fn: () => Promise<string | void>) {
    setOccupe(true); setMsg(undefined);
    try { const m = await fn(); if (m) setMsg(m); else router.refresh(); } catch { setMsg(t('ph.err')); }
    setOccupe(false);
  }

  const deplacer = (i: number, d: -1 | 1) => run(async () => {
    const ordre = validees.map((v) => v.path);
    const j = i + d;
    if (j < 0 || j >= ordre.length) return;
    [ordre[i], ordre[j]] = [ordre[j], ordre[i]];
    const { error } = await sb().rpc('ordonner_photos', { p_paths: ordre });
    if (error) return t('ph.err');
  });

  const supprimer = (p: PhotoItem) => run(async () => {
    const { error } = await sb().rpc('supprimer_photo', { p_path: p.path });
    if (error) return error.message.includes('minimum_photos') ? t('ph.min') : t('ph.err');
    await sb().storage.from('photos').remove([p.path]);
  });

  async function ajouter(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > MAX_IMAGE * 2) return setMsg(t('vf.ph.big'));
    void run(async () => {
      const { data: { user } } = await sb().auth.getUser();
      if (!user) return t('ph.err');
      const path = `${user.id}/${crypto.randomUUID()}.jpg`;
      void extension;
      const up = await sb().storage.from('photos').upload(path, await reduire(f), { contentType: 'image/jpeg' });
      if (up.error) return t('ph.err');
      const { error } = await sb().rpc('ajouter_photo', { p_path: path });
      if (error) {
        await sb().storage.from('photos').remove([path]);
        return error.message.includes('limite_photos') ? t('ph.max') : t('ph.err');
      }
    });
  }

  return (
    <div className="col" style={{ gap: 10 }}>
      <p className="small">{t('ph.hint')}</p>
      <div className="ed-photos gp">
        {validees.map((p, i) => (
          <div key={p.path}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt="" />
            {i === 0 && <span className="gp-main">{t('ph.main')}</span>}
            <div className="gp-act">
              <button type="button" disabled={occupe || i === 0} onClick={() => deplacer(i, -1)} aria-label={t('ph.left')}>‹</button>
              <button type="button" disabled={occupe} onClick={() => supprimer(p)} aria-label={t('ph.del')}>✕</button>
              <button type="button" disabled={occupe || i === validees.length - 1} onClick={() => deplacer(i, 1)} aria-label={t('ph.right')}>›</button>
            </div>
          </div>
        ))}
        {attente.map((p) => (
          <div key={p.path} className="gp-att">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt="" />
            <span className="gp-main att">{t('ph.pending')}</span>
            <div className="gp-act"><button type="button" disabled={occupe} onClick={() => supprimer(p)} aria-label={t('ph.del')}>✕</button></div>
          </div>
        ))}
        {items.length < 6 && (
          <label className="gp-add" aria-disabled={occupe}>
            <span>+</span><small>{t('ph.addBtn')}</small>
            <input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={occupe} onChange={ajouter} />
          </label>
        )}
      </div>
      {attente.length > 0 && <p className="small">{t('ph.pendingP')}</p>}
      {msg && <div className="erreur" role="alert">{msg}</div>}
    </div>
  );
}
