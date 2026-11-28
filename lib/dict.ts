import type { Lang } from '@/lib/i18n';

/** Textes de l'application (espace membre, connexion, profil). Chaque clé : [français, anglais]. */
export const D: Record<string, [string, string]> = {
  // Commun
  'c.back': ['Retour', 'Back'],
  'c.continue': ['Continuer', 'Continue'],
  'c.saving': ['Enregistrement…', 'Saving…'],
  'c.save': ['Enregistrer', 'Save'],
  'c.optional': ['facultatif', 'optional'],
  'c.netErr': ['Connexion impossible. Réessaie.', 'Can’t connect. Try again.'],
  'c.actionErr': ['Action impossible. Réessaie.', 'Couldn’t do that. Try again.'],
  'c.reportLimit': ['Limite de signalements atteinte pour aujourd’hui.', 'You’ve reached today’s report limit.'],
  'lang.label': ['Langue', 'Language'],

  // Navigation
  'nav.menu': ['Menu principal', 'Main menu'],
  'nav.discover': ['Découvrir', 'Discover'],
  'nav.likes': ['Likes', 'Likes'],
  'nav.messages': ['Messages', 'Messages'],
  'nav.me': ['Moi', 'Me'],
  'nav.badge': ['{n} nouveau(x)', '{n} new'],

  // Niveaux de confiance
  'lvl.1': ['Photos vérifiées', 'Photos verified'],
  'lvl.2': ['Selfie vérifié', 'Selfie verified'],
  'lvl.3': ['Identité vérifiée', 'Identity verified'],

  // Raisons de signalement
  'rs.faux_profil': ['Faux profil', 'Fake profile'],
  'rs.arnaque': ['Arnaque ou demande d’argent', 'Scam or request for money'],
  'rs.harcelement': ['Harcèlement', 'Harassment'],
  'rs.contenu_inapproprie': ['Contenu inapproprié', 'Inappropriate content'],
  'rs.mineur': ['Personne mineure', 'Underage person'],
  'rs.autre': ['Autre', 'Other'],

  // Valeurs de profil
  'v.homme': ['Un homme', 'A man'],
  'v.femme': ['Une femme', 'A woman'],
  'v.relation_serieuse': ['Relation sérieuse', 'Serious relationship'],
  'v.mariage': ['Mariage', 'Marriage'],
  'v.amitie': ['Amitié', 'Friendship'],
  'v.decouverte': ['Découverte', 'Getting to know people'],
  'v.aucun': ['Aucun', 'None'],
  'v.jai': ['J’en ai', 'I have some'],
  'v.jen_veux': ['J’en veux', 'I want some'],
  'v.jen_veux_pas': ['Je n’en veux pas', 'I don’t want any'],
  'v.Cuisine': ['Cuisine', 'Cooking'],
  'v.Voyages': ['Voyages', 'Travel'],
  'v.Musique': ['Musique', 'Music'],
  'v.Sport': ['Sport', 'Sports'],
  'v.Cinéma': ['Cinéma', 'Cinema'],
  'v.Lecture': ['Lecture', 'Reading'],
  'v.Foi': ['Foi', 'Faith'],
  'v.Mode': ['Mode', 'Fashion'],
  'v.Entrepreneuriat': ['Entrepreneuriat', 'Entrepreneurship'],
  'v.Français': ['Français', 'French'],
  'v.Anglais': ['Anglais', 'English'],
  'v.Autre': ['Autre', 'Other'],
  'v.Bac': ['Bac', 'High school'],
  'v.Licence': ['Licence', 'Bachelor’s'],
  'v.Master': ['Master', 'Master’s'],
  'v.Doctorat': ['Doctorat', 'Doctorate'],
  'v.Chrétienne': ['Chrétienne', 'Christian'],
  'v.Musulmane': ['Musulmane', 'Muslim'],
  'v.Je préfère ne pas dire': ['Je préfère ne pas dire', 'Prefer not to say'],
  'v.Non': ['Non', 'No'],
  'v.Parfois': ['Parfois', 'Sometimes'],
  'v.Souvent': ['Souvent', 'Often'],

  // Découverte
  'pile.title': ['Découvrir', 'Discover'],
  'pile.filters': ['Filtres de recherche', 'Search filters'],
  'pile.seenAll': ['Tu as tout vu pour l’instant', 'You’ve seen everyone for now'],
  'pile.seenFilters': ['Aucun autre profil ne correspond à tes filtres. Élargis ta recherche pour en voir plus.', 'No other profile matches your filters. Widen your search to see more.'],
  'pile.seenNone': ['De nouveaux membres arrivent chaque jour. Reviens bientôt, ou actualise.', 'New members join every day. Come back soon, or refresh.'],
  'pile.editFilters': ['Modifier les filtres', 'Edit filters'],
  'pile.refresh': ['Actualiser', 'Refresh'],
  'pile.profileOf': ['Profil de {name}, {age} ans', '{name}’s profile, {age}'],
  'pile.photoN': ['Photo {n} de {name}', 'Photo {n} of {name}'],
  'pile.like': ['J’AIME', 'LIKE'],
  'pile.pass': ['PASSER', 'PASS'],
  'pile.seeAll': ['Voir tout le profil de {name}', 'See {name}’s full profile'],
  'pile.offers': ['Voir les offres', 'See plans'],
  'pile.passAria': ['Passer {name}', 'Pass on {name}'],
  'pile.writeAria': ['Écrire à {name}', 'Message {name}'],
  'pile.likeAria': ['Aimer {name}', 'Like {name}'],
  'pile.unlimited': ['Likes illimités', 'Unlimited likes'],
  'pile.left.1': ['like restant aujourd’hui', 'like left today'],
  'pile.left.n': ['likes restants aujourd’hui', 'likes left today'],

  // Message d'intro
  'msg.dialog': ['Message pour {name}', 'Message for {name}'],
  'msg.title': ['Écrire à {name}', 'Write to {name}'],
  'msg.explain': ['Ton message accompagne ton like. Si {name} t’aime aussi, c’est le premier message de votre conversation.', 'Your message goes with your like. If {name} likes you back, it becomes the first message of your conversation.'],
  'msg.needVerif': ['Pour écrire un message, vérifie d’abord ton selfie vidéo. C’est ce qui rassure tout le monde ici.', 'To send a message, first verify your video selfie. It’s what keeps everyone here at ease.'],
  'msg.verifyCta': ['Vérifier mon profil', 'Verify my profile'],
  'msg.ph': ['Dis quelque chose à {name}…', 'Say something to {name}…'],
  'msg.yours': ['Ton message', 'Your message'],
  'msg.ideas': ['Idées de premier message', 'First-message ideas'],
  'msg.sending': ['Envoi…', 'Sending…'],
  'msg.send': ['Envoyer avec mon like', 'Send with my like'],
  'msg.i1': ['Salut {name} ! Ton profil m’a fait sourire. Comment se passe ta semaine ?', 'Hi {name}! Your profile made me smile. How’s your week going?'],
  'msg.i2': ['Ton intérêt pour « {x} » m’a donné envie de te parler. C’est quoi ton meilleur souvenir lié à ça ?', 'Your interest in “{x}” made me want to say hi. What’s your best memory linked to it?'],
  'msg.i2b': ['Bonjour {name}, qu’est-ce qui te passionne en ce moment ?', 'Hi {name}, what are you into these days?'],
  'msg.i3': ['Tu es à {city} ? Quel est ton endroit préféré là-bas ?', 'You’re in {city}? What’s your favourite spot there?'],
  'msg.i3b': ['Quel est ton endroit préféré dans ta ville ?', 'What’s your favourite spot in your city?'],

  // Filtres
  'flt.title': ['Filtres', 'Filters'],
  'flt.age': ['Âge', 'Age'],
  'flt.min': ['Âge minimum', 'Minimum age'],
  'flt.max': ['Âge maximum', 'Maximum age'],
  'flt.to': ['à', 'to'],
  'flt.city': ['Ville', 'City'],
  'flt.looking': ['Ce qu’il ou elle cherche', 'What they’re looking for'],
  'flt.any': ['Peu importe', 'Anything'],
  'flt.apply': ['Voir les profils', 'Show profiles'],
  'flt.reset': ['Réinitialiser', 'Reset'],

  // Match
  'match.aria': ['Nouveau match', 'New match'],
  'match.title': ['C’est un match !', 'It’s a match!'],
  'match.text': ['Toi et {name} vous êtes plu. Lancez la conversation maintenant.', 'You and {name} liked each other. Start the conversation now.'],
  'match.send': ['Envoyer un message', 'Send a message'],
  'match.see': ['Voir mes messages', 'See my messages'],
  'match.keep': ['Continuer à découvrir', 'Keep discovering'],

  // Fiche profil
  'fiche.close': ['Fermer le profil', 'Close profile'],
  'fiche.about': ['À propos', 'About'],
  'fiche.info': ['Infos', 'Details'],
  'fiche.city': ['Ville', 'City'],
  'fiche.job': ['Profession', 'Job'],
  'fiche.studies': ['Études', 'Education'],
  'fiche.height': ['Taille', 'Height'],
  'fiche.langs': ['Langues', 'Languages'],
  'fiche.looking': ['Je cherche', 'Looking for'],
  'fiche.interests': ['Centres d’intérêt', 'Interests'],
  'fiche.photos': ['Photos', 'Photos'],
  'fiche.trust': ['Confiance', 'Trust'],
  'fiche.notDone': [' · non fait', ' · not done'],
  'fiche.since': ['Membre depuis {date}.', 'Member since {date}.'],
  'fiche.report': ['Signaler ou bloquer {name}', 'Report or block {name}'],
  'fiche.reason': ['Raison du signalement', 'Reason for report'],
  'fiche.pick': ['Choisir une raison', 'Choose a reason'],
  'fiche.reportBtn': ['Signaler et bloquer', 'Report and block'],

  // Likes reçus
  'likes.title': ['Likes reçus', 'Likes received'],
  'likes.needActive': ['Ton profil doit être validé pour recevoir et voir des likes.', 'Your profile must be approved before you can receive and see likes.'],
  'likes.emptyT': ['Pas encore de like', 'No likes yet'],
  'likes.emptyP': ['Complète ton profil et ajoute des photos : les profils soignés reçoivent bien plus de likes.', 'Complete your profile and add photos: well-kept profiles get far more likes.'],
  'likes.improve': ['Améliorer mon profil', 'Improve my profile'],
  'likes.banner.1': ['1 personne t’a liké', '1 person liked you'],
  'likes.banner.n': ['{n} personnes t’ont liké', '{n} people liked you'],
  'likes.bannerP': ['Passe en Premium pour voir qui c’est, lire leurs messages et liker en retour pour matcher tout de suite.', 'Go Premium to see who it is, read their messages and like back to match right away.'],
  'likes.premium': ['Découvrir Premium', 'Discover Premium'],
  'likes.msgIn': ['Message reçu', 'Message received'],
  'likes.someone': ['Quelqu’un', 'Someone'],
  'likes.likeBack': ['Liker', 'Like back'],
  'likes.likeBackAria': ['Aimer {name} en retour', 'Like {name} back'],
  'likes.match': ['C’est un match ! Écrire', 'It’s a match! Write'],
  'likes.passed': ['Profil passé', 'Profile passed'],

  // Messages
  'msgs.title': ['Messages', 'Messages'],
  'msgs.emptyT': ['Aucun match pour l’instant', 'No matches yet'],
  'msgs.emptyP': ['Quand toi et quelqu’un vous aimez mutuellement, la conversation apparaît ici. Continue à découvrir des profils.', 'When you and someone like each other, the conversation shows up here. Keep discovering profiles.'],
  'msgs.discover': ['Découvrir des profils', 'Discover profiles'],
  'msgs.new': ['Nouveaux matchs', 'New matches'],
  'msgs.convs': ['Conversations', 'Conversations'],

  // Conversation
  'chat.back': ['Retour aux messages', 'Back to messages'],
  'chat.matchOn': ['Match du {date}', 'Matched on {date}'],
  'chat.options': ['Options de la conversation', 'Conversation options'],
  'chat.block': ['Bloquer {name}', 'Block {name}'],
  'chat.report': ['Signaler {name}', 'Report {name}'],
  'chat.convWith': ['Conversation avec {name}', 'Conversation with {name}'],
  'chat.emptyT': ['Vous vous êtes plu', 'You liked each other'],
  'chat.emptyP': ['Brise la glace avec {name}. Ne partage jamais d’argent ni de code reçu par message.', 'Break the ice with {name}. Never send money or share a code you received by message.'],
  'chat.i1': ['Salut {name} ! Comment s’est passée ta journée ?', 'Hi {name}! How was your day?'],
  'chat.i2': ['Qu’est-ce qui t’a plu dans mon profil ?', 'What did you like about my profile?'],
  'chat.i3': ['Tu préfères un café ou une sortie en plein air pour une première rencontre ?', 'Would you rather have a coffee or an outdoor outing for a first meet?'],
  'chat.read': [' · Lu', ' · Read'],
  'chat.ph': ['Écris à {name}…', 'Write to {name}…'],
  'chat.send': ['Envoyer', 'Send'],
  'chat.blocked': ['{name} est bloqué(e). Vous ne vous verrez plus.', '{name} is blocked. You won’t see each other anymore.'],
  'chat.reported': ['Merci. Notre équipe examine ton signalement et {name} est bloqué(e).', 'Thank you. Our team is reviewing your report and {name} is blocked.'],
  'chat.you': ['Ton message', 'Your message'],
  'e.verif': ['Vérifie ton selfie vidéo pour pouvoir écrire.', 'Verify your video selfie to be able to write.'],
  'e.fast': ['Doucement, tu écris trop vite. Réessaie dans une minute.', 'Slow down, you’re writing too fast. Try again in a minute.'],
  'e.gone': ['Cette conversation n’est plus disponible.', 'This conversation is no longer available.'],
  'e.inactive': ['Ton compte n’est pas encore activé.', 'Your account isn’t active yet.'],
  'e.notSent': ['Message non envoyé. Réessaie.', 'Message not sent. Try again.'],

  // Mon profil
  'me.title': ['Mon profil', 'My profile'],
  'me.mainPhoto': ['Ma photo principale', 'My main photo'],
  'me.matches': ['Matchs', 'Matches'],
  'me.likesIn': ['Likes reçus', 'Likes received'],
  'me.likesLeft': ['Likes restants', 'Likes left'],
  'me.trust': ['Confiance', 'Trust'],
  'me.st.pending': ['En attente de validation', 'Awaiting approval'],
  'me.st.active': ['Profil actif', 'Profile active'],
  'me.st.suspended': ['Compte suspendu', 'Account suspended'],
  'me.st.banned': ['Compte banni', 'Account banned'],
  'me.todo': ['à faire', 'to do'],
  'me.complete': ['Compléter ma vérification', 'Complete my verification'],
  'me.aboutMe': ['À propos de moi', 'About me'],
  'me.looking': ['Je cherche : {x}', 'Looking for: {x}'],
  'me.edit': ['Modifier mon profil', 'Edit my profile'],
  'me.sub': ['Abonnement', 'Subscription'],
  'me.free': ['Gratuit', 'Free'],
  'me.premium': ['Premium', 'Premium'],
  'me.essential': ['Essentiel', 'Essential'],
  'me.security': ['Sécurité et confidentialité', 'Safety and privacy'],
  'me.help': ['Aide et sécurité', 'Help and safety'],
  'me.signout': ['Se déconnecter', 'Log out'],
  'me.settings': ['Paramètres', 'Settings'],
  'me.strength': ['Profil complété à {n} %', 'Profile {n}% complete'],
  'me.strengthTip': ['Chaque détail ajouté augmente tes chances de match.', 'Every detail you add increases your chances of matching.'],

  // Modifier le profil
  'ed.title': ['Modifier mon profil', 'Edit my profile'],
  'ed.photos': ['Mes photos', 'My photos'],
  'ed.photoN': ['Ma photo {n}', 'My photo {n}'],
  'ed.managePhotos': ['Gérer mes photos et ma vérification', 'Manage my photos and verification'],
  'ed.bio': ['À propos de moi', 'About me'],
  'ed.bioPh': ['Quelques mots qui te ressemblent…', 'A few words that sound like you…'],
  'ed.job': ['Profession', 'Job'],
  'ed.height': ['Taille (cm)', 'Height (cm)'],
  'ed.studies': ['Études', 'Education'],
  'ed.unset': ['Non précisé', 'Not specified'],
  'ed.langs': ['Langues parlées', 'Languages spoken'],
  'ed.looking': ['Je cherche', 'Looking for'],
  'ed.kids': ['Enfants', 'Children'],
  'ed.tobacco': ['Tabac', 'Smoking'],
  'ed.alcohol': ['Alcool', 'Alcohol'],
  'ed.religion': ['Religion', 'Religion'],
  'ed.interests': ['Centres d’intérêt (5 maximum)', 'Interests (up to 5)'],
  'ed.saved': ['Profil enregistré.', 'Profile saved.'],

  // Paramètres
  'set.title': ['Paramètres', 'Settings'],
  'set.language': ['Langue', 'Language'],
  'set.languageP': ['La langue de toute l’application.', 'The language used across the whole app.'],
  'set.account': ['Compte', 'Account'],
  'set.email': ['Adresse email', 'Email address'],
  'set.danger': ['Zone sensible', 'Danger zone'],
  'set.deleteT': ['Supprimer mon compte', 'Delete my account'],
  'set.deleteP': ['Action définitive : ton profil, tes photos, tes matchs et tes messages sont effacés. Un abonnement en cours n’est pas remboursé.', 'This is permanent: your profile, photos, matches and messages are erased. A subscription in progress is not refunded.'],
  'set.deleteAsk': ['Pour confirmer, écris SUPPRIMER', 'To confirm, type DELETE'],
  'set.deleteWord': ['SUPPRIMER', 'DELETE'],
  'set.deleteGo': ['Supprimer définitivement', 'Delete permanently'],
  'set.deleting': ['Suppression…', 'Deleting…'],
  'set.deleteErr': ['La suppression a échoué. Réessaie ou écris-nous.', 'Deletion failed. Try again or write to us.'],

  // Connexion / inscription
  'auth.welcome': ['Content de te revoir', 'Welcome back'],
  'auth.email': ['Email', 'Email'],
  'auth.password': ['Mot de passe', 'Password'],
  'auth.login': ['Me connecter', 'Log in'],
  'auth.loggingIn': ['Connexion…', 'Logging in…'],
  'auth.forgot': ['Mot de passe oublié ?', 'Forgot your password?'],
  'auth.create': ['Créer un compte', 'Create an account'],
  'auth.bad': ['Email ou mot de passe incorrect.', 'Incorrect email or password.'],
  'auth.confirmFirst': ['Confirme d’abord ton email avec le lien reçu.', 'Please confirm your email first using the link we sent.'],
  'su.title': ['Crée ton compte', 'Create your account'],
  'su.emailHint': ['Nous t’envoyons un lien de confirmation.', 'We’ll send you a confirmation link.'],
  'su.r8': ['8 caractères minimum', 'At least 8 characters'],
  'su.rLetter': ['Une lettre', 'A letter'],
  'su.rDigit': ['Un chiffre', 'A number'],
  'su.confirm': ['Confirme le mot de passe', 'Confirm password'],
  'su.mismatch': ['Les mots de passe ne sont pas identiques.', 'Passwords don’t match.'],
  'su.website': ['Site web', 'Website'],
  'su.cgu1': ['J’ai 18 ans ou plus et j’accepte les ', 'I’m 18 or older and I accept the '],
  'su.cgu2': ['conditions d’utilisation', 'terms of use'],
  'su.cgu3': [' et la ', ' and the '],
  'su.cgu4': ['politique de confidentialité', 'privacy policy'],
  'su.creating': ['Création…', 'Creating…'],
  'su.submit': ['Créer mon compte', 'Create my account'],
  'su.netErr': ['Connexion impossible. Vérifie ton réseau et réessaie.', 'Can’t connect. Check your network and try again.'],
  'fg.title': ['Mot de passe oublié', 'Forgot password'],
  'fg.sent': ['Si un compte existe avec cette adresse, un lien de réinitialisation vient d’être envoyé. Pense à regarder tes courriers indésirables. Le lien est valable peu de temps.', 'If an account exists for this address, a reset link has just been sent. Check your spam folder. The link is valid for a short time.'],
  'fg.backLogin': ['Retour à la connexion', 'Back to log in'],
  'fg.intro': ['Entre l’email de ton compte. Nous t’envoyons un lien pour choisir un nouveau mot de passe.', 'Enter your account email. We’ll send you a link to choose a new password.'],
  'fg.sending': ['Envoi…', 'Sending…'],
  'fg.send': ['Envoyer le lien', 'Send the link'],
  'np.title': ['Nouveau mot de passe', 'New password'],
  'np.hint': ['8 caractères minimum, avec au moins une lettre et un chiffre. Note-le dans un endroit sûr.', 'At least 8 characters, with at least one letter and one number. Keep it somewhere safe.'],
  'np.show': ['Afficher le mot de passe', 'Show password'],
  'np.err': ['Le lien a expiré ou le mot de passe est refusé. Refais une demande depuis « Mot de passe oublié ».', 'The link has expired or the password was refused. Request a new one from “Forgot password”.'],
  'ce.title': ['Vérifie ton email', 'Check your email'],
  'ce.t1': ['Nous avons envoyé un lien de confirmation à ', 'We sent a confirmation link to '],
  'ce.t2': ['. Ouvre-le pour continuer.', '. Open it to continue.'],
  'ce.addr': ['ton adresse', 'your address'],
  'ce.spam': ['Pense à regarder tes courriers indésirables.', 'Check your spam folder too.'],

  // Téléphone
  'ph.soonT': ['Bientôt chez toi', 'Coming to you soon'],
  'ph.soonP': ['Nous ouvrons pays par pays. Nous gardons ton email et te prévenons dès l’ouverture chez toi.', 'We’re opening country by country. We’ll keep your email and let you know as soon as we open where you live.'],
  'ph.title': ['Ton numéro de téléphone', 'Your phone number'],
  'ph.intro': ['Un numéro ne peut servir qu’à un seul compte. Il nous permet de te contacter si besoin. Aucun SMS ne t’est envoyé.', 'A number can only be used for one account. It lets us reach you if needed. No SMS is sent to you.'],
  'ph.country': ['Ton pays', 'Your country'],
  'ph.number': ['Numéro de téléphone', 'Phone number'],
  'ph.private': ['Ton numéro reste privé : il n’apparaît jamais sur ton profil.', 'Your number stays private: it never appears on your profile.'],
  'ph.closed': ['Love Infinity n’est pas encore ouvert dans ce pays. Nous gardons ton email et te prévenons dès l’ouverture chez toi.', 'Love Infinity isn’t open in this country yet. We’ll keep your email and let you know as soon as we open where you live.'],
  'ph.save': ['Enregistrer mon numéro', 'Save my number'],

  // Profil (onboarding)
  'pf.t1': ['Présente-toi', 'Introduce yourself'],
  'pf.t2': ['À propos de toi', 'About you'],
  'pf.t3': ['Ton style de vie', 'Your lifestyle'],
  'pf.step': ['Profil · {n}/3', 'Profile · {n}/3'],
  'pf.privNote': ['Les informations privées sont indiquées sous chaque champ.', 'Private details are noted under each field.'],
  'pf.first': ['Prénom', 'First name'],
  'pf.last': ['Nom', 'Last name'],
  'pf.nameHint': ['Seul ton prénom est affiché. Ton nom reste privé : il sert à vérifier ton identité.', 'Only your first name is shown. Your last name stays private: it’s used to verify your identity.'],
  'pf.birth': ['Date de naissance', 'Date of birth'],
  'pf.city': ['Ville', 'City'],
  'pf.ageHint': ['18 ans minimum. Seul ton âge est affiché.', '18 or older. Only your age is shown.'],
  'pf.iam': ['Je suis', 'I am'],
  'pf.meet': ['Je veux rencontrer', 'I want to meet'],
  'pf.photosHint': ['Les photos arrivent à l’étape de vérification.', 'Photos come at the verification step.'],
  'pf.word': ['Un mot sur toi', 'A few words about you'],
  'pf.wordPh': ['Passionnée de cuisine et de voyages. Je cherche quelqu’un de sincère…', 'Into cooking and travel. Looking for someone sincere…'],
  'pf.choose': ['Choisir', 'Choose'],
  'pf.intentHint': ['Une seule intention, que tu pourras modifier.', 'One intention only, which you can change later.'],
  'pf.relHint': ['Visible sur ton profil uniquement si tu le choisis.', 'Shown on your profile only if you choose to.'],

  // Compte suspendu
  'cs.title': ['Compte indisponible', 'Account unavailable'],
  'cs.text': ['Le compte {email} est suspendu ou fermé après un contrôle de notre équipe. Pour demander un réexamen, écris-nous à l’adresse indiquée sur la page de contact.', 'The account {email} is suspended or closed following a review by our team. To request a new review, write to us at the address shown on the contact page.'],

  // Abonnement
  'ab.title': ['Abonnement', 'Subscription'],
  'ab.ok': ['Merci ! Ton paiement est en cours de confirmation. Ton abonnement s’active en quelques secondes.', 'Thank you! Your payment is being confirmed. Your subscription activates within seconds.'],
  'ab.fail': ['Le paiement n’a pas abouti. Aucun montant n’est débité en cas d’échec. Tu peux réessayer.', 'The payment didn’t go through. Nothing is charged if it fails. You can try again.'],
  'ab.active': ['Abonnement {plan} actif jusqu’au {date}. Renouveler ajoute 30 jours à cette date.', '{plan} subscription active until {date}. Renewing adds 30 days to that date.'],
  'ab.methods': ['Paiement par Wave, Orange Money, MTN, Moov ou carte. Pas de pièces qui expirent.', 'Pay with Wave, Orange Money, MTN, Moov or card. No coins that expire.'],
  'ab.for': ['pour {n} jours', 'for {n} days'],
  'ab.renew': ['Renouveler', 'Renew'],
  'ab.choose': ['Choisir {plan}', 'Choose {plan}'],
  'ab.redirect': ['Redirection…', 'Redirecting…'],

  // Aperçu avant validation
  'ap.title': ['Aperçu', 'Preview'],
  'ap.noteT': ['Aperçu avant validation', 'Preview before approval'],
  'ap.noteP': ['Voici {n} profil(s) du jour. Tu pourras liker et écrire dès que tes photos seront validées. Ton profil n’est visible de personne en attendant.', 'Here are {n} profile(s) of the day. You’ll be able to like and write as soon as your photos are approved. Nobody can see your profile meanwhile.'],
  'ap.none': ['Pas encore de profil à te montrer. Reviens bientôt.', 'No profile to show you yet. Come back soon.'],
  'ap.back': ['Retour à mon dossier', 'Back to my file'],
};

