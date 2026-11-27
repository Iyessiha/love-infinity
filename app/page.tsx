import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from '@/components/Icons';
import { SiteFooter, SiteNav } from '@/components/SiteChrome';
import { HeroVideo } from '@/components/HeroVideo';
import { MEDIA } from '@/lib/media';
import './landing.css';

export const metadata: Metadata = {
  title: 'Love Infinity – Ici, tout le monde est vrai',
  description: 'Rencontres sérieuses à Abidjan, avec des profils vérifiés. Inscription gratuite.',
  openGraph: { title: 'Love Infinity – Ici, tout le monde est vrai', description: 'Des rencontres vérifiées, jusqu’au premier rendez-vous. Inscription gratuite à Abidjan.', locale: 'fr_CI', type: 'website' },
};

export default function Accueil() {
  return (
    <main className="lp">
      <header className="lp-hero">
        <HeroVideo src={MEDIA.heroVideo} poster={MEDIA.heroPoster} />
        <div className="lp-wrap lp-hero-contenu">
          <SiteNav />
          <div className="lp-hero-grille">
            <div>
              <h1>Ici, tout le monde est vrai.</h1>
              <p className="lp-sous">Rencontre quelqu’un qui cherche la même chose que toi, à Abidjan, sans faux profils ni mauvaises surprises.</p>
              <div className="lp-actions">
                <Link href="/inscription" className="lp-btn or">Créer mon compte gratuit</Link>
                <Link href="/comment-ca-marche" className="lp-lien">Voir comment ça marche</Link>
              </div>
              <p className="lp-note">Gratuit pour commencer. Réservé aux personnes de 18 ans et plus.</p>
            </div>
            <svg className="lp-boucles" viewBox="-75 -50 150 100" role="img" aria-label="Deux boucles d’infini qui se croisent sur un badge de vérification">
              <path className="g g1" pathLength="1" d="M0,0 C-20,-30 -66,-30 -66,0 C-66,30 -20,30 0,0" />
              <path className="g g2" pathLength="1" d="M0,0 C20,-30 66,-30 66,0 C66,30 20,30 0,0" />
              <circle className="pt" cx="0" cy="0" r="12" />
              <path className="v" d="M-5,0.5 L-1.5,4 L5.5,-4" />
            </svg>
          </div>
        </div>
      </header>

      <div className="lp-confiance">
        <div className="lp-wrap">
          <span><i className="c"><Check size={13} /></i> Profils vérifiés par notre équipe</span>
          <span><i className="c"><Check size={13} /></i> Ton nom et ton numéro restent privés</span>
          <span><i className="c"><Check size={13} /></i> Wave, Orange Money, MTN, Moov</span>
          <Link href="/securite" className="lp-lien">Notre vérification</Link>
        </div>
      </div>

      <section className="lp-wrap lp-bloc" aria-labelledby="t1">
        <div>
          <h2 id="t1">Des rencontres qui mènent quelque part</h2>
          <p>Tu dis ce que tu cherches : relation sérieuse, mariage, amitié ou simple découverte. On te présente des personnes qui cherchent la même chose, près de chez toi.</p>
          <Link href="/comment-ca-marche" className="lp-lien">Comment ça marche</Link>
        </div>
        <img className="lp-visuel lp-photo-grande" src={MEDIA.photoPlage1.src} alt={MEDIA.photoPlage1.alt} loading="lazy" width={900} height={1125} />
      </section>

      <section className="lp-bloc-fond">
        <div className="lp-wrap lp-bloc inverse" aria-labelledby="t2">
          <div>
            <h2 id="t2">Pas de faux profils, pas d’arnaques</h2>
            <p>Photos contrôlées, selfie vidéo, pièce d’identité : chaque badge sur un profil a été vérifié pour de vrai. Et si quelqu’un se comporte mal, tu le bloques en un geste.</p>
            <Link href="/securite" className="lp-lien">Voir la vérification</Link>
          </div>
          <div className="lp-carte lp-visuel" aria-label="Exemple de profil">
            <div className="lp-photo">
              <span className="lp-ex">Exemple</span>
              <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="78" r="38" fill="#FBF6EE" opacity=".85" /><path d="M20 200c0-46 36-74 80-74s80 28 80 74z" fill="#FBF6EE" opacity=".85" /></svg>
            </div>
            <div className="lp-carte-corps">
              <b>Aïcha, 27</b>
              <span style={{ color: '#5E4A53', fontSize: 14 }}>Abidjan · Relation sérieuse</span>
              <div className="lp-pastilles">
                <span className="lp-pastille"><Check size={13} /> Photos</span>
                <span className="lp-pastille"><Check size={13} /> Selfie</span>
                <span className="lp-pastille"><Check size={13} /> Identité</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-wrap lp-bloc" aria-labelledby="t3">
        <div>
          <h2 id="t3">Pensé pour Abidjan, payé en FCFA</h2>
          <p>Paie avec Wave, Orange Money, MTN ou Moov. Pas de pièces qui expirent, pas de renouvellement caché. Commence gratuitement, décide ensuite.</p>
          <Link href="/tarifs" className="lp-lien">Voir les tarifs</Link>
        </div>
        <img className="lp-visuel lp-photo-grande" src={MEDIA.photoPlage2.src} alt={MEDIA.photoPlage2.alt} loading="lazy" width={900} height={1125} />
      </section>

      <section className="lp-section lp-galerie" aria-labelledby="tg">
        <div className="lp-wrap">
          <h2 id="tg">D’où que tu viennes, l’important est d’être vrai</h2>
          <p className="lp-intro">Africain(e), européen(ne), asiatique, de la diaspora : Love Infinity réunit des personnes de toutes origines qui cherchent une vraie histoire.</p>
          <div className="lp-mosaique">
            {MEDIA.galerie.map((g, i) => <img key={i} src={g.src} alt={g.alt} loading="lazy" className={`m${i + 1}`} />)}
          </div>
        </div>
      </section>

      <section className="lp-signe" aria-label="Notre promesse">
        <div className="lp-wrap">
          <h2>Ici, tout le monde est vrai.</h2>
          <p>Parce qu’une belle histoire commence par la confiance.</p>
        </div>
      </section>

      <section className="lp-section" aria-labelledby="t4">
        <div className="lp-wrap lp-section-centre">
          <h2 id="t4">Trois minutes pour te lancer</h2>
          <ol className="lp-trois">
            <li><h3>Crée ton profil</h3><p>Photos, âge, ville, ce que tu cherches.</p></li>
            <li><h3>Fais-toi vérifier</h3><p>Notre équipe contrôle, tu gagnes tes badges.</p></li>
            <li><h3>Rencontre</h3><p>Like, match, puis écris-vous.</p></li>
          </ol>
          <Link href="/comment-ca-marche" className="lp-lien">Le détail, étape par étape</Link>
        </div>
      </section>

      <section className="lp-section lp-ville" aria-labelledby="t5">
        <div className="lp-wrap lp-ville-grille">
          <div>
            <h2 id="t5">Abidjan d’abord</h2>
            <p className="lp-intro">Nous ouvrons ville par ville pour que chaque profil trouve de vraies personnes près de lui. Tu es ailleurs ? Crée ton compte : tu es prévenu(e) dès l’ouverture chez toi.</p>
            <div className="lp-actions" style={{ marginTop: 28 }}><Link href="/inscription" className="lp-btn or">Rejoindre Love Infinity</Link></div>
          </div>
          <div className="lp-pays" aria-label="Pays">
            <span className="on">Côte d’Ivoire · ouvert</span>
            <span>Burkina Faso</span><span>Sénégal</span><span>Mali</span><span>Togo</span><span>Bénin</span><span>Ghana</span><span>Nigeria</span>
          </div>
        </div>
      </section>

      <section className="lp-final" aria-labelledby="t6">
        <div className="lp-wrap">
          <h2 id="t6">Prêt(e) à rencontrer quelqu’un de vrai ?</h2>
          <div className="lp-actions" style={{ marginTop: 30 }}>
            <Link href="/inscription" className="lp-btn or">Créer mon compte gratuit</Link>
            <Link href="/faq" className="lp-lien">Une question ? Voir la FAQ</Link>
          </div>
        </div>
      </section>

      <SiteFooter credits={MEDIA.credits} />
    </main>
  );
}
