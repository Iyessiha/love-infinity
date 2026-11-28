import { ImageResponse } from 'next/og';

export const alt = 'Love Infinity – Ici, tout le monde est vrai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#6B1744,#33081F)', color: '#FBF6EE', fontFamily: 'serif', textAlign: 'center', padding: 60 }}>
        <div style={{ display: 'flex', width: 120, height: 8, borderRadius: 4, background: '#F6C453' }} />
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, marginTop: 40 }}>Love Infinity</div>
        <div style={{ display: 'flex', fontSize: 40, marginTop: 20, color: '#EBD9DF' }}>Ici, tout le monde est vrai.</div>
        <div style={{ display: 'flex', fontSize: 28, marginTop: 36, color: '#F6C453' }}>Rencontres verifiees en Afrique de l'Ouest</div>
      </div>
    ),
    size,
  );
}
