# 🤝 Handoff para outro agente (Claude Code) — Projeto PyTrack

> Cole este arquivo (ou peça para o agente lê-lo) ao iniciar uma nova conta do Claude Code
> para que ele assuma o projeto **PyTrack** com todo o contexto: GitHub, Supabase, Stripe,
> CI/CD, deploy, automação, variáveis de ambiente, webhooks, Render e servidores.

---

## 0. Como usar este handoff (comando para a outra conta)

Na **outra conta do Claude Code**, abra o terminal **dentro da pasta do projeto** e diga:

```
Leia docs/AGENT-HANDOFF.md e toda a pasta docs/agent-memory/ para carregar o contexto
do projeto PyTrack. Em seguida, salve os pontos-chave na sua memória de projeto e continue
de onde paramos (veja docs/agent-memory/MEMORY.md para o índice do que já foi feito).
```

> **Sobre a memória do Claude Code:** ela fica em arquivos locais em
> `~/.claude/projects/<caminho-do-projeto-codificado>/memory/`. Ela é **por máquina + por
> pasta do projeto**, NÃO por conta. Então:
> - **Mesma máquina + mesma pasta** → a outra conta já lê a memória automaticamente (o
>   `MEMORY.md` é carregado em todo início de sessão). Não precisa fazer nada.
> - **Outra máquina/conta** → use os arquivos de `docs/agent-memory/` (cópia versionada,
>   com segredos mascarados) — peça para o agente lê-los e re-salvar na própria memória.

---

## 1. O que é o PyTrack

Plataforma SaaS de **educação em Python** (EdTech): trilhas guiadas, +5.000 exercícios com
correção por IA, IDE Python no navegador (Pyodide/WASM), comunidade estilo LinkedIn, planos
de carreira por IA, apps mobile/desktop, bot do Telegram, extensão VS Code, certificados,
billing (Stripe), painel admin completo. Domínio: **www.pytrack.com.br**.

## 2. Stack e arquitetura

- **Frontend/Backend:** Next.js 15 (App Router) + React 19 + TypeScript estrito + Tailwind.
  Route groups: `(site)` (público), `(dashboard)` (logado), `(rede)` (comunidade). Rotas
  top-level full-screen: `/chat`, `/ide`, `/cv/[id]`.
- **Banco/Auth:** Supabase (Postgres + RLS em TODAS as tabelas, Auth/GoTrue, Realtime,
  Storage, Edge Functions). Schema aplicado via **Management API** (REST).
- **Pagamentos:** Stripe (assinaturas + vitalício + cupons/ofertas + webhook).
- **E-mail:** Resend (domínio verificado) + SMTP do Supabase Auth.
- **IA:** NVIDIA NIM / OpenRouter via `lib/ai/openrouter.ts` (`chatComplete`). Modelos
  configuráveis pelo painel `/admin/ia` (tabela `ai_settings`).
- **Deploy:** Vercel (`vercel --prod --yes`). Build: `npm run build`.
- **Apps:** Expo (mobile) e Tauri (desktop) em `aplicativos/` (ignorados no git principal).
- **Bot Telegram:** `bot-telegran/` é um **submódulo** → repo `github.com/estevam5s/pytrack-bot`,
  deploy no **Render**.
- **Analytics de receita:** Utmify (envio de pedidos pago/reembolso via webhook do Stripe).
- **Monitoramento:** Sentry (env-gated) + tabela `error_logs` + `/admin/saude`.

## 3. Playbook operacional (como o agente trabalha)

### Build / deploy
```bash
npx tsc --noEmit          # type-check (sempre antes de commitar)
npm run lint              # lint
npm run build             # build de produção
vercel --prod --yes       # deploy (alias para www.pytrack.com.br)
```
A cada deploy relevante, **criar uma release/tag no GitHub** incrementando a versão
(estamos em ~v1.4.x). Use git tag + push da tag; se a API REST do GitHub estiver
inacessível (já aconteceu: HTTP 000), as **tags via git push funcionam** e viram release
depois.

### Git / GitHub
- Remote `dados` = `github.com/estevam5s/pytrack` (público, open source).
- `.env` está no `.gitignore` (NUNCA commitar segredos). Há trava `**/.env`.
- Commits terminam com `Co-Authored-By: Claude ...`.
- Antes de `git add -A`, sempre rodar um **gate de segurança**: garantir que nenhum
  `.env`, `node_modules`, token (`ghp_`, `sbp_`, `re_`, `sk_live`, etc.) ou binário grande
  está staged.

