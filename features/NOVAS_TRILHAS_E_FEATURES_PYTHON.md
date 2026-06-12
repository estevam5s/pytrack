# PyTrack - novas trilhas, rotas e ferramentas SaaS para o ecossistema Python

Este documento e um briefing completo para o Claude Code expandir a plataforma PyTrack com novas trilhas de aprendizado, novas rotas de dashboard e ferramentas de produto SaaS. Ele foi escrito a partir da estrutura atual do projeto Next.js App Router, Supabase, Stripe e conteudo markdown local.

## 1. Diagnostico da plataforma atual

### Stack e arquitetura atual

- Framework: Next.js App Router com React 19 e TypeScript.
- UI: Tailwind CSS, componentes proprios em `components/ui`, icones `lucide-react`.
- Conteudo: modulos markdown em `doc/Conteudos`, manifest gerado em `lib/content/manifest.ts` e `lib/content/extra-manifest.ts`.
- Trilhas: definidas em `lib/trilhas.ts` como dados TypeScript (`TRILHAS`).
- Especializacoes: definidas em `lib/specializations.ts`.
- Autenticacao e dados: Supabase.
- Monetizacao: Stripe, tiers `free`, `essencial`, `completo`, `suprema`, `vitalicio`.
- Analytics: `datafast` ja inicializado em `components/datafast-init.tsx`.

### Rotas atuais do dashboard

Grupo Estudar:

- `/inicio`: hub principal com progresso, recomendacoes, graficos, pomodoro e cards.
- `/minhas-trilhas`: catalogo de trilhas.
- `/minhas-trilhas/[id]`: detalhe de uma trilha, modulos agrupados por area.
- `/comunidade`: feed social/comunidade.
- `/evolucao`: evolucao, graficos e metricas.
- `/stack`: tecnologias do ecossistema Python.
- `/exercicios`: exercicios.
- `/ide`: IDE Python no navegador.
- `/conteudos`: redireciona para `/minhas-trilhas`.
- `/conteudos/[modulo]` e `/conteudos/[modulo]/[licao]`: leitor de modulo/licao.

Grupo Recursos:

- `/aulas-udemy`: cursos externos.
- `/aulas-youtube`: videos/playlists.
- `/material`: materiais.
- `/livros`: livros.
- `/aplicativo`: app/mobile/desktop.

Grupo Carreira:

- `/minha-carreira`: carreira.
- `/especializacoes`: especializacoes.
- `/consultor-ia`: consultor de IA.
- `/vagas`: vagas.
- `/perguntas-carreira-python`: perguntas de entrevista/carreira.

Grupo Conta:

- `/perfil`: perfil publico/usuario.
- `/suporte`: suporte.
- `/configuracoes/*`: conta, plano, perfil, seguranca, dados, aparencia, IA, indicacoes, plataforma, sobre.

Grupo Admin:

- `/admin`: dashboard admin.
- `/admin/clientes`: clientes e receita.
- `/admin/moderacao`: moderacao.
- `/admin/mensagens`: mensagens de suporte.

### Gating atual por plano

O arquivo `lib/billing-access.ts` define o acesso:

- `free`: `/inicio`, `/onboarding`, `/minhas-trilhas`, `/minhas-trilhas/[id]`, `/aplicativo`, `/ide`, `/conteudos`, primeiro modulo `parte-1-basico`, `/perfil`, `/configuracoes`, `/suporte`.
- `essencial`: rotas de estudo e recursos que nao sao "completo only".
- `completo`: `/comunidade`, `/meus-projetos`, `/especializacoes`, `/consultor-ia`, `/minha-carreira`, `/vagas`, `/perguntas-carreira-python`.
- `suprema` e `vitalicio`: acesso acima de completo.

### Areas reais de conteudo ja existentes

As novas trilhas devem reutilizar `areas` quando possivel. Areas encontradas nos manifests:

- `Fundamentos`
- `Matemática`
- `Algoritmos`
- `Persistência`
- `Banco de Dados`
- `Engenharia de Software`
- `Performance & Async`
- `Automação`
- `Finanças`
- `Redes`
- `Qualidade`
- `Backend`
- `DevOps`
- `IoT`
- `Data Science`
- `Especializações`
- `Segurança`
- `Arquitetura`
- `Machine Learning`
- `Engenharia de Dados`
- `Desktop`
- `Jogos`

Observacao tecnica importante: em `lib/trilhas.ts`, a trilha `python-developer` usa `"Performance & Assincronia"`, mas a area real no manifest e `"Performance & Async"`. Se uma trilha depender dessa area, usar o nome real ou adicionar compatibilidade.

### Pontos fortes atuais

- O produto ja tem uma base grande de conteudo.
- O dashboard ja parece SaaS: progresso, carreira, recursos, comunidade, suporte, configuracoes, admin e billing.
- A estrutura de trilhas e declarativa, facil de expandir.
- O leitor de conteudo ja suporta markdown local e progresso Supabase.
- O produto ja tem dados externos/curados: livros, Udemy, YouTube, vagas, materiais e stack.

### Lacunas de produto

