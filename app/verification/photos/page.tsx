'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { extension, MAX_IMAGE } from '@/lib/verification';

export default function Photos() {
  const router = useRouter();
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
    if (liste.some((f) => f.size > MAX_IMAGE)) return setErreur('Une photo dépasse 8 Mo.');
    setErreur(undefined);
    setFichiers(liste);
  }

  async function envoyer() {
    if (fichiers.length < 2) return setErreur('Ajoute au moins 2 photos.');
    setEnvoi(true);
    setErreur(undefined);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/connexion');

    for (const [i, f] of fichiers.entries()) {
      const path = `${user.id}/${crypto.randomUUID()}.${extension(f)}`;
      const up = await supabase.storage.from('photos').upload(path, f, { contentType: f.type });
      if (up.error) { setEnvoi(false); return setErreur('Envoi impossible. Réessaie.'); }
      await supabase.from('profile_photos').insert({ user_id: user.id, path, position: i });
    }
    const { error } = await supabase.from('verifications').insert({ user_id: user.id, kind: 'photos' });
    setEnvoi(false);
    if (error && !error.message.includes('une_en_cours')) {
      return setErreur(error.message.includes('trop_essais') ? 'Trop d’essais aujourd’hui. Réessaie demain.' : 'Envoi impossible. Réessaie.');
    }
    router.push('/verification');
  }

  return (
    <main className="ph">
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <h1>Tes photos</h1>
      <p className="sub">2 minimum, 6 maximum. Visage visible, sans lunettes de soleil. Elles seront comparées à ta vidéo.</p>
      <div className="photos">
        {apercus.map((u) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={u} style={{ padding: 0, overflow: 'hidden' }}><img src={u} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
        ))}
      </div>
      <label className="btn ghost" style={{ cursor: 'pointer' }}>
        {fichiers.length ? 'Changer les photos' : 'Choisir mes photos'}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={choisir} />
      </label>
      {erreur && <div className="alert" role="alert">{erreur}</div>}
      <div className="sp"></div>
      <button className="btn" style={{ flex: 'none' }} disabled={fichiers.length < 2 || envoi} onClick={envoyer}>{envoi ? 'Envoi…' : 'Envoyer pour vérification'}</button>
    </main>
  );
}
