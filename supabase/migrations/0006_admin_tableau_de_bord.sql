-- Love Infinity – tableau de bord d'administration : chiffres agrégés (administrateur seulement)

create or replace function public.admin_stats()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare r jsonb;
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  select jsonb_build_object(
    'kpis', jsonb_build_object(
      'profils',      (select count(*) from public.profiles),
      'actifs',       (select count(*) from public.profiles where account_status = 'active'),
      'en_attente',   (select count(*) from public.profiles where account_status = 'pending'),
      'suspendus',    (select count(*) from public.profiles where account_status in ('suspended', 'banned')),
      'niveau1',      (select count(*) from public.profiles where verification_level >= 1),
      'niveau2',      (select count(*) from public.profiles where verification_level >= 2),
      'niveau3',      (select count(*) from public.profiles where verification_level >= 3),
      'inscrits_7j',  (select count(*) from public.profiles where created_at > now() - interval '7 days'),
      'verifs',       (select count(*) from public.verifications where status = 'pending'),
      'signalements', (select count(*) from public.reports where status = 'open'),
      'matchs',       (select count(*) from public.matches),
      'messages',     (select count(*) from public.messages),
      'abonnes',      (select count(*) from public.subscriptions where expires_at > now()),
      'revenus',      (select coalesce(sum(montant_xof), 0) from public.paiements where statut = 'paid'),
      'revenus_30j',  (select coalesce(sum(montant_xof), 0) from public.paiements where statut = 'paid' and paye_le > now() - interval '30 days'),
      'liste_attente',(select count(*) from public.waitlist)
    ),
    'inscriptions', coalesce((select jsonb_agg(jsonb_build_object('jour', to_char(j, 'YYYY-MM-DD'), 'n', coalesce(c.n, 0)) order by j)
      from generate_series((now() - interval '29 days')::date, now()::date, interval '1 day') j
      left join (select created_at::date d, count(*) n from public.profiles group by 1) c on c.d = j::date), '[]'),
    'verifs', coalesce((select jsonb_agg(jsonb_build_object('kind', kind, 'n', n, 'heures', h) order by kind)
      from (select kind, count(*) n, round(extract(epoch from (now() - min(created_at))) / 3600) h
            from public.verifications where status = 'pending' group by kind) x), '[]'),
    'signalements', coalesce((select jsonb_agg(jsonb_build_object('reason', reason, 'n', n) order by n desc)
      from (select reason, count(*) n from public.reports where status = 'open' group by reason) x), '[]'),
    'revenus_mois', coalesce((select jsonb_agg(jsonb_build_object('mois', mois, 'n', n, 'xof', xof) order by mois desc)
      from (select to_char(paye_le, 'YYYY-MM') mois, count(*) n, sum(montant_xof) xof
            from public.paiements where statut = 'paid' group by 1 order by 1 desc limit 12) x), '[]'),
    'pays', coalesce((select jsonb_agg(jsonb_build_object('country', phone_country, 'n', n) order by n desc)
      from (select phone_country, count(*) n from public.profiles where phone_country is not null group by 1 order by 2 desc limit 10) x), '[]'),
    'attente_pays', coalesce((select jsonb_agg(jsonb_build_object('country', country, 'n', n) order by n desc)
      from (select country, count(*) n from public.waitlist group by 1 order by 2 desc limit 10) x), '[]')
  ) into r;
  return r;
end;
$$;
revoke execute on function public.admin_stats() from public, anon;
grant execute on function public.admin_stats() to authenticated;

-- Derniers paiements, avec le prénom du membre (pas d'email, pas de numéro)
create or replace function public.admin_paiements(p_limite int default 50)
returns table (id uuid, prenom text, plan text, montant_xof int, statut text, cree_le timestamptz, paye_le timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'interdit'; end if;
  return query
    select p.id, pr.prenom, p.plan, p.montant_xof, p.statut, p.cree_le, p.paye_le
    from public.paiements p left join public.profiles pr on pr.id = p.user_id
    order by p.cree_le desc limit least(greatest(p_limite, 1), 200);
end;
$$;
revoke execute on function public.admin_paiements(int) from public, anon;
grant execute on function public.admin_paiements(int) to authenticated;
