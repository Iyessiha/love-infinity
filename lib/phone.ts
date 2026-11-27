import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';

export const COUNTRIES = [
  { code: 'CI', nom: "Côte d'Ivoire", indicatif: '+225', ouvert: true },
  { code: 'BF', nom: 'Burkina Faso', indicatif: '+226', ouvert: false },
  { code: 'SN', nom: 'Sénégal', indicatif: '+221', ouvert: false },
  { code: 'ML', nom: 'Mali', indicatif: '+223', ouvert: false },
  { code: 'TG', nom: 'Togo', indicatif: '+228', ouvert: false },
  { code: 'BJ', nom: 'Bénin', indicatif: '+229', ouvert: false },
  { code: 'GH', nom: 'Ghana', indicatif: '+233', ouvert: false },
  { code: 'NG', nom: 'Nigeria', indicatif: '+234', ouvert: false },
] as const;

export type CountryCodeOk = (typeof COUNTRIES)[number]['code'];

/** Numéro au format international (E.164), ou null s'il est invalide. */
export function normalizePhone(input: string, country: CountryCodeOk): string | null {
  const p = parsePhoneNumberFromString(input, country as CountryCode);
  return p && p.isValid() && p.country === country ? p.number : null;
}
