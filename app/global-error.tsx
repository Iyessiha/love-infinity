'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#33081F', color: '#FBF6EE', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: 24 }}>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 26 }}>Un problème est survenu · Something went wrong</h1>
          <p>Réessaie dans un instant. · Please try again in a moment.</p>
          <button type="button" onClick={reset} style={{ marginTop: 16, minHeight: 52, padding: '0 28px', borderRadius: 999, border: 0, background: '#F6C453', color: '#33081F', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>Réessayer · Try again</button>
        </div>
      </body>
    </html>
  );
}
