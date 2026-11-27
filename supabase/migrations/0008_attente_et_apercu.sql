-- Love Infinity – attente de vérification : suivi du dossier et aperçu limité des profils

-- Suivi du dossier du membre connecté : demandes en cours, place dans la file, délai habituel
create or replace function public.mon_dossier()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare moi uuid := auth.uid(); mon_debut timestamptz; r jsonb;
begin
  if moi is null then return null; end if;
  select min(created_at) into mon_debut from public.verifications where user_id = moi and status = 'pending';
  select jsonb_build_object(
    'demandes', coalesce((select jsonb_agg(jsonb_build_object('kind', kind, 'depuis', created_at) order by created_at)
                          from public.verifications where user_id = moi and status = 'pending'), '[]'),
    'position', case when mon_debut is null then null else 1 + (
        select count(*) from (select user_id from public.verifications where status = 'pending' and user_id <> moi
                              group by user_id having min(created_at) < mon_debut) x) end,
    'total', (select count(distinct user_id) from public.verifications where status = 'pending'),
    'delai_h', (select case when count(*) >= 5
                  then round((percentile_cont(0.5) within group (order by extract(epoch from (reviewed_at - created_at)) / 3600))::numeric, 0) end
                from (select reviewed_at, created_at from public.verifications
                      where status in ('approved', 'rejected') and reviewed_at > now() - interval '30 days'
                      order by reviewed_at desc limit 50) d)
  ) into r;
  return r;
end;
$$;
revoke execute on function public.mon_dossier() from public, anon;
grant execute on function public.mon_dossier() to authenticated;

-- Aperçu pour un membre dont les photos ont été envoyées mais pas encore validées :
-- 5 profils par jour (stables sur la journée), lecture seule
create or replace function public.apercu_decouverte()
returns table (id uuid, prenom text, age int, ville text, intention text, verification_level int, photo_path text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.prenom, extract(year from age(p.birth_date))::int, p.ville, p.intention, p.verification_level,
         (select pp.path from public.profile_photos pp where pp.user_id = p.id order by pp.position limit 1)
  from public.profiles me
  join public.profiles p on p.id <> me.id
  where me.id = auth.uid() and me.account_status = 'pending' and me.phone_e164 is not null
    and exists (select 1 from public.verifications v where v.user_id = me.id and v.kind = 'photos')
    and p.account_status = 'active' and p.genre = me.recherche and p.recherche = me.genre
    and exists (select 1 from public.profile_photos pp where pp.user_id = p.id)
    and not exists (select 1 from public.blocks b
                    where (b.blocker = me.id and b.blocked = p.id) or (b.blocker = p.id and b.blocked = me.id))
  order by md5(p.id::text || me.id::text || current_date::text)
  limit 5
$$;
revoke execute on function public.apercu_decouverte() from public, anon;
grant execute on function public.apercu_decouverte() to authenticated;
