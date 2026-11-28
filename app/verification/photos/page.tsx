'use client';
import { reduireImage } from '@/lib/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { extension, MAX_IMAGE } from '@/lib/verification';
import { useT } from '@/components/I18n';

export default function Photos() {
  const router = useRouter();
  const t = useT();
  const [fichiers, setFichiers] = useState<File[]>([]);
  const [apercus, setApercus] = useState<string[]>([]);
  const [erreur, setErreur] = useState<string>();
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    const urls = fichiers.map((f) => URL.createObjectURL(f));
    setApercus(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [fichiers]);

  function choisir(e: React.ChangeEvent<HTMLInputElement>) {
    const liste = [...(e.target.files ?? [])].slice(0, 6);
    if (liste.some((f) => f.size > MAX_IMAGE)) return setErreur(t('vf.ph.big'));
    setErreur(undefined);
    setFichiers(liste);
  }

  async function envoyer() {
    if (fichiers.length < 2) return setErreur(t('vf.ph.min'));
    setEnvoi(true);
    setErreur(undefined);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/connexion');

    for (const [i, f] of fichiers.entries()) {
      const path = `${user.id}/${crypto.randomUUID()}.jpg`;
      let corps: Blob = f;
      try { corps = await reduireImage(f); } catch { /* format non lisible par le navigateur : envoi tel quel */ }
      const up = await supabase.storage.from('photos').upload(path, corps, { contentType: corps === f ? f.type : 'image/jpeg' });
      if (up.error) { setEnvoi(false); return setErreur(t('vf.sendErr')); }
      await supabase.from('profile_photos').insert({ user_id: user.id, path, position: i });
    }
    const { error } = await supabase.from('verifications').insert({ user_id: user.id, kind: 'photos' });
    setEnvoi(false);
    if (error && !error.message.includes('une_en_cours')) {
      return setErreur(error.message.includes('trop_essais') ? t('vf.tooMany') : t('vf.sendErr'));
    }
    router.push('/verification');
  }

  return (
    <main className="ph">
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <h1>{t('vf.ph.t')}</h1>
      <p className="sub">{t('vf.ph.sub')}</p>
      <div className="photos">
        {apercus.map((u) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={u} style={{ padding: 0, overflow: 'hidden' }}><img src={u} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
        ))}
      </div>
      <label className="btn ghost" style={{ cursor: 'pointer' }}>
        {fichiers.length ? t('vf.ph.change') : t('vf.ph.choose')}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={choisir} />
      </label>
      {erreur && <div className="alert" role="alert">{erreur}</div>}
      <div className="sp"></div>
      <button className="btn" style={{ flex: 'none' }} disabled={fichiers.length < 2 || envoi} onClick={envoyer}>{envoi ? t('vf.sending') : t('vf.ph.send')}</button>
    </main>
  );
}
