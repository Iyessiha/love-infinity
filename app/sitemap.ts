import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://loveinfinity.app').replace(/\/$/, '');
  const pages: [string, string][] = [
    ['/', '/en'], ['/tarifs', '/en/pricing'], ['/comment-ca-marche', '/en/how-it-works'], ['/securite', '/en/safety'],
    ['/faq', '/en/faq'], ['/conditions', '/en/terms'], ['/confidentialite', '/en/privacy'],
  ];
  return pages.flatMap(([fr, en]) => [
    { url: `${site}${fr === '/' ? '' : fr}`, changeFrequency: 'monthly' as const, priority: fr === '/' ? 1 : 0.7, alternates: { languages: { fr: `${site}${fr === '/' ? '' : fr}`, en: `${site}${en}` } } },
    { url: `${site}${en}`, changeFrequency: 'monthly' as const, priority: fr === '/' ? 0.9 : 0.6 },
  ]);
}
