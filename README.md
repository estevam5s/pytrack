# 🐍 PyTrack — Python Learning Dashboard

Plataforma educacional completa para aprender e acompanhar a evolução em todo o
ecossistema Python — dos fundamentos a Data Science, IoT, DevOps, Engenharia de
Dados e Arquitetura. Visual escuro, moderno e tecnológico, inspirado em
plataformas premium de tecnologia.

Construída a partir do guia **`informacao.md`** (Stack Python Profissional), com
dados persistidos no **Supabase**.

---

## ✨ Stack

| Camada | Tecnologias |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS 3 + design system próprio |
| UI | Radix UI, Lucide React, Framer Motion, cmdk |
| Estado | Zustand |
| Formulários | React Hook Form + Zod + Server Actions |
| Gráficos | Recharts |
| Backend | Supabase (Postgres 17, Auth, RLS) |

---

## 🎨 Design system

Tema dark por padrão (com toggle para claro), tons de roxo e verde:

```
background #09090B · surface #111113 · card #18181B · border #27272A
primary #8257E5 · secondary #04D361 · text #F4F4F5 / #A1A1AA
danger #EF4444 · warning #F59E0B · success #22C55E
```

Componentes em `components/ui`: Button, Card, Badge, Progress, Tabs, Tooltip,
Dialog (Modal), Input/Textarea, EmptyState, LoadingState, Skeleton, Command
Search e DynamicIcon.

---

## 📁 Estrutura

```txt
app/
  (dashboard)/         # rotas protegidas (sidebar + header)
    page.tsx           # / — dashboard inicial
    conteudos/ evolucao/ stack/ aulas-udemy/ material/ livros/
    carreira/ vagas/ perguntas-carreira-python/ exercicios/
    projetos/ perfil/ configuracoes/
    layout.tsx loading.tsx error.tsx
  auth/                # login, register (layout próprio)
  layout.tsx globals.css not-found.tsx
components/  ui/ dashboard/ cards/ forms/ layout/
lib/
  supabase/  client.ts server.ts middleware.ts
  data/      queries.ts actions.ts
  parser/    informacao.ts        # parser do informacao.md
  navigation.ts utils.ts
store/  ui.ts
types/  index.ts
supabase/ schema.sql seed.sql
scripts/ import-informacao.ts
middleware.ts            # proteção de rotas
```

---

## 🚀 Executando localmente

Pré-requisitos: **Node 18+**.

```bash
# 1. Instalar dependências
npm install

# 2. Variáveis de ambiente (já incluídas em .env.local)
#    NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE

# 3. Rodar em desenvolvimento
npm run dev      # http://localhost:3000

# build de produção
npm run build && npm run start
```

### Conta de demonstração

Já existe um usuário de teste pronto para login:

```
e-mail: estudante.teste@pytrack.dev
senha:  python123
```

Ou crie a sua em **/auth/register** (o cadastro já loga automaticamente).

---

## 🗄️ Banco de dados (Supabase)

O schema e o seed **já foram aplicados** ao projeto Supabase `Carreira`
(`zohqgnhymtqppgzlammv`). Para reaplicar em outro projeto:

1. Abra o **SQL Editor** do Supabase.
2. Rode `supabase/schema.sql` (tabelas, enums, triggers, RLS).
3. Rode `supabase/seed.sql` (catálogo curado).

Tabelas: `users_profile`, `contents`, `progress`, `stack_items`,
`udemy_courses`, `materials`, `books`, `career_paths`, `exercises`, `projects`.

**Segurança (RLS):** o catálogo é legível por qualquer usuário autenticado;
`users_profile` e `progress` são restritos ao próprio dono (`auth.uid()`). Um
trigger cria o perfil automaticamente a cada novo cadastro.

