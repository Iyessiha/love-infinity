import type { ReactNode } from 'react';
import { tr, type Lang } from '@/lib/i18n';
import { Check } from '@/components/Icons';
import '@/app/offres.css';

export type PlanPrix = { code: 'essentiel' | 'premium'; prix: number; jours: number };
type Ligne = { fr: string; en: string; gratuit: boolean | string; essentiel: boolean | string; premium: boolean | string; bientot?: boolean };

const LIGNES: Ligne[] = [
  { fr: 'Profils 100 % vérifiés', en: '100% verified profiles', gratuit: true, essentiel: true, premium: true },
  { fr: 'Likes par jour', en: 'Likes per day', gratuit: '5', essentiel: '∞', premium: '∞' },
  { fr: 'Message d’intro avec ton like', en: 'Intro message with your like', gratuit: true, essentiel: true, premium: true },
  { fr: 'Voir qui t’a liké', en: 'See who liked you', gratuit: false, essentiel: false, premium: true },
  { fr: 'Boost : en tête de la découverte', en: 'Boost: top of discovery', gratuit: false, essentiel: false, premium: true, bientot: true },
  { fr: 'Thèmes de profil exclusifs', en: 'Exclusive profile themes', gratuit: false, essentiel: false, premium: true, bientot: true },
  { fr: 'Stories de 24 h', en: '24-hour Stories', gratuit: '1', essentiel: '3', premium: '10', bientot: true },
  { fr: 'Qui a vu mes stories', en: 'Who viewed my stories', gratuit: false, essentiel: false, premium: true, bientot: true },
];

const PLANS = {
  gratuit: { fr: 'Gratuit', en: 'Free', accroche: { fr: 'Pour découvrir', en: 'To get started' }, points: [{ fr: '5 likes par jour', en: '5 likes per day' }, { fr: 'Tous les profils vérifiés', en: 'All verified profiles' }, { fr: 'Tes matchs et messages', en: 'Your matches and messages' }] },
  essentiel: { fr: 'Essentiel', en: 'Essential', accroche: { fr: 'Pour matcher sans limite', en: 'To match without limits' }, points: [{ fr: 'Likes illimités', en: 'Unlimited likes' }, { fr: '3 stories de 24 h', en: '3 stories of 24 h' }, { fr: 'Tout le plan Gratuit', en: 'Everything in Free' }] },
  premium: { fr: 'Premium', en: 'Premium', accroche: { fr: 'Pour te démarquer', en: 'To stand out' }, points: [{ fr: 'Voir qui t’a liké', en: 'See who liked you' }, { fr: 'Boost chaque semaine', en: 'Weekly boost' }, { fr: 'Thèmes de profil exclusifs', en: 'Exclusive profile themes' }, { fr: 'Tout Essentiel', en: 'Everything in Essential' }] },
} as const;

/** Offres Gratuit / Essentiel / Premium + tableau comparatif. `cta` fournit le bouton de chaque offre. */
export function Offres({ lang, plans, cta, actif }: { lang: Lang; plans: PlanPrix[]; cta: (code: 'gratuit' | 'essentiel' | 'premium') => ReactNode; actif?: 'essentiel' | 'premium' | null }) {
  const t = tr(lang);
  const loc = lang === 'en' ? 'en-GB' : 'fr-FR';
  const prix = (code: 'essentiel' | 'premium') => plans.find((p) => p.code === code)?.prix;
  const cellule = (v: boolean | string) => (v === true ? <Check size={18} /> : v === false ? <span className="of-non" aria-label={t('Non inclus', 'Not included')}>–</span> : <b>{v}</b>);

  return (
    <div className="of">
      <div className="of-cartes">
        {(['gratuit', 'essentiel', 'premium'] as const).map((code) => {
          const p = PLANS[code];
          const montant = code === 'gratuit' ? 0 : prix(code);
          return (
            <section key={code} className={`of-carte ${code}`}>
              {code === 'premium' && <span className="of-ruban">{t('Le plus choisi', 'Most popular')}</span>}
              {actif === code && <span className="of-ruban actif">{t('Ton offre', 'Your plan')}</span>}
              <h3>{p[lang]}</h3>
              <p className="of-accroche">{p.accroche[lang]}</p>
              <div className="of-prix"><b>{montant === undefined ? '…' : montant.toLocaleString(loc)}</b><span>FCFA{code !== 'gratuit' && <> / {t('30 jours', '30 days')}</>}</span></div>
              <ul>{p.points.map((x) => <li key={x.fr}><Check size={16} />{x[lang]}</li>)}</ul>
              {cta(code)}
            </section>
          );
        })}
      </div>

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
      <p className="of-note">{t('Pas de renouvellement automatique : tu paies 30 jours, tu choisis de continuer. Les jours restants sont conservés si tu renouvelles avant la fin.', 'No automatic renewal: you pay for 30 days and choose whether to continue. Remaining days are kept if you renew before the end.')}</p>
    </div>
  );
}
