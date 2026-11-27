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

## Vérification et administration

Trois niveaux : photos (1), selfie vidéo avec geste tiré au hasard par la base (2), pièce d'identité recto/verso (3). Les fichiers de vérification sont dans un bucket privé, lisibles seulement par l'administrateur, et supprimés dès la décision. Les photos de profil sont conservées.

Messagerie : réservée aux matchs. Il faut un compte actif et au moins le niveau 2 (selfie vidéo) pour écrire, 20 messages par minute au maximum. Chaque conversation permet de bloquer ou de signaler ; les signalements sont lus par les administrateurs sur `/admin/signalements`.

Pour te donner les droits d'administrateur, après ta première inscription, exécute dans l'éditeur SQL de Supabase :

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'TON_EMAIL';
```

Après connexion, un administrateur arrive automatiquement sur `/admin` (tableau de bord : vérifications en attente, membres, lien vers le tableau de chiffres si `NEXT_PUBLIC_ADMIN_DASHBOARD_URL` est renseigné). La page de traitement des vérifications est `/admin/verifications`. Elle répond « introuvable » à tout utilisateur qui n'est pas administrateur.

## Paiement (GeniusPay)

1. Dans le tableau de bord GeniusPay, crée des clés **sandbox** et renseigne `GENIUSPAY_API_KEY` et `GENIUSPAY_API_SECRET`.
2. Déclare le webhook `<SITE>/api/paiement/webhook` (événements `payment.*`), copie le secret `whsec_…` dans `GENIUSPAY_WEBHOOK_SECRET` (il n'est affiché qu'une fois).
3. Teste un achat en sandbox, puis remplace par les clés `live`.
Les prix sont dans la table `plans` (modifiables sans redéployer). L'abonnement s'active uniquement par le webhook signé, après vérification du montant.