### Supabase (Management API)
- Aplicar SQL/migrations e config de Auth via REST:
  `POST https://api.supabase.com/v1/projects/<REF>/database/query` (header
  `Authorization: Bearer <SUPABASE_MGMT_TOKEN>`).
- Project ref: `zohqgnhymtqppgzlammv` (público). A **anon key é pública** (protegida por
  RLS). A **service_role** só no servidor (Server Actions / Route Handlers), nunca no client.
- Toda tabela nova: habilitar RLS + políticas por `auth.uid() = user_id`.

### Stripe
- Webhook ativo em `https://www.pytrack.com.br/api/stripe/webhook` (assinatura verificada).
- Price IDs (mensal/anual/vitalício) em `lib/billing-access.ts` (TIER_BY_PRICE). Cupons de
  oferta criados via API com `apiVersion: "2024-06-20"` (a versão "dahlia" 2026 quebra o
  param `coupon` em promotion_codes).
- Webhook envia vendas/reembolsos/renovações para a **Utmify** (`lib/utmify.ts`).

### Variáveis de ambiente
- No **Vercel** (criptografadas) + `.env` local (gitignored). Adicionar via
  `vercel env add NOME production` (e preview/development).
- Principais: `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`, `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_*`, `RESEND_API_KEY`, `NVIDIA_API_KEY`,
  `OPENROUTER_API_KEY`, `UTMIFY_API_TOKEN`, `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN`.

### Bot / Render / submódulo
- `bot-telegran/` é submódulo → repo `pytrack-bot`. Ao clonar: `git clone --recurse-submodules`
  ou `git submodule update --init`. Tem CI próprio (GitHub Actions) + deploy no Render.
- O `.env` do bot (token do Telegram + service key) **fica fora dos repos** (gitignored).

## 4. 🔐 Segurança — AÇÃO OBRIGATÓRIA antes de continuar

Durante o desenvolvimento, **vários tokens circularam em texto** e estão **comprometidos**.
O novo agente (e o usuário) **devem ROTACIONAR** estas credenciais antes de operar:

- GitHub PAT, Supabase Management token, Stripe (restricted/secret), Resend API key,
  Telegram bot token, Utmify token, Sentry token, chaves NVIDIA/OpenRouter, senha de app do
  Gmail.

Nos arquivos de `docs/agent-memory/` esses segredos aparecem **mascarados** como
`<..._ROTACIONAR>`. Os valores reais vivem apenas no `.env` (local) e no Vercel (env).
**Nunca cole segredos reais em arquivos versionados, prompts ou no chat.**

Outras pendências de segurança recomendadas (ver `docs/SEGURANCA.md`): captcha no
cadastro/login, MFA obrigatório no admin, backups gerenciados (Supabase Pro), alertas de
webhook falho (já implementado), LGPD formal (DPA/retenção/DPO — já documentado).

## 5. O que já foi feito (índice)

Veja **`docs/agent-memory/MEMORY.md`** (índice) e os arquivos temáticos em
`docs/agent-memory/` para o histórico detalhado: plataforma, tema/rotas, cron, comunidade,
billing, trilhas, perfil/suporte, extensão VS Code, apps mobile/desktop, distribuição,
ferramentas admin, bot Telegram, features por plano, melhorias UI, newsletter/auth.

Documentos de negócio/operação úteis: `docs/SEGURANCA.md` (auditoria), `micro-saas.md`
(estratégia), `docs/Guia-SaaS-PyTrack.pdf` (guia passo a passo), `docs/LGPD-DPA-Retencao.md`.

## 6. Como dar continuidade

1. Carregue este handoff + `docs/agent-memory/`.
2. Rode `npx tsc --noEmit && npm run build` para confirmar que o projeto compila.
3. Confirme acesso: `.env` presente, login no Vercel/Stripe/Supabase/GitHub (peça ao
   usuário se faltar algo — credenciais devem ser rotacionadas e fornecidas por ele).
4. Trabalhe em incrementos pequenos: tsc → lint → build → deploy → tag → atualizar memória.
5. **Sempre** salve aprendizados não-óbvios na memória de projeto (um fato por arquivo,
   com frontmatter) e atualize o `MEMORY.md`.

---

> Feito com 🐍 pela PyTrack. Bem-vindo(a) ao projeto — mantenha a qualidade, a segurança e
> a transparência (relate o que foi feito, o que falhou e o que ficou pendente).
