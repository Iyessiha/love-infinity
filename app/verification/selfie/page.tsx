'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { MAX_VIDEO } from '@/lib/verification';

type Etat = 'intro' | 'pret' | 'enregistre' | 'envoi';

export default function Selfie() {
  const router = useRouter();
  const video = useRef<HTMLVideoElement>(null);
  const flux = useRef<MediaStream | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const morceaux = useRef<Blob[]>([]);
  const [etat, setEtat] = useState<Etat>('intro');
  const [geste, setGeste] = useState('');
  const [vid, setVid] = useState<string>();
  const [erreur, setErreur] = useState<string>();

  useEffect(() => () => flux.current?.getTracks().forEach((t) => t.stop()), []);

  async function commencer() {
    setErreur(undefined);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/connexion');
    try {
      flux.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
    } catch {
      return setErreur('Autorise la caméra et le micro pour continuer.');
    }
    if (video.current) { video.current.srcObject = flux.current; await video.current.play().catch(() => {}); }
    // Le geste est tiré au hasard par la base de données, pas par le navigateur
    const { data, error } = await supabase.from('verifications').insert({ user_id: user.id, kind: 'selfie' }).select('id, gesture').single();
    if (error || !data) {
      flux.current?.getTracks().forEach((t) => t.stop());
      return setErreur(error?.message.includes('trop_essais') ? 'Trop d’essais aujourd’hui. Réessaie demain.' : 'Une vérification est déjà en cours ou impossible pour le moment.');
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
    flux.current?.getTracks().forEach((t) => t.stop());
    if (blob.size > MAX_VIDEO) { setEtat('intro'); return setErreur('Vidéo trop lourde. Réessaie.'); }
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    const path = `${user!.id}/selfie-${vid}.${type === 'video/webm' ? 'webm' : 'mp4'}`;
    const up = await supabase.storage.from('verifications').upload(path, blob, { contentType: type });
    if (up.error) { setEtat('intro'); return setErreur('Envoi impossible. Réessaie.'); }
    await supabase.from('verification_files').insert({ verification_id: vid, side: 'video', file_path: path });
    router.push('/verification');
  }

  return (
    <main className="ph">
      <div className="bar"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <h1>Selfie vidéo</h1>
      <div className="cam" style={{ minHeight: 360 }}>
        <video ref={video} muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
        <div className="oval"></div>
        {etat === 'enregistre' && <div className="rec"><i></i> Enregistrement… 8 secondes</div>}
        {geste && etat !== 'intro' && <div className="gesture">{geste}</div>}
      </div>
      {etat === 'intro' && <p className="sub">Place ton visage dans l'ovale. Nous te demanderons un geste choisi au hasard, pour prouver que c'est bien toi. La vidéo est supprimée après la décision.</p>}
      {erreur && <div className="alert" role="alert">{erreur}</div>}
      {etat === 'intro' && <button className="btn" style={{ flex: 'none' }} onClick={commencer}>Activer la caméra</button>}
      {etat === 'pret' && <button className="btn gold" style={{ flex: 'none' }} onClick={enregistrer}>Je fais le geste, j'enregistre</button>}
      {etat === 'enregistre' && <button className="btn" style={{ flex: 'none' }} onClick={() => rec.current?.stop()}>Terminer</button>}
      {etat === 'envoi' && <p className="sub" style={{ textAlign: 'center' }}>Envoi en cours…</p>}
    </main>
  );
}
