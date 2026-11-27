import { z } from 'zod';

const ageMin = (d: string) => {
  const n = new Date(d);
  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - 18);
  return !Number.isNaN(n.getTime()) && n <= limite && n.getFullYear() > 1930;
};

export const Etape1 = z.object({
  prenom: z.string().trim().min(2).max(40),
  nom: z.string().trim().min(2).max(60),
  birth_date: z.string().refine(ageMin, '18 ans minimum'),
  ville: z.string().trim().min(2).max(60),
  genre: z.enum(['homme', 'femme']),
  recherche: z.enum(['homme', 'femme']),
});

export const LANGUES = ['Français', 'Anglais', 'Dioula', 'Baoulé', 'Bété', 'Mooré', 'Autre'] as const;
export const ETUDES = ['Bac', 'Licence', 'Master', 'Doctorat', 'Autre'] as const;

export const Etape2 = z.object({
  bio: z.string().trim().max(300).optional().default(''),
  profession: z.string().trim().max(80).optional().default(''),
  taille_cm: z.number().int().min(120).max(230).optional(),
  etudes: z.enum(ETUDES).optional(),
  langues: z.array(z.enum(LANGUES)).max(7),
});

export const INTENTIONS = [
  ['relation_serieuse', 'Relation sérieuse'],
  ['mariage', 'Mariage'],
  ['amitie', 'Amitié'],
  ['decouverte', 'Découverte'],
] as const;
export const ENFANTS = [
  ['aucun', 'Aucun'],
  ['jai', 'J’en ai'],
  ['jen_veux', 'J’en veux'],
  ['jen_veux_pas', 'Je n’en veux pas'],
] as const;
export const INTERETS = ['Cuisine', 'Voyages', 'Musique', 'Sport', 'Cinéma', 'Lecture', 'Foi', 'Mode', 'Entrepreneuriat'] as const;
export const RELIGIONS = ['Chrétienne', 'Musulmane', 'Autre', 'Je préfère ne pas dire'] as const;
export const FREQ = ['Non', 'Parfois', 'Souvent'] as const;

export const Etape3 = z.object({
  intention: z.enum(INTENTIONS.map((i) => i[0]) as [string, ...string[]]),
  enfants: z.enum(ENFANTS.map((i) => i[0]) as [string, ...string[]]),
  tabac: z.enum(FREQ),
  alcool: z.enum(FREQ),
  religion: z.enum(RELIGIONS).optional(),
  interets: z.array(z.enum(INTERETS)).max(5),
});

export const SCHEMAS = { 1: Etape1, 2: Etape2, 3: Etape3 } as const;
