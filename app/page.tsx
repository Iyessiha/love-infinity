import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Check } from '@/components/Icons';
import './landing.css';

export const metadata: Metadata = {
  title: 'Love Infinity – Ici, tout le monde est vrai',
  description: 'Rencontres sérieuses à Abidjan. Chaque profil passe par une vérification : photos, selfie vidéo et pièce d’identité. Inscription gratuite.',
  openGraph: {
    title: 'Love Infinity – Ici, tout le monde est vrai',
    description: 'Des rencontres vérifiées, jusqu’au premier rendez-vous. Inscription gratuite à Abidjan.',
    locale: 'fr_CI',
    type: 'website',
  },
};

const FAQ: [string, string][] = [
  ['Pourquoi me demander mon identité ?', 'Pour que chaque personne que tu croises soit réelle. Tu choisis jusqu’où aller : le niveau 1 (photos) suffit pour entrer, le selfie vidéo débloque les messages, la pièce d’identité te donne le badge le plus fort.'],
  ['Mon nom de famille est-il visible ?', 'Non. Seuls ton prénom et ton âge sont affichés. Ton nom sert uniquement à vérifier ton identité.'],
  ['Qui voit mon numéro de téléphone ?', 'Personne. Il n’apparaît jamais sur ton profil. Un numéro ne peut servir qu’à un seul compte, ce qui bloque les doublons et les faux profils.'],
  ['Que deviennent ma vidéo et ma pièce d’identité ?', 'Elles sont lues par notre équipe, puis supprimées dès la décision. Seules tes photos de profil sont conservées.'],
  ['Je n’ai pas de carte d’identité.', 'Le passeport et le permis de conduire sont acceptés. Pour une carte ou un permis, nous demandons le recto et le verso.'],
  ['Et si je ne suis pas à Abidjan ?', 'Crée ton compte : nous gardons ton email et te prévenons dès l’ouverture dans ton pays.'],
];

