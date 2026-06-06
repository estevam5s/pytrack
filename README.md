<div align="center">

<img src="public/logo.png" alt="PyTrack" width="130" />

# PyTrack — Plataforma de Aprendizado Python

**Aprenda, pratique e domine todo o ecossistema Python — do básico à carreira profissional — em um único dashboard inteligente, com comunidade, IDE no navegador e correção por IA.**

PyTrack é uma plataforma educacional completa e funcional: site institucional público + dashboard privado com trilhas, conteúdos, exercícios com IA, **IDE Python (WebAssembly)**, projetos, livros, cursos, vagas, **comunidade social** e consultor de carreira — tudo com XP, níveis e acompanhamento de evolução.

<br/>

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Pyodide](https://img.shields.io/badge/Pyodide_(WASM)-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

🌐 **Em produção:** [plataforma-python.vercel.app](https://plataforma-python.vercel.app)

</div>

---

## 📑 Índice

- [Sobre](#-sobre-a-plataforma)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#️-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Como utilizar](#-como-utilizar)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Scripts](#-scripts)
- [Banco de dados & Supabase](#-banco-de-dados--supabase)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Segurança](#-segurança)
- [Deploy](#️-deploy-vercel)

---

## 📖 Sobre a plataforma

PyTrack resolve um problema real de quem aprende Python: estudo desorganizado, materiais espalhados e falta de clareza sobre a própria evolução. A plataforma centraliza **todo o ciclo de aprendizado** em uma experiência moderna (tema claro/escuro), dividida em:

- **Site público** (`/`): apresentação, trilhas, recursos, projetos, carreira e preços.
- **Dashboard privado** (`/inicio` e demais rotas): a área de estudo, protegida por autenticação.

Tudo é **real e funcional**: dados no Supabase (PostgreSQL), correção de código e análise de vagas via IA (OpenRouter), IDE executando Python no navegador via WebAssembly, e uma comunidade social com Realtime.

---

## ✨ Funcionalidades

### 🌐 Site público
| Rota | Conteúdo |
|------|----------|
| `/` | Landing completa (hero, trilhas, recursos, projetos, carreira, depoimentos, preços, FAQ). |
| `/sobre` | Missão, valores, metodologia e números. |
| `/trilhas` | Trilhas guiadas + como cada trilha funciona. |
| `/recursos` | Recursos da plataforma + dashboard + números. |
| `/precos` | Plano Pro, comparativo grátis × pro, tudo incluído, depoimentos e FAQ. |
| `/auth/login` · `/auth/register` | Autenticação com layout profissional (split-screen). |

Navbar com **rota ativa em destaque**, tema claro/escuro e menu mobile em tela cheia.

### 🎓 Dashboard — Estudar
| Rota | O que faz |
|------|-----------|
| `/inicio` | Painel com nível, XP, gráficos, atividades e pomodoro **global** (continua entre rotas, com som e notificação). |
| `/comunidade` | **Rede social Python**: posts, curtidas, comentários, follow, vagas, ranking, salvos, denúncias — em tempo real. |
| `/conteudos` | Trilhas e módulos com leitor de lições em Markdown. |
| `/evolucao` | Análise da evolução, mapa de proficiência e ferramentas. |
| `/stack` | Catálogo de tecnologias do ecossistema Python. |
| `/exercicios` | Exercícios com editor de código e **correção por IA**. |
| `/ide` | **IDE Python no navegador** (Pyodide/WASM) — `input()`, `numpy`/`pandas` sob demanda. |
| `/projetos` | +1.300 projetos práticos para portfólio. |

### 📚 Dashboard — Recursos
`/aulas-udemy` · `/aulas-youtube` (CRUD com extração por URL) · `/material` · `/livros` (CRUD com upload).

### 💼 Dashboard — Carreira
`/carreira` · `/especializacoes` (10 trilhas avançadas com roadmap/salário) · `/consultor-ia` · `/vagas` (importa vaga por link com IA) · `/perguntas-carreira-python`.

### ⚙️ Dashboard — Conta
`/perfil` · `/configuracoes` (subrotas: **conta, perfil, aparência, plataforma, dados, sobre**).

### 🧩 Recursos transversais
- 🏆 **XP e níveis** (🌱 Iniciante → 🐍 Especialista) com **notificação de level-up**.
- 🌗 **Tema claro/escuro** em todo o site e dashboard (variáveis CSS, sem flash).
- 🎓 **Tutorial de onboarding** (popups passo a passo) no primeiro acesso.
- 🤖 **IA** (OpenRouter) para exercícios, carreira e vagas.
- 🔎 **Busca global** (⌘K) · 📱 **Responsivo** · ⏱️ **Cron jobs** (pg_cron) de manutenção.

---

## 🛠️ Tecnologias utilizadas

| Camada | Stack |
|--------|-------|
| **Framework** | Next.js 15 (App Router, RSC, Server Actions) · React 19 · TypeScript |
| **UI** | Tailwind CSS · Radix UI · lucide-react · class-variance-authority · Framer Motion |
| **Estado/Forms** | Zustand (+persist) · React Hook Form · Zod |
| **Dados/Auth/Realtime** | Supabase (PostgreSQL, Auth, Storage, Realtime) via `@supabase/ssr` |
| **Conteúdo** | react-markdown · remark-gfm · rehype-highlight · highlight.js |
| **Gráficos** | Recharts |
| **IDE Python** | Pyodide (CPython em WebAssembly) · CodeMirror (`@uiw/react-codemirror`, `@codemirror/lang-python`) |
| **IA** | OpenRouter (modelos gratuitos com fallback) |
| **Busca** | cmdk · **Agendamento** pg_cron · **Deploy** Vercel |

---

## 🏗 Arquitetura

- **Server Components** buscam dados (queries em `lib/**`) e **Server Actions** fazem mutações (revalidam com `revalidatePath`).
- **Client Components** cuidam da interatividade (otimismo em curtidas, Realtime, IDE, uploads).
- **RLS** no Supabase protege todos os dados por usuário; o middleware (`lib/supabase/middleware.ts`) protege as rotas do dashboard e libera o site público.
- **Tema** via variáveis CSS (canais RGB) com script anti-FOUC em `app/layout.tsx`.

---

## 🚀 Como utilizar

### Pré-requisitos
- Node.js 18+ e npm
- Conta no [Supabase](https://supabase.com) e chave da [OpenRouter](https://openrouter.ai)

### Instalação

```bash
git clone https://github.com/estevam5s/analista-de-dados.git
cd analista-de-dados
npm install
```

### Rodando

```bash
npm run dev            # http://localhost:3000  (ou PORT=6464 npm run dev)
npm run build && npm run start   # produção
```

---

## 🔑 Variáveis de ambiente

Crie `.env.local` na raiz:

```env
# Supabase (públicas — protegidas por RLS)
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key

# Servidor / scripts (NUNCA no client)
SUPABASE_SERVICE_ROLE=sua-service-role-key      # seeds/scripts (PostgREST/Storage)
SUPABASE_ACCESS_TOKEN=sbp_xxx                   # Personal Access Token p/ aplicar schemas (Management API)
OPENROUTER_API_KEY=sua-chave-openrouter         # IA
```

> A **Management API** (aplicar SQL/DDL) exige o **Personal Access Token** (`sbp_…`), não o `service_role`. Apenas as `NEXT_PUBLIC_*` vão para o navegador.

---

## 📜 Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (HMR). |
| `npm run build` / `npm run start` | Build e execução de produção. |
| `npm run lint` | Linter do Next.js. |
| `npm run db:seed` | Popula o banco com dados iniciais. |
| `npx tsx scripts/apply-community-schema.ts` | Aplica o schema da **comunidade** no Supabase. |

**Geração de conteúdo** (`/scripts`): `import-informacao.ts`, `generate-content.mjs`, `gen-ecosystem-content.mjs`, `generate-exercises.mjs`, `expand-exercises.mjs`, `generate-questions*.mjs`, `generate-projects*.mjs` — geram/importam o currículo (fonte em `doc/Conteudos`).

---

## 🗄 Banco de dados & Supabase

SQL versionado em `/supabase`:

| Arquivo | Conteúdo |
|---------|----------|
| `schema.sql` / `seed.sql` | Schema base do dashboard + seed. |
| `community-schema.sql` | **Comunidade**: 10 tabelas `community_*`, RLS, triggers (contadores, XP/nível, notificações), bucket de imagens e Realtime. |
| `community-seed.sql` | Dados fictícios da comunidade (dev). |
| `*.sql` / `*.json` | Conteúdos, exercícios, perguntas, projetos. |

**Cron jobs** (manutenção via `pg_cron`): definidos em `cron/supabase-cron.sql` (10 jobs: heartbeat, limpeza, reindex/ANALYZE, backups lógicos, etc.) — gerenciáveis no painel **Integrations → Cron**.

**Storage**: buckets para avatares, capas de livros e `community-post-images` (jpg/png/webp, 5MB, RLS por dono).

---

## 📂 Estrutura do projeto

```
.
├── app/
│   ├── (site)/                # Site público (/, sobre, trilhas, recursos, precos)
│   ├── (dashboard)/           # Dashboard: inicio, comunidade, conteudos, ide, especializacoes...
│   │   └── configuracoes/     # Subrotas: conta, perfil, aparencia, plataforma, dados, sobre
│   ├── auth/                  # Login e cadastro (layout split-screen)
│   ├── layout.tsx             # Layout raiz + script de tema (no-FOUC)
│   └── globals.css            # Variáveis de tema (light/dark) + utilitários
├── components/
│   ├── site/                  # Componentes do site institucional
│   ├── community/             # Feed, posts, comentários, vagas, ranking, badges...
│   ├── dashboard/             # Cards, gráficos, level-up, onboarding-tour...
│   ├── home/                  # Nível, pomodoro (global), showcase
│   ├── ide/                   # IDE Python (Pyodide + CodeMirror)
│   ├── layout/                # Sidebar, header, busca, tema
│   └── ui/                    # Componentes base (button, card, badge...)
├── lib/
│   ├── supabase/              # Clients (server/browser) + middleware
│   ├── community/             # queries, actions, services, levels, storage
│   ├── data/                  # Queries e server actions do dashboard
│   ├── ai/                    # OpenRouter (retry/fallback)
│   ├── content/               # Manifesto e leitor de lições
│   └── level.ts               # XP e níveis
├── supabase/                  # Schemas SQL + seeds
├── cron/                      # Cron jobs (pg_cron) + scripts
├── doc/Conteudos/             # Currículo em Markdown (fonte das lições)
├── scripts/                   # Geração/importação de conteúdo
└── public/                    # Assets (logo.png, ícones)
```

---

## 🔐 Segurança

- **RLS** em todas as tabelas; usuários só acessam/editam o que é seu.
- Auth via **Supabase**; middleware protege o dashboard e libera o site.
- `service_role` e `SUPABASE_ACCESS_TOKEN` **apenas no servidor/scripts** — nunca no client.
- Validação de formulários (Zod), sanitização e limites de tamanho de texto/imagem; upload restrito por MIME e dono.
- Anti-spam básico, anti auto-follow e curtidas únicas garantidos por constraints/RLS.

---

## ☁️ Deploy (Vercel)

1. Conecte o repositório à Vercel (framework: **Next.js**).
2. Em **Settings → Environment Variables**, defina `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `OPENROUTER_API_KEY`.
3. `git push` na branch `main` (deploy automático) ou `vercel --prod`.

> `next.config.mjs` usa `outputFileTracingIncludes` para empacotar as lições em Markdown nas funções serverless.

---

<div align="center">

Feito com 💜 e Python · **PyTrack**

</div>
