-- ============================================================
-- PyTrack Comunidade — Mensagens diretas, Eventos e Certificados
-- ============================================================

-- ---------- Mensagens diretas (DM) ----------
create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_msg_pair on public.community_messages(sender_id, recipient_id, created_at);
create index if not exists idx_msg_recipient on public.community_messages(recipient_id, read);

alter table public.community_messages enable row level security;
drop policy if exists msg_read on public.community_messages;
create policy msg_read on public.community_messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
drop policy if exists msg_send on public.community_messages;
create policy msg_send on public.community_messages for insert
  with check (auth.uid() = sender_id);
drop policy if exists msg_update on public.community_messages;
create policy msg_update on public.community_messages for update
  using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);

-- ---------- Eventos ----------
create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,                  -- link (não upload)
  location text,
  online_url text,
  is_online boolean default true,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_event_start on public.community_events(starts_at);

create table if not exists public.community_event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.community_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (event_id, user_id)
);

alter table public.community_events enable row level security;
drop policy if exists event_read on public.community_events;
create policy event_read on public.community_events for select using (true);
drop policy if exists event_own on public.community_events;
create policy event_own on public.community_events for all
  using (auth.uid() = creator_id) with check (auth.uid() = creator_id);

alter table public.community_event_attendees enable row level security;
drop policy if exists att_read on public.community_event_attendees;
create policy att_read on public.community_event_attendees for select using (true);
drop policy if exists att_own on public.community_event_attendees;
create policy att_own on public.community_event_attendees for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Certificados de trilha ----------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trilha_id text not null,
  trilha_title text not null,
  recipient_name text not null,
  level text,
  hours int,
  credential_code text unique not null,
  issued_at timestamptz default now(),
  unique (user_id, trilha_id)
);
create index if not exists idx_cert_user2 on public.certificates(user_id);
create index if not exists idx_cert_code on public.certificates(credential_code);

alter table public.certificates enable row level security;
-- leitura pública: necessária para a verificação de autenticidade pelo código/QR
drop policy if exists cert_read on public.certificates;
create policy cert_read on public.certificates for select using (true);
drop policy if exists cert_own_insert on public.certificates;
create policy cert_own_insert on public.certificates for insert with check (auth.uid() = user_id);

-- Realtime para o chat e notificações de mensagem
do $$
begin
  begin execute 'alter publication supabase_realtime add table public.community_messages'; exception when others then null; end;
  begin execute 'alter publication supabase_realtime add table public.community_events'; exception when others then null; end;
end $$;

notify pgrst, 'reload schema';