- As trilhas atuais sao boas, mas ainda muito amplas. Faltam jornadas orientadas a resultado: "construa um SaaS", "passe em entrevista", "automatize trabalho real", "IA para produto", "backend monetizado".
- Faltam ferramentas interativas que criem habito diario e sensacao de progresso: desafios diarios, laboratorio de projetos, simulador de entrevista, code review, checklist de deploy, avaliador de portfolio.
- Faltam rotas que transformem o conteudo em produto SaaS premium: diagnostico, plano semanal, missao guiada, mentor IA por trilha, workspace de projeto, gerador de CV/GitHub/LinkedIn, ranking e certificacao.
- Faltam entidades persistidas para features mais fortes: metas semanais, submissao de exercicios, revisoes IA, projetos do usuario, certificacoes, badges, streaks e planos de estudo.

## 2. Como adicionar novas trilhas no app atual

### Arquivos principais

- `lib/trilhas.ts`: adicionar objetos em `TRILHAS`.
- `lib/content/manifest.ts`: gerado automaticamente por `scripts/generate-content.mjs`, nao editar manualmente.
- `lib/content/extra-manifest.ts`: gerado por `scripts/gen-ecosystem-content.mjs`, nao editar manualmente.
- `doc/Conteudos/...`: criar novos arquivos markdown de licao.
- `scripts/generate-content.mjs` e/ou `scripts/gen-ecosystem-content.mjs`: regenerar manifests quando criar conteudo novo.
- `supabase/contents_docs.sql` e `supabase/contents_extra.sql`: manter seeds de `contents` coerentes com os slugs, se o fluxo de seed exigir.

### Modelo de trilha

Cada trilha segue a interface:

```ts
export interface Trilha {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  icon: LucideIcon;
  tier: Tier;
  areas: string[];
  moduleSlugs?: string[];
  level: "basico" | "intermediario" | "avancado";
  accent: string;
  topics: string[];
  adModules: number;
  adLessons: number;
  adHours: number;
}
```

### Regras para novas trilhas

- Use `areas` quando a trilha representa uma area inteira.
- Use `moduleSlugs` quando a trilha precisa de uma curadoria precisa de modulos.
- Evite duplicar trilhas com nomes parecidos; pense em objetivo do usuario.
- Priorize nomes de trilha que vendem resultado: "SaaS com Python", "Backend de Alta Performance", "Python para Entrevistas", "Agentes de IA em Producao".
- Defina `tier` de acordo com valor:
  - `free`: entrada, diagnostico e primeiras experiencias.
  - `essencial`: formacao base e ferramentas de produtividade.
  - `completo`: carreira, projetos robustos, especializacoes e comunidade.
  - `suprema`: capstones, multi-stack, projetos finais e mentoria IA profunda.

## 3. Novas trilhas recomendadas

### 3.1 SaaS Full Stack com Python

- id: `saas-full-stack-python`
- title: `SaaS Full Stack com Python`
- subtitle: `Do zero a um produto vendavel`
- goal: `Quero criar um SaaS real com Python, pagamento, auth e deploy`
- tier: `suprema`
- level: `avancado`
- areas: `["Backend", "Banco de Dados", "DevOps", "Arquitetura", "Engenharia de Software"]`
- modulos novos sugeridos:
  - Produto SaaS, dominio e modelagem de features.
  - Autenticacao, RBAC, multi-tenant e permissoes.
  - Billing com Stripe, planos, trials, webhooks e inadimplencia.
  - Backend com FastAPI, SQLAlchemy, Postgres e Redis.
  - Painel admin, metricas, suporte e auditoria.
  - Deploy com Docker, CI/CD e observabilidade.
  - Capstone: SaaS completo com landing, dashboard, billing e admin.
- projetos:
  - Micro SaaS de automacao.
  - Plataforma de cursos.
  - CRM simples com planos pagos.
  - Sistema multi-tenant com painel admin.

### 3.2 Backend de Alta Performance

- id: `backend-alta-performance`
- title: `Backend de Alta Performance`
- subtitle: `APIs rapidas, resilientes e observaveis`
- goal: `Quero construir APIs Python escalaveis e prontas para producao`
- tier: `completo`
- level: `avancado`
- areas: `["Backend", "Performance & Async", "Banco de Dados", "DevOps"]`
- conteudos:
  - FastAPI avancado.
  - AsyncIO aplicado a APIs.
  - Pool de conexoes, caching e Redis.
  - Rate limiting, filas e backpressure.
  - Profiling, load test e tuning.
  - OpenTelemetry, logs estruturados e tracing.
  - Deploy horizontal e blue/green.
- ferramentas conectadas:
  - Checklist de performance.
  - Laboratorio de carga.
  - Comparador sync vs async.

### 3.3 Python para Entrevistas e Carreira Internacional

- id: `python-entrevistas-carreira`
- title: `Python para Entrevistas`
- subtitle: `Algoritmos, system design e comunicacao tecnica`
- goal: `Quero passar em entrevistas Python e backend`
- tier: `completo`
- level: `intermediario`
- areas: `["Fundamentos", "Algoritmos", "Backend", "Arquitetura", "Qualidade"]`
- conteudos:
  - Revisao de core Python.
  - Estruturas de dados e Big O.
  - Exercicios de entrevista com Python.
  - Debugging ao vivo e leitura de codigo.
  - System design para backend Python.
  - Perguntas comportamentais e portfolio.
  - Simulados com feedback IA.
- integrar com rota atual:
  - `/perguntas-carreira-python`
  - `/consultor-ia`
  - `/meus-projetos`

