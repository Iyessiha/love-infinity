import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'Love Infinity – Ici, tout le monde est vrai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const marque = `data:image/png;base64,${(await readFile(join(process.cwd(), 'public/brand/mark.png'))).toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56, background: 'linear-gradient(160deg,#5A1A3E,#33081F)', color: '#FBF6EE', fontFamily: 'sans-serif', padding: 70 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={marque} width={330} height={289} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 700 }}>Love Infinity</div>
          <div style={{ display: 'flex', fontSize: 40, marginTop: 14, color: '#F7B042' }}>Ici, tout le monde est vrai.</div>
          <div style={{ display: 'flex', fontSize: 28, marginTop: 28, color: '#EBD9DF' }}>Rencontres verifiees en Afrique de l'Ouest</div>
        </div>
      </div>
    ),
    size,
  );
}
