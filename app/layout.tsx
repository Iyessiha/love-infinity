import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://loveinfinity.app'),
  title: { default: 'Love Infinity', template: '%s' },
  openGraph: { siteName: 'Love Infinity', type: 'website', locale: 'fr_FR', alternateLocale: ['en_GB'] },
  twitter: { card: 'summary_large_image' },
  description: 'Ici, tout le monde est vrai. Rencontres vérifiées à Abidjan.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#4A0E2E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
