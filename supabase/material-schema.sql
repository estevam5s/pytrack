-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Material complementar — CRUD + upload (extende a tabela materials)
-- Idempotente. Aplicar via scripts/apply-community-schema-style ou REST.
-- ═══════════════════════════════════════════════════════════════════

alter table public.materials add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.materials add column if not exists file_url text;
alter table public.materials add column if not exists updated_at timestamptz not null default now();

alter table public.materials enable row level security;

drop policy if exists materials_read on public.materials;
create policy materials_read on public.materials for select to authenticated using (true);

drop policy if exists materials_insert on public.materials;
create policy materials_insert on public.materials
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists materials_update on public.materials;
create policy materials_update on public.materials
  for update to authenticated using (auth.uid() = user_id);

drop policy if exists materials_delete on public.materials;
create policy materials_delete on public.materials
  for delete to authenticated using (auth.uid() = user_id);

-- bucket de arquivos de material (pdf, zip, etc.) — público, 50MB
insert into storage.buckets (id, name, public, file_size_limit)
values ('material-files', 'material-files', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;

drop policy if exists "material files read" on storage.objects;
create policy "material files read" on storage.objects for select
  using (bucket_id = 'material-files');
drop policy if exists "material files insert" on storage.objects;
create policy "material files insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'material-files');
drop policy if exists "material files delete" on storage.objects;
create policy "material files delete" on storage.objects for delete to authenticated
  using (bucket_id = 'material-files');

notify pgrst, 'reload schema';
