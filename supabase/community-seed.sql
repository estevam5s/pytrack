-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Comunidade — seed de DESENVOLVIMENTO (dados fictícios)
-- Requer pelo menos 1 usuário em auth.users (os posts referenciam auth.users).
-- Reexecutável (evita duplicar pelos textos).
-- ═══════════════════════════════════════════════════════════════════

-- garante community_profiles para todos os usuários existentes
insert into public.community_profiles (user_id, display_name, username, headline, current_track)
select u.id,
       coalesce(p.name, split_part(u.email,'@',1), 'Estudante Python'),
       'user_' || left(replace(u.id::text,'-',''),10),
       'Estudante de Python',
       'Fundamentos de Python'
from auth.users u
left join public.users_profile p on p.user_id = u.id
on conflict (user_id) do nothing;

-- posts fictícios (autor = primeiro usuário)
with author as (select id from auth.users order by created_at limit 1)
insert into public.community_posts (user_id, category, title, content, tags)
select (select id from author), v.category, v.title, v.content, v.tags
from (values
  ('duvida','Erro de indentação no Python','Estou começando e recebo IndentationError. Alguém pode explicar como o Python usa indentação para blocos?', array['python','iniciante']),
  ('projeto','API de tarefas com FastAPI','Terminei minha primeira API REST com FastAPI + SQLAlchemy. Feedback é bem-vindo! 🚀', array['fastapi','backend','sqlalchemy']),
  ('conquista','Concluí a trilha de Fundamentos!','Finalizei todos os módulos de fundamentos e resolvi 120 exercícios. Bora pra Data agora! 🐍', array['python','conquista']),
  ('material','Cheatsheet de Pandas','Compartilhando um resumo dos métodos mais usados de Pandas para análise de dados.', array['pandas','dados']),
  ('discussao','FastAPI vs Django: quando usar cada um?','Qual a experiência de vocês escolhendo entre FastAPI e Django para projetos novos?', array['fastapi','django','backend'])
) as v(category,title,content,tags)
where exists (select 1 from author)
  and not exists (select 1 from public.community_posts cp where cp.title = v.title);

-- vagas fictícias
with author as (select id from auth.users order by created_at limit 1)
insert into public.community_jobs (user_id, title, company, location, remote, seniority, salary_range, apply_url, tags)
select (select id from author), v.title, v.company, v.location, v.remote, v.seniority, v.salary, v.url, v.tags
from (values
  ('Python Backend Developer','TechFlow','São Paulo - SP', true, 'Pleno', 'R$ 8k - 12k', 'https://example.com/vaga1', array['python','fastapi','postgres']),
  ('Engenheiro de Dados Jr','DataLake','Remoto', true, 'Júnior', 'R$ 5k - 8k', 'https://example.com/vaga2', array['python','airflow','spark'])
) as v(title,company,location,remote,seniority,salary,url,tags)
where exists (select 1 from author)
  and not exists (select 1 from public.community_jobs cj where cj.title = v.title and cj.company = v.company);
