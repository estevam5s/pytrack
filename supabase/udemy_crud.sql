-- =====================================================================
-- /aulas-udemy: CRUD por usuário + banner (image_url) + descrição
-- =====================================================================
alter table public.udemy_courses add column if not exists image_url   text;
alter table public.udemy_courses add column if not exists description  text;
alter table public.udemy_courses add column if not exists user_id      uuid
  default auth.uid() references auth.users(id) on delete cascade;

-- Remove os cursos de exemplo do seed (sem dono) para o usuário começar limpo.
delete from public.udemy_courses where user_id is null;

-- RLS: cada usuário gerencia apenas os próprios cursos.
drop policy if exists "read_udemy_courses" on public.udemy_courses;
drop policy if exists "udemy_select" on public.udemy_courses;
drop policy if exists "udemy_insert" on public.udemy_courses;
drop policy if exists "udemy_update" on public.udemy_courses;
drop policy if exists "udemy_delete" on public.udemy_courses;

create policy "udemy_select" on public.udemy_courses
  for select using (auth.uid() = user_id);
create policy "udemy_insert" on public.udemy_courses
  for insert with check (auth.uid() = user_id);
create policy "udemy_update" on public.udemy_courses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "udemy_delete" on public.udemy_courses
  for delete using (auth.uid() = user_id);

create index if not exists idx_udemy_user on public.udemy_courses(user_id);
