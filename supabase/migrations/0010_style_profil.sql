-- 0010 : thèmes de profil (Premium) et questions signature

alter table public.profiles
  add column if not exists theme text not null default 'classique',
  add column if not exists prompts jsonb not null default '[]'::jsonb;

create or replace function public.est_premium(p_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.subscriptions s where s.user_id = p_user and s.plan = 'premium' and s.expires_at > now())
$$;
revoke execute on function public.est_premium(uuid) from public, anon, authenticated;

-- Enregistre le thème et les questions signature. Un thème autre que « classique » exige un abonnement Premium actif.
create or replace function public.maj_style(p_theme text, p_prompts jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  q jsonb;
  nb int := 0;
  ids text[] := array['dimanche','rire','simple','voyage','plat','qualite','fierte','rdv'];
  vus text[] := '{}';
begin
  if auth.uid() is null then raise exception 'non_connecte'; end if;
  if p_theme not in ('classique','nuit','or','soleil','lagune') then raise exception 'theme_inconnu'; end if;
  if p_theme <> 'classique' and not public.est_premium(auth.uid()) then raise exception 'premium_requis'; end if;
  if jsonb_typeof(p_prompts) <> 'array' or jsonb_array_length(p_prompts) > 3 then raise exception 'questions_invalides'; end if;
  for q in select * from jsonb_array_elements(p_prompts) loop
    if not (q->>'q' = any (ids)) or q->>'q' = any (vus) then raise exception 'questions_invalides'; end if;
    if length(btrim(coalesce(q->>'a', ''))) not between 1 and 160 then raise exception 'questions_invalides'; end if;
    vus := vus || (q->>'q');
    nb := nb + 1;
  end loop;
  update public.profiles
     set theme = p_theme,
         prompts = (select coalesce(jsonb_agg(jsonb_build_object('q', e->>'q', 'a', btrim(e->>'a'))), '[]'::jsonb) from jsonb_array_elements(p_prompts) e)
   where id = auth.uid();
end $$;
revoke execute on function public.maj_style(text, jsonb) from public, anon;
grant execute on function public.maj_style(text, jsonb) to authenticated;

-- Découverte : ajoute thème (appliqué seulement si le membre est Premium) et questions
drop function if exists public.decouvrir(int, int, int, text, text);
create or replace function public.decouvrir(
  p_limit int default 10, p_age_min int default 18, p_age_max int default 99,
  p_ville text default null, p_intention text default null)
returns table (id uuid, prenom text, age int, ville text, bio text, intention text, profession text,
               interets text[], langues text[], verification_level int, photo_path text,
               taille_cm int, etudes text, photos text[], membre_depuis timestamptz,
               theme text, prompts jsonb)
language sql stable security definer set search_path = '' as $$
  select p.id, p.prenom, extract(year from age(p.birth_date))::int, p.ville, p.bio, p.intention, p.profession,
         p.interets, p.langues, p.verification_level,
         (select pp.path from public.profile_photos pp where pp.user_id = p.id order by pp.position limit 1),
         p.taille_cm, p.etudes,
         coalesce((select array_agg(pp.path order by pp.position) from public.profile_photos pp where pp.user_id = p.id), '{}'),
         p.created_at,
         case when public.est_premium(p.id) then p.theme else 'classique' end,
         p.prompts
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
