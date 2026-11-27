'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Recharge les données de la page toutes les 20 secondes tant que l'onglet est visible : le statut se met à jour sans action. */
export default function AutoRefresh({ secondes = 20 }: { secondes?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === 'visible') router.refresh(); }, secondes * 1000);
    const v = () => { if (document.visibilityState === 'visible') router.refresh(); };
    document.addEventListener('visibilitychange', v);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', v); };
  }, [router, secondes]);
  return null;
}