export default function Accueil() {
  return (
    <main className="lp">
      <header className="lp-hero">
        <div className="lp-wrap">
          <nav className="lp-nav" aria-label="Principal">
            <Link href="/" className="lp-marque"><Logo width={54} /> Love Infinity</Link>
            <Link href="/connexion" className="lp-lien">Me connecter</Link>
          </nav>
          <div className="lp-hero-grille">
            <div>
              <h1>Ici, tout le monde est vrai.</h1>
              <p className="lp-sous">Des rencontres sérieuses à Abidjan, entre personnes dont le visage et l’identité ont été vérifiés. Tu sais à qui tu parles avant d’écrire.</p>
              <div className="lp-actions">
                <Link href="/inscription" className="lp-btn or">Créer mon compte gratuit</Link>
                <Link href="/connexion" className="lp-lien">J’ai déjà un compte</Link>
              </div>
              <p className="lp-note">Réservé aux personnes de 18 ans et plus. Inscription et vérification gratuites.</p>
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

      <section className="lp-section" aria-labelledby="t-verif">
        <div className="lp-wrap">
          <h2 id="t-verif">Un badge se gagne, il ne s’achète pas</h2>
          <p className="lp-intro">Trois niveaux, du plus simple au plus fiable. Chaque badge affiché sur un profil correspond à une vérification réellement faite par notre équipe.</p>
          <div className="lp-verif">
            <ol className="lp-niveaux">
              <li className="lp-niveau"><span className="n" aria-hidden="true">1</span><div><h3>Photos vérifiées</h3><p>Ton visage est visible, les photos sont les tiennes. Ce niveau suffit pour entrer et découvrir des profils.</p></div></li>
              <li className="lp-niveau"><span className="n" aria-hidden="true">2</span><div><h3>Selfie vidéo</h3><p>Tu filmes quelques secondes en faisant un geste tiré au hasard. Impossible de tricher avec une photo volée. Ce niveau te permet d’écrire à tes matchs.</p></div></li>
              <li className="lp-niveau"><span className="n" aria-hidden="true">3</span><div><h3>Identité vérifiée</h3><p>Carte d’identité, permis ou passeport, contrôlés puis supprimés. Le badge vert que tout le monde remarque.</p></div></li>
            </ol>
            <div className="lp-carte" aria-label="Exemple de profil">
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
        </div>
      </section>

      <section className="lp-section lp-protege" aria-labelledby="t-prot">
        <div className="lp-wrap">
          <h2 id="t-prot">Ta vie privée reste à toi</h2>
          <div className="lp-liste">
            <div><h3>Seul ton prénom est affiché</h3><p>Ton nom de famille ne sert qu’à vérifier ton identité. Les autres ne le voient jamais.</p></div>
            <div><h3>Ton numéro reste caché</h3><p>Il n’apparaît pas sur ton profil, et un numéro ne peut ouvrir qu’un seul compte.</p></div>
            <div><h3>Tes pièces sont supprimées</h3><p>Vidéo et pièce d’identité sont effacées dès que la décision est prise.</p></div>
            <div><h3>Bloquer et signaler en un geste</h3><p>Dans chaque conversation. Une personne signalée est bloquée tout de suite et notre équipe examine le cas.</p></div>
          </div>
        </div>
      </section>

      <section className="lp-section" aria-labelledby="t-etapes">
        <div className="lp-wrap">
          <h2 id="t-etapes">De l’inscription au premier message</h2>
          <ol className="lp-etapes">
            <li><h3>Crée ton compte</h3><p>Email, mot de passe, pays et numéro. Aucun SMS à attendre.</p></li>
            <li><h3>Présente-toi</h3><p>Photos, âge, ville, ce que tu cherches : relation sérieuse, mariage, amitié ou découverte.</p></li>
            <li><h3>Fais-toi vérifier</h3><p>Notre équipe examine ta demande. Ton compte s’active quand tes photos sont approuvées.</p></li>
            <li><h3>Découvre et écris</h3><p>5 likes par jour offerts. Quand l’autre te like aussi, c’est un match et vous pouvez vous écrire.</p></li>
          </ol>
        </div>
      </section>

      <section className="lp-section lp-ville" aria-labelledby="t-ville">
        <div className="lp-wrap lp-ville-grille">
          <div>
            <h2 id="t-ville">Abidjan d’abord</h2>
            <p className="lp-intro">Nous ouvrons ville par ville pour que chaque profil trouve de vraies personnes près de lui. Tu es ailleurs ? Crée ton compte : tu es prévenu(e) dès l’ouverture chez toi.</p>
            <div className="lp-actions" style={{ marginTop: 28 }}><Link href="/inscription" className="lp-btn or">Rejoindre la liste</Link></div>
          </div>
          <div className="lp-pays" aria-label="Pays">
            <span className="on">Côte d’Ivoire · ouvert</span>
            <span>Burkina Faso</span><span>Sénégal</span><span>Mali</span><span>Togo</span><span>Bénin</span><span>Ghana</span><span>Nigeria</span>
          </div>
        </div>
      </section>

      <section className="lp-section" aria-labelledby="t-prix">
        <div className="lp-wrap lp-prix">
          <div>
            <h2 id="t-prix">Gratuit pour commencer</h2>
            <p className="lp-intro">L’inscription, la vérification et 5 likes par jour ne coûtent rien. Pour liker sans limite et écrire sans compter, des abonnements simples, en FCFA.</p>
            <div className="lp-moyens" aria-label="Moyens de paiement"><span>Wave</span><span>Orange Money</span><span>MTN</span><span>Moov</span><span>Carte</span></div>
          </div>
          <ul className="lp-garanties">
            <li><span className="c"><Check size={14} /></span><div><b>Pas de pièces qui expirent</b><span>Tu paies une période, tu en profites jusqu’au bout.</span></div></li>
            <li><span className="c"><Check size={14} /></span><div><b>Des prix clairs en FCFA</b><span>Pas de conversion, pas de frais cachés.</span></div></li>
            <li><span className="c"><Check size={14} /></span><div><b>Renouvellement sans perte</b><span>Si tu renouvelles avant la fin, les jours restants sont conservés.</span></div></li>
          </ul>
        </div>
      </section>

      <section className="lp-section lp-protege" aria-labelledby="t-faq">
        <div className="lp-wrap">
          <h2 id="t-faq">Questions fréquentes</h2>
          <div className="lp-faq">
            {FAQ.map(([q, r]) => <details key={q}><summary>{q}</summary><p>{r}</p></details>)}
          </div>
        </div>
      </section>

      <section className="lp-final" aria-labelledby="t-fin">
        <div className="lp-wrap">
          <h2 id="t-fin">Prêt(e) à rencontrer quelqu’un de vrai ?</h2>
          <div className="lp-actions" style={{ marginTop: 30 }}>
            <Link href="/inscription" className="lp-btn or">Créer mon compte gratuit</Link>
            <Link href="/connexion" className="lp-lien">Me connecter</Link>
          </div>
        </div>
      </section>

      <footer className="lp-pied">
        <div className="lp-wrap"><span>Love Infinity · Abidjan</span><span>Réservé aux personnes de 18 ans et plus</span></div>
      </footer>
    </main>
  );
}
