'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { DOCS, extension, MAX_IMAGE, type DocType } from '@/lib/verification';
import { Check } from '@/components/Icons';
import { useT } from '@/components/I18n';

export default function Document() {
  const router = useRouter();
  const t = useT();
  const [type, setType] = useState<DocType>('national_id');
  const [recto, setRecto] = useState<File | null>(null);
  const [verso, setVerso] = useState<File | null>(null);
  const [accord, setAccord] = useState(false);
  const [erreur, setErreur] = useState<string>();
  const [envoi, setEnvoi] = useState(false);
  const doc = DOCS[type];
  const pret = accord && recto && (!doc.verso || verso);

  async function envoyer() {
    if (!pret || !recto) return;
    if ([recto, verso].some((f) => f && f.size > MAX_IMAGE)) return setErreur(t('vf.dc.big'));
    setEnvoi(true);
    setErreur(undefined);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/connexion');

    const { data: v, error } = await supabase.from('verifications').insert({ user_id: user.id, kind: 'document', doc_type: type }).select('id').single();
    if (error || !v) {
      setEnvoi(false);
      return setErreur(error?.message.includes('trop_essais') ? t('vf.tooMany') : t('vf.dc.busy'));
    }
    const parts: [File, 'front' | 'back'][] = [[recto, 'front']];
    if (doc.verso && verso) parts.push([verso, 'back']);
    for (const [f, side] of parts) {
      const path = `${user.id}/doc-${v.id}-${side}.${extension(f)}`;
      const up = await supabase.storage.from('verifications').upload(path, f, { contentType: f.type });
      if (up.error) { setEnvoi(false); return setErreur(t('vf.sendErr')); }
      await supabase.from('verification_files').insert({ verification_id: v.id, side, file_path: path });
    }
    router.push('/verification');
  }

  const choix = (set: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => set(e.target.files?.[0] ?? null);

  return (
    <main className="ph" style={{ gap: 12 }}>
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <h1>{t('vf.dc.t')}</h1>
      <div className="field">
        <label className="lbl" htmlFor="type">{t('vf.dc.type')}</label>
        <select id="type" className="in" value={type} onChange={(e) => { setType(e.target.value as DocType); setVerso(null); }}>
          {Object.entries(DOCS).map(([k, d]) => <option key={k} value={k}>{t(`vf.dc.${k}`)}</option>)}
        </select>
      </div>
      <div className="row" style={{ gap: 12, alignItems: 'stretch' }}>
        <label className={`drop${recto ? ' done' : ''}`} style={{ flex: 1, cursor: 'pointer' }}>
          <b>{recto ? <><Check /> </> : null}{type === 'passport' ? t('vf.dc.rectoPass') : t('vf.dc.rectoCard')}</b><span>{recto ? recto.name : t('vf.dc.tap')}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden onChange={choix(setRecto)} />
        </label>
        {doc.verso && (
          <label className={`drop${verso ? ' done' : ''}`} style={{ flex: 1, cursor: 'pointer' }}>
            <b>{verso ? <><Check /> </> : null}{t('vf.dc.verso')}</b><span>{verso ? verso.name : t('vf.dc.tap')}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden onChange={choix(setVerso)} />
          </label>
        )}
      </div>
      <p className="small">{t('vf.dc.legible')}</p>
      <label className="check">
        <input type="checkbox" checked={accord} onChange={(e) => setAccord(e.target.checked)} />
        <span>{t('vf.dc.consent')}</span>
      </label>
      {erreur && <div className="alert" role="alert">{erreur}</div>}
      <div className="sp"></div>
      <button className="btn" style={{ flex: 'none' }} disabled={!pret || envoi} onClick={envoyer}>{envoi ? t('vf.sending') : t('vf.dc.send')}</button>
    </main>
  );
}