export type T = ((key: string, vars?: Record<string, string | number>) => string) & {
  lang: Lang;
  /** Pluriel : `key.1` pour un, `key.n` sinon. */
  n: (key: string, n: number, vars?: Record<string, string | number>) => string;
  /** Valeur de profil (intention, intérêt, langue…) : traduite si connue, sinon telle quelle. */
  v: (value: string) => string;
  /** Formate une date selon la langue. */
  date: (d: string | Date, opts?: Intl.DateTimeFormatOptions) => string;
  time: (d: string | Date) => string;
};

export function makeT(lang: Lang): T {
  const i = lang === 'en' ? 1 : 0;
  const loc = lang === 'en' ? 'en-GB' : 'fr-FR';
  const base = (key: string, vars?: Record<string, string | number>) => {
    let s = D[key]?.[i] ?? D[key]?.[0] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
    return s;
  };
  const t = base as T;
  t.lang = lang;
  t.n = (key, n, vars) => base(`${key}.${(lang === 'en' ? n === 1 : n < 2) ? '1' : 'n'}`, { n, ...vars });
  t.v = (value) => D[`v.${value}`]?.[i] ?? value;
  t.date = (d, opts) => new Date(d).toLocaleDateString(loc, opts ?? { day: 'numeric', month: 'long' });
  t.time = (d) => new Date(d).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
  return t;
}

