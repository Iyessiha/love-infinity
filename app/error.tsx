'use client';
import Link from 'next/link';

/** Erreur inattendue : message dans les deux langues (le contexte de langue peut lui-même être en cause). */
export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="etat">
      <div className="etat-in">
        <p className="etat-code" aria-hidden="true">:(</p>
        <h1>Un problème est survenu<br /><span style={{ fontSize: 20, opacity: 0.85 }}>Something went wrong</span></h1>
        <p>Ce n’est pas de ta faute. Réessaie dans un instant.<br />It’s not your fault. Please try again in a moment.</p>
        <div className="etat-actions">
          <button type="button" onClick={reset}>Réessayer · Try again</button>
          <Link className="ghost" href="/">Accueil · Home</Link>
        </div>
      </div>
    </main>
  );
}
