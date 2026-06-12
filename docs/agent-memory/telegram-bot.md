---
name: telegram-bot
description: "Bot Telegram PyTrack (@PyTrack_SaaS_Bot) em bot-telegran/; Telegraf+Supabase; login, exercícios c/ IA, admin; CI auto-broadcast"
metadata: 
  node_type: memory
  type: project
  originSessionId: e80488b4-200b-45f2-a1a1-9c9739d237ee
---

⚠️ **bot-telegran ERA repo git EMBUTIDO (gitlink mode 160000)** → `git add -A` dava warning "embedded git repository" e o conteúdo não ia pro repo principal. Corrigido 12/jun/2026: bot-telegran/.git movido p/ backup /tmp, `git rm --cached bot-telegran`, re-adicionado como 21 arquivos normais. .gitignore +bot-telegran/node_modules//dist//.env + trava global `**/.env`. .env do bot NÃO trackeado (gate verificou). aplicativos/mobile+desktop seguem IGNORADOS (.gitignore `aplicativos`) — eram embutidos tb mas ignorados. ⚠️ Os 5 app files que o user achou "não pushados" (admin/site/*, aplicativo/*, apps/page.tsx) ESTAVAM OK no repo (commitados em d28f135, só não mudaram desde então).

**README PROFISSIONAL nos repos gerados (/exercicios,/meus-projetos,IDE)**: `lib/github-readme.ts` buildReadme (badges/sobre/como executar/estrutura/tecnologias/autor) + buildLicense(MIT) + PY_CI_WORKFLOW (GitHub Actions ruff+pytest matriz 3.10-3.12) + GITIGNORE_PY. github-push-button.tsx usado por ai-exercise-review/project-submit/python-ide. Fix createGithubRepo: valida token antes, 401→limpa github_token do perfil+orienta reconectar, msgs p/ 403/422.

**Bot Telegram + CI auto-broadcast + docs apps (jun/2026).**

**Bot** `bot-telegran/` (user escreveu "telegran"): **@PyTrack_SaaS_Bot**, token <TELEGRAM_BOT_TOKEN_ROTACIONAR>. Stack **Telegraf 4 + @supabase/supabase-js + tsx** (Node ESM, .js nos imports). tsc limpo.
- `src/config.ts` (env + adminEmails), `src/index.ts` (bot principal, roteamento, fluxo login texto livre), `src/setup.ts` (setMyCommands+description — RODADO, 10 comandos registrados).
- `src/lib/`: supabase.ts (admin service role), sessions.ts (tabela `telegram_sessions` chat_id→user_id+tokens, cache Map, freshToken via refreshSession), platform.ts (login via /api/extension/login, getUserTier/profile/sub, listExercises/Projects/Tracks, ranking, correctExercise via Edge Function correct-exercise, markExerciseDone→tabela exercise_completions+15xp), state.ts (flow login/upload), broadcast.ts (insere notifications todos).
- `src/commands/`: account (/perfil /plano /ranking), learn (/trilhas /projetos /exercicios+botões inline ex:<id>), exercise (handleDocument: baixa .py via getFileLink → correctExercise → se score>=60 markDone), admin (/admin /stats /usuarios /usuario<email> /plano_set<email><tier> /broadcast<msg> — ensureAdmin via session.isAdmin).
- **Fluxo exercício**: /exercicios [busca] → botões → onPickExercise (mostra objetivo, setFlow upload) → user envia .py → IA corrige+marca. **Login**: /login → pede email → senha (apaga msg) → /api/extension/login → saveSession.
- Tabelas: `telegram_sessions`, `exercise_completions` (unique user_id+ex_id). RLS own.
- **Rodar**: `cd bot-telegran && npm install && npm run setup && npm start` (polling). ⚠️ precisa host 24/7 (Railway/Render/Fly/VPS) p/ produção; preferir webhook em escala. Bot rodou em polling no teste (0 erros, online).

**CI auto-broadcast**: endpoint `app/api/broadcast/route.ts` (POST, Bearer BROADCAST_SECRET, chama broadcastToUsers). Secret BROADCAST_SECRET no Vercel+.env+GitHub repo desktop. Workflow build.yml job `notify` (needs:build, roda 1x, curl /api/broadcast com title nova versão). ⚠️ desktop-v1.0.2 1ª tentativa falhou "Resource not accessible" criar release (tag apontava commit pré-notify/sem perms aplicadas) — re-setado default_workflow_permissions=write + re-tag do main.

