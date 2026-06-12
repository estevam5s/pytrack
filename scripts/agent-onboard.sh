#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# PyTrack — Onboarding de Agente (Claude Code)
# Prepara o ambiente para um novo agente assumir o projeto e imprime o prompt
# que deve ser dado à nova conta. Também valida build, varre segredos e mostra
# a localização da memória.
#
# Uso:
#   bash scripts/agent-onboard.sh           # onboarding completo
#   bash scripts/agent-onboard.sh --check   # só valida (tsc/build/scan)
#   bash scripts/agent-onboard.sh --rotate  # imprime o checklist de rotação
#   bash scripts/agent-onboard.sh --prompt  # só imprime o prompt da nova conta
# ──────────────────────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")/.."
BOLD="\033[1m"; GREEN="\033[32m"; YELLOW="\033[33m"; RED="\033[31m"; BLUE="\033[34m"; OFF="\033[0m"

hr() { printf '%s\n' "────────────────────────────────────────────────────────────"; }
ok() { printf "${GREEN}✓${OFF} %s\n" "$1"; }
warn() { printf "${YELLOW}⚠${OFF}  %s\n" "$1"; }
err() { printf "${RED}✗${OFF} %s\n" "$1"; }

print_prompt() {
  hr; printf "${BOLD}${BLUE}PROMPT PARA A NOVA CONTA DO CLAUDE CODE${OFF}\n"; hr
  cat <<'PROMPT'
Você vai assumir o desenvolvimento do projeto PyTrack (SaaS de educação em Python).

1) Leia docs/AGENT-HANDOFF.md e TODA a pasta docs/agent-memory/ para carregar o contexto
   completo (stack, GitHub, Supabase, Stripe, CI/CD, deploy, env, webhooks, Render, bot).
2) Salve os pontos-chave na sua memória de projeto (um fato por arquivo, com frontmatter) e
   mantenha o MEMORY.md atualizado.
3) Adote o playbook de operação do handoff: para cada tarefa, faça em incrementos pequenos →
   `npx tsc --noEmit` → `npm run lint` → `npm run build` → `vercel --prod --yes` → criar tag
   de release no GitHub → atualizar a memória. Rode um gate de segurança antes de cada commit
   (nenhum .env/token/binário staged).
4) Confirme as credenciais com o usuário (devem estar rotacionadas — ver
   docs/ROTACAO-CREDENCIAIS.md). Nunca cole segredos em arquivos versionados, prompts ou chat.
5) Continue de onde paramos (veja docs/agent-memory/MEMORY.md) e aplique os MESMOS padrões em
   futuros SaaS: Next.js + Supabase (RLS) + Stripe + Vercel, segurança e LGPD, automação de
   deploy/CI, e documentação/memória sempre atualizadas.

Pode começar confirmando que o projeto compila (npx tsc --noEmit && npm run build) e me
trazendo um resumo do estado atual + as 3 próximas melhorias sugeridas.
PROMPT
  hr
}

print_rotate() {
  if [ -f docs/ROTACAO-CREDENCIAIS.md ]; then
    hr; printf "${BOLD}CHECKLIST DE ROTAÇÃO${OFF} (docs/ROTACAO-CREDENCIAIS.md)\n"; hr
    grep -E "^\| ☐" docs/ROTACAO-CREDENCIAIS.md | sed 's/|/ /g'
    hr
  else
    err "docs/ROTACAO-CREDENCIAIS.md não encontrado"
  fi
}

scan_secrets() {
  printf "${BOLD}Varredura de segredos (arquivos rastreados)…${OFF}\n"
  # padrões PRECISOS (evita falsos positivos com palavras tipo "re_arquitetura")
  local pat='ghp_[A-Za-z0-9]{36}|sbp_[a-f0-9]{40}|sk_live_[A-Za-z0-9]{24}|rk_live_[A-Za-z0-9]{24}|whsec_[A-Za-z0-9]{30}|re_[A-Za-z0-9]{8}_[A-Za-z0-9]{20}|[0-9]{9,10}:AA[A-Za-z0-9_-]{33}|sntryu_[a-f0-9]{60}'
  # exclui conteúdo didático e backups de dados (não são configs)
  local hits
  hits=$(git grep -lE "$pat" -- . ':!docs/ROTACAO-CREDENCIAIS.md' ':!doc/' ':!backups/' ':!supabase/*.json' 2>/dev/null || true)
  if [ -n "$hits" ]; then
    err "Possíveis segredos em arquivos rastreados:"; echo "$hits"
    return 1
  fi
  ok "Nenhum segredo conhecido em arquivos rastreados"
}

check_env() {
  command -v node >/dev/null && ok "node $(node -v)" || err "node não encontrado"
  command -v npm >/dev/null && ok "npm $(npm -v)" || err "npm não encontrado"
  command -v git >/dev/null && ok "git ok" || err "git não encontrado"
  command -v vercel >/dev/null && ok "vercel CLI ok" || warn "vercel CLI ausente (npm i -g vercel)"
  [ -f .env ] && ok ".env presente" || warn ".env ausente — peça as credenciais (rotacionadas) ao usuário"
  [ -d node_modules ] && ok "node_modules ok" || warn "rode 'npm install'"
}

build_check() {
  printf "${BOLD}Type-check…${OFF}\n"; npx tsc --noEmit && ok "tsc limpo" || { err "tsc falhou"; return 1; }
  printf "${BOLD}Build…${OFF}\n"; npm run build >/tmp/pytrack-build.log 2>&1 && ok "build OK" || { err "build falhou (veja /tmp/pytrack-build.log)"; return 1; }
}

show_memory() {
  hr; printf "${BOLD}MEMÓRIA${OFF}\n"; hr
  echo "Local (auto-carregada na MESMA máquina+pasta):"
  echo "  ~/.claude/projects/-Users-estevamsouza-Documents-aulas-plataforma-python/memory/"
  echo "Cópia versionada (para OUTRA máquina), com segredos mascarados:"
  echo "  docs/agent-memory/  (índice: docs/agent-memory/MEMORY.md)"
}

case "${1:-}" in
  --prompt) print_prompt; exit 0 ;;
  --rotate) print_rotate; exit 0 ;;
  --check) hr; printf "${BOLD}PyTrack — verificação${OFF}\n"; hr; check_env; scan_secrets; build_check; exit 0 ;;
esac

hr; printf "${BOLD}${BLUE}🐍 PyTrack — Onboarding de Agente${OFF}\n"; hr
check_env
echo; scan_secrets || warn "Resolva os segredos antes de commitar/abrir o repo"
echo; show_memory
echo; print_prompt
echo; warn "ANTES de operar: rotacione as credenciais → bash scripts/agent-onboard.sh --rotate"
echo "Para validar o projeto:        bash scripts/agent-onboard.sh --check"