Catálogo: **30 módulos / 266 lições** (gerados a partir de `doc/Conteudos`) ·
**60 tecnologias** · 10 materiais · 7 livros · **13 carreiras** ·
**1230 exercícios de prática** (+ 8 com solução) · 10 projetos · cursos da Udemy
(CRUD por usuário).

### Banco de exercícios (`/exercicios`)

`scripts/generate-exercises.mjs` faz o parsing de
`doc/Conteudos/exercicio_python.md` (865 `EX` + 365 `PX`) e gera
`supabase/practice_exercises.json` + `.sql`. As linhas são inseridas via REST
(PostgREST + service role, em lotes). A página tem busca, filtro por categoria
(17 grupos) e nível, cards expansíveis com objetivo, requisitos, critérios de
aceite, checklist interativo e caminhos sugeridos de arquivo/teste — progresso
no `localStorage`. Há ainda a aba "Com solução" (editor + solução escondida).

### Perguntas por tecnologia (`/perguntas-carreira-python`)

`scripts/generate-questions.mjs` faz o parsing de `doc/Conteudos/perguntas.md`
(**577 perguntas**), classifica cada uma por tecnologia (13 categorias) e gera
`supabase/interview_questions.json` + `.sql` (inseridos via REST). A página tem
aba "Por tecnologia" (sidebar de categorias, busca, cards expansíveis com
conceito-chave, aplicação prática, erros comuns, como fixar rápido e código com
syntax highlight; progresso "estudada" em `localStorage`) e aba "Carreira" (FAQ).

### Marca / ícone

`logo.png` (na raiz) vira `public/logo.png` (sidebar e tela de login) e
`app/icon.png` / `app/apple-icon.png` (favicon do navegador), gerados com
`sips -Z 256`.

### IA (OpenRouter)

`/exercicios` tem **2462 exercícios** (dobrados) e, em cada um, um revisor de IA:
o aluno escreve o código, a IA dá nota, feedback (pontos fortes, problemas,
sugestões, complexidade) e uma **solução melhor** (`lib/ai/actions.ts` →
`analyzeExercise`). A rota **`/consultor-ia`** é um agente que analisa toda a
evolução/experiência e diz se você está apto a ser profissional Python
(`analyzeCareer`: veredito, prontidão %, forças, lacunas, roadmap, cargos-alvo).

Usa OpenRouter (`OPENROUTER_API_KEY` no `.env`) com modelos `:free` e fallback
em cadeia: `openai/gpt-oss-120b` → `google/gemma-4-31b-it` →
`nvidia/nemotron-nano-9b-v2`. Como os modelos gratuitos são instáveis, há retry
e parser de JSON tolerante. **Reinicie o dev server após editar o `.env`.**

### Cursos da Udemy (`/aulas-udemy`)

CRUD completo por usuário (RLS por `user_id`): adicionar, editar e remover.
Ao colar a URL do curso, o botão **Importar** lê os metadados Open Graph
(`fetchCourseMeta`) e preenche título, banner, instrutor e descrição. A Udemy
bloqueia fetch direto (Cloudflare/JA3), então há fallback automático via
microlink.io. Os cards exibem o banner do curso.

### Perfil avançado (`/perfil`)

Perfil profissional com upload de foto (png/jpg/jpeg/gif/webp → bucket
`avatars`), bio, localização e links sociais. O **nível em Python** é calculado
automaticamente por um sistema de XP (`lib/level.ts`) que soma módulos
concluídos, lições lidas, exercícios feitos, perguntas estudadas, livros lidos e
cursos — com 6 tiers (Iniciante → Especialista) e barra de progresso para o
próximo nível. Dados de progresso vêm do Supabase (`progress`, books, courses) +
`localStorage` (lições/exercícios/perguntas).

### Biblioteca com upload (`/livros`)

CRUD por usuário (RLS por `user_id`; livros do seed continuam visíveis como
"Recomendados", só os seus são editáveis). É possível **identificar a capa pela
URL** (`fetchBookMeta` → Open Graph) ou **fazer upload da capa** (bucket
`book-covers`) e do **arquivo do livro** PDF/EPUB (bucket `book-files`, até
100 MB). Filtros por escopo (todos/meus/recomendados) e busca.

