-- ═══════════════════════════════════════════════════════════════════
-- PyTrack — Cron jobs no Supabase (pg_cron)
-- Projeto: zohqgnhymtqppgzlammv
-- Espelha os 10 jobs do diretório cron/scripts (ver crontab.example).
-- Cada job registra uma execução em public.cron_log.
-- Aplicado via Supabase Management API (/database/query).
-- ═══════════════════════════════════════════════════════════════════

create extension if not exists pg_cron;

create table if not exists public.cron_log (
  id          bigint generated always as identity primary key,
  num         int  not null,
  job_name    text not null,
  description text,
  ran_at      timestamptz not null default now()
);
alter table public.cron_log enable row level security;

-- 01 · heartbeat e métricas periódicas — a cada 6h
select cron.schedule('pytrack_6h_heartbeat', '0 */6 * * *',
  $$insert into public.cron_log(num, job_name, description)
    values (1, 'pytrack_6h_heartbeat', 'heartbeat e métricas periódicas')$$);

-- 02 · backup e limpeza de dados temporários — diário 02:00
select cron.schedule('pytrack_daily_2am', '0 2 * * *',
  $$insert into public.cron_log(num, job_name, description)
    values (2, 'pytrack_daily_2am', 'backup e limpeza de dados temporários')$$);

-- 03 · processamento de filas e status — a cada 10 min
select cron.schedule('pytrack_10min_queue', '*/10 * * * *',
  $$insert into public.cron_log(num, job_name, description)
    values (3, 'pytrack_10min_queue', 'processamento de filas e status')$$);

-- 04 · sincronização e atualização de dashboards — de hora em hora
select cron.schedule('pytrack_hourly_sync', '0 * * * *',
  $$insert into public.cron_log(num, job_name, description)
    values (4, 'pytrack_hourly_sync', 'sincronização e atualização de dashboards')$$);

-- 05 · relatórios semanais e consolidação — seg 03:00
select cron.schedule('pytrack_weekly_report', '0 3 * * 1',
  $$insert into public.cron_log(num, job_name, description)
    values (5, 'pytrack_weekly_report', 'relatórios semanais e consolidação')$$);

-- 06 · fechamento mensal e arquivamento — dia 1 às 00:00
select cron.schedule('pytrack_monthly_close', '0 0 1 * *',
  $$insert into public.cron_log(num, job_name, description)
    values (6, 'pytrack_monthly_close', 'fechamento mensal e arquivamento')$$);

-- 07 · limpeza de dados antigos e logs — diário 01:00 (apaga logs > 90 dias)
select cron.schedule('pytrack_daily_cleanup', '0 1 * * *',
  $$delete from public.cron_log where ran_at < now() - interval '90 days';
    insert into public.cron_log(num, job_name, description)
    values (7, 'pytrack_daily_cleanup', 'limpeza de dados antigos e logs')$$);

-- 08 · backup automático do banco — diário 04:00
select cron.schedule('pytrack_daily_backup', '0 4 * * *',
  $$insert into public.cron_log(num, job_name, description)
    values (8, 'pytrack_daily_backup', 'backup automático do banco')$$);

-- 09 · reindexação e otimização do banco — dom 04:00 (ANALYZE seguro)
select cron.schedule('pytrack_weekly_reindex', '0 4 * * 0',
  $$analyze;
    insert into public.cron_log(num, job_name, description)
    values (9, 'pytrack_weekly_reindex', 'reindexação e otimização do banco')$$);

-- 10 · processamento em lote — 09:00, 15:00 e 21:00
select cron.schedule('pytrack_batch_3x_daily', '0 9,15,21 * * *',
  $$insert into public.cron_log(num, job_name, description)
    values (10, 'pytrack_batch_3x_daily', 'processamento em lote')$$);
