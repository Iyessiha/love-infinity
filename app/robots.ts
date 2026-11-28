import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://loveinfinity.app';
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/decouvrir', '/likes', '/matchs', '/moi', '/verification', '/admin', '/api', '/profil', '/telephone', '/abonnement', '/compte-suspendu'] }],
    sitemap: `${site}/sitemap.xml`,
  };
}
