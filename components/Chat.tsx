'use client';
import Link from 'next/link';
import { ChevronLeft, FlagIcon, SendIcon } from '@/components/Icons';
import '@/app/membre.css';
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

export function Chat({ matchId, moi, prenom, autreId, initial, photo, depuis }: { matchId: string; moi: string; prenom: string; autreId: string; initial: Msg[]; photo: string | null; depuis: string }) {
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
      <div className="vide" style={{ flex: 1, justifyContent: 'center' }}>
        <p role="status">{fini}</p>
        <Link className="cta" style={{ maxWidth: 300 }} href="/matchs">Retour aux messages</Link>
      </div>
    );
  }

  const idees = [`Salut ${prenom} ! Comment s’est passée ta journée ?`, 'Qu’est-ce qui t’a plu dans mon profil ?', 'Tu préfères un café ou une sortie en plein air pour une première rencontre ?'];
  const jour = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <header className="chat-top">
        <Link className="mb-ico" href="/matchs" aria-label="Retour aux messages"><ChevronLeft /></Link>
        <div className="chat-av">{/* eslint-disable-next-line @next/next/no-img-element */ photo && <img src={photo} alt="" />}</div>
        <div style={{ minWidth: 0, flex: 1 }}><b className="chat-nom">{prenom}</b><span className="small">Match du {depuis}</span></div>
        <button className="mb-ico" aria-expanded={menu} aria-label="Options de la conversation" onClick={() => setMenu((v) => !v)}><FlagIcon size={18} /></button>
      </header>
      {menu && (
        <div className="card col" style={{ gap: 10 }}>
          <button className="cta ghost" style={{ height: 44, fontSize: 15 }} onClick={bloquer}>Bloquer {prenom}</button>
          <label className="small" style={{ fontWeight: 800 }} htmlFor="raison">Signaler {prenom}</label>
          <select id="raison" className="zone" style={{ minHeight: 48, height: 48 }} value={raison} onChange={(e) => setRaison(e.target.value)}>
            <option value="">Choisir une raison</option>
            {RAISONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="cta" style={{ height: 44, fontSize: 15 }} disabled={!raison} onClick={signaler}>Signaler et bloquer</button>
        </div>
      )}
      <div className="fil2" role="log" aria-live="polite" aria-label={`Conversation avec ${prenom}`}>
        {msgs.length === 0 && (
          <div className="vide" style={{ padding: '18px 4px' }}>
            <h2>Vous vous êtes plu</h2>
            <p>Brise la glace avec {prenom}. Ne partage jamais d’argent ni de code reçu par message.</p>
            <div className="pastilles" style={{ justifyContent: 'center' }}>{idees.map((t) => <button key={t} className="pastille" onClick={() => setTexte(t)}>{t}</button>)}</div>
          </div>
        )}
        {msgs.map((m, n) => {
          const nouveau = n === 0 || jour(m.created_at) !== jour(msgs[n - 1].created_at);
          return (
            <div key={m.id} style={{ display: 'contents' }}>
              {nouveau && <div className="jour">{jour(m.created_at)}</div>}
              <div className={`bulle2 ${m.sender_id === moi ? 'moi' : 'autre'}`}>
                {m.body}
                <span className="heure">{new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}{m.sender_id === moi && m.read_at ? ' · Lu' : ''}</span>
              </div>
            </div>
          );
        })}
        <div ref={bas} />
      </div>
      {err && <div className="erreur" role="alert">{err}</div>}
      <form className="compo" onSubmit={envoyer}>
        <label className="sr" htmlFor="msg">Ton message</label>
        <input id="msg" value={texte} maxLength={1000} onChange={(e) => setTexte(e.target.value)} placeholder={`Écris à ${prenom}…`} autoComplete="off" />
        <button className="rond envoyer" disabled={envoi || !texte.trim()} aria-label="Envoyer"><SendIcon size={20} /></button>
      </form>
    </>
  );
}
