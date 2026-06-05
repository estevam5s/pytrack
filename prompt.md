# Prompt para criação da plataforma Python Learning Dashboard

Você é uma IA especialista em desenvolvimento full-stack moderno, arquitetura de software, UX/UI profissional, Next.js, Supabase, Tailwind CSS, TypeScript, dashboards educacionais e plataformas de aprendizado.

Crie uma plataforma completa, moderna, interativa e profissional para o usuário aprender profundamente todo o ecossistema Python, desde o nível básico até áreas avançadas como:

* Análise de dados
* IoT Developer
* Engenharia de Software
* Engenharia de Dados
* Automação
* Analista
* DevOPS
* Arquiteto de Solucoes
* Arquiteto de Software
* APIs
* Banco de dados
* Projetos práticos
* Preparação para carreira

A plataforma deve analisar e utilizar como fonte principal o arquivo `informacao.md`, extraindo dele conteúdos, trilhas, materiais, links, categorias, cursos, livros, exercícios e projetos.

---

## Objetivo da plataforma

Criar um dashboard educacional completo para acompanhar, organizar e evoluir no aprendizado de Python.

A experiência deve ser parecida com uma plataforma premium de estudos, inspirada no estilo visual da Rocketseat: visual escuro, moderno, tecnológico, com cards bem desenhados, sidebar elegante, tipografia forte, tons de roxo, verde, cinza escuro, bordas suaves, efeitos hover, microinterações e layout altamente profissional.

Não copie marca, logo ou elementos protegidos da Rocketseat. Use apenas inspiração visual em design system moderno para tecnologia e educação.

---

## Stack obrigatória

Utilize obrigatoriamente:

* Next.js com App Router
* TypeScript
* Tailwind CSS
* Supabase
* React Server Components quando fizer sentido
* Client Components para interações
* Shadcn UI ou componentes equivalentes
* Lucide React para ícones
* Framer Motion para animações
* Zustand ou Context API para estado global quando necessário
* React Hook Form + Zod para formulários
* Supabase Auth para autenticação
* Supabase Database para persistência de dados

---

## Dados do Supabase

Utilize variáveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zohqgnhymtqppgzlammv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaHFnbmh5bXRxcHBnemxhbW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDgxMzQsImV4cCI6MjA5NjE4NDEzNH0.OHmeGE1jsY0wNmjOeX4yQCONJ5_xaij7yQ_W5sUgito
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaHFnbmh5bXRxcHBnemxhbW12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDYwODEzNCwiZXhwIjoyMDk2MTg0MTM0fQ.ykQ2XjCVyU8xIhj8qkmRZOPBkAzNZJFkFC6v72mSdjg
```

Crie a integração com Supabase usando um client centralizado.

Estrutura esperada:

```txt
/lib/supabase/client.ts
/lib/supabase/server.ts
```

---

## Rotas obrigatórias

A aplicação deve conter as seguintes rotas:

```txt
/
 /conteudos
 /evolucao
 /stack
 /aulas-udemy
 /material
 /perguntas-carreira-python
 /livros
 /carreira
 /vagas
 /exercicios
 /projetos
 /configuracoes
 /perfil
