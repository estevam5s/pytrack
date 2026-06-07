# 🖥️ Prompt — App Desktop PyTrack (Windows · macOS · Linux) com Claude Code

> Cole este arquivo inteiro como instrução para o **Claude Code** construir o **aplicativo desktop** do PyTrack para as **3 plataformas** (Windows, macOS e Linux). Não é um site embrulhado — é um **app desktop nativo** que consome o **mesmo backend** (Supabase + Stripe), com **todas as rotas** (incluindo admin), **todas as trilhas** e **toda a segurança** já existentes no site.

---

## 0. Objetivo

App desktop oficial do PyTrack, instalável em **Windows (.exe/.msi)**, **macOS (.dmg)** e **Linux (.AppImage/.deb)**. Espelha o dashboard web (trilhas, conteúdos, exercícios com IA, IDE Python, comunidade, carreira, configurações, suporte e **painel admin**). **Tem Login, mas NÃO tem cadastro** — registro é no site (`https://www.pytrack.com.br/auth/register`); no app, botão "Criar conta no site" abre o navegador.

## 1. Stack obrigatória

- **Tauri 2** (Rust) — binários pequenos e seguros, cross-platform nativo (preferível ao Electron).
  - *Alternativa aceitável:* Electron, se houver bloqueio com Tauri — mas priorize **Tauri**.
- **Frontend**: **React 19 + Vite + TypeScript** + **Tailwind CSS** (reaproveitar os tokens/design da web) + **react-router** (espelhar as rotas do Next).
- **@supabase/supabase-js** para auth/dados.
- **@tanstack/react-query** para dados/cache.
- **Pyodide** (WebAssembly) embutido na webview do Tauri para a **IDE Python** (igual à web).
- Ícones: **lucide-react**. Markdown: `react-markdown` + `remark-gfm` + `rehype-highlight`.
- Armazenamento seguro de sessão: **Tauri Stronghold** ou o keychain do SO (não deixar refresh token em localStorage puro).

## 2. Backend (o MESMO — não criar outro)

- **Supabase** ref `zohqgnhymtqppgzlammv` — URL `https://zohqgnhymtqppgzlammv.supabase.co`.
  - Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (anon key é pública, protegida por RLS).
- **RLS ativo** em tudo: o app usa só anon key + sessão. **NUNCA** embutir `service_role` nem segredos de servidor.
- Tabelas: `users_profile`, `contents`, `progress`, `subscriptions`, `community_*`, `support_messages`, `user_ai_settings`, `referrals`, `app_releases`, `community_reports`, `rate_limits`.
- **IA** (exercícios/consultor): chamada **server-side** via Supabase Edge Function ou endpoint HTTPS do site. Sem chave de IA no app. Respeitar BYOK (`user_ai_settings`).

## 3. Autenticação e segurança (replicar a da web)

- **Login** (`/login`): e-mail + senha.
- **GitHub OAuth**: `signInWithOAuth({ provider: 'github' })` — no desktop, abrir o fluxo no navegador padrão e capturar o retorno via **deep link** (`pytrack://auth/callback`) registrado pelo Tauri; ou usar um servidor local efêmero (loopback) para o callback. Configurar a allowlist de redirect no Supabase.
- **2FA (TOTP)**: após a senha, se AAL `aal1→aal2`, exibir `/auth/mfa` (challenge+verify). Bloquear até `aal2`.
- **Sem cadastro**: botão → abre `https://www.pytrack.com.br/auth/register` no navegador.
- **Gating por plano** idêntico: `free<essencial<completo<suprema<vitalicio`; 7 dias grátis para quem não paga; Completo+ libera comunidade/projetos/especializações/consultor/vagas/perguntas; módulos avançados exigem Completo+.
- O gating real é do backend/RLS; o app reflete o estado.

## 4. Navegação e TODAS as rotas (espelhar o dashboard)

Layout desktop: **sidebar fixa** (grupos: Estudar, Recursos, Carreira, Conta, e **Admin** só para admins) + topbar. Rotas (react-router):

**Auth:** `/login` · `/auth/mfa` · `/auth/callback`

**Estudar:** `/inicio` · `/trilhas` · `/trilhas/:id` · `/conteudos/:modulo` · `/conteudos/:modulo/:licao` · `/comunidade` (Completo+) · `/evolucao` · `/stack` · `/exercicios` · `/ide`

**Recursos:** `/aulas-udemy` · `/aulas-youtube` · `/material` · `/livros` · `/aplicativo`

**Carreira:** `/minha-carreira` · `/especializacoes` · `/consultor-ia` · `/vagas` · `/perguntas-carreira-python`

**Conta:** `/perfil` · `/configuracoes` (+ `conta`, `perfil`, `plano`, `ia`, `indicacoes`, `seguranca`, `aparencia`, `plataforma`, `dados`) · `/suporte`

