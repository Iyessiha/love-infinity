import Link from 'next/link';
import { Check, HeartIcon, MsgIcon, ShieldIcon, XIcon, PinIcon } from '@/components/Icons';
import { SiteFooter, SiteNav } from '@/components/SiteChrome';
import { Offres } from '@/components/Offres';
import { href, tr, type Lang } from '@/lib/i18n';
import { lireTarifs } from '@/lib/tarifs';
import { HeroVideo } from '@/components/HeroVideo';
import { MEDIA } from '@/lib/media';

export async function Home({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const tarifs = await lireTarifs();
  return (
    <main className="lp lp2">
      <header className="lp2-hero">
        <HeroVideo src={MEDIA.heroVideo} poster={MEDIA.heroPoster} />
        <div className="lp-wrap">
          <SiteNav lang={lang} path="/" />
          <div className="lp2-hero-grille">
            <div className="lp2-hero-txt">
              <h1>{t('Ici, tout le monde est vrai.', 'Here, everyone is real.')}</h1>
              <p className="lp2-sous">{t('L’application de rencontres où chaque profil est vérifié : photos, selfie vidéo, pièce d’identité. Fini les faux comptes et les arnaques.', 'The dating app where every profile is verified: photos, video selfie, ID. No more fake accounts and scams.')}</p>
              <div className="lp-actions">
                <Link href="/inscription" className="lp-btn or">{t('Créer mon compte gratuit', 'Create my free account')}</Link>
                <Link href={href(lang, '/comment-ca-marche')} className="lp-lien">{t('Voir comment ça marche', 'See how it works')}</Link>
              </div>
              <ul className="lp2-garanties">
                <li><Check size={15} /> {t('Gratuit pour commencer', 'Free to start')}</li>
                <li><Check size={15} /> {t('Nom et numéro privés', 'Name and number private')}</li>
                <li><Check size={15} /> {t('Mobile Money et carte', 'Mobile Money and card')}</li>
              </ul>
            </div>

            <div className="lp2-scene" aria-label={t('Aperçu de l’application', 'App preview')}>
              <div className="lp2-tel">
                <div className="lp2-ecran">
                  <div className="lp2-haut"><b>{t('Découvrir', 'Discover')}</b><span /></div>
                  <div className="lp2-profil">
                    <div className="lp2-portrait"><img src={MEDIA.aicha.src} alt={MEDIA.aicha.alt} width={700} height={1100} fetchPriority="high" /></div>
                    <span className="lp2-badge"><ShieldIcon size={13} /> {t('Identité vérifiée', 'Identity verified')}</span>
                    <div className="lp2-info">
                      <b>Aïcha <em>27</em></b>
                      <span><PinIcon size={14} /> Abidjan · {t('Architecte', 'Architect')}</span>
                      <div><i>{t('Relation sérieuse', 'Serious relationship')}</i><i>{t('Cuisine', 'Cooking')}</i><i>{t('Voyages', 'Travel')}</i></div>
                    </div>
                  </div>
                  <div className="lp2-actions"><span className="x"><XIcon size={22} /></span><span className="m"><MsgIcon size={20} /></span><span className="c"><HeartIcon size={26} /></span></div>
                </div>
              </div>
              <div className="lp2-flotte f1"><span className="ok"><Check size={14} /></span><div><b>{t('Selfie vérifié', 'Selfie verified')}</b><small>{t('Par notre équipe', 'By our team')}</small></div></div>
              <div className="lp2-flotte f2"><span className="coeur"><HeartIcon size={16} /></span><div><b>{t('C’est un match !', 'It’s a match!')}</b><small>{t('Aïcha et Moussa', 'Aïcha and Moussa')}</small></div></div>
              <div className="lp2-flotte f3"><small>{t('Mon dimanche idéal…', 'My ideal Sunday…')}</small><b>{t('Marché, attiéké poisson, plage.', 'Market, grilled fish, beach.')}</b></div>
            </div>
          </div>
        </div>
      </header>

      <section className="lp2-section" aria-labelledby="d1">
        <div className="lp-wrap">
          <h2 id="d1" className="lp2-h2">{t('Ce qu’on fait autrement', 'What we do differently')}</h2>
          <p className="lp-intro">{t('Pas de faux profils, pas de messages vides. Chaque détail est pensé pour que tu rencontres des personnes réelles, et que la conversation démarre bien.', 'No fake profiles, no empty messages. Every detail is built so you meet real people and the conversation starts well.')}</p>
          <div className="lp2-bento">
            <article className="b a">
              <h3>{t('Chaque profil est vérifié', 'Every profile is verified')}</h3>
              <p>{t('Les badges se gagnent, ils ne se déclarent pas. Une personne sans vérification ne peut pas t’écrire.', 'Badges are earned, not claimed. Someone without verification can’t message you.')}</p>
              <ol className="lp2-echelle">
                <li><span><Check size={14} /></span><b>{t('Photos contrôlées', 'Photos checked')}</b><small>{t('Pour entrer', 'To get in')}</small></li>
                <li><span><Check size={14} /></span><b>{t('Selfie vidéo', 'Video selfie')}</b><small>{t('Pour écrire', 'To message')}</small></li>
                <li><span><Check size={14} /></span><b>{t('Pièce d’identité', 'ID document')}</b><small>{t('Le badge le plus fort', 'The strongest badge')}</small></li>
              </ol>
            </article>
            <article className="b">
              <h3>{t('Des questions qui font parler', 'Questions that get people talking')}</h3>
              <p>{t('Réponds à tes questions signature : ton premier message s’écrit presque tout seul.', 'Answer your signature questions: your first message almost writes itself.')}</p>
              <div className="lp2-qa"><small>{t('Ce qui me fait rire…', 'What makes me laugh…')}</small><b>{t('Les imitations de ma grand-mère.', 'My grandmother’s impressions.')}</b></div>
            </article>
            <article className="b">
              <h3>{t('Un profil à ton image', 'A profile that looks like you')}</h3>
              <p>{t('Thèmes Premium inspirés d’Afrique : Kente, Wax, Bogolan, Nuit d’Abidjan, Gentleman…', 'Premium themes inspired by Africa: Kente, Wax, Bogolan, Abidjan Night, Gentleman…')}</p>
              <div className="lp2-themes"><i className="t1" /><i className="t2" /><i className="t3" /><i className="t4" /></div>
            </article>
            <article className="b">
              <h3>{t('Un message avec ton like', 'A message with your like')}</h3>
              <p>{t('Si c’est réciproque, ton message devient le début de la conversation.', 'If it’s mutual, your message becomes the start of the conversation.')}</p>
              <div className="lp2-bulle">{t('Ton profil m’a fait sourire. Ta semaine ?', 'Your profile made me smile. How’s your week?')}</div>
            </article>
            <article className="b">
              <h3>{t('Stories de 24 h', '24-hour Stories')}</h3>
              <p>{t('Montre ton quotidien en photo, en vidéo de 10 s ou en texte. Ça disparaît tout seul.', 'Share your day in a photo, a 10 s video or text. It disappears on its own.')}</p>
              <div className="lp2-stories"><i /><i /><i /><i /></div>
            </article>
          </div>
        </div>
      </section>

      <section className="lp2-sombre" aria-labelledby="d2">
        <div className="lp-wrap">
          <h2 id="d2" className="lp2-h2">{t('Trois étapes, et tu es dedans', 'Three steps and you’re in')}</h2>
          <ol className="lp2-etapes">
            <li><b>1</b><h3>{t('Crée ton profil', 'Create your profile')}</h3><p>{t('Âge, ville, ce que tu cherches : relation sérieuse, mariage, amitié ou découverte.', 'Age, city, what you’re looking for: serious relationship, marriage, friendship or discovery.')}</p></li>
            <li><b>2</b><h3>{t('Fais-toi vérifier', 'Get verified')}</h3><p>{t('Tes photos, un selfie vidéo, une pièce d’identité. Notre équipe contrôle, puis supprime la vidéo et la pièce.', 'Your photos, a video selfie, an ID. Our team checks, then deletes the video and the ID.')}</p></li>
            <li><b>3</b><h3>{t('Rencontre', 'Meet')}</h3><p>{t('Fais défiler, like, écris. Quand c’est réciproque, la conversation s’ouvre.', 'Swipe, like, write. When it’s mutual, the conversation opens.')}</p></li>
          </ol>
          <Link href={href(lang, '/securite')} className="lp-lien">{t('Comment nous vérifions', 'How we verify')}</Link>
        </div>
      </section>

      <section className="lp2-section" aria-labelledby="d3">
        <div className="lp-wrap">
          <h2 id="d3" className="lp2-h2">{t('Gratuit pour commencer. Premium pour te démarquer.', 'Free to start. Premium to stand out.')}</h2>
          <p className="lp-intro">{t('Mobile Money ou carte. Pas de pièces qui expirent, pas de renouvellement caché.', 'Mobile Money or card. No coins that expire, no hidden renewal.')}</p>
          <div style={{ marginTop: 40 }}>
            <Offres lang={lang} plans={tarifs.plans} remises={tarifs.remises}
              cta={(code) => <Link className={`of-cta${code === 'premium' ? ' or' : ''}`} href="/inscription">{code === 'gratuit' ? t('Commencer gratuitement', 'Start for free') : t('Créer mon compte', 'Create my account')}</Link>} />
          </div>
        </div>
      </section>

      <section className="lp-section lp-ville" aria-labelledby="t5">
        <div className="lp-wrap lp-ville-grille">
          <div>
            <h2 id="t5">{t('Une communauté qui s’agrandit', 'A growing community')}</h2>
            <p className="lp-intro">{t('Nous ouvrons pays par pays et ville par ville. Crée ton compte : tu es prévenu(e) dès l’ouverture chez toi.', 'We open country by country and city by city. Create your account and we’ll let you know as soon as we open where you live.')}</p>
            <div className="lp-actions" style={{ marginTop: 28 }}><Link href="/inscription" className="lp-btn or">{t('Rejoindre Love Infinity', 'Join Love Infinity')}</Link></div>
          </div>
          <div className="lp-pays" aria-label={t('Pays', 'Countries')}>
            <span className="on">{t('Côte d’Ivoire · ouvert', 'Côte d’Ivoire · open')}</span>
            <span>Burkina Faso</span><span>{t('Sénégal', 'Senegal')}</span><span>Mali</span><span>Togo</span><span>{t('Bénin', 'Benin')}</span><span>Ghana</span><span>Nigeria</span><span>{t('Cameroun', 'Cameroon')}</span><span>{t('Diaspora', 'Diaspora')}</span>
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

      <SiteFooter lang={lang} path="/" />
    </main>
  );
}
