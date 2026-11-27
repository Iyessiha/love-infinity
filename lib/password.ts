const COMMUNS = new Set(['12345678', 'password', 'motdepasse', 'azerty123', 'qwerty123', '123456789', '00000000']);

export function passwordRules(pw: string) {
  return {
    longueur: pw.length >= 8,
    lettre: /[A-Za-zÀ-ÿ]/.test(pw),
    chiffre: /\d/.test(pw),
    pasCommun: !COMMUNS.has(pw.toLowerCase()),
  };
}

export const passwordOk = (pw: string) => Object.values(passwordRules(pw)).every(Boolean);

/** Force de 0 à 4 pour l'indicateur. */
export function passwordStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return passwordOk(pw) ? Math.max(s, 1) : Math.min(s, 1);
}
