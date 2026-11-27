/** Envoie une étape du profil. Renvoie null si tout va bien, sinon le message d'erreur. */
export async function sauverEtape(step: 1 | 2 | 3, data: unknown, aller: (url: string) => void): Promise<string | null> {
  try {
    const r = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, data }),
    });
    if (r.status === 401) {
      aller('/connexion');
      return null;
    }
    const j = await r.json();
    return j.ok ? null : j.message;
  } catch {
    return 'Connexion impossible. Vérifie ton réseau et réessaie.';
  }
}
