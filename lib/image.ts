/** Réduit une photo avant envoi (côté navigateur) : max 1280 px, JPEG. Évite d'envoyer 5 à 10 Mo par photo. */
export async function reduireImage(f: File, max = 1280, qualite = 0.82): Promise<Blob> {
  const bmp = await createImageBitmap(f);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close?.();
  return await new Promise((ok, ko) => c.toBlob((b) => (b ? ok(b) : ko(new Error('blob'))), 'image/jpeg', qualite));
}
