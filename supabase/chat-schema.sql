-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Chat (assistente IA + suporte humano) no site. Idempotente.
-- Funciona para visitantes anônimos e usuários logados.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.chat_conversations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  anon_id         text,                 -- id do visitante anônimo (localStorage)
  visitor_name    text,
  visitor_email   text,
  status          text not null default 'bot', -- bot | waiting_human | human | closed
  last_message_at timestamptz not null default now(),
  created_at      timestamptz not null default now()
);
create index if not exists idx_chat_conv_user on public.chat_conversations(user_id);
create index if not exists idx_chat_conv_anon on public.chat_conversations(anon_id);
create index if not exists idx_chat_conv_last on public.chat_conversations(last_message_at desc);

create table if not exists public.chat_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant', 'admin', 'system')),
  content         text not null,
  read_by_admin   boolean not null default false,
  read_by_user    boolean not null default false,
  created_at      timestamptz not null default now()
);
create index if not exists idx_chat_msg_conv on public.chat_messages(conversation_id, created_at);

alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

-- usuário logado vê apenas as próprias conversas
drop policy if exists chat_conv_select_own on public.chat_conversations;
create policy chat_conv_select_own on public.chat_conversations
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists chat_msg_select_own on public.chat_messages;
create policy chat_msg_select_own on public.chat_messages
  for select to authenticated using (
    exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

-- escrita e acesso anônimo: somente via service role (API do servidor).

notify pgrst, 'reload schema';
