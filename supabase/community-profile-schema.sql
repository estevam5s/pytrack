-- ============================================================
-- PyTrack Comunidade — Perfil profissional completo (estilo LinkedIn)
-- Experiências, formação, certificados, prêmios, idiomas, notas,
-- recomendações, serviços + URL vanity + endorsements de skills.
-- ============================================================

-- URL pública (vanity) + idioma do perfil em users_profile
alter table public.users_profile add column if not exists vanity_url text;
alter table public.users_profile add column if not exists profile_lang text default 'pt';
create unique index if not exists users_profile_vanity_uidx
  on public.users_profile (lower(vanity_url)) where vanity_url is not null;

-- ---------- Experiências profissionais ----------
create table if not exists public.community_experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  employment_type text,           -- tempo integral, meio período, freelance...
  company text not null,
  company_logo_url text,          -- link do ícone da empresa
  is_current boolean default false,
  start_date date,
  end_date date,
  location text,
  location_type text,             -- presencial, remoto, híbrido
  description text,
  found_via text,                 -- onde achou a vaga
  skills text[] default '{}',
  position int default 0,
  created_at timestamptz default now()
);

-- ---------- Formação acadêmica ----------
create table if not exists public.community_education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school text not null,
  degree text,
  field_of_study text,
  start_date date,
  end_date date,
  grade text,
  activities text,
  description text,
  skills text[] default '{}',
  position int default 0,
  created_at timestamptz default now()
);

-- ---------- Licenças e certificados ----------
create table if not exists public.community_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  issuer text not null,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  skills text[] default '{}',
  position int default 0,
  created_at timestamptz default now()
);

-- ---------- Reconhecimentos e prêmios ----------
create table if not exists public.community_awards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  issuer text,
  award_date date,
  image_url text,                 -- LINK (não upload, p/ poupar o banco)
  description text,
  skills text[] default '{}',
  position int default 0,
  created_at timestamptz default now()
);

-- ---------- Idiomas ----------
create table if not exists public.community_languages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  language text not null,
  proficiency text,               -- básico, intermediário, avançado, fluente, nativo
  position int default 0,
  created_at timestamptz default now()
);

-- ---------- Notas de provas / test scores ----------
create table if not exists public.community_test_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  score text,
  test_date date,
  description text,
  position int default 0,
  created_at timestamptz default now()
);

-- ---------- Recomendações (estilo LinkedIn) ----------
create table if not exists public.community_recommendations (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,  -- quem recomenda
  target_id uuid not null references auth.users(id) on delete cascade,  -- quem recebe
  relationship text,              -- ex.: "Gestor direto", "Colega de equipe"
  body text not null,
  status text default 'visible',  -- visible | pending | hidden
  created_at timestamptz default now(),
  unique (author_id, target_id)
);

-- ---------- Endorsements de competências (skills puxadas da plataforma) ----------
create table if not exists public.community_skill_endorsements (
  id uuid primary key default gen_random_uuid(),
  target_id uuid not null references auth.users(id) on delete cascade,
  endorser_id uuid not null references auth.users(id) on delete cascade,
  skill text not null,
  created_at timestamptz default now(),
  unique (target_id, endorser_id, skill)
);

-- ---------- Página de serviços ----------
create table if not exists public.community_services (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_open boolean default false,           -- aberto a propostas
  overview text,
  services text[] default '{}',            -- serviços prestados
  affiliated_company text,
  affiliated_company_logo text,
  media_urls text[] default '{}',          -- links de mídia
  updated_at timestamptz default now()
);

-- ============================================================
-- RLS — leitura pública (perfil público); escrita só do dono.
-- Recomendações: o autor escreve; alvo e autor enxergam visíveis.
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'community_experiences','community_education','community_certificates',
    'community_awards','community_languages','community_test_scores'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I_read on public.%I', t, t);
    execute format('create policy %I_read on public.%I for select using (true)', t, t);
    execute format('drop policy if exists %I_own on public.%I', t, t);
    execute format('create policy %I_own on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t, t);
  end loop;
end $$;

-- Serviços
alter table public.community_services enable row level security;
drop policy if exists services_read on public.community_services;
create policy services_read on public.community_services for select using (true);
drop policy if exists services_own on public.community_services;
create policy services_own on public.community_services for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Recomendações
alter table public.community_recommendations enable row level security;
drop policy if exists recs_read on public.community_recommendations;
create policy recs_read on public.community_recommendations for select using (status = 'visible' or auth.uid() = author_id or auth.uid() = target_id);
drop policy if exists recs_author on public.community_recommendations;
create policy recs_author on public.community_recommendations for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- Endorsements
alter table public.community_skill_endorsements enable row level security;
drop policy if exists endo_read on public.community_skill_endorsements;
create policy endo_read on public.community_skill_endorsements for select using (true);
drop policy if exists endo_own on public.community_skill_endorsements;
create policy endo_own on public.community_skill_endorsements for all using (auth.uid() = endorser_id) with check (auth.uid() = endorser_id);

-- índices
create index if not exists idx_exp_user on public.community_experiences(user_id);
create index if not exists idx_edu_user on public.community_education(user_id);
create index if not exists idx_cert_user on public.community_certificates(user_id);
create index if not exists idx_award_user on public.community_awards(user_id);
create index if not exists idx_lang_user on public.community_languages(user_id);
create index if not exists idx_test_user on public.community_test_scores(user_id);
create index if not exists idx_rec_target on public.community_recommendations(target_id);
create index if not exists idx_endo_target on public.community_skill_endorsements(target_id);

notify pgrst, 'reload schema';
