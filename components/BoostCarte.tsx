'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useT } from '@/components/I18n';

export function BoostCarte({ premium, actifJusqua, prochain }: { premium: boolean; actifJusqua: string | null; prochain: string | null }) {
  const t = useT();
  const router = useRouter();
  const [occupe, setOccupe] = useState(false);
  const [err, setErr] = useState<string>();
  const actif = actifJusqua && new Date(actifJusqua) > new Date();
  const attendre = prochain && new Date(prochain) > new Date();

  async function lancer() {
    setOccupe(true); setErr(undefined);
    const { error } = await supabaseBrowser().rpc('lancer_boost');
    setOccupe(false);
    if (error) return setErr(t('boost.err'));
    router.refresh();
  }

  return (
    <section className="reglage boost" aria-label={t('boost.t')}>
      <h2>⚡ {t('boost.t')}</h2>
      <p>{t('boost.p')}</p>
      {!premium ? <Link className="cta ghost" href="/abonnement">{t('boost.lock')}</Link>
        : actif ? <p><b>{t('boost.active', { time: t.time(actifJusqua!) })}</b></p>
        : attendre ? <p>{t('boost.next', { date: t.date(prochain!) })}</p>
        : <button type="button" className="cta" disabled={occupe} onClick={lancer}>{t('boost.go')}</button>}
      {err && <div className="erreur" role="alert">{err}</div>}
    </section>
  );
}
