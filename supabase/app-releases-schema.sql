-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Releases dos aplicativos (Android + Desktop). Idempotente.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.app_releases (
  id           uuid primary key default gen_random_uuid(),
  platform     text not null check (platform in ('android', 'windows', 'macos', 'linux')),
  version      text,
  notes        text,
  file_path    text,
  download_url text,
  size_bytes   bigint,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists idx_app_releases_platform on public.app_releases(platform, created_at desc);

alter table public.app_releases enable row level security;

-- qualquer usuário autenticado vê os releases publicados (o gating de download é na UI)
drop policy if exists app_releases_select on public.app_releases;
create policy app_releases_select on public.app_releases
  for select to authenticated using (is_published);

-- escrita só via service role (admin).

-- bucket de storage (público; links só aparecem para Completo+ na UI)
insert into storage.buckets (id, name, public)
values ('app-releases', 'app-releases', true)
on conflict (id) do nothing;

notify pgrst, 'reload schema';
