'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { MAX_VIDEO } from '@/lib/verification';
import { useT } from '@/components/I18n';

type Etat = 'intro' | 'pret' | 'enregistre' | 'envoi';

export default function Selfie() {
  const router = useRouter();
  const t = useT();
  const video = useRef<HTMLVideoElement>(null);
  const flux = useRef<MediaStream | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const morceaux = useRef<Blob[]>([]);
  const [etat, setEtat] = useState<Etat>('intro');
  const [geste, setGeste] = useState('');
  const [vid, setVid] = useState<string>();
  const [erreur, setErreur] = useState<string>();

  useEffect(() => () => flux.current?.getTracks().forEach((k) => k.stop()), []);

  async function commencer() {
    setErreur(undefined);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/connexion');
    try {
      flux.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
    } catch {
      return setErreur(t('vf.sf.perm'));
    }
    if (video.current) { video.current.srcObject = flux.current; await video.current.play().catch(() => {}); }
    // Le geste est tiré au hasard par la base de données, pas par le navigateur
    const { data, error } = await supabase.from('verifications').insert({ user_id: user.id, kind: 'selfie' }).select('id, gesture').single();
    if (error || !data) {
      flux.current?.getTracks().forEach((k) => k.stop());
      return setErreur(error?.message.includes('trop_essais') ? t('vf.tooMany') : t('vf.sf.busy'));
    }
    setVid(data.id);
    setGeste(data.gesture ?? '');
    setEtat('pret');
  }

  function enregistrer() {
    if (!flux.current) return;
    morceaux.current = [];
    const type = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
    const r = new MediaRecorder(flux.current, { mimeType: type, videoBitsPerSecond: 1_200_000 });
    r.ondataavailable = (e) => e.data.size && morceaux.current.push(e.data);
    r.onstop = () => envoyer(new Blob(morceaux.current, { type }), type);
    r.start();
    rec.current = r;
    setEtat('enregistre');
    setTimeout(() => r.state === 'recording' && r.stop(), 8000);
  }

  async function envoyer(blob: Blob, type: string) {
    setEtat('envoi');
    flux.current?.getTracks().forEach((k) => k.stop());
    if (blob.size > MAX_VIDEO) { setEtat('intro'); return setErreur(t('vf.sf.big')); }
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    const path = `${user!.id}/selfie-${vid}.${type === 'video/webm' ? 'webm' : 'mp4'}`;
    const up = await supabase.storage.from('verifications').upload(path, blob, { contentType: type });
    if (up.error) { setEtat('intro'); return setErreur(t('vf.sendErr')); }
    await supabase.from('verification_files').insert({ verification_id: vid, side: 'video', file_path: path });
    router.push('/verification');
  }

  return (
    <main className="ph">
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <h1>{t('vf.sf.t')}</h1>
      <div className="cam" style={{ minHeight: 360 }}>
        <video ref={video} muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
        <div className="oval"></div>
        {etat === 'enregistre' && <div className="rec"><i></i> {t('vf.sf.rec')}</div>}
        {geste && etat !== 'intro' && <div className="gesture">{t.v(geste)}</div>}
      </div>
      {etat === 'intro' && <p className="sub">{t('vf.sf.intro')}</p>}
      {erreur && <div className="alert" role="alert">{erreur}</div>}
      {etat === 'intro' && <button className="btn" style={{ flex: 'none' }} onClick={commencer}>{t('vf.sf.cam')}</button>}
      {etat === 'pret' && <button className="btn gold" style={{ flex: 'none' }} onClick={enregistrer}>{t('vf.sf.go')}</button>}
      {etat === 'enregistre' && <button className="btn" style={{ flex: 'none' }} onClick={() => rec.current?.stop()}>{t('vf.sf.stop')}</button>}
      {etat === 'envoi' && <p className="sub" style={{ textAlign: 'center' }}>{t('vf.sf.sending')}</p>}
    </main>
  );
}
