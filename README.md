<div align="center">

<img src="public/logo.png" alt="PyTrack" width="130" />

# PyTrack — Plataforma de Aprendizado Python

**Aprenda, pratique e domine todo o ecossistema Python — do básico à carreira profissional — em um único dashboard inteligente.**

PyTrack é uma plataforma educacional completa e funcional que reúne trilhas de estudo, conteúdos, exercícios com correção por IA, uma **IDE Python que roda no navegador**, projetos reais, livros, cursos, vagas e um consultor de carreira — tudo com acompanhamento de evolução por XP e níveis.

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

## 📖 Sobre a plataforma

PyTrack resolve um problema real de quem aprende Python: estudo desorganizado, materiais espalhados e falta de clareza sobre a própria evolução. A plataforma centraliza **todo o ciclo de aprendizado** em uma experiência única e moderna (dark/light), com **site institucional público** e um **dashboard privado** após o login.

- **Site público** (`/`): apresentação, trilhas, recursos, projetos, carreira e preços.
- **Dashboard** (`/inicio` e demais rotas): a área de estudo, protegida por autenticação.

Tudo é **real e funcional**: os dados vêm do Supabase (PostgreSQL), a correção de código e a análise de vagas usam IA (OpenRouter), e a IDE executa Python de verdade no navegador via WebAssembly.

---

## ✨ Funcionalidades

### Estudar
| Rota | O que faz |
|------|-----------|
| `/inicio` | Home com nível, XP, gráficos, atividades e pomodoro. |
| `/conteudos` | Trilhas e módulos com **leitor de lições** em Markdown (todo o ecossistema Python). |
| `/evolucao` | Análise profissional da sua evolução, ferramentas e experiência. |
| `/stack` | Catálogo de tecnologias do ecossistema Python com ícones e descrições. |
| `/exercicios` | Centenas de exercícios com editor de código e **correção por IA**. |
| **`/ide`** | **IDE Python completa que roda no navegador (Pyodide/WASM)** — escreva, execute, use `input()` e bibliotecas como `numpy`/`pandas`. |
| `/projetos` | +1.300 projetos práticos para portfólio, com dificuldade e tecnologias. |

### Recursos
`/aulas-udemy` · `/aulas-youtube` (CRUD com extração de banner/infos pela URL) · `/material` · `/livros` (CRUD com upload de capa e arquivo).

### Carreira
`/carreira` · **`/especializacoes`** (10 trilhas avançadas: Eng. de Dados, Eng. de Software, Analista de Dados, Arquiteto de Software/Soluções, ML, DevOps/Cloud, IA/LLMs, Segurança, IoT — com roadmap, tecnologias, projetos e faixa salarial) · `/consultor-ia` · `/vagas` (importa vaga por link e extrai os campos com IA) · `/perguntas-carreira-python`.

### Conta
`/perfil` · `/configuracoes` (subrotas: **conta, perfil, aparência, plataforma, dados, sobre**).

### Recursos transversais
- 🏆 **Sistema de XP e níveis** (🌱 Iniciante → 🐍 Especialista) com **notificação de level‑up** no topo.
- 🌗 **Tema claro/escuro** aplicado a todo o site e dashboard (variáveis CSS, sem flash).
- 🔎 **Busca global** (⌘K).
- 🤖 **IA** para revisão de exercícios, consultor de carreira e análise de vagas.
- 📱 **Responsivo** (mobile → desktop).

---

## 🛠️ Tecnologias utilizadas

| Camada | Stack |
|--------|-------|
| **Framework** | Next.js 15 (App Router, RSC) · React 19 · TypeScript |
| **UI** | Tailwind CSS · Radix UI · lucide-react · class-variance-authority · Framer Motion |
| **Estado/Forms** | Zustand · React Hook Form · Zod |
| **Dados/Auth** | Supabase (PostgreSQL, Auth, Storage) via `@supabase/ssr` |
| **Conteúdo** | react-markdown · remark-gfm · rehype-highlight · highlight.js |
| **Gráficos** | Recharts |
| **IDE Python** | Pyodide (CPython em WebAssembly) · CodeMirror (`@uiw/react-codemirror`, `@codemirror/lang-python`) |
| **IA** | OpenRouter (modelos gratuitos com fallback) |
| **Busca** | cmdk |
| **Deploy** | Vercel |

---

## 🚀 Como utilizar

