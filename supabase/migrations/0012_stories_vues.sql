-- 0012 : qui a vu ma story (liste réservée à Premium, le compteur reste visible pour tous)
create table if not exists public.story_vues (
  story_id uuid not null references public.stories(id) on delete cascade,
  viewer_id uuid not null references auth.users(id) on delete cascade,
  vu_le timestamptz not null default now(),
  primary key (story_id, viewer_id)
);
alter table public.story_vues enable row level security;
-- aucune policy : tout passe par les fonctions ci-dessous

create or replace function public.marquer_story_vue(p_story uuid)
returns void language sql security definer set search_path = '' as $$
  insert into public.story_vues (story_id, viewer_id)
  select s.id, auth.uid() from public.stories s
  where s.id = p_story and s.user_id <> auth.uid() and s.expires_at > now()
    and exists (select 1 from public.stories_actives() a where a.story_id = s.id)
  on conflict do nothing
$$;
revoke execute on function public.marquer_story_vue(uuid) from public, anon;
grant execute on function public.marquer_story_vue(uuid) to authenticated;

-- Propriétaire : nombre de vues pour tous, noms seulement pour Premium
create or replace function public.vues_story(p_story uuid)
returns table (nb bigint, viewer_id uuid, prenom text)
language plpgsql stable security definer set search_path = '' as $$
declare total bigint; prem boolean;
begin
  if not exists (select 1 from public.stories where id = p_story and user_id = auth.uid()) then return; end if;
  select count(*) into total from public.story_vues where story_id = p_story;
  prem := public.est_premium(auth.uid());
  if prem and total > 0 then
    return query select total, v.viewer_id, p.prenom from public.story_vues v join public.profiles p on p.id = v.viewer_id
      where v.story_id = p_story order by v.vu_le desc limit 50;
  else
    return query select total, null::uuid, null::text;
  end if;
end $$;
revoke execute on function public.vues_story(uuid) from public, anon;
grant execute on function public.vues_story(uuid) to authenticated;
