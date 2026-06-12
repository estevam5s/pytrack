-- =====================================================================
-- Aulas do YouTube + Vagas de TI (CRUD por usuário)
-- =====================================================================

-- ---- YouTube: vídeos e playlists ----------------------------------
create table if not exists public.youtube_content (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid default auth.uid() references auth.users(id) on delete cascade,
  kind          text not null default 'video',          -- 'video' | 'playlist'
  title         text not null,
  url           text not null,
  thumbnail_url text,
  channel       text,
  description   text,
  category      text,
  created_at    timestamptz not null default now()
);

alter table public.youtube_content enable row level security;
drop policy if exists "yt_select" on public.youtube_content;
drop policy if exists "yt_insert" on public.youtube_content;
drop policy if exists "yt_update" on public.youtube_content;
drop policy if exists "yt_delete" on public.youtube_content;
create policy "yt_select" on public.youtube_content for select using (auth.uid() = user_id);
create policy "yt_insert" on public.youtube_content for insert with check (auth.uid() = user_id);
create policy "yt_update" on public.youtube_content for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "yt_delete" on public.youtube_content for delete using (auth.uid() = user_id);
create index if not exists idx_yt_user on public.youtube_content(user_id);

-- ---- Vagas de TI ---------------------------------------------------
create table if not exists public.jobs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid default auth.uid() references auth.users(id) on delete cascade,
  title       text not null,
  company     text,
  type        text,          -- CLT, PJ, Estágio, Freelance...
  seniority   text,          -- Júnior, Pleno, Sênior...
  salary      text,
  modality    text,          -- remoto, presencial, híbrido
  location    text,
  description text,
  skills      text[] default '{}',
  stack       text[] default '{}',
  url         text,
  created_at  timestamptz not null default now()
);

alter table public.jobs enable row level security;
drop policy if exists "jobs_select" on public.jobs;
drop policy if exists "jobs_insert" on public.jobs;
drop policy if exists "jobs_update" on public.jobs;
drop policy if exists "jobs_delete" on public.jobs;
create policy "jobs_select" on public.jobs for select using (auth.uid() = user_id);
create policy "jobs_insert" on public.jobs for insert with check (auth.uid() = user_id);
create policy "jobs_update" on public.jobs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "jobs_delete" on public.jobs for delete using (auth.uid() = user_id);
create index if not exists idx_jobs_user on public.jobs(user_id);

notify pgrst, 'reload schema';