### 3.4 Agentes de IA em Producao

- id: `agentes-ia-producao`
- title: `Agentes de IA em Producao`
- subtitle: `RAG, tools, workflows e avaliacao`
- goal: `Quero criar agentes de IA uteis, confiaveis e monitorados`
- tier: `suprema`
- level: `avancado`
- areas: `["Machine Learning", "Backend", "Arquitetura", "DevOps"]`
- moduleSlugs existentes uteis:
  - `ext-agentes-de-ia-com-python`
  - `ext-langchain-e-rag`
  - `ext-nlp-e-llms`
  - `ext-mlops-na-pratica`
- conteudos novos:
  - RAG orientado a produto.
  - Function calling e tools.
  - Memoria, estado e workflows.
  - Multi-agent systems.
  - Avaliacao automatizada.
  - Guardrails, seguranca e custo.
  - Deploy de agentes com FastAPI.
- ferramenta nova:
  - Playground de prompt e avaliacao.
  - Calculadora de custo de LLM.
  - Auditor de respostas RAG.

### 3.5 Automacao Empresarial e RPA com Python

- id: `automacao-empresarial-rpa`
- title: `Automacao Empresarial e RPA`
- subtitle: `Automatize processos reais de empresas`
- goal: `Quero economizar horas automatizando tarefas repetitivas`
- tier: `essencial`
- level: `intermediario`
- areas: `["Automação", "Persistência", "Backend"]`
- conteudos:
  - Automacao de planilhas e relatorios.
  - Scraping com Playwright.
  - Automacao de navegador com Selenium.
  - PDFs, e-mails e OCR.
  - Filas e agendamentos.
  - Logs, retry e monitoramento.
  - Deploy de robos em VPS.
- projetos:
  - Robo de relatorio financeiro.
  - Monitor de precos.
  - Integrador de APIs.
  - Bot de atendimento com fila.

### 3.6 Data Apps com Python

- id: `data-apps-python`
- title: `Data Apps com Python`
- subtitle: `Dashboards e apps de dados para negocio`
- goal: `Quero criar dashboards e produtos de dados interativos`
- tier: `completo`
- level: `intermediario`
- areas: `["Data Science", "Backend", "Banco de Dados"]`
- conteudos:
  - Streamlit profissional.
  - Dashboards com Plotly.
  - DuckDB e Polars para dados locais.
  - Upload, filtros, cache e sessao.
  - Apps de dados com auth.
  - Deploy de Streamlit/FastAPI.
  - Storytelling e KPI design.
- ferramenta nova:
  - Gerador de dashboard por dataset.
  - Checklist de metricas.
  - Galeria de data apps.

### 3.7 Analytics Engineer com Python, SQL e dbt

- id: `analytics-engineer-python`
- title: `Analytics Engineer`
- subtitle: `SQL, dbt, qualidade e modelagem de dados`
- goal: `Quero transformar dados brutos em modelos confiaveis para negocio`
- tier: `completo`
- level: `avancado`
- areas: `["Engenharia de Dados", "Data Science", "Banco de Dados"]`
- conteudos:
  - SQL analitico.
  - Modelagem dimensional.
  - dbt core e testes.
  - DuckDB como warehouse local.
  - Data contracts e data quality.
  - Lineage e documentacao.
  - Camadas bronze, silver e gold.

### 3.8 MLOps e Modelos em Producao

- id: `mlops-modelos-producao`
- title: `MLOps e Modelos em Producao`
- subtitle: `Do notebook ao deploy monitorado`
- goal: `Quero colocar modelos de ML em producao com confiabilidade`
- tier: `suprema`
- level: `avancado`
- areas: `["Machine Learning", "DevOps", "Backend", "Engenharia de Dados"]`
- conteudos:
  - MLflow, DVC e versionamento.
  - Feature stores.
  - Serving com FastAPI/BentoML.
  - Batch inference e online inference.
  - Monitoramento de drift.
  - A/B testing e rollback.
  - Custos e latencia.

### 3.9 Python para Financas, Trading e Dados de Mercado

- id: `python-financas-trading`
- title: `Python para Financas e Trading`
- subtitle: `Dados de mercado, risco e backtesting`
- goal: `Quero usar Python para analise financeira e estrategias quant`
- tier: `completo`
- level: `avancado`
- areas: `["Finanças", "Data Science", "Matemática"]`
- moduleSlugs existentes uteis:
  - `parte-6-financas`
  - `parte-6-financas-quantitativas`
- conteudos:
  - Dados de mercado.
  - Indicadores e series temporais.
  - Backtesting.
  - Risco e portfolio.
  - Derivativos e volatilidade.
  - Automacao de relatorios financeiros.

### 3.10 Python Security Lab

- id: `python-security-lab`
- title: `Python Security Lab`
- subtitle: `AppSec, DevSecOps e automacao de seguranca`
- goal: `Quero proteger aplicacoes e criar ferramentas de seguranca`
- tier: `completo`
- level: `avancado`
- areas: `["Segurança", "Backend", "DevOps", "Redes"]`
- conteudos:
  - OWASP aplicado a Python.
  - Auth segura com JWT/OAuth2.
  - Secrets, criptografia e hashing.
  - SAST, dependency scanning e supply chain.
  - Rate limiting e hardening.
  - Pentest automation etico.
  - Pipeline DevSecOps.