```

---

## Layout principal

Crie um layout estilo dashboard com:

* Sidebar fixa
* Header superior
* Área principal responsiva
* Cards de progresso
* Busca global
* Filtro por categoria
* Filtro por nível
* Tema dark como padrão
* Suporte futuro a tema light
* Avatar do usuário
* Menu de configurações
* Indicadores de evolução

A sidebar deve conter links para todas as rotas:

* Conteúdos
* Evolução
* Stack
* Aulas Udemy
* Material
* Livros
* Carreira
* Exercícios
* Projetos
* Configurações

---

## Design system

Crie um design system próprio inspirado em plataformas modernas de tecnologia.

Use como base:

```txt
background: #09090B
surface: #111113
card: #18181B
border: #27272A
primary: #8257E5
secondary: #04D361
text-primary: #F4F4F5
text-secondary: #A1A1AA
danger: #EF4444
warning: #F59E0B
success: #22C55E
```

Componentes obrigatórios:

* Button
* Card
* Badge
* Progress
* SidebarItem
* CourseCard
* LessonCard
* ProjectCard
* BookCard
* CareerCard
* StatCard
* EmptyState
* LoadingState
* Modal
* Tabs
* Command Search
* Tooltip

---

## Banco de dados Supabase

Crie SQL completo para as tabelas:

### users_profile

Campos:

* id
* user_id
* name
* avatar_url
* current_level
* goal
* created_at
* updated_at

### contents

Campos:

* id
* title
* description
* category
* level
* area
* order_index
* estimated_hours
* status
* created_at

### progress

Campos:

* id
* user_id
* content_id
* status
* progress_percentage
* completed_at
* updated_at

### stack_items

Campos:

* id
* name
* description
* category
* level
* documentation_url
* icon
* created_at

### udemy_courses

Campos:

* id
* title
* instructor
* url
* category
* level
* duration
* status
* created_at

### materials

Campos:

* id
* title
* description
* type
* url
* category
* level
* created_at

### books

Campos:

* id
* title
* author
* description
* url
* category
* level
* status
* created_at

### career_paths

Campos:

* id
* title
* description
* area
* skills
* roadmap
* salary_range
* created_at

### exercises

Campos:

* id
* title
* description
* difficulty
* category
* starter_code
* solution
* created_at

### projects

Campos:

* id
* title
* description
* difficulty
* area
* technologies
* requirements
* github_url
* status
* created_at

---

## Funcionalidades por rota

### `/conteudos`

Página principal de conteúdos.

Deve conter:

* Lista de módulos
* Trilhas por área
* Filtros por nível
* Filtros por categoria
* Cards com progresso
* Botão para marcar como iniciado
* Botão para marcar como concluído

Categorias sugeridas:

* Fundamentos de Python
* Estruturas de Dados
* Programação Orientada a Objetos
* APIs
* Banco de Dados
* Web Scraping
* Automação
* Testes
* Análise de Dados
* IoT
* Engenharia de Software
* Engenharia de Dados

---

### `/evolucao`

Dashboard de progresso do usuário.

Deve conter:

* Porcentagem geral concluída
* Conteúdos iniciados
* Conteúdos concluídos
* Horas estimadas estudadas
* Gráfico de evolução
* Progresso por área
* Ranking de habilidades
* Próximos passos recomendados

---

### `/stack`

Página com tecnologias do ecossistema Python.

Deve conter cards para:

* Python
* FastAPI
* Django
* Flask
* Pandas
* NumPy
* Matplotlib
* Seaborn
* Jupyter
* SQLAlchemy
* PostgreSQL
* Supabase
* Docker
* Git
* GitHub
* MQTT
* Raspberry Pi
* Airflow
* Spark
* Pytest

---

### `/aulas-udemy`

Página para organizar cursos da Udemy.

Deve conter:

* Lista de cursos
* Status do curso
* Progresso
* Link externo
* Instrutor
* Categoria
* Duração
* Nível

---

### `/material`

Página para materiais complementares.

Tipos:

* Artigos
* Documentação
* Vídeos
* Cheatsheets
* Repositórios
* Guias
* PDFs
* Links úteis

---

### `/livros`

Página para livros recomendados.

Deve conter:

* Capa ou placeholder
* Título
* Autor
* Categoria
* Nível
* Status de leitura
* Link
* Descrição

---

### `/carreira`

Página focada em carreira.

Áreas:

* Python Developer
* Backend Developer
* Data Analyst
* Data Engineer
* IoT Developer
* Software Engineer
* Automation Developer

Cada trilha deve mostrar:

* Descrição da carreira
* Habilidades necessárias
* Roadmap
* Projetos recomendados
* Tecnologias essenciais
* Nível esperado
* Sugestões de portfólio

---

### `/exercicios`

Página de exercícios práticos.

Deve conter:

* Exercícios por dificuldade
* Editor de código simples
* Enunciado
* Código inicial
* Solução escondida
* Botão para revelar solução
* Tags
* Status de conclusão

Dificuldades:

* Básico
* Intermediário
* Avançado
* Desafio real

---

### `/projetos`

Página de projetos práticos.

Projetos sugeridos:

* Calculadora CLI
* Sistema de tarefas
* Web scraper
* API REST com FastAPI
* Dashboard de dados
* Bot de automação
* Sistema IoT com MQTT
* Pipeline de dados
* ETL com Python
* Projeto final full-stack com Python

Cada projeto deve conter:

* Objetivo
* Requisitos
* Tecnologias usadas
* Passo a passo
* Critérios de conclusão
* Status
* Link do GitHub

---

### `/configuracoes`

Página de configurações.

Deve conter:

* Dados do perfil
* Objetivo de aprendizado
* Nível atual
* Preferências de tema
* Resetar progresso
* Exportar dados
* Configurar Supabase
* Configurar preferências da plataforma

---

## Leitura do arquivo `informacao.md`

A aplicação deve conter uma camada responsável por ler, interpretar e transformar o conteúdo do arquivo `informacao.md`.

Crie uma função utilitária para processar esse arquivo e estruturar os dados em objetos como:

```ts
type LearningContent = {
  title: string
  description: string
  category: string
  level: "basico" | "intermediario" | "avancado"
  area: string
  estimatedHours?: number
}
```

Se o arquivo estiver em Markdown, parseie headings, listas, links e seções.

Crie uma estrutura para importar esses dados para o Supabase.

---

## Requisitos técnicos

A IA deve gerar:

* Estrutura completa de pastas
* Código funcional
* Componentes reutilizáveis
* Layout responsivo
* Integração com Supabase
* SQL das tabelas
* Seed inicial de dados
* Página inicial do dashboard
* Rotas protegidas
* Sistema de autenticação
* Tratamento de loading
* Tratamento de erro
* Empty states
* Validação de formulários
* Tipagem forte com TypeScript

---

## Estrutura esperada do projeto

```txt
/app
  /(dashboard)
    layout.tsx
    page.tsx
    conteudos/page.tsx
    evolucao/page.tsx
    stack/page.tsx
    aulas-udemy/page.tsx
    material/page.tsx
    perguntas-carreira-python/page.tsx
    livros/page.tsx
    vagas/page.tsx
    carreira/page.tsx
    perfil/page.tsx
    exercicios/page.tsx
    projetos/page.tsx
    configuracoes/page.tsx
  /auth
    login/page.tsx
    register/page.tsx