**Docs**: `/docs/apps` (app/(site)/docs/apps/page.tsx — seções mobile/desktop/extensão/bot/instalação/segurança, índice sticky, nível /docs). Link em /docs + sitemap. bot-telegran/README.md completo.

⚠️ tsconfig+vercelignore+eslint do site excluem `bot-telegran` (telegraf quebra build do Next).

**Melhorias bot v2 (jun/2026)**: **Menu profissional** `commands/menu.ts` (showMainMenu inline keyboard, handleMenuContent edita a MESMA msg via editMessageText = interface limpa; botões Perfil/Plano/Exercícios/Desafio/Trilhas/Projetos/Ranking/Conquistas/Ajuda/Limpar/Admin). /start e /menu → showMainMenu. Callbacks `menu:*` roteados (home/perfil/plano/trilhas/projetos/ranking/conquistas/ajuda/admin editam; exercicios/desafio/limpar/login enviam nova msg). **Comandos novos** `commands/extras.ts`: /limpar (apaga últimas ~100 msgs via deleteMessage, auto-apaga aviso 4s), /desafio (exercício do dia determinístico), /conquistas (count exercise_completions), /suporte. setMyCommands 15 comandos. Login mostra menu ao final. ⚠️ rows de teclado misto callback+url precisa tipo explícito `ReturnType<typeof Markup.button.callback | typeof Markup.button.url>[][]`.

**BUG correção JSON CORRIGIDO**: Edge Function correct-exercise quebrava com "Expected ',' or '}' in JSON" (IA retorna bestSolution com código multilinha/aspas não escapadas). FIX: `parseAiResult()` robusto (tenta JSON.parse; fallback extrai score/feedback/strengths/improvements/bestSolution por regex; nunca lança; captura bloco ```python se bestSolution vazio). System prompt reforçado (escapar \\n e \\", código ≤15 linhas). Re-deployed.

**Rota `/bot`** (app/(site)/bot/page.tsx): logo do bot (public/bot-logo.jpg baixado via getChat+getFile do Telegram), descrição, link t.me/PyTrack_SaaS_Bot, 6 features, 5 passos de uso, comandos user+admin, privacidade. Nav +Bot, footer Desenvolvedores +Bot, AppsShowcase home 4º card (Telegram), sitemap.

**AUTO-BROADCAST CONFIRMADO funcionando**: desktop-v1.0.2 rebuild (1ª falhou criar release por perms→re-tag do main funcionou) → job notify rodou → criou notification "🖥️ App Desktop v1.0.2 disponível!" p/ todos (5 users). app_releases windows/macos/linux→v1.0.2. ⚠️ Docker build v1.0.2 falhou (não crítico, imagem 1.0.1 funciona). Mobile EAS em queue.

**DEPLOY no Render (free, jun/2026)**: repo público **estevam5s/pytrack-bot** (push do bot-telegran sem .env). Render API key rnd_pklF2LBLH9Bd1205ZWUU7B1NQSJL, workspace tea-ct8a8u9u0jms73dmdn80 ("My Workspace"). Serviço **web_service free** id **srv-d8kr8s1kh4rs73ffgg8g**, URL **https://pytrack-telegram-bot.onrender.com**. **Bot adaptado p/ webhook**: index.ts checa WEBHOOK_URL||RENDER_EXTERNAL_URL → cria http.createServer (rota /health 200 + bot.webhookCallback secretPath) + setWebhook; senão polling. package.json: tsx movido p/ dependencies (Render roda sem build step), start=tsx src/index.ts, engines node>=20. render.yaml blueprint (web free, healthCheckPath /health). 7 env vars setadas via API (BOT_TOKEN/WEBHOOK_URL/SUPABASE_URL/ANON_KEY/SERVICE_ROLE/SITE_URL/ADMIN_EMAILS). ⚠️ PUT /env-vars SUBSTITUI TODAS (re-enviar lista completa). Bot LOCAL parado (polling conflita com webhook). ⚠️ **Render free Web Service hiberna após 15min sem tráfego HTTP** — 1ª msg após idle tem cold start ~30-60s (Telegram re-tenta webhook). P/ manter quente: pinger externo grátis (UptimeRobot/cron-job.org) no /health a cada 14min.