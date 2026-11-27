# Love Infinity

Application de rencontres vérifiées, lancée d'abord à Abidjan. « Ici, tout le monde est vrai. »

Pile : Next.js (PWA), Supabase (authentification, base, stockage), Vercel.

## Démarrer

```bash
cp .env.example .env.local   # puis remplir les clés (voir ci-dessous)
npm install
npm run dev
```

Variables : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (serveur seulement, jamais dans le navigateur), `HASH_SECRET` (longue chaîne aléatoire), `NEXT_PUBLIC_SITE_URL`, et `NEXT_PUBLIC_TURNSTILE_SITE_KEY` pour le CAPTCHA.

## Réglages Supabase à faire dans le tableau de bord

- Authentication > Providers > Email : confirmation d'email activée.
- Authentication > Attack Protection : activer le CAPTCHA (Cloudflare Turnstile) avec la clé secrète.
- Authentication > URL Configuration : ajouter `<NEXT_PUBLIC_SITE_URL>/auth/callback` aux URL de redirection.
- Authentication > Providers > Phone : laisser désactivé (aucun SMS).

## Base de données

Les migrations sont dans `supabase/migrations`. La première (`0001_socle.sql`) crée les profils, la liste des emails jetables, les numéros uniques, les tentatives d'inscription et la liste d'attente.

## Parcours construit

Accueil, inscription (email et mot de passe choisi, CAPTCHA, piège à robots, limite par IP), confirmation d'email, numéro de téléphone (pays au choix, unique, sans SMS). Le profil en trois étapes, la vérification et l'abonnement suivent.
