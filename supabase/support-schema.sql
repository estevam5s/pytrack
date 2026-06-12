-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Canal de suporte / comunicação usuário ↔ admin. Idempotente.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.support_messages (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  sender        text not null check (sender in ('user', 'admin')),
  subject       text,
  body          text not null,
  read_by_admin boolean not null default false,
  read_by_user  boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists idx_support_user on public.support_messages(user_id);
create index if not exists idx_support_created on public.support_messages(created_at desc);

alter table public.support_messages enable row level security;

-- usuário vê e cria apenas as mensagens do seu próprio thread
drop policy if exists support_select_own on public.support_messages;
create policy support_select_own on public.support_messages
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists support_insert_own on public.support_messages;
create policy support_insert_own on public.support_messages
  for insert to authenticated
  with check (auth.uid() = user_id and sender = 'user');

drop policy if exists support_update_own on public.support_messages;
create policy support_update_own on public.support_messages
  for update to authenticated using (auth.uid() = user_id);

-- admin lê/escreve tudo via service role (ignora RLS).

notify pgrst, 'reload schema';
