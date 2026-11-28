import Link from 'next/link';
import { Logo, Wordmark } from '@/components/Logo';
import { LangSetter } from '@/components/LangSetter';
import { SITE } from '@/lib/site';
import { href, tr, type Lang } from '@/lib/i18n';
import '@/app/landing.css';

export function SiteNav({ lang, path, sombre = false }: { lang: Lang; path: string; sombre?: boolean }) {
  const t = tr(lang);
  const autre: Lang = lang === 'fr' ? 'en' : 'fr';
  return (
    <nav className={`lp-nav${sombre ? ' sombre' : ''}`} aria-label={t('Principal', 'Main')}>
      <LangSetter lang={lang} />
      <Link href={href(lang, '/')} className="lp-marque" aria-label={SITE.nom}><Logo width={48} /><Wordmark height={40} clair /></Link>
      <div className="lp-nav-liens">
        <Link href={href(lang, '/comment-ca-marche')} className="lp-nav-lien">{t('Comment ça marche', 'How it works')}</Link>
        <Link href={href(autre, path)} className="lp-nav-lien lp-langue" hrefLang={autre} lang={autre} aria-label={autre === 'en' ? 'Read in English' : 'Lire en français'}>{autre.toUpperCase()}</Link>
        <Link href="/connexion" className="lp-lien">{t('Me connecter', 'Log in')}</Link>
      </div>
    </nav>
  );
}

export function SiteFooter({ lang, path, credits }: { lang: Lang; path: string; credits?: string }) {
  const t = tr(lang);
  const autre: Lang = lang === 'fr' ? 'en' : 'fr';
  return (
    <footer className="lp-pied">
      <div className="lp-wrap lp-pied-grille">
        <div>
          <b className="lp-pied-titre">{SITE.nom}</b>
          <p>{t('Des rencontres vérifiées, partout où nous ouvrons.', 'Verified dating, wherever we open.')}</p>
          <p>{t('Réservé aux personnes de 18 ans et plus.', 'For people aged 18 and over.')}</p>
          <Link href={href(autre, path)} hrefLang={autre} lang={autre}>{autre === 'en' ? 'English' : 'Français'}</Link>
        </div>
        <div>
          <b className="lp-pied-titre">{t('Découvrir', 'Discover')}</b>
          <Link href={href(lang, '/comment-ca-marche')}>{t('Comment ça marche', 'How it works')}</Link>
          <Link href={href(lang, '/securite')}>{t('Sécurité et vérification', 'Safety and verification')}</Link>
          <Link href={href(lang, '/tarifs')}>{t('Tarifs', 'Pricing')}</Link>
          <Link href={href(lang, '/faq')}>{t('Questions fréquentes', 'FAQ')}</Link>
        </div>
        <div>
          <b className="lp-pied-titre">{t('Informations légales', 'Legal')}</b>
          <Link href={href(lang, '/conditions')}>{t('Conditions d’utilisation', 'Terms of use')}</Link>
          <Link href={href(lang, '/confidentialite')}>{t('Confidentialité', 'Privacy')}</Link>
          <span>{SITE.editeur}</span>
        </div>
      </div>
      {credits && <div className="lp-wrap"><p className="lp-credits">{credits}</p></div>}
    </footer>
  );
}
