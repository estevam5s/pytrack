-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Configuração de IA própria do usuário (BYOK). Idempotente.
-- O usuário pode usar seu próprio provedor/modelo/chave (OpenRouter,
-- OpenAI, Anthropic/Claude, Gemini, DeepSeek, Grok, Nvidia, etc.).
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.user_ai_settings (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  provider   text,          -- rótulo do provedor (openrouter, openai, anthropic, gemini, deepseek, groq, nvidia, custom)
  base_url   text,          -- endpoint base compatível com OpenAI (/chat/completions é anexado)
  model      text,          -- ex.: anthropic/claude-3.5-sonnet, gpt-4o-mini, deepseek-chat
  api_key    text,          -- chave do usuário (protegida por RLS)
  enabled    boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_ai_settings enable row level security;

drop policy if exists uas_select_own on public.user_ai_settings;
create policy uas_select_own on public.user_ai_settings
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists uas_insert_own on public.user_ai_settings;
create policy uas_insert_own on public.user_ai_settings
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists uas_update_own on public.user_ai_settings;
create policy uas_update_own on public.user_ai_settings
  for update to authenticated using (auth.uid() = user_id);

drop policy if exists uas_delete_own on public.user_ai_settings;
create policy uas_delete_own on public.user_ai_settings
  for delete to authenticated using (auth.uid() = user_id);

notify pgrst, 'reload schema';
