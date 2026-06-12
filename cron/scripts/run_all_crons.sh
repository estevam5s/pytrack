#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# Master Cron Runner — scrum-master
# Executa todos os 10 cron jobs manualmente (útil para debug e testes)
# ═══════════════════════════════════════════════════════════════════
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "═══════════════════════════════════════════════════════"
echo " Master Cron Runner — scrum-master"
echo " Iniciado em: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo "═══════════════════════════════════════════════════════"

OK=0; FAIL=0

if "${SCRIPT_DIR}/cron_6h_heartbeat.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_6h_heartbeat falhou"
  ((FAIL++)) || true
fi
if "${SCRIPT_DIR}/cron_daily_2am.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_daily_2am falhou"
  ((FAIL++)) || true
fi
if "${SCRIPT_DIR}/cron_10min_queue.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_10min_queue falhou"
  ((FAIL++)) || true
fi
if "${SCRIPT_DIR}/cron_hourly_sync.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_hourly_sync falhou"
  ((FAIL++)) || true
fi
if "${SCRIPT_DIR}/cron_weekly_report.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_weekly_report falhou"
  ((FAIL++)) || true
fi
if "${SCRIPT_DIR}/cron_monthly_close.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_monthly_close falhou"
  ((FAIL++)) || true
fi
if "${SCRIPT_DIR}/cron_daily_cleanup.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_daily_cleanup falhou"
  ((FAIL++)) || true
fi
if "${SCRIPT_DIR}/cron_daily_backup.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_daily_backup falhou"
  ((FAIL++)) || true
fi
if "${SCRIPT_DIR}/cron_weekly_reindex.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_weekly_reindex falhou"
  ((FAIL++)) || true
fi
if "${SCRIPT_DIR}/cron_batch_3x_daily.sh"; then
  ((OK++))
else
  echo "  ⚠️  cron_batch_3x_daily falhou"
  ((FAIL++)) || true
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo " Resultado: $OK sucessos, $FAIL falhas"
echo " Concluído em: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo "═══════════════════════════════════════════════════════"

[[ $FAIL -eq 0 ]] && exit 0 || exit 1
