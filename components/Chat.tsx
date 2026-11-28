'use client';
import Link from 'next/link';
import { ChevronLeft, FlagIcon, SendIcon } from '@/components/Icons';
import '@/app/membre.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useT } from '@/components/I18n';

type Msg = { id: string; sender_id: string; body: string; created_at: string; read_at: string | null };

const RAISONS = ['faux_profil', 'arnaque', 'harcelement', 'contenu_inapproprie', 'mineur', 'autre'];
const ERREURS: Record<string, string> = { verification_requise: 'e.verif', trop_vite: 'e.fast', indisponible: 'e.gone', compte_inactif: 'e.inactive', contact_externe: 'e.contact', contenu_interdit: 'e.scam' };

export function Chat({ matchId, moi, prenom, autreId, initial, photo, depuis }: { matchId: string; moi: string; prenom: string; autreId: string; initial: Msg[]; photo: string | null; depuis: string }) {
  const t = useT();
  const erreur = (m: string) => t(Object.entries(ERREURS).find(([k]) => m.includes(k))?.[1] ?? 'e.notSent');
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
    // Temps réel : un nouveau message (ou un accusé de lecture) arrive aussitôt, sans attendre.
    const canal = sb.channel(`chat-${matchId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` }, (p) => {
        const m = p.new as Msg;
        setMsgs((l) => (l.some((x) => x.id === m.id) ? l : [...l, m]));
        if (m.sender_id !== moi) void sb.rpc('marquer_lus', { p_match: matchId });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` }, (p) => {
        const m = p.new as Msg;
        setMsgs((l) => l.map((x) => (x.id === m.id ? { ...x, read_at: m.read_at } : x)));
      })
      .subscribe();
    // Filet de sécurité : resynchronisation lente si la connexion temps réel tombe.
    const filet = setInterval(() => { if (document.visibilityState === 'visible') charger(); }, 30000);
    const retour = () => { if (document.visibilityState === 'visible') charger(); };
    document.addEventListener('visibilitychange', retour);
    return () => { clearInterval(filet); document.removeEventListener('visibilitychange', retour); void sb.removeChannel(canal); };
  }, [charger, sb, matchId, moi]);
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
    void charger();
  }

  async function bloquer() {
    const { error } = await sb.rpc('bloquer', { p_user: autreId });
    setFini(error ? undefined : t('chat.blocked', { name: prenom }));
    if (error) setErr(t('c.actionErr'));
  }
  const [confirme, setConfirme] = useState(false);
  async function defaire() {
    const { error } = await sb.rpc('defaire_match', { p_match: matchId });
    if (error) return setErr(t('c.actionErr'));
    setFini(t('chat.unmatched', { name: prenom }));
  }
  async function signaler() {
    if (!raison) return;
    const { error } = await sb.rpc('signaler', { p_user: autreId, p_reason: raison });
    if (error) return setErr(error.message.includes('trop_de') ? t('c.reportLimit') : t('c.actionErr'));
    setFini(t('chat.reported', { name: prenom }));
  }

  if (fini) {
    return (
      <div className="vide" style={{ flex: 1, justifyContent: 'center' }}>
        <p role="status">{fini}</p>
        <Link className="cta" style={{ maxWidth: 300 }} href="/matchs">{t('chat.back')}</Link>
      </div>
    );
  }

  const idees = [t('chat.i1', { name: prenom }), t('chat.i2'), t('chat.i3')];
  const jour = (iso: string) => t.date(iso, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <header className="chat-top">
        <Link className="mb-ico" href="/matchs" aria-label={t('chat.back')}><ChevronLeft /></Link>
        <div className="chat-av">{/* eslint-disable-next-line @next/next/no-img-element */ photo && <img src={photo} alt="" />}</div>
        <div style={{ minWidth: 0, flex: 1 }}><b className="chat-nom">{prenom}</b><span className="small">{t('chat.matchOn', { date: depuis })}</span></div>
        <button className="mb-ico" aria-expanded={menu} aria-label={t('chat.options')} onClick={() => setMenu((v) => !v)}><FlagIcon size={18} /></button>
      </header>
      {menu && (
        <div className="card col" style={{ gap: 10 }}>
          <button className="cta ghost" style={{ height: 44, fontSize: 15 }} onClick={bloquer}>{t('chat.block', { name: prenom })}</button>
          {!confirme
            ? <button className="cta ghost" style={{ height: 44, fontSize: 15 }} onClick={() => setConfirme(true)}>{t('chat.unmatch', { name: prenom })}</button>
            : <div className="col" style={{ gap: 8 }}><p className="small" role="alert">{t('chat.unmatchAsk')}</p><button className="cta rouge" style={{ height: 44, fontSize: 15 }} onClick={defaire}>{t('chat.unmatchYes')}</button></div>}
          <label className="small" style={{ fontWeight: 800 }} htmlFor="raison">{t('chat.report', { name: prenom })}</label>
          <select id="raison" className="zone" style={{ minHeight: 48, height: 48 }} value={raison} onChange={(e) => setRaison(e.target.value)}>
            <option value="">{t('fiche.pick')}</option>
            {RAISONS.map((k) => <option key={k} value={k}>{t(`rs.${k}`)}</option>)}
          </select>
          <button className="cta" style={{ height: 44, fontSize: 15 }} disabled={!raison} onClick={signaler}>{t('fiche.reportBtn')}</button>
        </div>
      )}
      <div className="fil2" role="log" aria-live="polite" aria-label={t('chat.convWith', { name: prenom })}>
        {msgs.length === 0 && (
          <div className="vide" style={{ padding: '18px 4px' }}>
            <h2>{t('chat.emptyT')}</h2>
            <p>{t('chat.emptyP', { name: prenom })}</p>
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
                <span className="heure">{t.time(m.created_at)}{m.sender_id === moi && m.read_at ? t('chat.read') : ''}</span>
              </div>
            </div>
          );
        })}
        <div ref={bas} />
      </div>
      {err && <div className="erreur" role="alert">{err}</div>}
      <form className="compo" onSubmit={envoyer}>
        <label className="sr" htmlFor="msg">{t('chat.you')}</label>
        <input id="msg" value={texte} maxLength={1000} onChange={(e) => setTexte(e.target.value)} placeholder={t('chat.ph', { name: prenom })} autoComplete="off" />
        <button className="rond envoyer" disabled={envoi || !texte.trim()} aria-label={t('chat.send')}><SendIcon size={20} /></button>
      </form>
    </>
  );
}
