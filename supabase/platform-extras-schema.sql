-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Rate limiting, moderação, onboarding e LGPD. Idempotente.
-- ═══════════════════════════════════════════════════════════════════

-- ── Rate limiting (janela fixa por chave) ──
create table if not exists public.rate_limits (
  key          text primary key,
  count        integer not null default 0,
  window_start timestamptz not null default now()
);
alter table public.rate_limits enable row level security;
-- sem políticas públicas: só o service role acessa (server).

-- conta/incrementa um hit e retorna o total na janela atual.
create or replace function public.rl_hit(p_key text, p_window_seconds int)
returns integer
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  insert into public.rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update set
    count = case
      when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
        then 1
      else public.rate_limits.count + 1
    end,
    window_start = case
      when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
        then now()
      else public.rate_limits.window_start
    end
  returning count into v_count;
  return v_count;
end;
$$;

-- ── Moderação da comunidade ──
alter table public.community_profiles
  add column if not exists is_blocked boolean not null default false;

-- garante colunas de status em denúncias (se ainda não existirem)
alter table public.community_reports
  add column if not exists status text not null default 'pending';

-- ── Onboarding + consentimento (LGPD) ──
alter table public.users_profile
  add column if not exists onboarding_goal text;
alter table public.users_profile
  add column if not exists onboarding_done boolean not null default false;

notify pgrst, 'reload schema';
