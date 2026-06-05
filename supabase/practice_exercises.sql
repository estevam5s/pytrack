-- Tabela do banco de exercícios (gerada de exercicio_python.md)
create table if not exists public.practice_exercises (
  id             uuid primary key default gen_random_uuid(),
  ex_id          text unique not null,
  title          text not null,
  category       text,
  group_label    text,
  level          difficulty_level not null default 'basico',
  type           text,
  objective      text,
  requirements   text[] default '{}',
  acceptance     text[] default '{}',
  checklist      text[] default '{}',
  suggested_file text,
  suggested_test text,
  source         text,
  order_index    int default 0,
  created_at     timestamptz not null default now()
);
create index if not exists idx_practice_group on public.practice_exercises(group_label);
create index if not exists idx_practice_level on public.practice_exercises(level);
alter table public.practice_exercises enable row level security;
drop policy if exists "read_practice" on public.practice_exercises;
create policy "read_practice" on public.practice_exercises for select using (true);
