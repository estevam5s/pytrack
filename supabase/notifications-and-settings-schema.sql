-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Notificações do usuário + configurações do site. Idempotente.
-- ═══════════════════════════════════════════════════════════════════

-- ── Notificações ──
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null default 'info', -- info | success | community | support | system | level
  title      text not null,
  body       text,
  link       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notif_user on public.notifications(user_id, is_read, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists notif_select_own on public.notifications;
create policy notif_select_own on public.notifications
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists notif_update_own on public.notifications;
create policy notif_update_own on public.notifications
  for update to authenticated using (auth.uid() = user_id);
-- inserção via service role (eventos do sistema).

-- ── Configurações globais do site (admin) ──
create table if not exists public.site_settings (
  id              int primary key default 1,
  default_locale  text not null default 'pt',
  maintenance     boolean not null default false,
  signups_enabled boolean not null default true,
  announcement    text,
  primary_contact text default 'contato@estevamsouza.com.br',
  social_github   text default 'https://github.com/PyTrackOrganization',
  social_linkedin text default 'https://www.linkedin.com/company/pytrack/about/?viewAsMember=true',
  updated_at      timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;
-- leitura pública (anúncio/locale), escrita só via service role (admin server)
drop policy if exists site_settings_read on public.site_settings;
create policy site_settings_read on public.site_settings
  for select to anon, authenticated using (true);

notify pgrst, 'reload schema';
