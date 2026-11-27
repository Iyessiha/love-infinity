import Link from 'next/link';
import { SiteFooter, SiteNav } from '@/components/SiteChrome';

export function InfoPage({ titre, intro, maj, children, cta = true }: { titre: string; intro?: string; maj?: string; children: React.ReactNode; cta?: boolean }) {
  return (
    <main className="lp">
      <header className="lp-doc-tete">
        <div className="lp-wrap">
          <SiteNav sombre />
          <h1>{titre}</h1>
          {intro && <p className="lp-doc-intro">{intro}</p>}
          {maj && <p className="lp-doc-maj">Dernière mise à jour : {maj}</p>}
        </div>
      </header>
      <div className="lp-wrap lp-doc">{children}</div>
      {cta && (
        <section className="lp-final">
          <div className="lp-wrap">
            <h2>Prêt(e) à rencontrer quelqu’un de vrai ?</h2>
            <div className="lp-actions" style={{ marginTop: 28 }}>
              <Link href="/inscription" className="lp-btn or">Créer mon compte gratuit</Link>
            </div>
          </div>
        </section>
      )}
      <SiteFooter />
    </main>
  );
}