### 3.11 Python Open Source e Pacotes Profissionais

- id: `python-open-source-pacotes`
- title: `Open Source e Pacotes Python`
- subtitle: `Crie bibliotecas, CLIs e pacotes publicaveis`
- goal: `Quero publicar pacotes Python profissionais e contribuir open source`
- tier: `essencial`
- level: `intermediario`
- areas: `["Engenharia de Software", "Qualidade", "DevOps"]`
- conteudos:
  - Estrutura de pacote moderno.
  - `pyproject.toml`, uv/poetry/hatch.
  - CLI com Typer e Rich.
  - Testes, coverage e docs.
  - Publicacao no PyPI.
  - Versionamento semantico e releases.
  - Manutencao open source.

### 3.12 Python para APIs de IA

- id: `python-apis-ia`
- title: `APIs de IA com Python`
- subtitle: `FastAPI, LLMs, streaming e produtos inteligentes`
- goal: `Quero criar APIs que usam IA generativa com boa UX`
- tier: `completo`
- level: `avancado`
- areas: `["Backend", "Machine Learning", "Arquitetura"]`
- conteudos:
  - Streaming de resposta.
  - APIs com LLM e tools.
  - Cache semantico.
  - Upload e processamento de documentos.
  - Observabilidade de prompt.
  - Rate limit por usuario/plano.
  - Billing por uso.

### 3.13 Python Desktop Pro

- id: `python-desktop-pro`
- title: `Python Desktop Pro`
- subtitle: `Apps desktop modernos e distribuiveis`
- goal: `Quero criar aplicativos desktop profissionais com Python`
- tier: `essencial`
- level: `intermediario`
- areas: `["Desktop", "Engenharia de Software", "Qualidade"]`
- conteudos:
  - PySide6 moderno.
  - Arquitetura de UI.
  - Estado, eventos e forms.
  - Persistencia local.
  - Empacotamento para Windows/macOS/Linux.
  - Auto-update e assinatura.
  - UX para ferramentas internas.

### 3.14 Python Game Dev e Simulacoes

- id: `python-game-dev-simulacoes`
- title: `Game Dev e Simulacoes`
- subtitle: `Jogos, fisica simples e visualizacoes interativas`
- goal: `Quero aprender Python criando jogos e simuladores`
- tier: `essencial`
- level: `intermediario`
- areas: `["Jogos", "Matemática", "Algoritmos"]`
- conteudos:
  - Pygame.
  - Loop de jogo.
  - Sprites, colisao e estados.
  - IA simples para jogos.
  - Simulacoes fisicas.
  - Projeto final: jogo completo.

### 3.15 Python Cloud Native

- id: `python-cloud-native`
- title: `Python Cloud Native`
- subtitle: `Containers, Kubernetes, serverless e observabilidade`
- goal: `Quero operar sistemas Python modernos na nuvem`
- tier: `completo`
- level: `avancado`
- areas: `["DevOps", "Backend", "Arquitetura"]`
- conteudos:
  - Docker para apps Python.
  - Kubernetes e Helm.
  - Serverless com Python.
  - Terraform.
  - Observabilidade.
  - Seguranca de containers.
  - FinOps para apps Python.

### 3.16 Python para Produtos Internos

- id: `python-produtos-internos`
- title: `Python para Produtos Internos`
- subtitle: `Ferramentas internas, paineis e automacoes para empresas`
- goal: `Quero criar ferramentas que times realmente usam`
- tier: `completo`
- level: `intermediario`
- areas: `["Automação", "Backend", "Data Science", "Engenharia de Software"]`
- conteudos:
  - Descoberta de processo.
  - Apps internos com FastAPI/Streamlit.
  - Permissoes e auditoria.
  - Integracoes com planilhas, e-mail e APIs.
  - Logs, suporte e operacao.
  - Metricas de uso e ROI.

### 3.17 Python Testing Mastery

- id: `python-testing-mastery`
- title: `Python Testing Mastery`
- subtitle: `Testes que sustentam software profissional`
- goal: `Quero escrever testes de nivel profissional em Python`
- tier: `essencial`
- level: `intermediario`
- areas: `["Qualidade", "Engenharia de Software"]`
- conteudos:
  - Pytest do zero ao avancado.
  - Fixtures, parametrizacao e mocks.
  - Testes de integracao.
  - Testes de contrato.
  - Property-based testing.
  - Coverage util.
  - CI com testes.

### 3.18 Python Observability e SRE

- id: `python-observability-sre`
- title: `Observabilidade e SRE para Python`
- subtitle: `Logs, metricas, traces, incidentes e confiabilidade`
- goal: `Quero operar sistemas Python com confianca`
- tier: `completo`
- level: `avancado`
- areas: `["DevOps", "Backend", "Performance & Async"]`
- conteudos:
  - Logging estruturado.
  - Metricas com Prometheus.
  - Tracing com OpenTelemetry.
  - Dashboards Grafana.
  - Alertas, SLOs e runbooks.
  - Postmortem e melhoria continua.

### 3.19 Python com Banco de Dados Avancado

