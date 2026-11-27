-- Love Infinity – file d'attente de vérification : un dossier par membre, tri par ancienneté, recherche, pagination

create or replace function public.admin_file_verifications(p_kind text default null, p_q text default null, p_limite int default 25, p_decalage int default 0)
returns table (user_id uuid, prenom text, nom text, birth_date date, genre text, ville text, phone_country text,
               kinds text[], plus_ancienne timestamptz, nb int, total bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  return query
    with f as (
      select v.user_id as uid, array_agg(distinct v.kind order by v.kind) as ks, min(v.created_at) as ancien, count(*)::int as n
      from public.verifications v
      where v.status = 'pending' and (p_kind is null or v.kind = p_kind)
      group by v.user_id
    )
    select p.id, p.prenom, p.nom, p.birth_date, p.genre, p.ville, p.phone_country, f.ks, f.ancien, f.n, count(*) over ()
    from f join public.profiles p on p.id = f.uid
    where p_q is null or p_q = '' or p.prenom ilike '%' || p_q || '%' or p.nom ilike '%' || p_q || '%' or p.ville ilike '%' || p_q || '%'
    order by f.ancien
    limit least(greatest(p_limite, 1), 100) offset greatest(p_decalage, 0);
end;
$$;
revoke execute on function public.admin_file_verifications(text, text, int, int) from public, anon;
grant execute on function public.admin_file_verifications(text, text, int, int) to authenticated;

-- Dossier suivant : le plus ancien en attente, hors membre en cours
create or replace function public.admin_verif_suivant(p_exclure uuid default null, p_kind text default null)
returns uuid language plpgsql stable security definer set search_path = '' as $$
declare r uuid;
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  select v.user_id into r from public.verifications v
  where v.status = 'pending' and (p_exclure is null or v.user_id <> p_exclure) and (p_kind is null or v.kind = p_kind)
  group by v.user_id order by min(v.created_at) limit 1;
  return r;
end;
$$;
revoke execute on function public.admin_verif_suivant(uuid, text) from public, anon;
grant execute on function public.admin_verif_suivant(uuid, text) to authenticated;
