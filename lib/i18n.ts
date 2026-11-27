export type Lang = 'fr' | 'en';
export const tr = (lang: Lang) => (fr: string, en: string) => (lang === 'en' ? en : fr);
// Adresse d'une page publique selon la langue : '/faq' → '/en/faq'
const SLUG_EN: Record<string, string> = { '/comment-ca-marche': '/how-it-works', '/securite': '/safety', '/tarifs': '/pricing', '/faq': '/faq', '/confidentialite': '/privacy', '/conditions': '/terms' };
export const href = (lang: Lang, path: string) => (lang === 'en' ? (path === '/' ? '/en' : `/en${SLUG_EN[path] ?? path}`) : path);
// Pages publiques disponibles en deux langues
export const PUBLIC = ['/', '/comment-ca-marche', '/securite', '/tarifs', '/faq', '/confidentialite', '/conditions'];
export const alternates = (lang: Lang, path: string) => ({
  canonical: href(lang, path),
  languages: { fr: href('fr', path), en: href('en', path) },
});