### Storage

Buckets públicos `avatars`, `book-covers`, `book-files` (criados em
`supabase/profile_books.sql`) com políticas em `storage.objects` (leitura
pública, escrita por autenticados). Upload no client via `lib/storage.ts`.

### Home e Evolução

A home (`/`) é um painel interativo: card de **nível no ecossistema Python**
(XP/tiers, `components/home/python-level-card.tsx`), um **Pomodoro com xícara de
café** que esvazia conforme o tempo de foco corre e enche de novo na pausa
(`pomodoro-coffee.tsx`, sessões salvas no `localStorage`), gráficos (progresso
por área + donut de status), e um **showcase de código Python** (FastAPI,
pandas, asyncio) com syntax highlight. `/evolucao` foi reorganizado em seções:
nível + radial, stats, gráficos (área + status) e ranking/próximos passos.

### Currículo a partir de `doc/Conteudos`

O diretório `doc/Conteudos` (Parte-1 … Parte-10, ~266 arquivos `.md`) é a fonte
do currículo. O script `scripts/generate-content.mjs` percorre as pastas e gera:

- `lib/content/manifest.ts` — módulos e lições tipados (título, área, nível, path);
- `supabase/contents_docs.sql` — upsert dos módulos na tabela `contents`.

```bash
node scripts/generate-content.mjs   # regenera manifest + SQL
```

Em `/conteudos`, cada módulo abre uma página de estudo
(`/conteudos/[modulo]/[licao]`) que renderiza o markdown completo da lição com
syntax highlighting, sumário, navegação entre lições e marcação de progresso
(sincronizada com o Supabase). Os corpos das lições são lidos do disco em tempo
de request, então a pasta `doc/Conteudos` deve acompanhar o deploy.

---

## 📄 Parser do `informacao.md`

`lib/parser/informacao.ts` lê o Markdown, extrai headings, listas, tabelas e
links, e transforma tudo em objetos `LearningContent` tipados.

Importar o conteúdo parseado para a tabela `contents`:

```bash
npx tsx scripts/import-informacao.ts            # dry-run (apenas mostra)
npx tsx scripts/import-informacao.ts --apply    # grava no Supabase (service role)
```

---

## 🧭 Rotas

| Rota | Descrição |
|---|---|
| `/` | Dashboard: saudação, progresso, em andamento, recomendados, projetos, stack, carreira |
| `/conteudos` | Trilhas com filtro por nível/categoria/busca e marcação de progresso |
| `/evolucao` | Progresso geral, por área, ranking de habilidades, próximos passos (gráficos) |
| `/stack` | Tecnologias do ecossistema, agrupadas por categoria |
| `/aulas-udemy` | Organização de cursos da Udemy |
| `/material` | Documentação, artigos, cheatsheets, repositórios |
| `/livros` | Biblioteca recomendada |
| `/carreira` | 7 trilhas com habilidades, roadmap, tecnologias e faixa salarial |
| `/vagas` | Plataformas, cargos e dicas de preparação |
| `/perguntas-carreira-python` | FAQ de carreira |
| `/exercicios` | Exercícios por dificuldade, editor e solução escondida |
| `/projetos` | Projetos práticos com requisitos e passo a passo |
| `/perfil` · `/configuracoes` | Perfil, objetivo, tema, exportar/resetar dados |

---

## 🔐 Autenticação

Supabase Auth (e-mail/senha) com Server Actions. O `middleware.ts` protege todas
as rotas do dashboard e redireciona usuários não autenticados para `/auth/login`.
Sessão persistida via cookies (`@supabase/ssr`).

---

Feito com foco em código limpo, tipagem forte, componentes reutilizáveis e
pronto para expansão. 🚀
