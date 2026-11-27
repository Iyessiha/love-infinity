-- Love Infinity – modération : suspendre, bannir ou réactiver un membre (administrateur seulement)

create or replace function public.changer_statut_membre(p_id uuid, p_statut text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  if p_statut not in ('active', 'suspended', 'banned') then raise exception 'statut_invalide'; end if;
  if p_id = auth.uid() then raise exception 'pas_soi_meme'; end if;
  if exists (select 1 from public.admins a where a.user_id = p_id) then raise exception 'pas_un_admin'; end if;
  if p_statut = 'active' and not exists (select 1 from public.profiles where id = p_id and phone_e164 is not null) then
    raise exception 'compte_incomplet';
  end if;
  update public.profiles set account_status = p_statut::public.account_status where id = p_id;
  if not found then raise exception 'introuvable'; end if;
end;
$$;
revoke execute on function public.changer_statut_membre(uuid, text) from public, anon;
grant execute on function public.changer_statut_membre(uuid, text) to authenticated;