- id: `python-banco-dados-avancado`
- title: `Banco de Dados Avancado com Python`
- subtitle: `SQL, ORM, performance e arquitetura de dados`
- goal: `Quero dominar persistencia e queries em sistemas Python`
- tier: `completo`
- level: `avancado`
- areas: `["Banco de Dados", "Backend", "Arquitetura"]`
- conteudos:
  - SQL avancado.
  - SQLAlchemy 2.0.
  - Alembic e migracoes.
  - Indices, explain e tuning.
  - Transacoes e concorrencia.
  - Redis, MongoDB e Elasticsearch.
  - Repositorios e unit of work.

### 3.20 Python Creator: Conteudo, Portifolio e Autoridade

- id: `python-creator-portfolio`
- title: `Python Creator e Portfolio`
- subtitle: `Construa autoridade com projetos, artigos e GitHub`
- goal: `Quero montar portfolio e me posicionar como profissional Python`
- tier: `completo`
- level: `intermediario`
- areas: `["Engenharia de Software", "Carreira", "Qualidade"]`
- observacao: a area `Carreira` ainda nao existe no manifest; usar `moduleSlugs` ou criar novos modulos.
- conteudos:
  - Como escolher projetos de portfolio.
  - README profissional.
  - GitHub profile e pinned repos.
  - Artigos tecnicos.
  - LinkedIn para dev Python.
  - Demo, deploy e apresentacao.
  - Feedback IA em portfolio.

## 4. Novas rotas e ferramentas SaaS recomendadas

As rotas abaixo devem ser adicionadas em `app/(dashboard)/...` e em `lib/navigation.ts`. Quando forem premium, atualizar `lib/billing-access.ts`.

### 4.1 `/diagnostico`

Objetivo: avaliar o usuario e recomendar uma trilha.

Funcionalidades:

- Quiz tecnico adaptativo.
- Perguntas por objetivo: backend, dados, IA, automacao, carreira, devops.
- Resultado com nivel, lacunas, trilha recomendada e plano de 30 dias.
- Gerar evento DataFast: `diagnostic_completed`.

Dados sugeridos:

- tabela `diagnostics`
- tabela `diagnostic_answers`
- campos: `user_id`, `goal`, `score`, `level`, `recommended_track_id`, `created_at`.

Plano: liberar para `free` como aquisicao e upsell.

### 4.2 `/plano-de-estudo`

Objetivo: transformar trilhas em agenda semanal.

Funcionalidades:

- Plano de 7, 14, 30 ou 90 dias.
- Metas semanais.
- Blocos de estudo com conteudo, exercicio e projeto.
- Ajuste por disponibilidade: 30min, 1h, 2h/dia.
- Botao "comecei hoje".
- Streak de estudo.

Dados sugeridos:

- tabela `study_plans`
- tabela `study_plan_items`
- tabela `study_sessions`

Plano: `essencial`.

### 4.3 `/desafios`

Objetivo: criar habito e engajamento.

Funcionalidades:

- Desafio diario Python.
- Desafio semanal por trilha.
- Ranking pessoal e badges.
- Submissao de codigo.
- Feedback automatico por IA.
- Integracao com `/ide`.

Dados sugeridos:

- tabela `challenges`
- tabela `challenge_submissions`
- tabela `badges`
- tabela `user_badges`

Plano:

- diario basico: `free`
- feedback IA e ranking completo: `completo`

### 4.4 `/laboratorio`

Objetivo: workspace de projetos prontos para executar.

Funcionalidades:

- Projetos guiados com etapas.
- Templates por trilha.
- Checklist de requisitos.
- Link para GitHub.
- Validacao por testes.
- Area "meu progresso no projeto".

Pode evoluir `/meus-projetos`, mas a rota separada vende melhor como feature premium.

Plano: `completo`.

### 4.5 `/code-review`

Objetivo: ferramenta premium de avaliacao de codigo.

Funcionalidades:

- Upload/cola de codigo.
- Analise por criterios: legibilidade, bugs, performance, seguranca, testes, arquitetura.
- Rubrica por nivel.
- Sugestao de refatoracao.
- Exportar relatorio.

Dados sugeridos:

- tabela `code_reviews`
- campos: `user_id`, `language`, `input`, `summary`, `score`, `findings`, `created_at`.

Plano: `completo` ou `suprema` dependendo do uso de IA.

### 4.6 `/simulador-entrevista`

Objetivo: preparar para entrevistas e vender valor de carreira.

Funcionalidades:

- Simulados por senioridade.
- Perguntas de Python, backend, algoritmos e system design.
- Cronometro.
- Feedback IA.
- Historico de tentativas.
- Score por competencia.

Integrar com:

- `/perguntas-carreira-python`
- `/consultor-ia`
- `/minha-carreira`

Plano: `completo`.

### 4.7 `/portfolio`

Objetivo: transformar aprendizado em empregabilidade.

Funcionalidades:

- Builder de portfolio Python.
- Checklist de GitHub.
- Importar projetos da tabela `projects`.
- Gerar README.
- Gerar descricao para LinkedIn.
- Score de empregabilidade.

Dados sugeridos:

- tabela `portfolio_items`
- tabela `portfolio_reviews`

Plano: `completo`.

### 4.8 `/certificados`

Objetivo: dar marco de progresso e prova social.

Funcionalidades:

- Certificado por trilha concluida.
- Certificado por projeto final aprovado.
- Pagina publica verificavel.
- Badge no perfil.

