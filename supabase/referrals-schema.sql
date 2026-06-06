-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Indicações (referral). Idempotente.
-- ═══════════════════════════════════════════════════════════════════

-- código de indicação por perfil de comunidade
alter table public.community_profiles
  add column if not exists referral_code text unique;

create or replace function public.gen_referral_code(uid uuid)
returns text language sql immutable as $$
  select lower(substr(replace(uid::text, '-', ''), 1, 8));
$$;

-- backfill
update public.community_profiles
  set referral_code = public.gen_referral_code(user_id)
  where referral_code is null;

-- garante código em novos perfis
create or replace function public.community_set_referral_code()
returns trigger language plpgsql as $$
begin
  if new.referral_code is null then
    new.referral_code := public.gen_referral_code(new.user_id);
  end if;
  return new;
end; $$;
drop trigger if exists trg_referral_code on public.community_profiles;
create trigger trg_referral_code before insert on public.community_profiles
  for each row execute function public.community_set_referral_code();

create table if not exists public.referrals (
  id               uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid unique references auth.users(id) on delete set null,
  referred_email   text,
  status           text not null default 'pending', -- pending | converted
  reward_granted   boolean not null default false,
  created_at       timestamptz not null default now(),
  converted_at     timestamptz,
  constraint referrals_status_chk check (status in ('pending', 'converted')),
  constraint referrals_no_self check (referrer_user_id <> referred_user_id)
);
create index if not exists idx_referrals_referrer on public.referrals(referrer_user_id);

alter table public.referrals enable row level security;
drop policy if exists referrals_select_own on public.referrals;
create policy referrals_select_own on public.referrals
  for select to authenticated using (auth.uid() = referrer_user_id);
-- escrita só via service role (signup action / webhook)

notify pgrst, 'reload schema';
