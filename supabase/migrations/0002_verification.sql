-- Love Infinity – vérification en trois niveaux, photos, administration

create table public.admins (user_id uuid primary key references auth.users (id) on delete cascade);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid())
$$;
grant execute on function public.is_admin() to authenticated;
revoke execute on function public.is_admin() from anon, public;

-- L'administrateur peut lire les profils (nom, âge) pour comparer avec les pièces
create policy "admin_lit_profils" on public.profiles
  for select to authenticated using (public.is_admin());

-- Photos de profil (conservées, contrairement aux fichiers de vérification)
create table public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  path text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, path)
);
alter table public.profile_photos enable row level security;
create policy "photos_perso" on public.profile_photos
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "photos_admin" on public.profile_photos
  for select to authenticated using (public.is_admin());

-- Demandes de vérification : photos (niveau 1), selfie vidéo (2), pièce d'identité (3)
create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('photos', 'selfie', 'document')),
  doc_type text check (doc_type in ('national_id', 'passport', 'driver_license')),
  gesture text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reason text,
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check (kind <> 'document' or doc_type is not null)
);
create unique index verifications_une_en_cours on public.verifications (user_id, kind) where status = 'pending';
create index verifications_file on public.verifications (status, created_at);
alter table public.verifications enable row level security;

-- Le geste aléatoire et le statut sont fixés par la base, pas par le client ; 3 essais par jour et par type
create or replace function public.verifications_avant_insertion()
returns trigger language plpgsql security definer set search_path = '' as $$
declare gestes text[] := array[
  'Tourne lentement la tête vers la droite',
  'Tourne lentement la tête vers la gauche',
  'Cligne deux fois des yeux',
  'Souris, puis lève la main droite',
  'Touche ton oreille gauche avec ta main droite',
  'Dis ton prénom à voix haute'];
begin
  if (select count(*) from public.verifications v
      where v.user_id = new.user_id and v.kind = new.kind and v.created_at > now() - interval '24 hours') >= 3 then
    raise exception 'trop_essais';
  end if;
  new.status := 'pending';
  new.reason := null; new.reviewed_by := null; new.reviewed_at := null;
  new.gesture := case when new.kind = 'selfie' then gestes[1 + floor(random() * array_length(gestes, 1))::int] else null end;
  return new;
end;
$$;
create trigger verifications_avant_insertion before insert on public.verifications
  for each row execute function public.verifications_avant_insertion();
revoke execute on function public.verifications_avant_insertion() from public, anon, authenticated;

create policy "verif_lecture" on public.verifications
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "verif_creation" on public.verifications
  for insert to authenticated with check (user_id = auth.uid());

-- Fichiers sensibles (vidéo, recto, verso) : supprimés après la décision
create table public.verification_files (
  id uuid primary key default gen_random_uuid(),
  verification_id uuid not null references public.verifications (id) on delete cascade,
  side text not null check (side in ('front', 'back', 'video')),
  file_path text not null,
  created_at timestamptz not null default now(),
  unique (verification_id, side)
);
alter table public.verification_files enable row level security;
create policy "fichiers_ajout" on public.verification_files
  for insert to authenticated with check (exists (
    select 1 from public.verifications v
    where v.id = verification_id and v.user_id = auth.uid() and v.status = 'pending'
      and split_part(file_path, '/', 1) = auth.uid()::text));
create policy "fichiers_admin" on public.verification_files
  for select to authenticated using (public.is_admin());
create policy "fichiers_admin_suppression" on public.verification_files
  for delete to authenticated using (public.is_admin());

-- Décision de l'administrateur : met à jour la demande, le niveau et le statut du compte
create or replace function public.decider_verification(p_id uuid, p_decision text, p_reason text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare v public.verifications;
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  if p_decision not in ('approved', 'rejected') then raise exception 'decision_invalide'; end if;
  select * into v from public.verifications where id = p_id and status = 'pending' for update;
  if not found then raise exception 'introuvable'; end if;
  update public.verifications
    set status = p_decision, reason = p_reason, reviewed_by = auth.uid(), reviewed_at = now()
    where id = p_id;
  if p_decision = 'approved' then
    update public.profiles p
      set verification_level = greatest(p.verification_level, case v.kind when 'photos' then 1 when 'selfie' then 2 else 3 end),
          account_status = case when p.account_status = 'pending' and p.phone_e164 is not null then 'active' else p.account_status end
      where p.id = v.user_id;
  end if;
end;
$$;
revoke execute on function public.decider_verification(uuid, text, text) from public, anon;
grant execute on function public.decider_verification(uuid, text, text) to authenticated;

-- Stockage privé : photos et fichiers de vérification, un dossier par utilisateur
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('photos', 'photos', false, 8388608, array['image/jpeg', 'image/png', 'image/webp']),
  ('verifications', 'verifications', false, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'video/webm', 'video/mp4'])
on conflict (id) do nothing;

create policy "stockage_envoi_perso" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('photos', 'verifications') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "stockage_lecture_photos_perso" on storage.objects
  for select to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "stockage_suppression_photos_perso" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "stockage_admin_lecture" on storage.objects
  for select to authenticated using (bucket_id in ('photos', 'verifications') and public.is_admin());
create policy "stockage_admin_suppression" on storage.objects
  for delete to authenticated using (bucket_id = 'verifications' and public.is_admin());
