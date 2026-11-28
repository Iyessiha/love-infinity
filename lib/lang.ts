import { cookies, headers } from 'next/headers';
import type { Lang } from '@/lib/i18n';
import { COOKIE_LANG, makeT } from '@/lib/dict';

/** Langue de l'application : choix mémorisé dans un cookie, sinon langue du navigateur, sinon français. */
export async function getLang(): Promise<Lang> {
  const c = (await cookies()).get(COOKIE_LANG)?.value;
  if (c === 'fr' || c === 'en') return c;
  const al = (await headers()).get('accept-language') ?? '';
  return /^\s*en\b/i.test(al) ? 'en' : 'fr';
}

export async function getT() {
  return makeT(await getLang());
}
