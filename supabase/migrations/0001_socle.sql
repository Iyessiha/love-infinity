-- Love Infinity – socle : profils, anti-faux comptes, numéros uniques
-- À appliquer sur un projet Supabase vide.

create type public.account_status as enum ('pending', 'active', 'suspended', 'banned');

-- Domaines d'emails jetables refusés à l'inscription (liste à compléter)
create table public.disposable_domains (domain text primary key);
alter table public.disposable_domains enable row level security;
insert into public.disposable_domains (domain) values
  ('mailinator.com'), ('yopmail.com'), ('guerrillamail.com'), ('10minutemail.com'),
  ('tempmail.com'), ('temp-mail.org'), ('trashmail.com'), ('sharklasers.com'),
  ('getnada.com'), ('throwawaymail.com'), ('maildrop.cc'), ('dispostable.com'),
  ('fakeinbox.com'), ('mohmal.com'), ('emailondeck.com'), ('mintemail.com');

-- Email canonique : minuscules, sans « +étiquette », sans points pour Gmail
create or replace function public.canonical_email(e text)
returns text language sql immutable set search_path = '' as $$
  select case
    when split_part(lower(trim(e)), '@', 2) in ('gmail.com', 'googlemail.com')
      then replace(split_part(split_part(lower(trim(e)), '@', 1), '+', 1), '.', '') || '@gmail.com'
    else split_part(split_part(lower(trim(e)), '@', 1), '+', 1) || '@' || split_part(lower(trim(e)), '@', 2)
  end
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email_canonical text not null unique,
  account_status public.account_status not null default 'pending',
  prenom text,
  nom text,                       -- privé : sert à vérifier l'identité
  birth_date date,
  ville text,
  genre text check (genre in ('homme', 'femme')),
  recherche text check (recherche in ('homme', 'femme')),
  bio text check (char_length(bio) <= 300),
  profession text,
  taille_cm int check (taille_cm between 120 and 230),
  etudes text,
  langues text[] not null default '{}',
  intention text check (intention in ('relation_serieuse', 'mariage', 'amitie', 'decouverte')),
  enfants text check (enfants in ('aucun', 'jai', 'jen_veux', 'jen_veux_pas')),
  tabac text,
  alcool text,
  religion text,                  -- facultatif
  interets text[] not null default '{}' check (cardinality(interets) <= 5),
  phone_country text,
  phone_e164 text,                -- renseigné par le serveur seulement
  phone_verified_at timestamptz,  -- reste null : aucun SMS
  verification_level int not null default 0 check (verification_level between 0 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Un numéro = un seul compte
create unique index profiles_phone_unique on public.profiles (phone_e164) where phone_e164 is not null;

-- Numéros de comptes bannis : empreinte seulement
create table public.blocked_phones (
  phone_hash text primary key,
  created_at timestamptz not null default now()
);
alter table public.blocked_phones enable row level security;

-- Tentatives d'inscription (limites par IP, file de comptes suspects)
create table public.signup_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  email_canonical text,
  outcome text not null,
  created_at timestamptz not null default now()
);
create index signup_attempts_ip_time on public.signup_attempts (ip_hash, created_at desc);
alter table public.signup_attempts enable row level security;

-- Liste d'attente hors Côte d'Ivoire
create table public.waitlist (
  email_canonical text primary key,
  country text not null,
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;

-- Création automatique du profil, avec contrôle des emails jetables et doublons
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.disposable_domains d
             where d.domain = lower(split_part(new.email, '@', 2))) then
    raise exception 'email_jetable';
  end if;
  insert into public.profiles (id, email_canonical)
  values (new.id, public.canonical_email(new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Sécurité par ligne : chacun ne voit et ne modifie que son propre profil
alter table public.profiles enable row level security;
create policy "profil_lecture_perso" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profil_modif_perso" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Colonnes modifiables par l'utilisateur (pas le statut, pas le numéro, pas le niveau)
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (prenom, nom, birth_date, ville, genre, recherche, bio, profession,
              taille_cm, etudes, langues, intention, enfants, tabac, alcool,
              religion, interets) on public.profiles to authenticated;

-- Les fonctions de déclenchement ne sont pas appelables depuis l'API
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
