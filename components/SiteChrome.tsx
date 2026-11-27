import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { SITE } from '@/lib/site';
import '@/app/landing.css';

export function SiteNav({ sombre = false }: { sombre?: boolean }) {
  return (
    <nav className={`lp-nav${sombre ? ' sombre' : ''}`} aria-label="Principal">
      <Link href="/" className="lp-marque"><Logo width={54} /> {SITE.nom}</Link>
      <div className="lp-nav-liens">
        <Link href="/comment-ca-marche" className="lp-nav-lien">Comment ça marche</Link>
        <Link href="/connexion" className="lp-lien">Me connecter</Link>
      </div>
    </nav>
  );
}

export function SiteFooter({ credits }: { credits?: string }) {
  return (
    <footer className="lp-pied">
      <div className="lp-wrap lp-pied-grille">
        <div>
          <b className="lp-pied-titre">{SITE.nom}</b>
          <p>Rencontres vérifiées, à Abidjan d’abord.</p>
          <p>Réservé aux personnes de 18 ans et plus.</p>
        </div>
        <div>
          <b className="lp-pied-titre">Découvrir</b>
          <Link href="/comment-ca-marche">Comment ça marche</Link>
          <Link href="/securite">Sécurité et vérification</Link>
          <Link href="/tarifs">Tarifs</Link>
          <Link href="/faq">Questions fréquentes</Link>
        </div>
        <div>
          <b className="lp-pied-titre">Informations légales</b>
          <Link href="/conditions">Conditions d’utilisation</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <span>{SITE.editeur}</span>
        </div>
      </div>
      {credits && <div className="lp-wrap"><p className="lp-credits">{credits}</p></div>}
    </footer>
  );
}
