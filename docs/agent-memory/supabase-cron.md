---
name: supabase-cron
description: pg_cron jobs criados no Supabase do PyTrack (10 jobs agendados)
metadata: 
  node_type: memory
  type: project
  originSessionId: e80488b4-200b-45f2-a1a1-9c9739d237ee
---

O projeto Supabase do PyTrack (ref `zohqgnhymtqppgzlammv`) tem **10 cron jobs (pg_cron)** ativos, criados a partir do diretório `cron/scripts` (que vinha do projeto scrum-master — eram shell scripts que faziam POST num `table_cron`). Ver também [[pytrack-platform]].

- Extensão `pg_cron` habilitada; jobs registram execução em `public.cron_log (id, num, job_name, description, ran_at)` (RLS on, sem policies → só postgres/service).
- SQL fonte versionado em `cron/supabase-cron.sql`. Aplicado via **Management API** `POST https://api.supabase.com/v1/projects/zohqgnhymtqppgzlammv/database/query` com `Authorization: Bearer <SUPABASE_MGMT_TOKEN_ROTACIONAR>` (token de management; NÃO está no .env — o .env só tem URL/anon/service-role/openrouter).
- Jobs (nome · schedule): `pytrack_6h_heartbeat 0 */6 * * *` · `pytrack_daily_2am 0 2 * * *` · `pytrack_10min_queue */10 * * * *` · `pytrack_hourly_sync 0 * * * *` · `pytrack_weekly_report 0 3 * * 1` · `pytrack_monthly_close 0 0 1 * *` · `pytrack_daily_cleanup 0 1 * * *` (apaga logs >90d) · `pytrack_daily_backup 0 4 * * *` · `pytrack_weekly_reindex 0 4 * * 0` (ANALYZE) · `pytrack_batch_3x_daily 0 9,15,21 * * *`.
- `cron.schedule(nome, ...)` faz upsert por nome (reexecutar o SQL é idempotente). Ver/gerenciar no dashboard: Integrations → Cron, ou `select * from cron.job` / `cron.job_run_details`. Remover: `select cron.unschedule('nome')`.
