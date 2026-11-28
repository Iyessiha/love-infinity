import type { ReactNode } from 'react';
import { tr, type Lang } from '@/lib/i18n';
import { Check } from '@/components/Icons';
import { mensuelRemise, type Remises } from '@/lib/tarifs';
import '@/app/offres.css';

export type PlanPrix = { code: 'essentiel' | 'premium'; prix: number; jours: number };
type Ligne = { fr: string; en: string; gratuit: boolean | string; essentiel: boolean | string; premium: boolean | string; bientot?: boolean };

const LIGNES: Ligne[] = [
  { fr: 'Profils 100 % vérifiés', en: '100% verified profiles', gratuit: true, essentiel: true, premium: true },
  { fr: 'Likes par jour', en: 'Likes per day', gratuit: '5', essentiel: '∞', premium: '∞' },
  { fr: 'Message d’intro avec ton like', en: 'Intro message with your like', gratuit: true, essentiel: true, premium: true },
  { fr: 'Voir qui t’a liké', en: 'See who liked you', gratuit: false, essentiel: false, premium: true },
  { fr: 'Boost : en tête de la découverte (30 min / semaine)', en: 'Boost: top of discovery (30 min / week)', gratuit: false, essentiel: false, premium: true },
  { fr: 'Filtres avancés (taille, études, religion…)', en: 'Advanced filters (height, studies, religion…)', gratuit: false, essentiel: false, premium: true },
  { fr: 'Vue anonyme des stories', en: 'Anonymous story viewing', gratuit: false, essentiel: false, premium: true },
  { fr: 'Thèmes de profil (Kente, Wax, Bogolan, Gentleman…)', en: 'Profile themes (Kente, Wax, Bogolan, Gentleman…)', gratuit: false, essentiel: false, premium: true },
  { fr: 'Profil mis en avant dans la découverte', en: 'Profile shown first in discovery', gratuit: false, essentiel: false, premium: true },
  { fr: 'Badge Premium sur ton profil', en: 'Premium badge on your profile', gratuit: false, essentiel: false, premium: true },
  { fr: 'Stories de 24 h (photo, vidéo 10 s, texte)', en: '24-hour Stories (photo, 10 s video, text)', gratuit: '1', essentiel: '3', premium: '10' },
  { fr: 'Qui a vu mes stories', en: 'Who viewed my stories', gratuit: false, essentiel: false, premium: true },
];

const PLANS = {
  gratuit: { fr: 'Gratuit', en: 'Free', accroche: { fr: 'Pour découvrir', en: 'To get started' }, points: [{ fr: '5 likes par jour', en: '5 likes per day' }, { fr: 'Tous les profils vérifiés', en: 'All verified profiles' }, { fr: 'Tes matchs et messages', en: 'Your matches and messages' }] },
  essentiel: { fr: 'Essentiel', en: 'Essential', accroche: { fr: 'Pour matcher sans limite', en: 'To match without limits' }, points: [{ fr: 'Likes illimités', en: 'Unlimited likes' }, { fr: '3 stories de 24 h', en: '3 stories of 24 h' }, { fr: 'Tout le plan Gratuit', en: 'Everything in Free' }] },
  premium: { fr: 'Premium', en: 'Premium', accroche: { fr: 'Pour te démarquer', en: 'To stand out' }, points: [{ fr: 'Voir qui t’a liké', en: 'See who liked you' }, { fr: 'Boost chaque semaine', en: 'Weekly boost' }, { fr: 'Thèmes de profil exclusifs', en: 'Exclusive profile themes' }, { fr: 'Tout Essentiel', en: 'Everything in Essential' }] },
} as const;

/** Offres Gratuit / Essentiel / Premium + tableau comparatif. `cta` fournit le bouton de chaque offre. */
export function Offres({ lang, plans, cta, actif, cartes = true, remises }: { lang: Lang; plans: PlanPrix[]; cta: (code: 'gratuit' | 'essentiel' | 'premium') => ReactNode; actif?: 'essentiel' | 'premium' | null; cartes?: boolean; remises?: Remises }) {
  const t = tr(lang);
  const loc = lang === 'en' ? 'en-GB' : 'fr-FR';
  const prix = (code: 'essentiel' | 'premium') => plans.find((p) => p.code === code)?.prix;
  const cellule = (v: boolean | string) => (v === true ? <Check size={18} /> : v === false ? <span className="of-non" aria-label={t('Non inclus', 'Not included')}>–</span> : <b>{v}</b>);

  return (
    <div className="of">
      {cartes && <div className="of-cartes">
        {(['gratuit', 'essentiel', 'premium'] as const).map((code) => {
          const p = PLANS[code];
          const montant = code === 'gratuit' ? 0 : prix(code);
          return (
            <section key={code} className={`of-carte ${code}`}>
              {code === 'premium' && <span className="of-ruban">{t('Le plus choisi', 'Most popular')}</span>}
              {actif === code && <span className="of-ruban actif">{t('Ton offre', 'Your plan')}</span>}
              <h3>{p[lang]}</h3>
              <p className="of-accroche">{p.accroche[lang]}</p>
              <div className="of-prix"><b>{montant === undefined ? '…' : montant.toLocaleString(loc)}</b><span>FCFA{code !== 'gratuit' && <> / {t('mois', 'month')}</>}</span></div>
              {code !== 'gratuit' && montant !== undefined && remises && <p className="of-dures">{t('Dès', 'From')} <b>{mensuelRemise(montant, remises[12]).toLocaleString(loc)} FCFA</b> / {t('mois', 'month')} {t('avec 12 mois', 'on a 12-month plan')} <i>−{remises[12]} %</i></p>}
              <ul>{p.points.map((x) => <li key={x.fr}><Check size={16} />{x[lang]}</li>)}</ul>
              {cta(code)}
            </section>
          );
        })}
      </div>}

      <h3 className="of-titre">{t('Comparer les offres', 'Compare plans')}</h3>
      <div className="of-table" role="table" aria-label={t('Comparatif des offres', 'Plan comparison')}>
        <div className="of-tr of-th" role="row"><span role="columnheader" /><span role="columnheader">{PLANS.gratuit[lang]}</span><span role="columnheader">{PLANS.essentiel[lang]}</span><span role="columnheader" className="pr">Premium</span></div>
        {LIGNES.map((l) => (
          <div className="of-tr" role="row" key={l.fr}>
            <span role="rowheader" className="of-lib">{lang === 'en' ? l.en : l.fr}{l.bientot && <i>{t('Bientôt', 'Soon')}</i>}</span>
            <span role="cell">{cellule(l.gratuit)}</span><span role="cell">{cellule(l.essentiel)}</span><span role="cell" className="pr">{cellule(l.premium)}</span>
          </div>
        ))}
      </div>
      <p className="of-note">{t('Choisis 1, 3, 6 ou 12 mois : plus la durée est longue, moins le mois coûte cher. Pas de renouvellement automatique, et les jours restants sont conservés si tu renouvelles avant la fin.', 'Choose 1, 3, 6 or 12 months: the longer, the cheaper per month. No automatic renewal, and remaining days are kept if you renew before the end.')}</p>
    </div>
  );
}
