-- =====================================================================
-- Python Learning Dashboard — Schema completo
-- Postgres 17 / Supabase
-- =====================================================================

-- Extensões -----------------------------------------------------------
create extension if not exists "pgcrypto";

-- Tipos enumerados ----------------------------------------------------
do $$ begin
  create type learning_level as enum ('basico', 'intermediario', 'avancado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_status as enum ('nao_iniciado', 'em_andamento', 'concluido');
exception when duplicate_object then null; end $$;

do $$ begin
  create type difficulty_level as enum ('basico', 'intermediario', 'avancado', 'desafio');
exception when duplicate_object then null; end $$;

-- =====================================================================
-- Função util: updated_at automático
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- =====================================================================
-- users_profile
-- =====================================================================
create table if not exists public.users_profile (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null unique references auth.users(id) on delete cascade,
  name          text,
  avatar_url    text,
  current_level learning_level default 'basico',
  goal          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists trg_users_profile_updated on public.users_profile;
create trigger trg_users_profile_updated before update on public.users_profile
  for each row execute function public.set_updated_at();

-- =====================================================================
-- contents (trilhas / módulos de estudo)
-- =====================================================================
create table if not exists public.contents (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  category        text not null,
  level           learning_level not null default 'basico',
  area            text not null,
  order_index     int not null default 0,
  estimated_hours numeric(5,1) default 0,
  status          content_status default 'nao_iniciado',
  created_at      timestamptz not null default now()
);

-- =====================================================================
-- progress (progresso do usuário por conteúdo)
-- =====================================================================
create table if not exists public.progress (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  content_id          uuid not null references public.contents(id) on delete cascade,
  status              content_status not null default 'nao_iniciado',
  progress_percentage int not null default 0 check (progress_percentage between 0 and 100),
  completed_at        timestamptz,
  updated_at          timestamptz not null default now(),
  unique (user_id, content_id)
);

drop trigger if exists trg_progress_updated on public.progress;
create trigger trg_progress_updated before update on public.progress
  for each row execute function public.set_updated_at();

-- =====================================================================
-- stack_items (tecnologias do ecossistema Python)
-- =====================================================================
create table if not exists public.stack_items (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text,
  category          text not null,
  level             learning_level not null default 'basico',
  documentation_url text,
  icon              text,
  created_at        timestamptz not null default now()
);

-- =====================================================================
-- udemy_courses
-- =====================================================================
create table if not exists public.udemy_courses (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  instructor  text,
  url         text,
  category    text,
  level       learning_level default 'basico',
  duration    text,
  status      content_status default 'nao_iniciado',
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- materials (materiais complementares)
-- =====================================================================
create table if not exists public.materials (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  type        text not null,
  url         text,
  category    text,
  level       learning_level default 'basico',
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- books
-- =====================================================================
create table if not exists public.books (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  author      text,
  description text,
  url         text,
  category    text,
  level       learning_level default 'basico',
  status      content_status default 'nao_iniciado',
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- career_paths
-- =====================================================================
create table if not exists public.career_paths (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  area         text not null,
  skills       text[] default '{}',
  roadmap      text[] default '{}',
  technologies text[] default '{}',
  salary_range text,
  level        learning_level default 'basico',
  created_at   timestamptz not null default now()
);

-- =====================================================================
-- exercises
-- =====================================================================
create table if not exists public.exercises (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  difficulty  difficulty_level not null default 'basico',
  category    text,
  tags        text[] default '{}',
  starter_code text,
  solution    text,
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- projects
-- =====================================================================
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  difficulty   difficulty_level not null default 'basico',
  area         text,
  technologies text[] default '{}',
  requirements text[] default '{}',
  steps        text[] default '{}',
  github_url   text,
  status       content_status default 'nao_iniciado',
  created_at   timestamptz not null default now()
);

-- =====================================================================
-- Índices
-- =====================================================================
create index if not exists idx_contents_area on public.contents(area);
create index if not exists idx_contents_level on public.contents(level);
create index if not exists idx_contents_category on public.contents(category);
create index if not exists idx_progress_user on public.progress(user_id);
create index if not exists idx_stack_category on public.stack_items(category);
create index if not exists idx_exercises_difficulty on public.exercises(difficulty);
create index if not exists idx_projects_area on public.projects(area);

-- =====================================================================
-- Trigger: cria users_profile automaticamente ao registrar
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users_profile (user_id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.users_profile enable row level security;
alter table public.progress      enable row level security;
alter table public.contents      enable row level security;
alter table public.stack_items   enable row level security;
alter table public.udemy_courses enable row level security;
alter table public.materials     enable row level security;
alter table public.books         enable row level security;
alter table public.career_paths  enable row level security;
alter table public.exercises     enable row level security;
alter table public.projects      enable row level security;

-- Conteúdo de catálogo: leitura pública para usuários autenticados
do $$
declare t text;
begin
  foreach t in array array['contents','stack_items','udemy_courses','materials','books','career_paths','exercises','projects']
  loop
    execute format('drop policy if exists "read_%1$s" on public.%1$s;', t);
    execute format('create policy "read_%1$s" on public.%1$s for select using (true);', t);
  end loop;
end $$;

-- users_profile: cada usuário gerencia o próprio perfil
drop policy if exists "profile_select" on public.users_profile;
create policy "profile_select" on public.users_profile
  for select using (auth.uid() = user_id);
drop policy if exists "profile_insert" on public.users_profile;
create policy "profile_insert" on public.users_profile
  for insert with check (auth.uid() = user_id);
drop policy if exists "profile_update" on public.users_profile;
create policy "profile_update" on public.users_profile
  for update using (auth.uid() = user_id);

-- progress: cada usuário gerencia o próprio progresso
drop policy if exists "progress_all" on public.progress;
create policy "progress_all" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