/components
  /ui
  /dashboard
  /cards
  /forms
  /layout

/lib
  /supabase
  /utils
  /data
  /parser

/types
/hooks
/store
/styles
/supabase
  schema.sql
  seed.sql
```

---

## Experiência visual

A interface deve ter:

* Dashboard escuro moderno
* Cards com bordas suaves
* Gradientes discretos
* Sidebar premium
* Ícones elegantes
* Animações suaves
* Layout responsivo para desktop, tablet e mobile
* Microinterações em botões e cards
* Estados visuais de progresso
* Badges coloridas por dificuldade
* Barras de progresso
* Gráficos simples

---

## Página inicial `/`

A página inicial deve mostrar:

* Saudação ao usuário
* Progresso geral
* Conteúdos em andamento
* Próximos estudos recomendados
* Projetos em destaque
* Stack recomendada
* Atalhos rápidos
* Card de carreira sugerida
* Últimas atividades

---

## Autenticação

Implemente autenticação com Supabase Auth.

Funcionalidades:

* Login
* Cadastro
* Logout
* Proteção das rotas do dashboard
* Perfil do usuário
* Sessão persistente

---

## Regras importantes

* Escreva código limpo, modular e escalável
* Use TypeScript corretamente
* Evite componentes gigantes
* Separe responsabilidades
* Use nomes claros
* Comente apenas onde for necessário
* Priorize performance
* Priorize acessibilidade
* Use componentes reutilizáveis
* A plataforma deve estar pronta para expansão futura

---

## Entregáveis esperados

Gere todos os arquivos necessários para o projeto funcionar.

Inclua:

1. Comandos de instalação
2. Estrutura de pastas
3. Configuração do Tailwind
4. Configuração do Supabase
5. Schema SQL
6. Seed SQL
7. Componentes principais
8. Layout do dashboard
9. Todas as páginas das rotas
10. Parser do arquivo `informacao.md`
11. Tipos TypeScript
12. Hooks
13. Serviços de banco
14. Autenticação
15. Guia de execução local

---

## Comandos esperados

Inclua instruções como:

```bash
npx create-next-app@latest python-learning-dashboard --typescript --tailwind --eslint --app
cd python-learning-dashboard

npm install @supabase/supabase-js @supabase/ssr lucide-react framer-motion zustand react-hook-form zod @hookform/resolvers class-variance-authority clsx tailwind-merge
npm install react-markdown remark-gfm
npm run dev
```

---

## Resultado final esperado

O resultado final deve ser uma plataforma completa, funcional, moderna e profissional para aprendizado de Python, funcionando como um dashboard interativo, com dados persistidos no Supabase, leitura do arquivo `informacao.md`, rotas bem organizadas e visual inspirado em plataformas premium de tecnologia.

A resposta deve ser extremamente completa, gerando código real e pronto para uso.

* Deve gerar arquivo sql completo e ja inserir as informacoes no banco de dados do supabase via REST (Token: "sbp_3634d88745b1adae7450f4dcc2735fd7b97ce7cf")