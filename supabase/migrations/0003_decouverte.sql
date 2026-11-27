-- Love Infinity – découverte, likes, matchs, blocage, abonnements (structure)

create table public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null check (plan in ('essentiel', 'premium')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy "abonnement_perso" on public.subscriptions for select to authenticated using (user_id = auth.uid());

create or replace function public.a_un_abonnement(p_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.subscriptions s where s.user_id = p_user and s.expires_at > now())
$$;
revoke execute on function public.a_un_abonnement(uuid) from public, anon, authenticated;

create table public.blocks (
  blocker uuid not null references auth.users (id) on delete cascade,
  blocked uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked),
  check (blocker <> blocked)
);
alter table public.blocks enable row level security;
create policy "blocage_perso" on public.blocks for all to authenticated
  using (blocker = auth.uid()) with check (blocker = auth.uid());

create table public.swipes (
  from_user uuid not null references auth.users (id) on delete cascade,
  to_user uuid not null references auth.users (id) on delete cascade,
  action text not null check (action in ('like', 'pass')),
  created_at timestamptz not null default now(),
  primary key (from_user, to_user),
  check (from_user <> to_user)
);
create index swipes_vers on public.swipes (to_user, action);
create index swipes_jour on public.swipes (from_user, created_at);
alter table public.swipes enable row level security;
create policy "swipe_creation" on public.swipes for insert to authenticated with check (from_user = auth.uid());
create policy "swipe_lecture_perso" on public.swipes for select to authenticated using (from_user = auth.uid());

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references auth.users (id) on delete cascade,
  user_b uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_a, user_b),
  check (user_a < user_b)
);
alter table public.matches enable row level security;
create policy "match_participants" on public.matches for select to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());

revoke all on public.subscriptions, public.blocks, public.swipes, public.matches from anon;

-- Contrôles avant un swipe : compte actif, personne disponible, limite de likes du plan gratuit (5 par jour)
create or replace function public.swipes_avant_insertion()
returns trigger language plpgsql security definer set search_path = '' as $$
declare moi public.profiles; lui public.profiles;
begin
  select * into moi from public.profiles where id = new.from_user;
  select * into lui from public.profiles where id = new.to_user;
  if moi.id is null or moi.account_status <> 'active' then raise exception 'compte_inactif'; end if;
  if lui.id is null or lui.account_status <> 'active'
     or lui.genre is distinct from moi.recherche or lui.recherche is distinct from moi.genre
     or exists (select 1 from public.blocks b
                where (b.blocker = new.from_user and b.blocked = new.to_user)
                   or (b.blocker = new.to_user and b.blocked = new.from_user)) then
    raise exception 'indisponible';
  end if;
  if new.action = 'like' and not public.a_un_abonnement(new.from_user)
     and (select count(*) from public.swipes s
          where s.from_user = new.from_user and s.action = 'like'
            and s.created_at >= date_trunc('day', now())) >= 5 then
    raise exception 'limite_likes';
  end if;
  return new;
end;
$$;
create trigger swipes_avant before insert on public.swipes
  for each row execute function public.swipes_avant_insertion();

-- Like réciproque : création du match
create or replace function public.swipes_apres_insertion()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.action = 'like' and exists (
      select 1 from public.swipes s where s.from_user = new.to_user and s.to_user = new.from_user and s.action = 'like') then
    insert into public.matches (user_a, user_b)
    values (least(new.from_user, new.to_user), greatest(new.from_user, new.to_user))
    on conflict do nothing;
  end if;
  return new;
end;
$$;
create trigger swipes_apres after insert on public.swipes
  for each row execute function public.swipes_apres_insertion();
revoke execute on function public.swipes_avant_insertion() from public, anon, authenticated;
revoke execute on function public.swipes_apres_insertion() from public, anon, authenticated;

-- Profils à découvrir : actifs, compatibles dans les deux sens, ni déjà vus ni bloqués. Ni nom ni téléphone.
create or replace function public.decouvrir(p_limit int default 10)
returns table (id uuid, prenom text, age int, ville text, bio text, intention text, profession text,
               interets text[], langues text[], verification_level int, photo_path text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.prenom, extract(year from age(p.birth_date))::int, p.ville, p.bio, p.intention, p.profession,
         p.interets, p.langues, p.verification_level,
         (select pp.path from public.profile_photos pp where pp.user_id = p.id order by pp.position limit 1)
  from public.profiles me
  join public.profiles p on p.id <> me.id
  where me.id = auth.uid() and me.account_status = 'active'
    and p.account_status = 'active' and p.genre = me.recherche and p.recherche = me.genre
    and not exists (select 1 from public.swipes s where s.from_user = me.id and s.to_user = p.id)
    and not exists (select 1 from public.blocks b
                    where (b.blocker = me.id and b.blocked = p.id) or (b.blocker = p.id and b.blocked = me.id))
  order by p.verification_level desc, random()
  limit least(greatest(p_limit, 1), 20)
$$;
revoke execute on function public.decouvrir(int) from public, anon;
grant execute on function public.decouvrir(int) to authenticated;

-- Mes matchs
create or replace function public.mes_matchs()
returns table (match_id uuid, autre_id uuid, prenom text, photo_path text, cree_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select m.id, p.id, p.prenom,
         (select pp.path from public.profile_photos pp where pp.user_id = p.id order by pp.position limit 1),
         m.created_at
  from public.matches m
  join public.profiles p on p.id = case when m.user_a = auth.uid() then m.user_b else m.user_a end
  where (m.user_a = auth.uid() or m.user_b = auth.uid())
    and not exists (select 1 from public.blocks b
                    where (b.blocker = auth.uid() and b.blocked = p.id) or (b.blocker = p.id and b.blocked = auth.uid()))
  order by m.created_at desc
$$;
revoke execute on function public.mes_matchs() from public, anon;
grant execute on function public.mes_matchs() to authenticated;

-- Likes restants aujourd'hui (plan gratuit : 5, abonné : illimité = null)
create or replace function public.likes_restants()
returns int language sql stable security definer set search_path = '' as $$
  select case when public.a_un_abonnement(auth.uid()) then null
    else greatest(0, 5 - (select count(*)::int from public.swipes s
                          where s.from_user = auth.uid() and s.action = 'like' and s.created_at >= date_trunc('day', now())))
  end
$$;
revoke execute on function public.likes_restants() from public, anon;
grant execute on function public.likes_restants() to authenticated;

-- Photos visibles : celles des profils actifs, pour un membre actif
create or replace function public.photo_visible(p_path text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles me where me.id = auth.uid() and me.account_status = 'active')
     and exists (select 1 from public.profile_photos pp join public.profiles p on p.id = pp.user_id
                 where pp.path = p_path and p.account_status = 'active')
$$;
revoke execute on function public.photo_visible(text) from public, anon;
grant execute on function public.photo_visible(text) to authenticated;
create policy "stockage_photos_membres" on storage.objects
  for select to authenticated using (bucket_id = 'photos' and public.photo_visible(name));
