import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function Accueil() {
  return (
    <main className="ph" style={{ justifyContent: 'center', gap: 20 }}>
      <div className="col center" style={{ gap: 8 }}>
        <Logo />
        <h1 style={{ fontSize: 40 }}>Love Infinity</h1>
        <p className="sub" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: '#4A0E2E' }}>
          Ici, tout le monde est vrai.
        </p>
      </div>
      <div className="col" style={{ gap: 14, marginTop: 16 }}>
        <div className="lvl"><div className="n g">✓</div><div><b>Chaque profil est vérifié</b><span>Selfie vidéo et pièce d'identité, contrôlés par notre équipe.</span></div></div>
        <div className="lvl"><div className="n g">✓</div><div><b>Des prix clairs en FCFA</b><span>Pas de pièces qui expirent. Remboursement automatique en cas de problème.</span></div></div>
        <div className="lvl"><div className="n g">✓</div><div><b>Jusqu'au premier rendez-vous</b><span>Des rencontres sérieuses, à Abidjan d'abord.</span></div></div>
      </div>
      <div className="col" style={{ marginTop: 20 }}>
        <Link className="btn" href="/inscription">Créer mon compte</Link>
        <Link className="link" href="/connexion">J'ai déjà un compte</Link>
      </div>
      <p className="small center" style={{ textAlign: 'center' }}>Réservé aux personnes de 18 ans et plus.</p>
    </main>
  );
}
