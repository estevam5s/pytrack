# 💾 Backup e Recuperação — PyTrack

Guia para proteger e restaurar os dados críticos: **banco de dados (Supabase Postgres)**, **Storage** (avatares, capas, materiais, apps) e **configurações** (Stripe, env vars).

---

## 1. Banco de dados (Supabase Postgres)

### Backups automáticos (recomendado)
- O Supabase faz **backups diários automáticos** do banco.
  - Painel: **Database → Backups** (restauração point-in-time disponível em planos pagos).
- **Ação recomendada:** ativar **PITR (Point-in-Time Recovery)** no plano Pro do Supabase para restaurar a qualquer minuto dos últimos dias.

### Backup manual (pg_dump)
Rode periodicamente (ou em CI/cron) com a connection string do projeto:

```bash
# Connection string: Supabase → Project Settings → Database → Connection string (URI)
pg_dump "postgresql://postgres:[SENHA]@db.zohqgnhymtqppgzlammv.supabase.co:5432/postgres" \
  --no-owner --no-privileges -F c -f pytrack-$(date +%F).dump
```

### Restauração
```bash
pg_restore --no-owner --no-privileges -d "postgresql://...":  pytrack-AAAA-MM-DD.dump
# ou, para SQL puro:
psql "postgresql://..." < backup.sql
```

### Schemas versionados (infra como código)
Todos os schemas estão em `supabase/*.sql` e são idempotentes — recriam tabelas, RLS, policies e funções:
- `stripe-subscriptions-schema.sql`, `referrals-schema.sql`, `support-schema.sql`,
  `app-releases-schema.sql`, `user-ai-settings-schema.sql`, `platform-extras-schema.sql`,
  `community-schema.sql`, `material-schema.sql`, `contents_*.sql`.
Aplicáveis via **Supabase SQL Editor** ou **Management API**.

---

## 2. Storage (arquivos)

Buckets: `avatars`, capas de livros/materiais e **`app-releases`** (APKs/binários).

### Backup
```bash
# Supabase CLI
supabase storage download --recursive --experimental \
  ss://app-releases ./backup-storage/app-releases
```
Ou baixe pelo painel **Storage** e guarde em um bucket externo (S3/GCS/Drive).

### Restauração
Recrie os buckets (os SQLs já fazem `insert into storage.buckets ...`) e faça upload dos arquivos de volta.

---

## 3. Configurações críticas

| Item | Onde está | Como recuperar |
|------|-----------|----------------|
| Variáveis de ambiente | Vercel + `.env.local` | Documentadas em `.env.example`; reaplicar com `vercel env add` |
| Produtos/Preços Stripe | Conta Stripe | IDs nas envs `STRIPE_PRICE_ID_*`; recriáveis pela API |
| Webhook Stripe | Stripe → Webhooks | `https://www.pytrack.com.br/api/stripe/webhook` + signing secret |
| Provedores Auth (GitHub) | Supabase → Auth → Providers | Client ID/Secret do GitHub OAuth App |
| Config Auth (Site URL, redirect, MFA, manual linking) | Supabase → Auth | Reaplicável via Management API (`/config/auth`) |

---

## 4. Rotina sugerida

- **Diário:** backup automático do Supabase (ativar PITR).
- **Semanal:** `pg_dump` manual armazenado fora do Supabase + cópia do Storage `app-releases`.
- **A cada mudança de schema:** versionar o `.sql` em `supabase/` (já feito).
- **Mensal:** teste de restauração em um projeto Supabase de staging.

---

## 4.1 🛡️ Backup automático anti-ban (independente do painel)

Caso o Supabase **bane/suspenda a conta** ou o projeto seja perdido, há backup completo fora do painel:

- **Script**: `scripts/backup-supabase.mjs` — exporta **todas as tabelas** (JSON) + **todos os arquivos do storage** + `manifest.json`, via REST (service role) + Management API. Testado: 38 tabelas (1.719 perguntas, 2.462 exercícios, 1.364 projetos…) ~7,4 MB.
- **Automação**: `.github/workflows/backup.yml` roda **todo domingo** (e sob demanda) e guarda como **artifact no GitHub por 90 dias** — fora do Supabase. Opcional: enviar para S3/R2.

Rodar manual:
```bash
SUPABASE_MANAGEMENT_TOKEN=sbp_... SUPABASE_PROJECT_REF=zohqgnhymtqppgzlammv \
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co SUPABASE_SERVICE_ROLE=eyJ... \
node scripts/backup-supabase.mjs
```
Secrets do GitHub Actions: `SUPABASE_MANAGEMENT_TOKEN`, `SUPABASE_PROJECT_REF`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`.

> `backups/` está no `.gitignore` (não versionar dados de usuário). Guarde os artifacts em local privado.

---

## 5. Recuperação de desastre (resumo)

1. Criar/restaurar projeto Supabase (ou usar o existente).
2. Restaurar o banco (PITR ou `pg_restore`).
3. Recriar buckets e restaurar arquivos do Storage.
4. Reaplicar env vars na Vercel (`.env.example` como referência) e redeploy.
5. Reapontar o webhook da Stripe e reativar provedores Auth.
6. Validar em `/status`.
