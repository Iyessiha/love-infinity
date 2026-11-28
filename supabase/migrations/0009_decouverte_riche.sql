-- Love Infinity – découverte enrichie : message d'accroche, filtres, fiche complète, likes reçus

-- 1. Message d'accroche joint à un like (affiché en premier message si match)
alter table public.swipes add column if not exists note text check (note is null or char_length(note) between 1 and 280);

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
  if new.action = 'pass' then new.note := null; end if;
  if new.note is not null then
    new.note := btrim(new.note);
    if new.note = '' then new.note := null; end if;
  end if;
  if new.note is not null and moi.verification_level < 2 then raise exception 'verification_requise'; end if;
  if new.action = 'like' and not public.a_un_abonnement(new.from_user)
     and (select count(*) from public.swipes s
          where s.from_user = new.from_user and s.action = 'like'
            and s.created_at >= date_trunc('day', now())) >= 5 then
    raise exception 'limite_likes';
  end if;
  return new;
end;
$$;

-- Les messages d'accroche deviennent les premiers messages de la conversation à la création du match.
create or replace function public.messages_avant_insertion()
returns trigger language plpgsql security definer set search_path = '' as $$
declare m public.matches; p public.profiles; autre uuid;
begin
  if coalesce(current_setting('app.intro', true), '') = '1' then
    return new; -- message d'accroche inséré par la base lors du match
  end if;
  select * into m from public.matches where id = new.match_id;
  if m.id is null or auth.uid() not in (m.user_a, m.user_b) then raise exception 'indisponible'; end if;
  autre := case when m.user_a = new.sender_id then m.user_b else m.user_a end;
  if public.bloque_entre(new.sender_id, autre) then raise exception 'indisponible'; end if;
  select * into p from public.profiles where id = new.sender_id;
  if p.account_status <> 'active' then raise exception 'compte_inactif'; end if;
  if p.verification_level < 2 then raise exception 'verification_requise'; end if;
  if (select count(*) from public.messages
      where sender_id = new.sender_id and created_at > now() - interval '1 minute') >= 20 then
    raise exception 'trop_vite';
  end if;
  new.body := btrim(new.body);
  new.read_at := null;
  new.created_at := now();
  return new;
end $$;

create or replace function public.swipes_apres_insertion()
returns trigger language plpgsql security definer set search_path = '' as $$
declare mid uuid; autre public.swipes;
begin
  if new.action = 'like' then
    select * into autre from public.swipes s where s.from_user = new.to_user and s.to_user = new.from_user and s.action = 'like';
    if autre.from_user is not null then
      insert into public.matches (user_a, user_b)
      values (least(new.from_user, new.to_user), greatest(new.from_user, new.to_user))
      on conflict do nothing
      returning id into mid;
      if mid is not null then
        perform set_config('app.intro', '1', true);
        if autre.note is not null then
          insert into public.messages (match_id, sender_id, body, created_at) values (mid, autre.from_user, autre.note, autre.created_at);
        end if;
        if new.note is not null then
          insert into public.messages (match_id, sender_id, body, created_at) values (mid, new.from_user, new.note, now() + interval '1 second');
        end if;
        perform set_config('app.intro', '0', true);
      end if;
    end if;
  end if;
  return new;
end;
$$;

-- 2. Découverte : fiche complète (toutes les photos, taille, études, langues) et filtres
drop function if exists public.decouvrir(int);
create or replace function public.decouvrir(
  p_limit int default 10, p_age_min int default 18, p_age_max int default 99,
  p_ville text default null, p_intention text default null)
returns table (id uuid, prenom text, age int, ville text, bio text, intention text, profession text,
               interets text[], langues text[], verification_level int, photo_path text,
               taille_cm int, etudes text, photos text[], membre_depuis timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, p.prenom, extract(year from age(p.birth_date))::int, p.ville, p.bio, p.intention, p.profession,
         p.interets, p.langues, p.verification_level,
         (select pp.path from public.profile_photos pp where pp.user_id = p.id order by pp.position limit 1),
         p.taille_cm, p.etudes,
         coalesce((select array_agg(pp.path order by pp.position) from public.profile_photos pp where pp.user_id = p.id), '{}'),
         p.created_at
  from public.profiles me
  join public.profiles p on p.id <> me.id
  where me.id = auth.uid() and me.account_status = 'active'
    and p.account_status = 'active' and p.genre = me.recherche and p.recherche = me.genre
    and extract(year from age(p.birth_date)) between greatest(p_age_min, 18) and least(p_age_max, 99)
    and (nullif(btrim(p_ville), '') is null or p.ville ilike '%' || btrim(p_ville) || '%')
    and (nullif(p_intention, '') is null or p.intention = p_intention)
    and not exists (select 1 from public.swipes s where s.from_user = me.id and s.to_user = p.id)
    and not exists (select 1 from public.blocks b
                    where (b.blocker = me.id and b.blocked = p.id) or (b.blocker = p.id and b.blocked = me.id))
  order by p.verification_level desc, random()
  limit least(greatest(p_limit, 1), 20)
$$;
revoke execute on function public.decouvrir(int, int, int, text, text) from public, anon;
grant execute on function public.decouvrir(int, int, int, text, text) to authenticated;

-- 3. Qui m'a liké (et que je n'ai pas encore vu)
create or replace function public.likes_recus()
returns table (id uuid, prenom text, age int, ville text, verification_level int, photo_path text, note text, cree_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, p.prenom, extract(year from age(p.birth_date))::int, p.ville, p.verification_level,
         (select pp.path from public.profile_photos pp where pp.user_id = p.id order by pp.position limit 1),
         s.note, s.created_at
  from public.swipes s
  join public.profiles p on p.id = s.from_user
  join public.profiles me on me.id = s.to_user
  where s.to_user = auth.uid() and s.action = 'like' and me.account_status = 'active'
    and p.account_status = 'active' and p.genre = me.recherche and p.recherche = me.genre
    and not exists (select 1 from public.swipes m where m.from_user = me.id and m.to_user = p.id)
    and not exists (select 1 from public.blocks b
                    where (b.blocker = me.id and b.blocked = p.id) or (b.blocker = p.id and b.blocked = me.id))
  order by s.created_at desc
$$;
revoke execute on function public.likes_recus() from public, anon;
grant execute on function public.likes_recus() to authenticated;
