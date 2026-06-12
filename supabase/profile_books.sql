-- =====================================================================
-- Perfil avançado + Livros (CRUD + upload) + Supabase Storage
-- =====================================================================

-- ---- Campos extras do perfil --------------------------------------
alter table public.users_profile
  add column if not exists bio          text,
  add column if not exists location     text,
  add column if not exists github_url   text,
  add column if not exists linkedin_url text,
  add column if not exists website_url  text,
  add column if not exists xp           int default 0;

-- ---- Livros: capa, arquivo e dono ---------------------------------
alter table public.books
  add column if not exists cover_url text,
  add column if not exists file_url  text,
  add column if not exists user_id   uuid default auth.uid() references auth.users(id) on delete cascade;

-- read continua público (catálogo); escrita só do dono
drop policy if exists "books_insert" on public.books;
create policy "books_insert" on public.books
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "books_update" on public.books;
create policy "books_update" on public.books
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "books_delete" on public.books;
create policy "books_delete" on public.books
  for delete to authenticated using (auth.uid() = user_id);

-- =====================================================================
-- Storage: buckets públicos para avatar, capas e arquivos de livro
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',     'avatars',     true,  8388608,  array['image/png','image/jpeg','image/jpg','image/gif','image/webp']),
  ('book-covers', 'book-covers', true,  8388608,  array['image/png','image/jpeg','image/jpg','image/gif','image/webp']),
  ('book-files',  'book-files',  true, 104857600, array['application/pdf','application/epub+zip','application/octet-stream'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Políticas de Storage (objetos) para os três buckets
drop policy if exists "media_read"   on storage.objects;
drop policy if exists "media_insert" on storage.objects;
drop policy if exists "media_update" on storage.objects;
drop policy if exists "media_delete" on storage.objects;

create policy "media_read" on storage.objects
  for select using (bucket_id in ('avatars','book-covers','book-files'));
create policy "media_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('avatars','book-covers','book-files'));
create policy "media_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('avatars','book-covers','book-files'));
create policy "media_delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('avatars','book-covers','book-files'));

notify pgrst, 'reload schema';
