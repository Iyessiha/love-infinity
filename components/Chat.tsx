'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

type Msg = { id: string; sender_id: string; body: string; created_at: string; read_at: string | null };

const RAISONS: [string, string][] = [
  ['faux_profil', 'Faux profil'], ['arnaque', 'Arnaque ou demande d’argent'], ['harcelement', 'Harcèlement'],
  ['contenu_inapproprie', 'Contenu inapproprié'], ['mineur', 'Personne mineure'], ['autre', 'Autre'],
];
const ERREURS: Record<string, string> = {
  verification_requise: 'Vérifie ton selfie vidéo pour pouvoir écrire.',
  trop_vite: 'Doucement, tu écris trop vite. Réessaie dans une minute.',
  indisponible: 'Cette conversation n’est plus disponible.',
  compte_inactif: 'Ton compte n’est pas encore activé.',
};
const erreur = (m: string) => Object.entries(ERREURS).find(([k]) => m.includes(k))?.[1] ?? 'Message non envoyé. Réessaie.';

export function Chat({ matchId, moi, prenom, autreId, initial }: { matchId: string; moi: string; prenom: string; autreId: string; initial: Msg[] }) {
  const sb = useRef(supabaseBrowser()).current;
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [texte, setTexte] = useState('');
  const [err, setErr] = useState<string>();
  const [envoi, setEnvoi] = useState(false);
  const [menu, setMenu] = useState(false);
  const [raison, setRaison] = useState('');
  const [fini, setFini] = useState<string>();
  const bas = useRef<HTMLDivElement>(null);

  const charger = useCallback(async () => {
    const { data } = await sb.from('messages').select('id,sender_id,body,created_at,read_at').eq('match_id', matchId).order('created_at', { ascending: true }).limit(200);
    if (data) setMsgs(data as Msg[]);
    await sb.rpc('marquer_lus', { p_match: matchId });
  }, [sb, matchId]);

  useEffect(() => {
    charger();
    const t = setInterval(() => { if (document.visibilityState === 'visible') charger(); }, 4000);
    return () => clearInterval(t);
  }, [charger]);
  useEffect(() => { bas.current?.scrollIntoView({ block: 'end' }); }, [msgs.length]);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    const body = texte.trim();
    if (!body || envoi) return;
    setEnvoi(true); setErr(undefined);
    const { error } = await sb.from('messages').insert({ match_id: matchId, sender_id: moi, body });
    setEnvoi(false);
    if (error) return setErr(erreur(error.message));
    setTexte('');
    charger();
  }

  async function bloquer() {
    const { error } = await sb.rpc('bloquer', { p_user: autreId });
    setFini(error ? undefined : `${prenom} est bloqué(e). Vous ne vous verrez plus.`);
    if (error) setErr('Action impossible. Réessaie.');
  }
  async function signaler() {
    if (!raison) return;
    const { error } = await sb.rpc('signaler', { p_user: autreId, p_reason: raison });
    if (error) return setErr(error.message.includes('trop_de') ? 'Limite de signalements atteinte pour aujourd’hui.' : 'Action impossible. Réessaie.');
    setFini(`Merci. Notre équipe examine ton signalement et ${prenom} est bloqué(e).`);
  }

  if (fini) {
    return (
      <div className="col center" style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
        <p role="status" style={{ textAlign: 'center' }}>{fini}</p>
        <Link className="btn" href="/matchs">Retour à mes matchs</Link>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <h1 style={{ fontSize: 22 }}>{prenom}</h1>
        <div className="sp"></div>
        <button className="link" style={{ background: 'none', border: 0, cursor: 'pointer', minHeight: 44 }} aria-expanded={menu} onClick={() => setMenu((v) => !v)}>Options</button>
      </div>
      {menu && (
        <div className="card col" style={{ gap: 10 }}>
          <button className="btn ghost" style={{ height: 44 }} onClick={bloquer}>Bloquer {prenom}</button>
          <label className="lbl" htmlFor="raison">Signaler {prenom}</label>
          <select id="raison" className="in" value={raison} onChange={(e) => setRaison(e.target.value)}>
            <option value="">Choisir une raison</option>
            {RAISONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="btn" style={{ height: 44 }} disabled={!raison} onClick={signaler}>Signaler et bloquer</button>
        </div>
      )}
      <div className="fil" role="log" aria-live="polite" aria-label={`Conversation avec ${prenom}`}>
        {msgs.length === 0 && <p className="small" style={{ textAlign: 'center' }}>Dis bonjour à {prenom}. Ne partage jamais d’argent ni de code reçu par message.</p>}
        {msgs.map((m) => (
          <div key={m.id} className={`bulle ${m.sender_id === moi ? 'moi' : 'autre'}`}>
            {m.body}
            <span className="heure">{new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}{m.sender_id === moi && m.read_at ? ' · Lu' : ''}</span>
          </div>
        ))}
        <div ref={bas} />
      </div>
      {err && <div className="alert" role="alert">{err}</div>}
      <form className="row" style={{ gap: 8 }} onSubmit={envoyer}>
        <label className="sr" htmlFor="msg">Ton message</label>
        <input id="msg" className="in" value={texte} maxLength={1000} onChange={(e) => setTexte(e.target.value)} placeholder="Écris ton message" autoComplete="off" />
        <button className="btn gold" style={{ width: 96, flex: 'none', height: 52 }} disabled={envoi || !texte.trim()}>Envoyer</button>
      </form>
    </>
  );
}
