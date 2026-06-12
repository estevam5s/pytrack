#!/usr/bin/env bash
# PyTrack — CLI de criação de SaaS (construir-saas)
# Uso: curl -fsSL https://www.pytrack.com.br/pytrack-saas.sh | bash
# Disponível a partir do plano Completo (R$19).

set -e
API="https://www.pytrack.com.br/api/saas/scaffold"

# Lê do terminal mesmo quando o script vem por pipe (curl | bash).
TTY=/dev/tty
if [ ! -r "$TTY" ]; then
  echo "  ❌ Este instalador precisa de um terminal interativo."
  echo "     Baixe e rode assim:"
  echo "        curl -fsSL $0 -o pytrack-saas.sh && bash pytrack-saas.sh"
  exit 1
fi

echo ""
echo "  🐍  PyTrack — Construtor de SaaS"
echo "  ──────────────────────────────────────────"
echo "  Cria a arquitetura inicial do seu SaaS na sua máquina."
echo "  Requer plano Completo (R\$19) ou superior."
echo ""

# credenciais (identificam o seu plano)
printf "  E-mail PyTrack: "; read -r EMAIL < "$TTY"
printf "  Senha: "; read -rs PASSWORD < "$TTY"; echo ""

echo ""
echo "  Escolha sua stack:"
echo "    1) Next.js + Supabase + Stripe   (full-stack, recomendado)"
echo "    2) FastAPI + PostgreSQL          (API Python)"
echo "    3) Flask                         (Python simples)"
echo "    4) Django + DRF                  (Python robusto)"
echo "    5) Express + Prisma              (Node.js)"
printf "  Opção [1-5]: "; read -r OPT < "$TTY"

case "$OPT" in
  2) STACK="fastapi-postgres";;
  3) STACK="flask";;
  4) STACK="django";;
  5) STACK="express-prisma";;
  *) STACK="nextjs-supabase";;
esac

printf "  Nome do projeto: "; read -r NAME < "$TTY"
NAME="${NAME:-meu-saas}"

echo ""
echo "  ⏳ Validando seu plano e gerando a arquitetura..."

json_escape() { printf '%s' "$1" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))'; }
PAYLOAD=$(printf '{"email":%s,"password":%s,"stack":%s,"name":%s}' \
  "$(json_escape "$EMAIL")" "$(json_escape "$PASSWORD")" "$(json_escape "$STACK")" "$(json_escape "$NAME")")

# -s para silencioso, mas captura corpo e status separadamente
HTTP=$(curl -sS -o /tmp/pytrack_scaffold.out -w "%{http_code}" -X POST "$API" -H "Content-Type: application/json" -d "$PAYLOAD" 2>/dev/null || echo "000")
RESP="$(cat /tmp/pytrack_scaffold.out 2>/dev/null || true)"
rm -f /tmp/pytrack_scaffold.out

if [ "$HTTP" = "000" ]; then
  echo "  ❌ Não foi possível conectar à PyTrack. Verifique sua internet."
  exit 1
fi

if printf '%s' "$RESP" | grep -q '"error"'; then
  ERR=$(printf '%s' "$RESP" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("error","erro"))' 2>/dev/null || echo "Falha na validação")
  echo "  ❌ $ERR"
  exit 1
fi

if [ "$HTTP" != "200" ] || [ -z "$RESP" ]; then
  echo "  ❌ Resposta inesperada (HTTP $HTTP). Tente novamente em instantes."
  exit 1
fi

# executa o scaffold recebido
echo ""
bash -c "$RESP"
echo ""
echo "  🚀 Pronto! Bons códigos. — PyTrack"
