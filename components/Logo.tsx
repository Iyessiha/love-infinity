/* eslint-disable @next/next/no-img-element */
/** Marque Love Infinity (cœur-ruban). `blanc` pour les fonds colorés. */
export function Logo({ width = 54, blanc = false }: { width?: number; blanc?: boolean }) {
  return <img src={blanc ? '/brand/mark-blanc.png' : '/brand/mark.png'} width={width} height={Math.round(width * 0.875)} alt="Love Infinity" decoding="async" />;
}

/** Marque + nom et signature. `clair` : texte crème pour les fonds sombres. */
export function Wordmark({ height = 44, clair = false }: { height?: number; clair?: boolean }) {
  return <img src={clair ? '/brand/wordmark-clair.png' : '/brand/wordmark.png'} height={height} width={Math.round(height * 900 / 206)} alt="Love Infinity – l’amour sans limites" decoding="async" />;
}

/** Logo complet (cœur + nom + signature), fonds clairs. */
export function LogoComplet({ width = 190 }: { width?: number }) {
  return <img src="/brand/logo.png" width={width} height={Math.round(width * 505 / 720)} alt="Love Infinity – l’amour sans limites" decoding="async" />;
}