### Pré-requisitos
- Node.js 18+ e npm
- Uma conta no [Supabase](https://supabase.com) e uma chave da [OpenRouter](https://openrouter.ai)

### Instalação

```bash
git clone https://github.com/estevam5s/analista-de-dados.git
cd analista-de-dados
npm install
```

### Variáveis de ambiente
Crie um arquivo `.env.local` na raiz:

```env
# Supabase (públicas — protegidas por RLS)
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key

# Apenas para scripts locais (NÃO vai para o cliente/Vercel)
SUPABASE_SERVICE_ROLE=sua-service-role-key

# IA (somente servidor)
OPENROUTER_API_KEY=sua-chave-openrouter
```

### Rodando em desenvolvimento

```bash
npm run dev          # http://localhost:3000
# (o projeto também roda em outra porta, ex.: PORT=6464 npm run dev)
```

### Build de produção

```bash
npm run build
npm run start
```

---

## 📜 Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (HMR). |
| `npm run build` | Build de produção otimizado. |
| `npm run start` | Sobe o build de produção. |
| `npm run lint` | Linter do Next.js. |
| `npm run db:seed` | Popula o banco (Supabase) com os dados iniciais. |

### Scripts de geração de conteúdo (`/scripts`)
Ferramentas que **geram e importam** o conteúdo da plataforma para o Supabase (executadas com `tsx`/`node`):

| Arquivo | Função |
|---------|--------|
| `import-informacao.ts` | Importa o currículo a partir de `doc/Conteudos`. |
| `generate-content.mjs` / `gen-ecosystem-content.mjs` | Gera módulos e lições do ecossistema Python. |
| `generate-exercises.mjs` / `expand-exercises.mjs` | Gera e expande os exercícios práticos. |
| `generate-questions.mjs` / `generate-questions-v2.mjs` | Gera perguntas de entrevista (junior → senior). |
| `generate-projects.mjs` / `generate-projects-mega.mjs` | Gera o catálogo de projetos. |

> Conteúdo-fonte do currículo: pasta `doc/Conteudos` (Markdown), lida em runtime pelo leitor de lições.

---

## 📂 Estrutura do projeto

```
.
├── app/
│   ├── (site)/                # Site público (navbar + footer): /, sobre, trilhas, recursos, precos
│   ├── (dashboard)/           # Dashboard privado: inicio, conteudos, ide, especializacoes, ...
│   │   └── configuracoes/     # Subrotas: conta, perfil, aparencia, plataforma, dados, sobre
│   ├── auth/                  # Login e cadastro
│   ├── layout.tsx             # Layout raiz + script de tema (no-FOUC)
│   └── globals.css            # Variáveis de tema (light/dark) + utilitários
├── components/
│   ├── site/                  # Componentes do site institucional
│   ├── dashboard/             # Cards, gráficos, notificador de level-up, etc.
│   ├── ide/                   # IDE Python (Pyodide + CodeMirror)
│   ├── layout/                # Sidebar, header, busca, tema
│   └── ui/                    # Componentes base (button, card, badge, ...)
├── lib/
│   ├── supabase/              # Clients (server/browser) e middleware de auth
│   ├── data/                  # Queries e server actions
│   ├── ai/                    # Integração OpenRouter (com retry/fallback)
│   ├── content/               # Manifesto e leitor das lições
│   ├── level.ts               # Sistema de XP e níveis
│   └── specializations.ts     # Dados das especializações
├── doc/Conteudos/             # Currículo em Markdown (fonte das lições)
├── scripts/                   # Geração/importação de conteúdo
└── public/                    # Assets (logo.png, ícones)
```

---

## 🔐 Autenticação e segurança

- Auth via **Supabase** com middleware que protege as rotas do dashboard (`/inicio`, `/conteudos`, etc.) e libera o site público.
- As chaves `NEXT_PUBLIC_*` são públicas por design (protegidas por **RLS** no Supabase). A `OPENROUTER_API_KEY` e a `SUPABASE_SERVICE_ROLE` ficam **apenas no servidor / scripts**.

---

## ☁️ Deploy (Vercel)

1. Conecte o repositório à Vercel (framework detectado: **Next.js**).
2. Em **Settings → Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `OPENROUTER_API_KEY`.
3. Faça `git push` na branch `main` (deploy automático) ou rode `vercel --prod`.

> O `next.config.mjs` usa `outputFileTracingIncludes` para empacotar as lições em Markdown nas funções serverless.

---

<div align="center">

Feito com 💜 e Python · **PyTrack**

</div>
