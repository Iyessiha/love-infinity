import Link from 'next/link';
import { Check } from '@/components/Icons';
import { SiteFooter, SiteNav } from '@/components/SiteChrome';
import { HeroVideo } from '@/components/HeroVideo';
import { MEDIA } from '@/lib/media';
import { href, tr, type Lang } from '@/lib/i18n';

export function Home({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <main className="lp">
      <header className="lp-hero">
        <HeroVideo src={MEDIA.heroVideo} poster={MEDIA.heroPoster} />
        <div className="lp-wrap lp-hero-contenu">
          <SiteNav lang={lang} path="/" />
          <div className="lp-hero-grille">
            <div>
              <h1>{t('Ici, tout le monde est vrai.', 'Here, everyone is real.')}</h1>
              <p className="lp-sous">{t('Rencontre quelqu’un qui cherche la même chose que toi, près de chez toi, sans faux profils ni mauvaises surprises.', 'Meet someone who wants the same things as you, near you, with no fake profiles and no bad surprises.')}</p>
              <div className="lp-actions">
                <Link href="/inscription" className="lp-btn or">{t('Créer mon compte gratuit', 'Create my free account')}</Link>
                <Link href={href(lang, '/comment-ca-marche')} className="lp-lien">{t('Voir comment ça marche', 'See how it works')}</Link>
              </div>
              <p className="lp-note">{t('Gratuit pour commencer. Réservé aux personnes de 18 ans et plus.', 'Free to start. For people aged 18 and over.')}</p>
            </div>
            <svg className="lp-boucles" viewBox="-75 -50 150 100" role="img" aria-label={t('Deux boucles d’infini qui se croisent sur un badge de vérification', 'Two infinity loops crossing on a verification badge')}>
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
          <span><i className="c"><Check size={13} /></i> {t('Profils vérifiés par notre équipe', 'Profiles verified by our team')}</span>
          <span><i className="c"><Check size={13} /></i> {t('Ton nom et ton numéro restent privés', 'Your name and number stay private')}</span>
          <span><i className="c"><Check size={13} /></i> {t('Mobile Money et carte', 'Mobile Money and card')}</span>
          <Link href={href(lang, '/securite')} className="lp-lien">{t('Notre vérification', 'How we verify')}</Link>
        </div>
      </div>

      <section className="lp-wrap lp-bloc" aria-labelledby="t1">
        <div>
          <h2 id="t1">{t('Des rencontres qui mènent quelque part', 'Dating that leads somewhere')}</h2>
          <p>{t('Tu dis ce que tu cherches : relation sérieuse, mariage, amitié ou simple découverte. On te présente des personnes qui cherchent la même chose, près de chez toi.', 'You say what you want: a serious relationship, marriage, friendship or simply discovery. We show you people who want the same, close to you.')}</p>
          <Link href={href(lang, '/comment-ca-marche')} className="lp-lien">{t('Comment ça marche', 'How it works')}</Link>
        </div>
        <img className="lp-visuel lp-photo-grande" src={MEDIA.photoPlage1.src} alt={t(MEDIA.photoPlage1.alt, 'A couple holding hands at the water’s edge at sunset')} loading="lazy" width={900} height={1125} />
      </section>

      <section className="lp-bloc-fond">
        <div className="lp-wrap lp-bloc inverse" aria-labelledby="t2">
          <div>
            <h2 id="t2">{t('Pas de faux profils, pas d’arnaques', 'No fake profiles, no scams')}</h2>
            <p>{t('Photos contrôlées, selfie vidéo, pièce d’identité : chaque badge sur un profil a été vérifié pour de vrai. Et si quelqu’un se comporte mal, tu le bloques en un geste.', 'Checked photos, video selfie, ID: every badge on a profile was really verified. And if someone behaves badly, you block them in one tap.')}</p>
            <Link href={href(lang, '/securite')} className="lp-lien">{t('Voir la vérification', 'See verification')}</Link>
          </div>
          <div className="lp-carte lp-visuel" aria-label={t('Exemple de profil', 'Sample profile')}>
            <div className="lp-photo">
              <span className="lp-ex">{t('Exemple', 'Example')}</span>
              <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="78" r="38" fill="#FBF6EE" opacity=".85" /><path d="M20 200c0-46 36-74 80-74s80 28 80 74z" fill="#FBF6EE" opacity=".85" /></svg>
            </div>
            <div className="lp-carte-corps">
              <b>Aïcha, 27</b>
              <span style={{ color: '#5E4A53', fontSize: 14 }}>{t('Relation sérieuse', 'Serious relationship')}</span>
              <div className="lp-pastilles">
                <span className="lp-pastille"><Check size={13} /> {t('Photos', 'Photos')}</span>
                <span className="lp-pastille"><Check size={13} /> {t('Selfie', 'Selfie')}</span>
                <span className="lp-pastille"><Check size={13} /> {t('Identité', 'Identity')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-wrap lp-bloc" aria-labelledby="t3">
        <div>
          <h2 id="t3">{t('Pensé pour ton quotidien, payé comme chez toi', 'Built for your daily life, paid the way you do')}</h2>
          <p>{t('Mobile Money ou carte, dans la monnaie de ton pays. Pas de pièces qui expirent, pas de renouvellement caché. Commence gratuitement, décide ensuite.', 'Mobile Money or card, in your country’s currency. No coins that expire, no hidden renewal. Start free, decide later.')}</p>
          <Link href={href(lang, '/tarifs')} className="lp-lien">{t('Voir les tarifs', 'See pricing')}</Link>
        </div>
        <img className="lp-visuel lp-photo-grande" src={MEDIA.photoPlage2.src} alt={t(MEDIA.photoPlage2.alt, 'A couple walking hand in hand on the beach')} loading="lazy" width={900} height={1125} />
      </section>

      <section className="lp-section lp-galerie" aria-labelledby="tg">
        <div className="lp-wrap">
          <h2 id="tg">{t('D’où que tu viennes, l’important est d’être vrai', 'Wherever you are from, what matters is being real')}</h2>
          <p className="lp-intro">{t('Africain(e), européen(ne), asiatique, de la diaspora : Love Infinity réunit des personnes de toutes origines qui cherchent une vraie histoire.', 'African, European, Asian, from the diaspora: Love Infinity brings together people of every origin who are looking for a real story.')}</p>
          <div className="lp-mosaique">
            {MEDIA.galerie.map((g, i) => <img key={i} src={g.src} alt={t(g.alt, g.altEn)} loading="lazy" className={`m${i + 1}`} />)}
          </div>
        </div>
      </section>

      <section className="lp-signe" aria-label={t('Notre promesse', 'Our promise')}>
        <div className="lp-wrap">
          <h2>{t('Ici, tout le monde est vrai.', 'Here, everyone is real.')}</h2>
          <p>{t('Parce qu’une belle histoire commence par la confiance.', 'Because a great story starts with trust.')}</p>
        </div>
      </section>

      <section className="lp-section" aria-labelledby="t4">
        <div className="lp-wrap lp-section-centre">
          <h2 id="t4">{t('Trois minutes pour te lancer', 'Three minutes to get started')}</h2>
          <ol className="lp-trois">
            <li><h3>{t('Crée ton profil', 'Create your profile')}</h3><p>{t('Photos, âge, ville, ce que tu cherches.', 'Photos, age, city, what you are looking for.')}</p></li>
            <li><h3>{t('Fais-toi vérifier', 'Get verified')}</h3><p>{t('Notre équipe contrôle, tu gagnes tes badges.', 'Our team checks, you earn your badges.')}</p></li>
            <li><h3>{t('Rencontre', 'Meet')}</h3><p>{t('Like, match, puis écris-vous.', 'Like, match, then start chatting.')}</p></li>
          </ol>
          <Link href={href(lang, '/comment-ca-marche')} className="lp-lien">{t('Le détail, étape par étape', 'The details, step by step')}</Link>
        </div>
      </section>

      <section className="lp-section lp-ville" aria-labelledby="t5">
        <div className="lp-wrap lp-ville-grille">
          <div>
            <h2 id="t5">{t('Une communauté qui s’agrandit', 'A growing community')}</h2>
            <p className="lp-intro">{t('Nous ouvrons pays par pays et ville par ville, pour que chaque profil trouve de vraies personnes près de lui. Crée ton compte : tu es prévenu(e) dès l’ouverture chez toi.', 'We open country by country and city by city, so every profile finds real people nearby. Create your account and we will let you know as soon as we open where you live.')}</p>
            <div className="lp-actions" style={{ marginTop: 28 }}><Link href="/inscription" className="lp-btn or">{t('Rejoindre Love Infinity', 'Join Love Infinity')}</Link></div>
          </div>
          <div className="lp-pays" aria-label={t('Pays', 'Countries')}>
            <span className="on">{t('Côte d’Ivoire · ouvert', 'Côte d’Ivoire · open')}</span>
            <span>{t('Burkina Faso', 'Burkina Faso')}</span><span>{t('Sénégal', 'Senegal')}</span><span>Mali</span><span>Togo</span><span>{t('Bénin', 'Benin')}</span><span>Ghana</span><span>Nigeria</span><span>{t('Cameroun', 'Cameroon')}</span><span>{t('Diaspora', 'Diaspora')}</span>
          </div>
        </div>
      </section>

      <section className="lp-final" aria-labelledby="t6">
        <div className="lp-wrap">
          <h2 id="t6">{t('Prêt(e) à rencontrer quelqu’un de vrai ?', 'Ready to meet someone real?')}</h2>
          <div className="lp-actions" style={{ marginTop: 30 }}>
            <Link href="/inscription" className="lp-btn or">{t('Créer mon compte gratuit', 'Create my free account')}</Link>
            <Link href={href(lang, '/faq')} className="lp-lien">{t('Une question ? Voir la FAQ', 'A question? See the FAQ')}</Link>
          </div>
        </div>
      </section>

      <SiteFooter lang={lang} path="/" credits={MEDIA.credits} />
    </main>
  );
}
