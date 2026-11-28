-- 0011 : stories de 24 h (photo). Limites par offre : Gratuit 1, Essentiel 3, Premium 10.

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  path text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours'
);
create index if not exists stories_user_idx on public.stories (user_id, expires_at);
create index if not exists stories_expire_idx on public.stories (expires_at);
alter table public.stories enable row level security;
create policy "story_lecture_perso" on public.stories for select to authenticated using (user_id = auth.uid());
create policy "story_suppression_perso" on public.stories for delete to authenticated using (user_id = auth.uid());
grant select, delete on public.stories to authenticated;

-- Stories visibles : les miennes + celles des profils actifs compatibles et non bloqués
create or replace function public.stories_actives()
returns table (user_id uuid, prenom text, story_id uuid, path text, created_at timestamptz, est_moi boolean)
language sql stable security definer set search_path = '' as $$
  select s.user_id, p.prenom, s.id, s.path, s.created_at, (s.user_id = me.id)
  from public.profiles me
  join public.stories s on s.expires_at > now()
  join public.profiles p on p.id = s.user_id
  where me.id = auth.uid() and me.account_status = 'active'
    and (s.user_id = me.id or (
      p.account_status = 'active' and p.genre = me.recherche and p.recherche = me.genre
      and not exists (select 1 from public.blocks b
                      where (b.blocker = me.id and b.blocked = p.id) or (b.blocker = p.id and b.blocked = me.id))))
  order by (s.user_id = me.id) desc, s.user_id, s.created_at
$$;
revoke execute on function public.stories_actives() from public, anon;
grant execute on function public.stories_actives() to authenticated;

create or replace function public.ajouter_story(p_path text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  me public.profiles;
  maxi int;
  nb int;
  nouvel uuid;
begin
  select * into me from public.profiles where id = auth.uid();
  if me.id is null or me.account_status <> 'active' then raise exception 'compte_inactif'; end if;
  if p_path is null or p_path not like auth.uid()::text || '/%' then raise exception 'chemin_invalide'; end if;
  maxi := case
    when public.est_premium(auth.uid()) then 10
    when exists (select 1 from public.subscriptions s where s.user_id = auth.uid() and s.plan = 'essentiel' and s.expires_at > now()) then 3
    else 1 end;
  select count(*) into nb from public.stories where user_id = auth.uid() and expires_at > now();
  if nb >= maxi then raise exception 'limite_stories'; end if;
  insert into public.stories (user_id, path) values (auth.uid(), p_path) returning id into nouvel;
  return nouvel;
end $$;
revoke execute on function public.ajouter_story(text) from public, anon;
grant execute on function public.ajouter_story(text) to authenticated;

-- Purge : supprime les lignes expirées et renvoie les fichiers à effacer du stockage
create or replace function public.purger_stories()
returns setof text language sql security definer set search_path = '' as $$
  delete from public.stories where expires_at < now() - interval '1 hour' returning path
$$;
revoke execute on function public.purger_stories() from public, anon, authenticated;
