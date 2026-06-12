#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# Cron Job 04: cron_hourly_sync
# Projeto: scrum-master
# Frequência: a cada hora
# Agendamento cron: 0 * * * *
# Descrição: sincronização e atualização de dashboards
# ═══════════════════════════════════════════════════════════════════
set -euo pipefail

SUPABASE_URL="https://fryrzxlefaftyvzuhmgy.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyeXJ6eGxlZmFmdHl2enVobWd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU0MjMxNCwiZXhwIjoyMDkzMTE4MzE0fQ.5P8bOKYKh4YzhaJKSTnXIDinpvzsvK2xckqjZpJJZVE"

echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] Iniciando cron job 04: cron_hourly_sync"

# Inserir na table_cron
RESPONSE=$(curl -s -w "\n__HTTP__%{http_code}" \
  -X POST "${SUPABASE_URL}/rest/v1/table_cron" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"num":4}')

BODY=$(echo "$RESPONSE" | sed '$d')
CODE=$(echo "$RESPONSE" | tail -1 | sed 's/__HTTP__//')

if [[ "$CODE" == "200" || "$CODE" == "201" ]]; then
  echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] ✅ Cron 04 executado com sucesso (HTTP $CODE)"
else
  echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] ❌ Erro HTTP $CODE: $BODY" >&2
  exit 1
fi
