export type DocType = 'national_id' | 'passport' | 'driver_license';

export const DOCS: Record<DocType, { label: string; recto: string; verso: boolean }> = {
  national_id: { label: 'Carte nationale d’identité', recto: 'Recto, côté photo', verso: true },
  driver_license: { label: 'Permis de conduire', recto: 'Recto, côté photo', verso: true },
  passport: { label: 'Passeport', recto: 'Page photo du passeport', verso: false },
};

export const MAX_IMAGE = 8 * 1024 * 1024;
export const MAX_VIDEO = 20 * 1024 * 1024;

export const RAISONS = [
  'Visage différent des photos',
  'Photo floue ou trop sombre',
  'Geste demandé non réalisé',
  'Verso manquant',
  'Document illisible ou expiré',
  'Autre',
] as const;

export const extension = (f: File) => (f.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'jpg';