/** Sous-ensemble du dictionnaire envoyé au navigateur (même contenu que D : environ 20 Ko). */
export const COOKIE_LANG = 'li_lang';

D['ab.adv.e1'] = ['Likes illimités', 'Unlimited likes'];
D['ab.adv.e2'] = ['Messages avec tous tes matchs', 'Messages with all your matches'];
D['ab.adv.p1'] = ['Tout Essentiel', 'Everything in Essential'];
D['ab.adv.p2'] = ['Profil mis en avant', 'Boosted profile'];
D['ab.adv.p3'] = ['Voir qui t’a liké', 'See who liked you'];
D['ab.heroT'] = ['Choisis comment tu veux être vu', 'Choose how you want to be seen'];
D['ab.heroP'] = ['Des profils vérifiés pour tout le monde. Les offres te donnent plus de visibilité, plus de likes et des outils pour te démarquer.', 'Verified profiles for everyone. Plans give you more visibility, more likes and tools to stand out.'];
D['ab.free'] = ['Inclus', 'Included'];
D['ab.current'] = ['Ton offre actuelle', 'Your current plan'];

// Questions signature et thèmes
export const QUESTIONS = ['dimanche', 'rire', 'simple', 'voyage', 'plat', 'qualite', 'fierte', 'rdv'] as const;
export const THEMES = ['classique', 'nuit', 'or', 'soleil', 'lagune', 'kente', 'bogolan', 'wax', 'gentleman'] as const;
D['q.dimanche'] = ['Mon dimanche idéal…', 'My ideal Sunday…'];
D['q.rire'] = ['Ce qui me fait rire…', 'What makes me laugh…'];
D['q.simple'] = ['Une chose simple qui me rend heureux(se)…', 'A simple thing that makes me happy…'];
D['q.voyage'] = ['Mon prochain voyage…', 'My next trip…'];
D['q.plat'] = ['Mon plat préféré…', 'My favourite dish…'];
D['q.qualite'] = ['Ce que j’apprécie chez quelqu’un…', 'What I value in someone…'];
D['q.fierte'] = ['Ce dont je suis fier(e)…', 'Something I’m proud of…'];
D['q.rdv'] = ['Mon premier rendez-vous idéal…', 'My ideal first date…'];
D['th.classique'] = ['Classique', 'Classic'];
D['th.nuit'] = ['Nuit d’Abidjan', 'Abidjan Night'];
D['th.or'] = ['Or royal', 'Royal gold'];
D['th.soleil'] = ['Soleil', 'Sunshine'];
D['th.lagune'] = ['Lagune', 'Lagoon'];
D['sty.title'] = ['Mon style', 'My style'];
D['sty.prompts'] = ['Questions signature', 'Signature questions'];
D['sty.promptsP'] = ['Réponds à jusqu’à 3 questions : ce sont de vrais sujets pour démarrer la conversation.', 'Answer up to 3 questions: they give people a real way to start a conversation.'];
D['sty.add'] = ['Ajouter une question', 'Add a question'];
D['sty.pick'] = ['Choisir une question', 'Choose a question'];
D['sty.answer'] = ['Ta réponse', 'Your answer'];
D['sty.remove'] = ['Retirer', 'Remove'];
D['sty.theme'] = ['Thème de profil', 'Profile theme'];
D['sty.themeP'] = ['Choisis l’ambiance de ta fiche. Les thèmes sont réservés à Premium.', 'Choose the mood of your profile. Themes are for Premium members.'];
D['sty.locked'] = ['Premium', 'Premium'];
D['sty.unlock'] = ['Débloquer les thèmes avec Premium', 'Unlock themes with Premium'];
D['sty.err'] = ['Enregistrement impossible. Réessaie.', 'Couldn’t save. Try again.'];
D['sty.errPremium'] = ['Ce thème demande un abonnement Premium actif.', 'This theme needs an active Premium subscription.'];
D['fiche.prompts'] = ['Questions', 'Questions'];
// Stories
D['st.title'] = ['Stories', 'Stories'];
D['st.add'] = ['Ma story', 'Your story'];
D['st.addP'] = ['Ajouter', 'Add'];
D['st.close'] = ['Fermer', 'Close'];
D['st.del'] = ['Supprimer', 'Delete'];
D['st.err'] = ['Envoi impossible. Réessaie.', 'Couldn’t upload. Try again.'];
D['st.limit'] = ['Limite de stories atteinte pour ton offre. Passe à une offre supérieure ou attends l’expiration.', 'Story limit reached for your plan. Upgrade or wait for one to expire.'];
D['st.sending'] = ['Envoi…', 'Uploading…'];
D['st.hint'] = ['Disparaît après 24 h', 'Disappears after 24 h'];
D['st.empty'] = ['Aucune story pour le moment. Publie la première !', 'No stories yet. Post the first one!'];
D['st.views'] = ['Vues', 'Views'];
D['st.viewsN.1'] = ['{n} vue', '{n} view'];
D['st.viewsN.n'] = ['{n} vues', '{n} views'];
D['st.seenBy'] = ['Vu par', 'Seen by'];
D['st.premiumSee'] = ['Découvre qui a vu ta story avec Premium', 'See who viewed your story with Premium'];
D['st.noViews'] = ['Pas encore de vue.', 'No views yet.'];
D['st.errBig'] = ['Vidéo trop lourde (12 Mo maximum).', 'Video too large (12 MB max).'];
D['st.errLong'] = ['Vidéo trop longue (10 secondes maximum).', 'Video too long (10 seconds max).'];
D['st.soundOn'] = ['Activer le son', 'Turn sound on'];
D['st.soundOff'] = ['Couper le son', 'Turn sound off'];
D['st.text'] = ['Story texte', 'Text story'];
D['st.textPh'] = ['Écris quelque chose…', 'Write something…'];
D['st.bg'] = ['Fond', 'Background'];
D['st.publish'] = ['Publier', 'Post'];
D['st.errContact'] = ['Pas de numéro, lien ou identifiant dans une story.', 'No phone number, link or handle in a story.'];
D['th.kente'] = ['Kente', 'Kente'];
D['th.bogolan'] = ['Bogolan', 'Bogolan'];
D['th.wax'] = ['Wax', 'Wax'];
D['th.gentleman'] = ['Gentleman', 'Gentleman'];
D['badge.premium'] = ['Premium', 'Premium'];
D['me.styleT'] = ['Mon style', 'My style'];
D['me.styleOn'] = ['Tu es Premium : choisis un thème et réponds aux questions signature pour te démarquer.', 'You’re Premium: pick a theme and answer the signature questions to stand out.'];
D['me.styleOff'] = ['Thèmes africains, motifs Kente, Wax, Gentleman… Débloque-les avec Premium.', 'African themes, Kente, Wax and Gentleman patterns… Unlock them with Premium.'];
D['me.styleCta'] = ['Personnaliser mon profil', 'Customise my profile'];
D['me.styleCtaOff'] = ['Voir les thèmes', 'See the themes'];
D['st.like'] = ['Liker {name}', 'Like {name}'];
D['st.liked'] = ['Liké', 'Liked'];
D['st.match'] = ['C’est un match avec {name} !', 'It’s a match with {name}!'];
D['st.see'] = ['Voir', 'See'];
// Vérification
D['vf.lvl1'] = ['Photos', 'Photos'];
D['vf.lvl1t'] = ['Nos équipes vérifient que tes photos sont réelles et nettes.', 'Our team checks that your photos are real and clear.'];
D['vf.lvl2'] = ['Selfie vidéo', 'Video selfie'];
D['vf.lvl2t'] = ['Une courte vidéo avec un geste au hasard prouve que c’est bien toi.', 'A short video with a random gesture proves it’s really you.'];
D['vf.lvl3'] = ['Pièce d’identité', 'ID document'];
D['vf.lvl3t'] = ['Recto et verso de ta pièce. Supprimée dès la décision.', 'Front and back of your ID. Deleted as soon as we decide.'];
D['vf.n.photos'] = ['tes photos', 'your photos'];
D['vf.n.selfie'] = ['ton selfie vidéo', 'your video selfie'];
D['vf.n.document'] = ['ta pièce d’identité', 'your ID document'];
D['vf.d.none'] = ['sous 24 heures', 'within 24 hours'];
D['vf.d.lt1'] = ['moins d’une heure', 'less than an hour'];
D['vf.d.h'] = ['environ {n} h', 'about {n} h'];
D['vf.d.d'] = ['environ {n} jours', 'about {n} days'];
D['vf.s1'] = ['Ajouter au moins 3 photos', 'Add at least 3 photos'];
D['vf.s2'] = ['Écrire une présentation d’au moins 40 caractères', 'Write an intro of at least 40 characters'];
D['vf.s3'] = ['Indiquer ta profession', 'Add your job'];
D['vf.s4'] = ['Dire ce que tu recherches', 'Say what you’re looking for'];
D['vf.s5'] = ['Choisir au moins 3 centres d’intérêt', 'Pick at least 3 interests'];
D['vf.okT'] = ['Ton profil est validé', 'Your profile is approved'];
D['vf.okP'] = ['Bienvenue ! Tu peux découvrir des profils dès maintenant.', 'Welcome! You can start discovering profiles now.'];
D['vf.discover'] = ['Découvrir des profils', 'Discover profiles'];
D['vf.reviewT'] = ['Ton dossier est en cours d’examen', 'Your file is being reviewed'];
D['vf.r1'] = ['Dossier reçu', 'File received'];
D['vf.r1p'] = ['Nous avons bien reçu {x}.', 'We’ve received {x}.'];
D['vf.r2'] = ['Examen par notre équipe', 'Review by our team'];
D['vf.r2q'] = ['Tu es n° {n} sur {total} dans la file.', 'You’re number {n} of {total} in the queue.'];
D['vf.r2n'] = ['Ton dossier est le prochain à être examiné.', 'Your file is next in line.'];
D['vf.r3'] = ['Décision', 'Decision'];
D['vf.r3p'] = ['Cette page se met à jour toute seule dès que c’est décidé.', 'This page updates by itself as soon as we decide.'];
D['vf.delay'] = ['Délai habituel : {d}.', 'Usual delay: {d}.'];
D['vf.delayP'] = ['Tu peux fermer cette page : le statut sera à jour à ton retour.', 'You can close this page: the status will be up to date when you’re back.'];
D['vf.preview'] = ['Voir un aperçu des profils', 'Preview profiles'];
D['vf.waitT'] = ['Profite de l’attente', 'Make the most of the wait'];
D['vf.waitP'] = ['Un profil complet reçoit plus de likes. Termine-le pendant que nous vérifions.', 'A complete profile gets more likes. Finish it while we check.'];
D['vf.levels'] = ['Tes niveaux de vérification', 'Your verification levels'];
D['vf.verify'] = ['Vérifie ton profil', 'Verify your profile'];
D['vf.sub'] = ['Chaque niveau rassure les autres membres. Tu peux t’arrêter au niveau 1 pour commencer.', 'Each level reassures other members. You can stop at level 1 to get started.'];
D['vf.pending'] = ['En cours de vérification.', 'Being checked.'];
D['vf.rejected'] = ['Refusé : {r}. Tu peux réessayer.', 'Declined: {r}. You can try again.'];
D['vf.noReason'] = ['raison non précisée', 'no reason given'];
D['vf.approved'] = ['Validé', 'Approved'];
D['vf.retry'] = ['Réessayer', 'Try again'];
D['vf.start'] = ['Commencer', 'Start'];
D['vf.footer'] = ['Ton compte sera activé dès que tes photos seront validées.', 'Your account will be activated as soon as your photos are approved.'];
// photos
D['vf.ph.t'] = ['Tes photos', 'Your photos'];
D['vf.ph.sub'] = ['2 minimum, 6 maximum. Visage visible, sans lunettes de soleil. Elles seront comparées à ta vidéo.', '2 minimum, 6 maximum. Face visible, no sunglasses. They’ll be compared with your video.'];
D['vf.ph.big'] = ['Une photo dépasse 8 Mo.', 'A photo is over 8 MB.'];
D['vf.ph.min'] = ['Ajoute au moins 2 photos.', 'Add at least 2 photos.'];
D['vf.ph.change'] = ['Changer les photos', 'Change photos'];
D['vf.ph.choose'] = ['Choisir mes photos', 'Choose my photos'];
D['vf.ph.send'] = ['Envoyer pour vérification', 'Send for review'];
D['vf.sending'] = ['Envoi…', 'Sending…'];
D['vf.sendErr'] = ['Envoi impossible. Réessaie.', 'Couldn’t send. Try again.'];
D['vf.tooMany'] = ['Trop d’essais aujourd’hui. Réessaie demain.', 'Too many attempts today. Try again tomorrow.'];
// selfie
D['vf.sf.t'] = ['Selfie vidéo', 'Video selfie'];
D['vf.sf.perm'] = ['Autorise la caméra et le micro pour continuer.', 'Allow the camera and microphone to continue.'];
D['vf.sf.busy'] = ['Une vérification est déjà en cours ou impossible pour le moment.', 'A check is already in progress or isn’t possible right now.'];
D['vf.sf.big'] = ['Vidéo trop lourde. Réessaie.', 'Video too large. Try again.'];
D['vf.sf.rec'] = ['Enregistrement… 8 secondes', 'Recording… 8 seconds'];
D['vf.sf.intro'] = ['Place ton visage dans l’ovale. Nous te demanderons un geste choisi au hasard, pour prouver que c’est bien toi. La vidéo est supprimée après la décision.', 'Place your face in the oval. We’ll ask for a random gesture to prove it’s really you. The video is deleted after the decision.'];
D['vf.sf.cam'] = ['Activer la caméra', 'Turn on camera'];
D['vf.sf.go'] = ['Je fais le geste, j’enregistre', 'I do the gesture and record'];
D['vf.sf.stop'] = ['Terminer', 'Finish'];
D['vf.sf.sending'] = ['Envoi en cours…', 'Sending…'];
// gestes (stockés en français par la base)
D['v.Tourne lentement la tête vers la droite'] = ['Tourne lentement la tête vers la droite', 'Slowly turn your head to the right'];
D['v.Tourne lentement la tête vers la gauche'] = ['Tourne lentement la tête vers la gauche', 'Slowly turn your head to the left'];
D['v.Cligne deux fois des yeux'] = ['Cligne deux fois des yeux', 'Blink twice'];
D['v.Souris, puis lève la main droite'] = ['Souris, puis lève la main droite', 'Smile, then raise your right hand'];
D['v.Touche ton oreille gauche avec ta main droite'] = ['Touche ton oreille gauche avec ta main droite', 'Touch your left ear with your right hand'];
D['v.Dis ton prénom à voix haute'] = ['Dis ton prénom à voix haute', 'Say your first name out loud'];
// motifs de refus (affichés au membre)
D['v.Visage différent des photos'] = ['Visage différent des photos', 'Face doesn’t match the photos'];
D['v.Photo floue ou trop sombre'] = ['Photo floue ou trop sombre', 'Photo blurry or too dark'];
D['v.Geste demandé non réalisé'] = ['Geste demandé non réalisé', 'Requested gesture not performed'];
D['v.Verso manquant'] = ['Verso manquant', 'Back side missing'];
D['v.Document illisible ou expiré'] = ['Document illisible ou expiré', 'Document unreadable or expired'];
D['v.Visage non visible'] = ['Visage non visible', 'Face not visible'];
D['v.Contenu inapproprié'] = ['Contenu inapproprié', 'Inappropriate content'];
D['v.Photo qui n’est pas la tienne'] = ['Photo qui n’est pas la tienne', 'Photo isn’t yours'];
D['v.Vidéo floue ou trop sombre'] = ['Vidéo floue ou trop sombre', 'Video blurry or too dark'];
D['v.Nom ou âge différent du profil'] = ['Nom ou âge différent du profil', 'Name or age doesn’t match the profile'];
D['v.Autre'] = ['Autre', 'Other'];
// document
D['vf.dc.t'] = ['Pièce d’identité', 'ID document'];
D['vf.dc.type'] = ['Type de document', 'Document type'];
D['vf.dc.national_id'] = ['Carte nationale d’identité', 'National ID card'];
D['vf.dc.driver_license'] = ['Permis de conduire', 'Driving licence'];
D['vf.dc.passport'] = ['Passeport', 'Passport'];
D['vf.dc.rectoCard'] = ['Recto, côté photo', 'Front, photo side'];
D['vf.dc.rectoPass'] = ['Page photo du passeport', 'Passport photo page'];
D['vf.dc.verso'] = ['Verso', 'Back'];
D['vf.dc.tap'] = ['Touche pour photographier', 'Tap to take a photo'];
D['vf.dc.big'] = ['Une image dépasse 8 Mo.', 'An image is over 8 MB.'];
D['vf.dc.busy'] = ['Une vérification est déjà en cours.', 'A check is already in progress.'];
D['vf.dc.legible'] = ['Toutes les informations doivent être lisibles. Ton nom doit être identique à celui de ton profil.', 'All details must be readable. Your name must match your profile.'];
D['vf.dc.consent'] = ['J’accepte que ma pièce soit consultée uniquement pour confirmer mon identité, puis supprimée dès la décision.', 'I agree my document is viewed only to confirm my identity, then deleted as soon as a decision is made.'];
D['vf.dc.send'] = ['Envoyer', 'Send'];
// Messages d'erreur des API
D['err.login'] = ['Connecte-toi pour continuer.', 'Sign in to continue.'];
D['err.badreq'] = ['Requête invalide.', 'Invalid request.'];
D['err.likes'] = ['Tu as utilisé tes 5 likes du jour. Reviens demain ou passe à un abonnement.', 'You’ve used your 5 likes for today. Come back tomorrow or upgrade.'];
D['err.verifmsg'] = ['Vérifie ton selfie vidéo pour pouvoir écrire un message.', 'Verify your video selfie to be able to message.'];
D['err.inactive'] = ['Ton compte n’est pas encore activé.', 'Your account isn’t activated yet.'];
D['err.gone'] = ['Ce profil n’est plus disponible.', 'This profile is no longer available.'];
D['err.step'] = ['Étape inconnue.', 'Unknown step.'];
D['err.fields'] = ['Vérifie les champs du formulaire.', 'Check the form fields.'];
D['err.save'] = ['Enregistrement impossible. Réessaie.', 'Couldn’t save. Try again.'];
D['err.plan'] = ['Offre introuvable.', 'Plan not found.'];
D['err.pay'] = ['Paiement indisponible. Réessaie.', 'Payment unavailable. Try again.'];
D['err.payDown'] = ['Le service de paiement ne répond pas. Réessaie dans un instant.', 'The payment service isn’t responding. Try again in a moment.'];
D['err.signupFields'] = ['Vérifie ton email, ton mot de passe et les conditions.', 'Check your email, password and the terms.'];
D['err.fast'] = ['Un instant, puis réessaie.', 'One moment, then try again.'];
D['err.tooMany'] = ['Trop d’essais. Réessaie dans une heure.', 'Too many attempts. Try again in an hour.'];
D['err.pwd'] = ['Mot de passe : 8 caractères minimum, avec une lettre et un chiffre.', 'Password: at least 8 characters, with a letter and a number.'];
D['err.email'] = ['Cette adresse email ne peut pas être utilisée. Essaie-en une autre.', 'This email address can’t be used. Try another one.'];
D['err.captcha'] = ['Vérification anti-robot échouée. Réessaie.', 'Anti-bot check failed. Try again.'];
D['err.signup'] = ['Inscription impossible pour le moment. Réessaie.', 'Sign-up isn’t possible right now. Try again.'];
D['err.confirm'] = ['Confirme d’abord ton email.', 'Confirm your email first.'];
D['err.phone'] = ['Numéro invalide.', 'Invalid number.'];
D['err.phoneCountry'] = ['Ce numéro n’est pas valide pour ce pays.', 'This number isn’t valid for this country.'];
D['err.phoneBlocked'] = ['Ce numéro ne peut pas être utilisé.', 'This number can’t be used.'];
D['err.phoneUsed'] = ['Ce numéro est déjà utilisé. Connecte-toi ou réinitialise ton mot de passe.', 'This number is already in use. Sign in or reset your password.'];
D['nf.t'] = ['Cette page n’existe pas', 'This page doesn’t exist'];
D['nf.p'] = ['Le lien est peut-être incorrect, ou la page a été déplacée.', 'The link may be wrong, or the page has moved.'];
D['nf.home'] = ['Retour à l’accueil', 'Back to home'];
D['nf.app'] = ['Découvrir des profils', 'Discover profiles'];
// Gestion des matchs et pause
D['chat.unmatch'] = ['Défaire le match avec {name}', 'Unmatch from {name}'];
D['chat.unmatchAsk'] = ['Les messages seront supprimés pour vous deux. Confirmer ?', 'Messages will be deleted for both of you. Confirm?'];
D['chat.unmatchYes'] = ['Oui, défaire le match', 'Yes, unmatch'];
D['chat.unmatched'] = ['Le match avec {name} a été défait.', 'You unmatched from {name}.'];
D['set.pauseT'] = ['Mettre mon profil en pause', 'Pause my profile'];
D['set.pauseP'] = ['Tu n’apparais plus dans Découvrir, les Likes et les Stories. Tes matchs et conversations restent actifs.', 'You no longer appear in Discover, Likes and Stories. Your matches and chats stay active.'];
D['set.pauseOn'] = ['Profil en pause', 'Profile paused'];
D['set.pauseOff'] = ['Profil visible', 'Profile visible'];
D['set.pauseBtnOn'] = ['Remettre mon profil en ligne', 'Put my profile back online'];
D['set.pauseBtnOff'] = ['Mettre en pause', 'Pause'];
D['set.blockedT'] = ['Personnes bloquées', 'Blocked people'];
D['set.blockedP'] = ['Gère les profils que tu as bloqués.', 'Manage the profiles you’ve blocked.'];
D['set.blockedOpen'] = ['Voir la liste', 'View list'];
D['blk.empty'] = ['Tu n’as bloqué personne.', 'You haven’t blocked anyone.'];
D['blk.unblock'] = ['Débloquer', 'Unblock'];
D['blk.done'] = ['Débloqué', 'Unblocked'];
D['blk.note'] = ['Débloquer ne recrée pas de match : la personne pourra de nouveau apparaître dans Découvrir.', 'Unblocking doesn’t restore a match: the person may appear in Discover again.'];
