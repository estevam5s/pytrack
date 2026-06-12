-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Stripe Billing — assinatura mensal (R$10/mês)
-- Aplicar via Management API ou SQL Editor. Idempotente.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.stripe_customers (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  email              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  stripe_price_id        text,
  status                 text not null default 'incomplete',
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  canceled_at            timestamptz,
  trial_start            timestamptz,
  trial_end              timestamptz,
  metadata               jsonb,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint subscriptions_status_chk check (status in
    ('active','trialing','past_due','canceled','unpaid',
     'incomplete','incomplete_expired','paused'))
);
create unique index if not exists subscriptions_user_uniq on public.subscriptions(user_id);

create table if not exists public.payment_events (
  id              uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  type            text,
  processed       boolean not null default false,
  payload         jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_subscriptions_period on public.subscriptions(current_period_end);
create index if not exists idx_stripe_customers_user on public.stripe_customers(user_id);

-- updated_at
create or replace function public.billing_touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists trg_touch_stripe_customers on public.stripe_customers;
create trigger trg_touch_stripe_customers before update on public.stripe_customers
  for each row execute function public.billing_touch_updated_at();
drop trigger if exists trg_touch_subscriptions on public.subscriptions;
create trigger trg_touch_subscriptions before update on public.subscriptions
  for each row execute function public.billing_touch_updated_at();

-- ───────────────────────────────── RLS ─────────────────────────────
-- Apenas leitura para o próprio usuário; toda escrita é via service role
-- (webhook), que ignora RLS. payment_events fica totalmente privado.
alter table public.stripe_customers enable row level security;
alter table public.subscriptions    enable row level security;
alter table public.payment_events   enable row level security;

drop policy if exists customers_select_own on public.stripe_customers;
create policy customers_select_own on public.stripe_customers
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own on public.subscriptions
  for select to authenticated using (auth.uid() = user_id);

-- payment_events: sem policies => nenhum acesso por anon/authenticated.

notify pgrst, 'reload schema';