Dados sugeridos:

- tabela `certificates`
- campos: `user_id`, `track_id`, `certificate_code`, `issued_at`, `public_url`.

Plano: certificado basico para `essencial`, certificados premium/projeto para `completo`.

### 4.9 `/playground-ia`

Objetivo: playground educativo para IA com Python.

Funcionalidades:

- Testar prompts.
- Comparar modelos/configuracoes.
- Simular RAG com documentos.
- Ver custo estimado.
- Gerar snippets Python.

Plano: `suprema`.

### 4.10 `/arquitetura-lab`

Objetivo: ensinar system design e arquitetura de software.

Funcionalidades:

- Canvas de arquitetura.
- Escolha de requisitos.
- Sugestao de componentes.
- Diagrama textual/mermaid.
- Checklist de trade-offs.
- Feedback IA.

Plano: `suprema`.

### 4.11 `/deploy-lab`

Objetivo: reduzir friccao para deploy de projetos Python.

Funcionalidades:

- Checklist por tipo de app: FastAPI, Streamlit, bot, worker, desktop.
- Gerador de Dockerfile.
- Gerador de GitHub Actions.
- Checklist de variaveis de ambiente.
- Runbook de producao.

Plano: `completo`.

### 4.12 `/mapa-python`

Objetivo: visual do ecossistema inteiro.

Funcionalidades:

- Mapa interativo por area.
- Mostrar progresso por node.
- Recomendar proximo node.
- Conectar tecnologias da rota `/stack`.

Plano: `free` para visualizar, `essencial` para progresso completo.

## 5. Melhorias nas rotas existentes

### `/inicio`

Adicionar:

- Card "Seu proximo melhor passo" com base em progresso e objetivo.
- Card "Missao da semana".
- Card "Diagnostico pendente" para usuarios novos.
- Card "Projeto recomendado".
- Eventos DataFast: `dashboard_cta_clicked`, `weekly_mission_started`.

### `/minhas-trilhas`

Adicionar:

- Filtros por objetivo: carreira, backend, dados, IA, automacao, iniciante.
- Filtros por duracao: curta, media, longa.
- Badge "recomendada para voce".
- Ordenacao por progresso, popularidade e nivel.
- Preview de projeto final.
- Comparador de trilhas.

### `/minhas-trilhas/[id]`

Adicionar:

- Plano de estudo automatico.
- Projetos obrigatorios da trilha.
- Skills desbloqueadas.
- Certificado ao concluir.
- "Pergunte ao mentor desta trilha".
- Lista de pre-requisitos.

### `/ide`

Adicionar:

- Templates por trilha.
- Rodar testes de exercicios.
- Salvar snippets.
- Enviar para code review.
- Modo desafio com cronometro.

### `/evolucao`

Adicionar:

- Streak.
- Heatmap de estudo.
- Radar por habilidades, nao apenas areas.
- Metas semanais.
- Comparacao "antes/depois do diagnostico".

### `/stack`

Adicionar:

- "Stacks por objetivo": Backend, Data, IA, DevOps, Automacao.
- Dependencias entre tecnologias.
- Nivel recomendado para cada tecnologia.
- Projetos que usam cada tecnologia.

### `/meus-projetos`

Adicionar:

- Projetos por trilha.
- Status: planejado, em andamento, revisao, concluido, publicado.
- Rubrica de avaliacao.
- Upload de GitHub URL.
- Review IA.
- Badge para portfolio.

### `/consultor-ia`

Adicionar:

- Contexto do usuario: progresso, trilha atual, projetos, objetivo.
- Recomendacoes persistidas.
- Botao "transformar em plano de estudo".
- Limites por plano.

### `/perguntas-carreira-python`

Adicionar:

- Modo flashcards.
- Modo entrevista.
- Favoritos.
- Perguntas erradas para revisao.
- Feedback por senioridade.

### `/comunidade`

Adicionar:

- Canais por trilha.
- Showcase de projetos.
- Pair programming posts.
- Ranking de desafios.
- Moderacao por report ja existente.

### `/admin`

Adicionar:

- Analytics de trilhas mais acessadas.
- Conversao por rota.
- Usuarios travados por etapa.
- Conteudos com baixa conclusao.
- Relatorio de churn por plano.

## 7. Priorizacao sugerida

### Sprint 1 - Alto impacto e baixo risco

1. Criar rota `/diagnostico`.
2. Criar rota `/plano-de-estudo`.
3. Melhorar `/minhas-trilhas` com filtros por objetivo.
4. Adicionar 8 novas trilhas em `lib/trilhas.ts`.
5. Adicionar cards no `/inicio` para "proximo passo" e "missao da semana".

### Sprint 2 - Produto premium

1. Criar `/desafios`.
2. Criar `/code-review`.
3. Criar `/simulador-entrevista`.
4. Adicionar feedback IA com limites por plano.
5. Adicionar streak e badges.

### Sprint 3 - Carreira e retencao

1. Criar `/portfolio`.
2. Criar `/certificados`.
3. Melhorar `/meus-projetos` com rubrica e review.
4. Integrar `/consultor-ia` ao progresso real do usuario.
5. Criar pagina publica de certificado/perfil.

### Sprint 4 - Suprema e advanced SaaS

