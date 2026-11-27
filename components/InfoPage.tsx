import Link from 'next/link';
import { SiteFooter, SiteNav } from '@/components/SiteChrome';
import { href, tr, type Lang } from '@/lib/i18n';

export function InfoPage({ lang, path, titre, intro, maj, children, cta = true }: { lang: Lang; path: string; titre: string; intro?: string; maj?: string; children: React.ReactNode; cta?: boolean }) {
  const t = tr(lang);
  return (
    <main className="lp">
      <header className="lp-doc-tete">
        <div className="lp-wrap">
          <SiteNav lang={lang} path={path} sombre />
          <h1>{titre}</h1>
          {intro && <p className="lp-doc-intro">{intro}</p>}
          {maj && <p className="lp-doc-maj">{t('Dernière mise à jour', 'Last updated')} : {maj}</p>}
        </div>
      </header>
      <div className="lp-wrap lp-doc">{children}</div>
      {cta && (
        <section className="lp-final">
          <div className="lp-wrap">
            <h2>{t('Prêt(e) à rencontrer quelqu’un de vrai ?', 'Ready to meet someone real?')}</h2>
            <div className="lp-actions" style={{ marginTop: 28 }}>
              <Link href="/inscription" className="lp-btn or">{t('Créer mon compte gratuit', 'Create my free account')}</Link>
            </div>
          </div>
        </section>
      )}
      <SiteFooter lang={lang} path={path} />
    </main>
  );
}
