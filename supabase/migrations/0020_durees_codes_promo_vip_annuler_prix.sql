-- Rattrapage : ces objets ont été appliqués directement dans Supabase (migrations 0020 à 0025).
-- Durées d'abonnement, codes promo, prix calculé en base, sélection VIP, annulation d'un swipe, compteurs de navigation.

create table if not exists public.plan_durees (
  mois int primary key check (mois in (1, 3, 6, 12)),
  remise_pct int not null check (remise_pct >= 0 and remise_pct <= 60)
);
alter table public.plan_durees enable row level security;
insert into public.plan_durees (mois, remise_pct) values (1, 0), (3, 15), (6, 25), (12, 35) on conflict (mois) do nothing;

create table if not exists public.codes_promo (
  code text primary key check (code = upper(code) and length(code) between 3 and 24),
  pct int not null check (pct between 1 and 90),
  actif boolean not null default true,
  expire_le timestamptz,
  max_utilisations int,
  utilisations int not null default 0
);
alter table public.codes_promo enable row level security;

alter table public.paiements add column if not exists mois int not null default 1;
alter table public.paiements add column if not exists code_promo text;

create or replace function public.activer_paiement(p_paiement uuid, p_montant integer)
returns text language plpgsql security definer set search_path to '' as $f$
declare p public.paiements; debut timestamptz;
begin
  select * into p from public.paiements where id = p_paiement for update;
  if p.id is null then return 'inconnu'; end if;
  if p.statut = 'paid' then return 'deja_traite'; end if;
  if p_montant <> p.montant_xof then return 'montant_different'; end if;
  update public.paiements set statut = 'paid', paye_le = now() where id = p.id;
  if p.code_promo is not null then update public.codes_promo set utilisations = utilisations + 1 where code = p.code_promo; end if;
  select greatest(now(), coalesce((select expires_at from public.subscriptions where user_id = p.user_id), now())) into debut;
  insert into public.subscriptions (user_id, plan, expires_at)
  values (p.user_id, p.plan, debut + make_interval(days => p.duree_jours))
  on conflict (user_id) do update set plan = excluded.plan, expires_at = excluded.expires_at;
  return 'ok';
end $f$;

-- Prix : mensuel arrondi à 50 FCFA après remise de durée, total = mensuel × durée ; avec code promo, arrondi à 100 FCFA.
create or replace function public.calculer_prix(p_plan text, p_mois integer, p_code text default null)
returns table(brut integer, remise_duree_pct integer, remise_promo_pct integer, total integer, code_ok boolean)
language plpgsql stable security definer set search_path to '' as $f$
declare mensuel int; rd int; rp int := 0; cok boolean := false; b int; pm int; apres int; fin int;
begin
  select prix_xof into mensuel from public.plans where code = p_plan and actif;
  select remise_pct into rd from public.plan_durees where mois = p_mois;
  if mensuel is null or rd is null then return; end if;
  if p_code is not null and length(trim(p_code)) > 0 then
    select c.pct into rp from public.codes_promo c
     where c.code = upper(trim(p_code)) and c.actif
       and (c.expire_le is null or c.expire_le > now())
       and (c.max_utilisations is null or c.utilisations < c.max_utilisations);
    if rp is null then rp := 0; else cok := true; end if;
  end if;
  b := mensuel * p_mois;
  pm := round(mensuel * (100 - rd) / 100.0 / 50.0)::int * 50;
  apres := pm * p_mois;
  fin := case when rp = 0 then apres else round(apres * (100 - rp) / 100.0 / 100.0)::int * 100 end;
  return query select b, rd, rp, greatest(200, fin), cok;
end $f$;

create or replace function public.selection_vip(p_limit integer default 24)
returns table(id uuid, prenom text, age integer, ville text, verification_level integer, photo_path text, premium boolean)
language sql stable security definer set search_path to '' as $f$
  select p.id, p.prenom, extract(year from age(p.birth_date))::int, p.ville, p.verification_level,
         (select pp.path from public.profile_photos pp where pp.user_id = p.id order by pp.position limit 1),
         public.est_premium(p.id)
  from public.profiles me
  join public.profiles p on p.id <> me.id
  where me.id = auth.uid() and me.account_status = 'active'
    and p.account_status = 'active' and not p.en_pause
    and p.genre = me.recherche and p.recherche = me.genre
    and (p.verification_level >= 3 or (p.verification_level >= 2 and public.est_premium(p.id)))
    and not exists (select 1 from public.swipes s where s.from_user = me.id and s.to_user = p.id)
    and not exists (select 1 from public.blocks b where (b.blocker = me.id and b.blocked = p.id) or (b.blocker = p.id and b.blocked = me.id))
  order by p.verification_level desc, public.est_premium(p.id) desc, random()
  limit least(greatest(p_limit, 1), 40)
$f$;

create or replace function public.annuler_swipe(p_to uuid)
returns text language plpgsql security definer set search_path to '' as $f$
declare dernier public.swipes; a uuid; b uuid;
begin
  if not public.est_premium(auth.uid()) then raise exception 'premium_requis'; end if;
  select * into dernier from public.swipes where from_user = auth.uid() order by created_at desc limit 1;
  if dernier.from_user is null or dernier.to_user <> p_to then raise exception 'pas_le_dernier'; end if;
  if dernier.created_at < now() - interval '1 hour' then raise exception 'trop_tard'; end if;
  a := least(auth.uid(), p_to); b := greatest(auth.uid(), p_to);
  if exists (select 1 from public.matches m where m.user_a = a and m.user_b = b) then raise exception 'match_existe'; end if;
  delete from public.swipes where from_user = dernier.from_user and to_user = dernier.to_user;
  return dernier.action;
end $f$;

create or replace function public.compteurs_nav()
returns table(likes integer, non_lus integer)
language sql stable set search_path to '' as $f$
  select (select count(*)::int from public.likes_recus()),
         (select coalesce(sum(m.non_lus), 0)::int from public.mes_matchs() m)
$f$;

grant execute on function public.calculer_prix(text, integer, text), public.selection_vip(integer), public.annuler_swipe(uuid), public.compteurs_nav() to authenticated;
