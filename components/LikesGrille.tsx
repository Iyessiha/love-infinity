'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HeartIcon, LockIcon, XIcon } from '@/components/Icons';
import { useT } from '@/components/I18n';

export type LikeRecu = { id: string; prenom: string | null; age: number | null; ville: string | null; photo: string | null; note: string | null };

export function LikesGrille({ likes, premium }: { likes: LikeRecu[]; premium: boolean }) {
  const router = useRouter();
  const t = useT();
  const [faits, setFaits] = useState<Record<string, 'match' | 'pass'>>({});
  const [matchIds, setMatchIds] = useState<Record<string, string | null>>({});
  const [occupe, setOccupe] = useState<string>();

  async function agir(id: string, action: 'like' | 'pass') {
    setOccupe(id);
    const r = await fetch('/api/swipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: id, action }) });
    const j = await r.json().catch(() => null);
    setOccupe(undefined);
    if (!j?.ok) return;
    setFaits((s) => ({ ...s, [id]: action === 'like' && j.match ? 'match' : 'pass' }));
    if (j.match) setMatchIds((s) => ({ ...s, [id]: j.matchId ?? null }));
    router.refresh();
  }

  return (
    <div className="grille-likes">
      {likes.map((l) => {
        const etat = faits[l.id];
        return (
          <div key={l.id} className={`lk${premium ? '' : ' flou'}`}>
            {premium && l.photo && /* eslint-disable-next-line @next/next/no-img-element */ <img src={l.photo} alt={t('pile.photoN', { n: 1, name: l.prenom ?? '' })} />}
            <div className="lk-txt">
              {premium ? <b>{l.prenom}, {l.age}</b> : <b style={{ display: 'flex', alignItems: 'center', gap: 6 }}><LockIcon size={18} /> {t('likes.someone')}</b>}
              {l.note && <span className="lk-note">{premium ? `« ${l.note} »` : l.note}</span>}
              {premium && !etat && (
                <div className="lk-act">
                  <button className="n" disabled={occupe === l.id} onClick={() => agir(l.id, 'pass')} aria-label={t('pile.passAria', { name: l.prenom ?? '' })}><XIcon size={16} /></button>
                  <button className="o" disabled={occupe === l.id} onClick={() => agir(l.id, 'like')} aria-label={t('likes.likeBackAria', { name: l.prenom ?? '' })}><HeartIcon size={16} /> {t('likes.likeBack')}</button>
                </div>
              )}
              {premium && etat === 'match' && <Link className="lk-act" style={{ textDecoration: 'none' }} href={matchIds[l.id] ? `/matchs/${matchIds[l.id]}` : '/matchs'}><span className="o" style={{ flex: 1, height: 38, borderRadius: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 13px Nunito,sans-serif' }}>{t('likes.match')}</span></Link>}
              {premium && etat === 'pass' && <span className="lk-note">{t('likes.passed')}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
