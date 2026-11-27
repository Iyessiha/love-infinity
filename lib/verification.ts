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

export type Kind = 'photos' | 'selfie' | 'document';

/** Motifs de refus proposés à l'administrateur, selon ce qui est vérifié. */
export const RAISONS_PAR_TYPE: Record<Kind, readonly string[]> = {
  photos: ['Photo floue ou trop sombre', 'Visage non visible', 'Contenu inapproprié', 'Photo qui n’est pas la tienne', 'Autre'],
  selfie: ['Visage différent des photos', 'Geste demandé non réalisé', 'Vidéo floue ou trop sombre', 'Autre'],
  document: ['Visage différent des photos', 'Nom ou âge différent du profil', 'Verso manquant', 'Document illisible ou expiré', 'Autre'],
};

export const KIND_LABEL: Record<Kind, string> = { photos: 'Photos', selfie: 'Selfie vidéo', document: 'Pièce d’identité' };
export const GENRE_LABEL: Record<string, string> = { homme: 'Homme', femme: 'Femme' };
export const NIVEAU_LABEL = ['Aucune vérification', 'Photos vérifiées', 'Selfie vérifié', 'Identité vérifiée'] as const;

export const extension = (f: File) => (f.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'jpg';
