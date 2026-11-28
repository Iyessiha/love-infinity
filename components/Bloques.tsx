'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useT } from '@/components/I18n';

export type Bloque = { id: string; prenom: string; photo: string | null };

export function Bloques({ items }: { items: Bloque[] }) {
  const t = useT();
  const [faits, setFaits] = useState<Set<string>>(new Set());
  async function debloquer(id: string) {
    const { error } = await supabaseBrowser().rpc('debloquer', { p_user: id });
    if (!error) setFaits((s) => new Set(s).add(id));
  }
  if (items.length === 0) return <div className="vide"><p>{t('blk.empty')}</p></div>;
  return (
    <div className="col" style={{ gap: 10 }}>
      {items.map((b) => (
        <div key={b.id} className="conv">
          <div className="av">{/* eslint-disable-next-line @next/next/no-img-element */ b.photo && <img src={b.photo} alt="" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}><b>{b.prenom}</b></div>
          <button type="button" className="cta ghost" style={{ height: 44, fontSize: 14, width: 'auto', padding: '0 18px' }} disabled={faits.has(b.id)} onClick={() => debloquer(b.id)}>{faits.has(b.id) ? t('blk.done') : t('blk.unblock')}</button>
        </div>
      ))}
      <p className="small">{t('blk.note')}</p>
    </div>
  );
}