**Admin** (somente `contato@estevamsouza.com.br` e `estevamsouzalaureth@gmail.com`; esconder dos demais):
- `/admin` (hub + criar usuário Suprema vitalício)
- `/admin/clientes` (MRR/ARR/assinaturas/planos, lista com excluir/mudar plano, busca, CSV; **excluir os admins do faturamento**)
- `/admin/moderacao` (denúncias: remover post/bloquear autor/resolver; bloqueados)
- `/admin/mensagens` (suporte: ler/responder)

> Rota inexistente → tela **404 informativa**.

## 5. Pagamentos (Stripe)

- Sem cartão dentro do app. Assinar/upgrade/downgrade/portal/reembolso → abrir `https://www.pytrack.com.br/assinar` (ou Checkout/portal) no **navegador padrão** (`@tauri-apps/plugin-shell` `open`), e ao retornar recarregar a assinatura.
- Planos: Grátis (7 dias) · Essencial R$10 · Completo R$19 · Suprema R$46 · **Vitalício R$697 (único)**.
- Refletir plano via `subscriptions` (RLS) + `tierOf`/`hasDashboardAccess`.

## 6. Trilhas (as mesmas 16)

Grátis: **Primeiros Passos**.
Essencial: **Python Developer**, **Backend Developer**, **Data Analytics**, **Automação & Produtividade**, **Apps Desktop & Jogos**.
Completo: **Engenharia de Dados**, **Machine Learning & IA**, **DevOps & Cloud**, **Arquitetura de Software**, **IoT & Embarcados**, **Cyber Security**, **Blockchain**, **Bioinformática**, **Quant & Finanças**.
Suprema: **Python Mastery — Trilha Suprema** (todos os módulos + projeto final SaaS).

Detalhe da trilha com tópicos + módulos por área + progresso. Conteúdo de `contents` + lições.

## 7. UI/UX — robusta e profissional (vantagens do desktop)

- **Tema claro/escuro**, tokens da marca: primary `#8234E9`/`#9956F6`, green `#29E0A9`, blue `#5F75F2`, magenta `#E254FF`, fundo `#09090B`. Logo `new-logo.png`.
- Layout amplo: sidebar colapsável, command palette (Ctrl/Cmd+K), atalhos de teclado, multi-painel (lição + IDE lado a lado).
- IDE Python robusta (CodeMirror + Pyodide), terminal de saída, executar com Ctrl+Enter.
- Gráficos (Recharts) na Evolução e no painel admin (com animações).
- Skeletons, estados vazios/erro, toasts. Onboarding pós-primeiro login (objetivo → trilha).
- Menu nativo do app (Sobre, Verificar atualizações, Sair), tray opcional, notificações nativas (lembretes/streak).

## 8. Segurança (replicar a do site)

- Sessão/refresh token em **Stronghold/keychain** do SO (não em localStorage puro).
- Sem segredos de servidor no app (só anon key pública).
- Autorização via **RLS**; **2FA** quando ativado.
- **CSP** na webview do Tauri permitindo Pyodide (`'wasm-unsafe-eval'` + `cdn.jsdelivr.net`), Supabase (`*.supabase.co` + `wss`), Stripe; bloquear o resto. `tauri.conf.json` com `csp` e allowlist mínima (shell open só para domínios PyTrack/Stripe/Supabase).
- Validação de uploads (tamanho/extensão/MIME + nome seguro) espelhando `lib/upload-validation.ts`.
- Atualizações assinadas (Tauri Updater) e binários assinados por OS quando possível.

## 9. Build e distribuição (3 versões)

- `npm run tauri build` gerando:
  - **Windows**: `.msi` e/ou `.exe` (NSIS).
  - **macOS**: `.dmg` (universal: Apple Silicon + Intel).
  - **Linux**: `.AppImage` e `.deb`.
- Configurar `tauri.conf.json`: identidade (`com.pytrack.app`), ícones (new-logo), nome "PyTrack", deep link `pytrack://`, updater.
- Os instaladores devem poder ser disponibilizados em `/aplicativo` (bucket `app-releases`) para download por usuários **Completo+**.
- Build cross-OS via GitHub Actions (matriz windows/macos/ubuntu) recomendado.

## 10. Critérios de aceite

- [ ] Login (e-mail/senha + GitHub OAuth + 2FA); sem cadastro no app.
- [ ] Todas as rotas, incluindo **admin** (escondidas para não-admins).
- [ ] Gating por plano idêntico (7 dias grátis, tiers, completo-only).
- [ ] 16 trilhas + leitor de conteúdo + IDE Python (Pyodide) com execução real.
- [ ] Exercícios com IA + consultor de carreira (via backend, com fallback).
- [ ] Comunidade, suporte, configurações (LGPD: exportar/excluir conta), admin completo (clientes/moderação/mensagens).
- [ ] Tema claro/escuro, command palette, atalhos, notificações nativas.
- [ ] Segurança: keychain, RLS, 2FA, CSP na webview, uploads validados, sem segredos.
- [ ] Build gerando instaladores para **Windows, macOS e Linux**.

> Entregue um projeto Tauri organizado (`src/` React, `src-tauri/` Rust), tipado, com README de setup (env, `tauri build` por OS, deep links, updater e configuração de provedores no Supabase).
