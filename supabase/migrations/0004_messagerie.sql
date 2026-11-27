-- Messagerie entre matchs, signalements, blocage.

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index messages_match_idx on public.messages (match_id, created_at desc);
alter table public.messages enable row level security;

create or replace function public.est_participant(p_match uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.matches m
                 where m.id = p_match and auth.uid() in (m.user_a, m.user_b))
$$;
revoke execute on function public.est_participant(uuid) from public, anon;
grant execute on function public.est_participant(uuid) to authenticated;

create or replace function public.bloque_entre(p_a uuid, p_b uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.blocks b
                 where (b.blocker = p_a and b.blocked = p_b) or (b.blocker = p_b and b.blocked = p_a))
$$;
revoke execute on function public.bloque_entre(uuid, uuid) from public, anon, authenticated;

create policy "messages_lecture" on public.messages for select to authenticated
  using (public.est_participant(match_id));
create policy "messages_envoi" on public.messages for insert to authenticated
  with check (sender_id = auth.uid());

create or replace function public.messages_avant_insertion()
returns trigger language plpgsql security definer set search_path = '' as $$
declare m public.matches; p public.profiles; autre uuid;
begin
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
create trigger messages_avant before insert on public.messages
  for each row execute function public.messages_avant_insertion();

-- Marque comme lus les messages reçus d'un match.
create or replace function public.marquer_lus(p_match uuid)
returns void language sql security definer set search_path = '' as $$
  update public.messages set read_at = now()
  where match_id = p_match and sender_id <> auth.uid() and read_at is null
    and public.est_participant(p_match)
$$;
revoke execute on function public.marquer_lus(uuid) from public, anon;
grant execute on function public.marquer_lus(uuid) to authenticated;

-- Signalements
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reported_id uuid not null references auth.users (id) on delete cascade,
  reason text not null check (reason in ('faux_profil','arnaque','harcelement','contenu_inapproprie','mineur','autre')),
  details text check (char_length(details) <= 500),
  status text not null default 'open' check (status in ('open','handled')),
  created_at timestamptz not null default now(),
  check (reporter_id <> reported_id)
);
alter table public.reports enable row level security;
create policy "signalements_admin" on public.reports for select to authenticated using (public.is_admin());
create policy "signalements_admin_maj" on public.reports for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Signaler (bloque aussi la personne). 5 signalements par jour maximum.
create or replace function public.signaler(p_user uuid, p_reason text, p_details text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'non_connecte'; end if;
  if (select count(*) from public.reports where reporter_id = auth.uid() and created_at > now() - interval '1 day') >= 5 then
    raise exception 'trop_de_signalements';
  end if;
  insert into public.reports (reporter_id, reported_id, reason, details)
  values (auth.uid(), p_user, p_reason, nullif(btrim(coalesce(p_details, '')), ''));
  insert into public.blocks (blocker, blocked) values (auth.uid(), p_user) on conflict do nothing;
end $$;
revoke execute on function public.signaler(uuid, text, text) from public, anon;
grant execute on function public.signaler(uuid, text, text) to authenticated;

-- Bloquer seulement
create or replace function public.bloquer(p_user uuid)
returns void language sql security definer set search_path = '' as $$
  insert into public.blocks (blocker, blocked)
  select auth.uid(), p_user where auth.uid() is not null and auth.uid() <> p_user
  on conflict do nothing
$$;
revoke execute on function public.bloquer(uuid) from public, anon;
grant execute on function public.bloquer(uuid) to authenticated;

-- Liste des conversations avec dernier message et non lus
drop function if exists public.mes_matchs();
create or replace function public.mes_matchs()
returns table (match_id uuid, autre_id uuid, prenom text, photo_path text, cree_le timestamptz,
               dernier_message text, dernier_le timestamptz, non_lus int)
language sql stable security definer set search_path = '' as $$
  select m.id, p.id, p.prenom,
         (select pp.path from public.profile_photos pp where pp.user_id = p.id order by pp.position limit 1),
         m.created_at,
         (select x.body from public.messages x where x.match_id = m.id order by x.created_at desc limit 1),
         (select x.created_at from public.messages x where x.match_id = m.id order by x.created_at desc limit 1),
         (select count(*)::int from public.messages x where x.match_id = m.id and x.sender_id <> auth.uid() and x.read_at is null)
  from public.matches m
  join public.profiles p on p.id = case when m.user_a = auth.uid() then m.user_b else m.user_a end
  where (m.user_a = auth.uid() or m.user_b = auth.uid())
    and not public.bloque_entre(auth.uid(), p.id)
  order by coalesce((select max(x.created_at) from public.messages x where x.match_id = m.id), m.created_at) desc
$$;
revoke execute on function public.mes_matchs() from public, anon;
grant execute on function public.mes_matchs() to authenticated;