1. Criar `/playground-ia`.
2. Criar `/arquitetura-lab`.
3. Criar `/deploy-lab`.
4. Criar trilha `SaaS Full Stack com Python`.
5. Criar capstone final com avaliacao.

## 8. Sugestao de novas entradas em `lib/navigation.ts`

Adicionar no grupo `Estudar`:

- `Diagnostico` -> `/diagnostico` -> icon `ClipboardCheck`
- `Plano de estudo` -> `/plano-de-estudo` -> icon `CalendarCheck`
- `Desafios` -> `/desafios` -> icon `Trophy`
- `Laboratorio` -> `/laboratorio` -> icon `FlaskConical`
- `Code Review` -> `/code-review` -> icon `ScanSearch`

Adicionar no grupo `Carreira`:

- `Simulador de Entrevista` -> `/simulador-entrevista` -> icon `MessagesSquare`
- `Portfolio` -> `/portfolio` -> icon `BriefcaseBusiness`
- `Certificados` -> `/certificados` -> icon `BadgeCheck`

Adicionar no grupo `Recursos` ou `Estudar`:

- `Mapa Python` -> `/mapa-python` -> icon `Network`
- `Deploy Lab` -> `/deploy-lab` -> icon `Rocket`
- `Playground IA` -> `/playground-ia` -> icon `Sparkles`

## 9. Regras de UX para as novas telas

- Nao criar landing pages dentro do dashboard; cada rota deve ser uma ferramenta usavel no primeiro viewport.
- Usar cards apenas para itens repetidos, paineis ou ferramentas enquadradas.
- Manter interface densa, clara e operacional: produto SaaS, nao pagina de marketing.
- Toda rota nova deve ter:
  - `PageHeader`
  - estado vazio util
  - loading/erro se houver dados externos
  - CTA claro para proxima acao
  - gating visual por plano quando necessario
- Usar os componentes existentes:
  - `Button`
  - `Card`
  - `Badge`
  - `Progress`
  - `EmptyState`
  - `PageHeader`
- Usar icones `lucide-react`.
- Evitar paleta monotematica. A plataforma ja usa `primary`, `secondary`, `blue`, `green`, `magenta`, `warning`, `danger`.

## 10. Eventos analytics sugeridos com DataFast

Adicionar tracking nos principais CTAs:

- `track_selected`
- `track_started`
- `lesson_opened`
- `diagnostic_started`
- `diagnostic_completed`
- `study_plan_created`
- `challenge_started`
- `challenge_submitted`
- `code_review_requested`
- `interview_simulation_started`
- `portfolio_review_requested`
- `certificate_generated`
- `upgrade_clicked`

## 11. Conteudos novos por pasta markdown

Criar novas pastas em `doc/Conteudos/Ecossistema/`:

- `saas-full-stack-com-python`
- `backend-alta-performance`
- `agentes-de-ia-em-producao`
- `automacao-empresarial-rpa`
- `data-apps-com-python`
- `analytics-engineer-python`
- `mlops-modelos-em-producao`
- `python-security-lab`
- `open-source-e-pacotes-python`
- `python-testing-mastery`
- `observabilidade-e-sre-python`
- `deploy-lab-python`

Cada pasta deve conter:

- `README.md`
- `01_*.md`
- `02_*.md`
- `03_*.md`
- pelo menos um projeto guiado no final.

Padrao recomendado para cada licao:

```md
# Titulo da licao

## Objetivo

## Quando usar

## Conceitos essenciais

## Exemplo pratico

## Erros comuns

## Checklist profissional

## Exercicio guiado

## Projeto incremental

## Proximos passos
```

## 12. Ordem recomendada para o Claude Code implementar

1. Corrigir nomes de areas inconsistentes em trilhas existentes, especialmente `Performance & Assincronia` vs `Performance & Async`.
2. Adicionar novas trilhas em `lib/trilhas.ts` usando areas existentes.
3. Adicionar novas rotas em `app/(dashboard)/...`.
4. Atualizar `lib/navigation.ts`.
5. Atualizar `lib/billing-access.ts` para gating das novas rotas.
6. Criar schemas Supabase em novo arquivo `supabase/platform-learning-tools.sql`.
7. Criar tipos em `types/index.ts`.
8. Criar queries/actions em `lib/data/...`.
9. Criar componentes em `components/dashboard/...`.
10. Adicionar tracking DataFast nos CTAs.
11. Criar/atualizar conteudo markdown.
12. Rodar `npm run typecheck`.

## 13. Trilhas que devem entrar primeiro

Para maior retorno de produto, implementar primeiro:

1. `python-entrevistas-carreira`
2. `backend-alta-performance`
3. `automacao-empresarial-rpa`
4. `data-apps-python`
5. `agentes-ia-producao`
6. `saas-full-stack-python`
7. `python-testing-mastery`
8. `python-cloud-native`

Motivo: elas conectam conteudo existente com necessidades claras de usuario, aumentam percepcao de valor do plano pago e criam pontes naturais para ferramentas premium como diagnostico, desafios, code review, simulador de entrevista e portfolio.
---

## 14. STATUS DE IMPLEMENTACAO (atualizado jun/2026)

> Esta secao reflete o que JA foi entregue na plataforma versus o que segue como roadmap. Use-a como fonte de verdade do estado atual do produto.

### 14.1 Ja implementado e em producao (www.pytrack.com.br)

