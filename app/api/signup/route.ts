import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hmac } from '@/lib/hash';
import { passwordOk } from '@/lib/password';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';

const Body = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
  acceptCgu: z.literal(true),
  website: z.string().optional(), // piège à robots : doit rester vide
  startedAt: z.number(), // heure d'ouverture du formulaire (ms)
  captchaToken: z.string().optional(),
});

const MAX_PAR_HEURE = 5;
const DELAI_MINI_MS = 3000;

const reponse = (status: number, code: string, message: string) =>
  NextResponse.json({ ok: false, code, message }, { status });

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'inconnu').split(',')[0].trim();
  const ipHash = hmac(ip);
  const admin = supabaseAdmin();
  const noter = (outcome: string, email?: string) =>
    admin.from('signup_attempts').insert({ ip_hash: ipHash, email_canonical: email ?? null, outcome });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return reponse(400, 'requete', 'Requête invalide.');
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return reponse(400, 'champs', 'Vérifie ton email, ton mot de passe et les conditions.');
  const { email, password, website, startedAt, captchaToken } = parsed.data;

  // 1. Robots : champ piège rempli, ou formulaire envoyé trop vite
  if (website) {
    await noter('honeypot');
    return reponse(400, 'requete', 'Requête invalide.');
  }
  if (Date.now() - startedAt < DELAI_MINI_MS) {
    await noter('trop_rapide');
    return reponse(429, 'trop_rapide', 'Un instant, puis réessaie.');
  }

  // 2. Limite par adresse IP : 5 essais par heure
  const depuis = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await admin
    .from('signup_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', depuis);
  if ((count ?? 0) >= MAX_PAR_HEURE) {
    return reponse(429, 'limite', 'Trop d’essais. Réessaie dans une heure.');
  }

  // 3. Mot de passe
  if (!passwordOk(password)) {
    return reponse(400, 'mot_de_passe', 'Mot de passe : 8 caractères minimum, avec une lettre et un chiffre.');
  }

  // 4. Création du compte. Le CAPTCHA est vérifié par Supabase (réglage Authentication > Attack Protection).
  const supabase = await supabaseServer();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${site}/auth/callback`, captchaToken },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    await noter('refuse');
    if (msg.includes('email_jetable') || msg.includes('database error')) {
      // Domaine jetable ou email déjà utilisé (même canonique) : message volontairement général
      return reponse(400, 'email', 'Cette adresse email ne peut pas être utilisée. Essaie-en une autre.');
    }
    if (msg.includes('captcha')) return reponse(400, 'captcha', 'Vérification anti-robot échouée. Réessaie.');
    return reponse(400, 'inscription', 'Inscription impossible pour le moment. Réessaie.');
  }

  await noter('ok');
  return NextResponse.json({ ok: true });
}
