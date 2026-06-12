# 📋 Changelog — Ecossistema PyTrack

Todas as mudanças relevantes dos produtos PyTrack: **Plataforma Web**, **Extensão VS Code**, **App Mobile (Android)** e **App Desktop (Windows · macOS · Linux)**.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Versionamento Semântico](https://semver.org/lang/pt-BR/).

🌐 Plataforma: **[www.pytrack.com.br](https://www.pytrack.com.br)**

---

## 🧩 Extensão VS Code — `EstevamSouza.pytrack`

> [Marketplace](https://marketplace.visualstudio.com/items?itemName=EstevamSouza.pytrack) · exclusiva do plano **Suprema**

### [1.0.1] — 2026-06-10
#### Adicionado
- 📊 **Dashboard completo** (webview) com plano, XP, nível, projetos, aulas e exercícios.
- 🚪 Botão de **sair da conta** (logout) com confirmação.
- 🤖 Ações rápidas de IA no menu de contexto: **Explicar · Refatorar · Gerar testes · Gerar docstring**.
- 🛠️ Ferramentas: **rodar arquivo**, **criar venv**, **gerar requirements.txt**, **formatar com Ruff**, **buscar exercício**, **desafio do dia**.
- 🐍 Novo **ícone de Python** na barra lateral.
- 🧩 Snippets ampliados para **58** (todo o ecossistema).
#### Alterado
- Login restrito ao plano **Suprema** com aviso de upgrade para os demais.
- "Conheça a PyTrack" passa a abrir a página inicial do site.
#### Corrigido
- Ícone quebrado na página do Marketplace (URL absoluta).
- Tratamento de respostas não‑JSON do servidor (mensagem clara em vez de erro técnico).

### [1.0.0] — 2026-06-10
#### Adicionado
- Lançamento da extensão: **login**, gestão de **assinatura**, importação de **projetos/aulas/exercícios**.
- **Snippets de Python**, **sintaxe por versão** (3.0 → 3.13), **instalar pacotes (pip)**.
- **Assistente de IA** com a **sua própria chave** (OpenAI, OpenRouter, Anthropic, NVIDIA, custom).
- CI de publicação automática via GitHub Actions (tag `v*`).

---

## 📱 App Mobile (Android) — Expo / React Native

> [Download (.apk)](https://github.com/estevam5s/pytrack/releases) · disponível em `/aplicativo`

### [1.0.0] — 2026-06-10
#### Adicionado
- **Login** e‑mail/senha + **GitHub OAuth** + **2FA (TOTP)**; sem cadastro no app (registro no site).
- Navegação por abas: **Início** (XP/nível/atalhos), **Trilhas** (as 17, com cadeado por plano), **Exercícios** (busca nos +5.000), **Comunidade** (feed, Completo+), **Perfil**.
- Telas de **Notificações** (badge de não‑lidas), **Configurações**, **Meu plano** e **IA (BYOK)**.
- **Gating por plano** espelhando a web; pagamentos abrem o site (sem cartão no app).
- **Segurança**: sessão no SecureStore (keychain/keystore), apenas anon key pública, RLS.
#### Notas técnicas
- Corrigida incompatibilidade do NativeWind 4.2 (Reanimated worklets) na SDK 51.
- Variáveis públicas (`EXPO_PUBLIC_*`) injetadas no build (eas.json) + fallback.

---

## 🖥️ App Desktop (Windows · macOS · Linux) — Tauri 2 / React

> [Releases](https://github.com/estevam5s/pytrack-desktop/releases) · disponível em `/aplicativo`

### [1.0.1] — 2026-06-10
#### Adicionado
- 🔄 **Atualização automática (Tauri Updater)**: o app verifica novas versões ao abrir e oferece "Atualizar e reiniciar" — com binários **assinados** (chave pública embutida) e manifesto `latest.json`.

### [1.0.0] — 2026-06-10
#### Adicionado
- App nativo cross‑platform (**~7 MB**), instaladores **.msi/.exe** (Windows), **.dmg** (macOS) e **.AppImage/.deb** (Linux).
- **Login** e‑mail/senha + **GitHub OAuth** + **2FA**; **sidebar** com grupos e badge de notificações.
- **IDE Python (Pyodide)** rodando Python localmente (Ctrl/Cmd+Enter).
- Trilhas, exercícios (busca real), comunidade (feed Markdown), notificações, perfil, plano, IA (BYOK).
- **CSP** restritiva (Pyodide + Supabase + Stripe), sessão segura, sem segredos no bundle.
- **CI cross‑OS** (GitHub Actions, matriz Windows/macOS/Linux) gerando os 3 instaladores.

---

## 🌐 Plataforma Web — `www.pytrack.com.br`

### [Unreleased / contínuo] — 2026-06
#### Adicionado
- **Rota de Currículo** (`/curriculo`, Completo+): editor completo, **8 modelos** (4 exclusivos Suprema), preview ao vivo e **exportação PDF/DOCX/DOC/TXT** com CRUD.
- **Extensão VS Code** (`/extensao`): página de apresentação + download do `.vsix` (Suprema) + admin para gerenciar versões.
- **API da plataforma** (Suprema): endpoints `/api/v1/me`, `/progress`, `/tracks`, `/ranking` + **playground** + geração de chaves `pytk_live_`.
- **Notificações** (`/notificacoes`) com **badge vermelho** de não‑lidas no menu.
- **Rota de Contato** (`/contato`) com envio de e‑mail ao proprietário.
- **Banner de cookies (LGPD)** na primeira visita + integração com o Google Consent Mode.
- **Lista de conexões/seguidores** clicável na comunidade (`/comunidade/conexoes`).
- **+5.000 exercícios** (de ~2.400) cobrindo **81 categorias** de todo o ecossistema Python.
- **Idiomas**: além de PT/EN/ES, adicionados **Chinês (中文)** e **Coreano (한국어)**.
- **E‑mails profissionais**: boas‑vindas, aviso 3 dias antes da 1ª cobrança (trial), cancelamento e reembolso.
#### Alterado
- Gerador de **respostas das perguntas de carreira** enriquecidas por IA (específicas por pergunta).
- **Acordeão** das perguntas agora abre uma de cada vez, com fechamento suave.
- Trilha **grátis** ampliada (21 → 30 tópicos).
#### Corrigido
- **Comentários na comunidade** (erro `column "email" does not exist` na função `community_ensure_profile`).
- **Markdown** renderizado nos posts (vagas não mostram mais código cru).
- **Painel de receita admin** lendo via `payment_intents` (chave restrita sem permissão de `charges`).

---

## 🔭 Roadmap

- IDE Pyodide também no app mobile (WebView).
- Correção de exercícios por IA via **Supabase Edge Function** (com fallback).
- **Push notifications** de streak/lembretes nos apps.
- **i18n** completo nos apps (PT/EN/ES/ZH/KO).
- **Tutorial guiado** + consentimento de cookies na 1ª abertura dos apps.
- Apps desktop assinados/notarizados; updater automático (Tauri).

---

<div align="center">

Feito com 🐍 pela **PyTrack** — domine todo o ecossistema Python.

</div>
