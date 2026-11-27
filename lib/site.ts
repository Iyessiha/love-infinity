import type { Lang } from '@/lib/i18n';

export const SITE = {
  nom: 'Love Infinity',
  editeur: 'MonWe Infinity LLC',
  // À confirmer : adresse de contact publique pour les demandes de données et d'assistance.
  contact: 'monweci@gmail.com',
  maj: { fr: '27 novembre 2026', en: 'November 27, 2026' },
};

type QR = { q: string; r: string };
export const FAQ: Record<Lang, { groupe: string; items: QR[] }[]> = {
  fr: [
    { groupe: 'Vérification', items: [
      { q: 'Pourquoi me demander mon identité ?', r: 'Pour que chaque personne que tu croises soit réelle. Le niveau 1 (photos) suffit pour entrer, le selfie vidéo débloque les messages, la pièce d’identité te donne le badge le plus fort.' },
      { q: 'Que deviennent ma vidéo et ma pièce d’identité ?', r: 'Elles sont lues par notre équipe, puis supprimées dès la décision. Seules tes photos de profil sont conservées.' },
      { q: 'Je n’ai pas de carte d’identité.', r: 'Le passeport et le permis de conduire sont acceptés. Pour une carte ou un permis, nous demandons le recto et le verso.' },
      { q: 'Ma vérification a été refusée. Que faire ?', r: 'Tu vois la raison du refus et tu peux refaire une demande, jusqu’à 3 par jour pour chaque type de vérification.' },
    ] },
    { groupe: 'Ma vie privée', items: [
      { q: 'Mon nom de famille est-il visible ?', r: 'Non. Seuls ton prénom et ton âge sont affichés. Ton nom sert uniquement à vérifier ton identité.' },
      { q: 'Qui voit mon numéro de téléphone ?', r: 'Personne. Il n’apparaît jamais sur ton profil. Un numéro ne peut servir qu’à un seul compte, ce qui bloque les doublons et les faux profils.' },
    ] },
    { groupe: 'Mon compte', items: [
      { q: 'Quel âge faut-il avoir ?', r: 'Il faut avoir 18 ans révolus. Un compte dont le titulaire est mineur est supprimé.' },
      { q: 'Dans quels pays Love Infinity est-il disponible ?', r: 'Nous ouvrons pays par pays et ville par ville. Crée ton compte : nous te prévenons dès l’ouverture chez toi.' },
      { q: 'Dans quelles langues est le service ?', r: 'En français et en anglais. Tu peux changer de langue à tout moment.' },
      { q: 'Comment supprimer mon compte ?', r: 'Écris-nous à l’adresse de contact indiquée sur la page Confidentialité. Nous supprimons ton compte et tes données, sauf ce que la loi nous oblige à conserver.' },
    ] },
    { groupe: 'Abonnement', items: [
      { q: 'Que puis-je faire gratuitement ?', r: 'T’inscrire, te faire vérifier, découvrir des profils avec 5 likes par jour et recevoir tes matchs.' },
      { q: 'Comment je paie ?', r: 'Par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte, sur la page de paiement sécurisée de notre partenaire GeniusPay. Les moyens proposés dépendent de ton pays. Nous ne voyons jamais ton code secret ni ton numéro de carte.' },
      { q: 'L’abonnement se renouvelle-t-il tout seul ?', r: 'Non. Tu paies une période et tu choisis de renouveler. Si tu renouvelles avant la fin, les jours restants sont conservés.' },
    ] },
  ],
  en: [
    { groupe: 'Verification', items: [
      { q: 'Why do you ask for my identity?', r: 'So that everyone you meet is real. Level 1 (photos) is enough to get in, the video selfie unlocks messaging, and an ID document earns you the strongest badge.' },
      { q: 'What happens to my video and my ID?', r: 'Our team reviews them, then they are deleted as soon as a decision is made. Only your profile photos are kept.' },
      { q: 'I don’t have an ID card.', r: 'A passport or a driving licence is accepted. For a card or a licence, we ask for the front and the back.' },
      { q: 'My verification was refused. What now?', r: 'You can see the reason and submit a new request, up to 3 per day for each type of verification.' },
    ] },
    { groupe: 'My privacy', items: [
      { q: 'Is my last name visible?', r: 'No. Only your first name and age are shown. Your last name is used only to verify your identity.' },
      { q: 'Who can see my phone number?', r: 'Nobody. It never appears on your profile. A number can only be used for one account, which blocks duplicates and fake profiles.' },
    ] },
    { groupe: 'My account', items: [
      { q: 'How old do I need to be?', r: 'You must be 18 or older. An account held by a minor is deleted.' },
      { q: 'In which countries is Love Infinity available?', r: 'We open country by country and city by city. Create your account and we will let you know as soon as we open where you live.' },
      { q: 'Which languages does the service support?', r: 'French and English. You can switch language at any time.' },
      { q: 'How do I delete my account?', r: 'Write to the contact address shown on the Privacy page. We delete your account and data, except what the law requires us to keep.' },
    ] },
    { groupe: 'Subscription', items: [
      { q: 'What can I do for free?', r: 'Sign up, get verified, discover profiles with 5 likes per day and receive your matches.' },
      { q: 'How do I pay?', r: 'With Mobile Money (Wave, Orange Money, MTN, Moov) or by card, on the secure payment page of our partner GeniusPay. The options offered depend on your country. We never see your PIN or your card number.' },
      { q: 'Does the subscription renew automatically?', r: 'No. You pay for a period and choose whether to renew. If you renew before it ends, your remaining days are kept.' },
    ] },
  ],
};