**Aprendizado e conteudo**
- 82 modulos de conteudo, +2.400 exercicios, +1.300 projetos.
- 17 trilhas (incluindo a nova "Construir um LLM do zero").
- Trilha gratuita ampliada (21 topicos, 6 modulos).
- IDE Python no navegador (Pyodide) com 32 temas (Dracula, Tokyo Night, Nord, etc) e ~45 snippets prontos.
- IDE conectada aos exercicios (botao "Abrir na IDE") e correcao por IA.
- Pagina de detalhe de cada projeto com passo a passo, features e learnings.
- Simulador de entrevista (flashcards por tecnologia e nivel) em /perguntas-carreira-python (1.719 perguntas).

**IA**
- Assistente "Py" no site (chat com IA, escalonamento para suporte humano, deteccao de login).
- Correcao de exercicios por IA + consultor de carreira + analise de projetos (nota + requisitos).
- BYOK: usuario pode usar a propria chave de IA. Provider padrao: Nvidia NIM (fallback OpenRouter).

**Crescimento e monetizacao**
- Planos Essencial/Completo/Suprema (mensal e anual) + Vitalico + 7 dias gratis + reembolso 7 dias.
- Pagina de precos com toggle animado mensal/anual, confetti e NumberFlow.
- Indicacoes (referrals), SEO + sitemap + Open Graph dinamico, blog, novidades/changelog publico.
- Captura de origem do cadastro ("Como nos encontrou") com analytics no admin.

**Comunidade e social**
- Feed, ranking, perfis avancados estilo LinkedIn (capa, headline, skills), conexoes e seguir.
- Moderacao (denuncias, bloqueio) no admin.

**Conta, seguranca e integracoes**
- 2FA (TOTP) com auto-submit, login com GitHub, confirmacao de e-mail obrigatoria.
- Forca de senha (zxcvbn) + confirmar senha no cadastro.
- Integracao GitHub: criar repositorios dos exercicios e projetos direto da plataforma.
- LGPD: exportar e excluir conta. Rate limiting, RLS, CSP e headers de seguranca.
- PWA instalavel (site e dashboard).

**Apps e canais**
- Rota /aplicativo (download Android/Desktop por plano), prompts de build mobile/desktop.
- E-mail transacional (Gmail SMTP) em suporte, contato e respostas do admin.

**Admin (painel completo)**
- Menu Admin colapsavel com subrotas.
- Clientes & receita (MRR/ARR, avatar, origem dos cadastros, gerenciar/excluir).
- Configuracao do site (idioma, anuncio, manutencao, cadastros on/off).
- Taxas e custos (Stripe real + Supabase/Vercel/IA).
- Banco de dados (tabelas, linhas, storage, RLS, backups).
- Chat ao vivo, mensagens de suporte, moderacao.

**Observabilidade e DevOps**
- CI (lint + typecheck + build), Dependabot, npm audit.
- Logger + error boundary + endpoint de log; status page publico.
- Documentacao: BACKUP.md, SECURITY.md (OWASP), MONITORING.md, load-test (k6).

### 14.2 Roadmap priorizado (proximas entregas de alto valor)

Ordenado por impacto em aquisicao/retencao/percepcao de valor:

1. **/desafios semanais com ranking** — gamificacao competitiva (retencao + viralizacao). Tabela `challenges` + `challenge_submissions`, leaderboard semanal, badge.
2. **/code-review por IA** — cole um repo/arquivo e receba revisao senior (premium Completo+). Reaproveita `lib/ai`.
3. **Certificados de conclusao verificaveis** — emissao por trilha concluida, pagina publica `/certificado/[id]` (prova social forte para LinkedIn).
4. **/plano-de-estudo personalizado** — IA monta cronograma a partir do objetivo e tempo/dia; integra com onboarding e XP.
5. **/diagnostico de nivel** — quiz adaptativo que recomenda a trilha ideal (melhora ativacao no primeiro acesso).
6. **5.000+ exercicios** — gerar em lotes por area (script `scripts/generate-exercises.mjs`), cobrindo todo o ecossistema, sem duplicatas.
7. **Ampliar respostas das 1.719 perguntas** — enriquecer cada resposta com IA em lote (conceito, exemplo, pegadinha, codigo).
8. **Notificacoes automaticas** — disparar `notifications` em eventos (resposta de suporte, level up, nova conquista, conexao aceita).
9. **Mentorias ao vivo / office hours** — agenda + sala (premium Suprema), diferencial competitivo.
10. **Trilhas do briefing (secao 3)** — priorizar entrevistas/carreira, backend alta performance, automacao/RPA, data apps, agentes de IA.

### 14.3 Notas de qualidade (garantir produto de alta qualidade)

- Manter `npm run lint && npm run typecheck && npm run build` verdes no CI antes de cada deploy.
- Toda nova rota: gating em `lib/billing-access.ts` + `PROTECTED_PREFIX` no middleware + item em `lib/navigation.ts`.
- Toda tabela nova: RLS habilitado e politicas por usuario; escrita sensivel via service role no servidor.
- Toda feature de IA: fallback gracioso quando a IA falha + opcao BYOK.
- Acessibilidade: foco visivel, contraste, labels; responsivo mobile-first (chat ja ocupa tela cheia no mobile).
