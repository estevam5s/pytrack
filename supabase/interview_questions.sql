-- Perguntas de entrevista por tecnologia (gerada de perguntas.md)
create table if not exists public.interview_questions (
  id          uuid primary key default gen_random_uuid(),
  num         int,
  question    text not null,
  category    text,
  intro       text,
  concept     text,
  application text,
  mistakes    text,
  fix_fast    text,
  code        text,
  order_index int default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_questions_category on public.interview_questions(category);
alter table public.interview_questions enable row level security;
drop policy if exists "read_questions" on public.interview_questions;
create policy "read_questions" on public.interview_questions for select using (true);
