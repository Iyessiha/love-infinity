'use client';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Lang } from '@/lib/i18n';
import { COOKIE_LANG, makeT, type T } from '@/lib/dict';

const Ctx = createContext<T>(makeT('fr'));

export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = useMemo(() => makeT(lang), [lang]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <Ctx.Provider value={t}>{children}</Ctx.Provider>;
}

export const useT = () => useContext(Ctx);

/** Sélecteur de langue : mémorise le choix puis recharge la page dans la nouvelle langue. */
export function LangSwitch({ className = '' }: { className?: string }) {
  const t = useT();
  const router = useRouter();
  function choisir(l: Lang) {
    if (l === t.lang) return;
    try { document.cookie = `${COOKIE_LANG}=${l}; path=/; max-age=31536000; samesite=lax`; } catch { /* cookies bloqués */ }
    router.refresh();
  }
  return (
    <div className={`langsw ${className}`} role="group" aria-label={t('lang.label')}>
      {(['fr', 'en'] as const).map((l) => (
        <button key={l} type="button" className={t.lang === l ? 'on' : ''} aria-pressed={t.lang === l} lang={l} onClick={() => choisir(l)}>{l === 'fr' ? 'Français' : 'English'}</button>
      ))}
    </div>
  );
}
