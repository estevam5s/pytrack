-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Perfil avançado, presença, tutorial e suporte. Idempotente.
-- ═══════════════════════════════════════════════════════════════════

-- ── Perfil avançado (estilo LinkedIn) ──
alter table public.users_profile add column if not exists headline text;
alter table public.users_profile add column if not exists bio text;
alter table public.users_profile add column if not exists location text;
alter table public.users_profile add column if not exists website text;
alter table public.users_profile add column if not exists github_url text;
alter table public.users_profile add column if not exists linkedin_url text;
alter table public.users_profile add column if not exists cover_url text;
alter table public.users_profile add column if not exists skills text[] default '{}';
alter table public.users_profile add column if not exists tutorial_done boolean not null default false;
alter table public.users_profile add column if not exists last_seen_at timestamptz;

-- atualiza o "visto por último" (presença online/offline)
create or replace function public.touch_last_seen(uid uuid)
returns void language sql security definer as $$
  update public.users_profile set last_seen_at = now() where user_id = uid;
$$;

-- ── Bucket de capas de perfil ──
insert into storage.buckets (id, name, public)
values ('profile-covers', 'profile-covers', true)
on conflict (id) do nothing;

-- ── Conexões (estilo LinkedIn: pedido/aceite) ──
create table if not exists public.community_connections (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid not null references auth.users(id) on delete cascade,
  receiver_id   uuid not null references auth.users(id) on delete cascade,
  status        text not null default 'pending', -- pending | accepted
  created_at    timestamptz not null default now(),
  responded_at  timestamptz,
  unique (requester_id, receiver_id),
  constraint conn_no_self check (requester_id <> receiver_id),
  constraint conn_status_chk check (status in ('pending', 'accepted'))
);
create index if not exists idx_conn_receiver on public.community_connections(receiver_id, status);
create index if not exists idx_conn_requester on public.community_connections(requester_id, status);

alter table public.community_connections enable row level security;

drop policy if exists conn_select on public.community_connections;
create policy conn_select on public.community_connections
  for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = receiver_id);

drop policy if exists conn_insert on public.community_connections;
create policy conn_insert on public.community_connections
  for insert to authenticated with check (auth.uid() = requester_id);

drop policy if exists conn_update on public.community_connections;
create policy conn_update on public.community_connections
  for update to authenticated
  using (auth.uid() = receiver_id or auth.uid() = requester_id);

drop policy if exists conn_delete on public.community_connections;
create policy conn_delete on public.community_connections
  for delete to authenticated
  using (auth.uid() = requester_id or auth.uid() = receiver_id);

-- ── Suporte: status de chamado (ticket) ──
alter table public.support_messages add column if not exists status text;
-- status no nível do thread é derivado; coluna opcional para a 1ª mensagem.

notify pgrst, 'reload schema';
