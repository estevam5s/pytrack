<div align="center">

<img src="public/new-logo.png" alt="PyTrack" width="130" />

# PyTrack — Plataforma de Aprendizado Python

**Aprenda, pratique e domine todo o ecossistema Python — do básico à carreira profissional — em um único dashboard inteligente, com comunidade, IDE no navegador e correção por IA.**

PyTrack é uma plataforma educacional completa: site institucional público + dashboard privado com **trilhas de aprendizado por planos**, conteúdos, exercícios com IA, **IDE Python (WebAssembly)**, projetos, livros, cursos, vagas, **comunidade social** e consultor de carreira — tudo com XP, níveis, billing recorrente, plano vitalício e acompanhamento de evolução.

🔗 **Produção:** [www.pytrack.com.br](https://www.pytrack.com.br)

> 🤝 **Vai continuar o projeto (você ou outro agente/dev)?** Leia
> [`docs/AGENT-HANDOFF.md`](docs/AGENT-HANDOFF.md) e a pasta [`docs/agent-memory/`](docs/agent-memory/)
> e rode `bash scripts/agent-onboard.sh` (valida o ambiente, varre segredos e imprime o
> prompt de onboarding). Antes de operar, **rotacione as credenciais**:
> [`docs/ROTACAO-CREDENCIAIS.md`](docs/ROTACAO-CREDENCIAIS.md).

<br/>

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Pyodide](https://img.shields.io/badge/Pyodide_(WASM)-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 📑 Sumário

1. [O que é o PyTrack](#-o-que-é-o-pytrack)
2. [É um SaaS ou Micro-SaaS?](#-é-um-saas-ou-micro-saas)
3. [Visão geral em números](#-visão-geral-em-números)
4. [Planos e preços](#-planos-e-preços)
5. [Funcionalidades — Site público](#-funcionalidades--site-público)
6. [Funcionalidades — Dashboard](#-funcionalidades--dashboard)
7. [Sistema de billing (Stripe)](#-sistema-de-billing-stripe)
8. [Trilhas de aprendizado e tiers de conteúdo](#-trilhas-de-aprendizado-e-tiers-de-conteúdo)
9. [IDE Python no navegador](#-ide-python-no-navegador)
10. [Inteligência Artificial (OpenRouter)](#-inteligência-artificial-openrouter)
11. [Comunidade](#-comunidade)
12. [Administração](#-administração)
13. [Arquitetura](#-arquitetura)
14. [Stack tecnológica](#-stack-tecnológica)
15. [Estrutura de pastas](#-estrutura-de-pastas)
16. [Modelo de dados](#-modelo-de-dados)
17. [Rotas da aplicação](#-rotas-da-aplicação)
18. [Pipeline de conteúdo](#-pipeline-de-conteúdo)
19. [SEO e crescimento](#-seo-e-crescimento)
20. [Segurança](#-segurança)
21. [Variáveis de ambiente](#-variáveis-de-ambiente)
22. [Como rodar localmente](#-como-rodar-localmente)
23. [Deploy](#-deploy)
24. [Scripts utilitários](#-scripts-utilitários)
25. [Roadmap](#-roadmap)
26. [FAQ](#-faq)
27. [Licença](#-licença)

---

## 🎯 O que é o PyTrack

O **PyTrack** é uma plataforma de educação em Python construída como um produto SaaS real, pronto para receber alunos pagantes. Ele resolve um problema concreto: **aprender o ecossistema Python de forma guiada, prática e com acompanhamento**, em vez de cursos soltos e tutoriais desconexos.

A plataforma combina, em um só lugar:

- **Conteúdo estruturado** — 80+ módulos e centenas de lições do básico ao avançado, organizados em **16 trilhas** por objetivo de carreira.
- **Prática real** — milhares de exercícios com correção por IA e uma **IDE Python que roda no navegador** (sem instalar nada).
- **Portfólio** — mais de 1.300 projetos práticos, dos primeiros scripts a sistemas distribuídos.
- **Carreira** — roadmap, consultor de carreira com IA, vagas e banco de perguntas de entrevista.
- **Comunidade** — rede social interna com posts, ranking, conexões e tempo real.
- **Gamificação** — XP, níveis e acompanhamento visual de evolução.
- **Monetização** — assinaturas recorrentes (mensal/anual), plano vitalício, trial gratuito, indicações e garantia de reembolso, tudo via Stripe.

O objetivo do produto é claro: **transformar iniciantes em desenvolvedores Python empregáveis**, com um caminho do zero à contratação.

---

## 🧩 É um SaaS ou Micro-SaaS?

Pergunta importante — e a resposta orienta toda a estratégia do produto.

### Definições rápidas

| Conceito | Característica |
|----------|---------------|
| **SaaS** | Software como serviço, entregue via web, com receita recorrente (assinatura). Geralmente equipe maior, múltiplos segmentos, vendas/marketing estruturados. |
| **Micro-SaaS** | Um SaaS de **nicho**, operado por **uma pessoa ou equipe muito pequena**, com escopo focado, baixos custos fixos e forte automação. Receita recorrente, mas mira um público específico. |
| **Vertical SaaS** | SaaS especializado em **um setor** (aqui: educação/EdTech). |

### Veredito: o PyTrack é um **Micro-SaaS vertical (EdTech)**

Tecnicamente é um **SaaS completo** (multiusuário, web, assinatura recorrente, billing automatizado, autoatendimento). Mas pelo **modelo de operação** ele se enquadra melhor como **Micro-SaaS**:

✅ **Nicho bem definido** — quem quer aprender **Python** (não “programação em geral”).
✅ **Operável por um fundador** — toda a infra é gerenciada (Vercel + Supabase + Stripe), com automações de conteúdo, cobrança e e-mails.
✅ **Custos fixos baixos** — sem servidores próprios; escala sob demanda.
✅ **Receita recorrente** — planos mensais/anuais + vitalício.
✅ **Autoatendimento total** — o usuário se cadastra, paga, faz upgrade/downgrade e até **pede reembolso** sozinho.
✅ **Forte automação** — geração de conteúdo por scripts, cron jobs no banco, webhooks de pagamento, IA para correção.

> **Resumo:** é um **Micro-SaaS de EdTech** com arquitetura de SaaS "grande". Pode crescer para um SaaS pleno sem retrabalho de fundação — só adicionando time de conteúdo, marketing e suporte.

### Por que isso importa

- A estratégia de crescimento é **product-led** (freemium + trial + indicações + SEO), não vendas enterprise.
- O ticket é **baixo e volumétrico** (R$10–R$46/mês), então o foco é **conversão e retenção** automatizadas.
- A operação precisa ser **enxuta**: tudo que dá para automatizar, está automatizado.

---

## 📊 Visão geral em números

| Métrica | Valor |
|--------|-------|
| Trilhas de aprendizado | **16** (por objetivo e plano) |
| Módulos de conteúdo | **80+** |
| Lições | **centenas** |
| Exercícios com correção por IA | **2.400+** |
| Projetos para portfólio | **1.300+** |
| Áreas do ecossistema cobertas | **22** |
| Planos pagos | **4** (Essencial, Completo, Suprema, Vitalício) |
| Rotas do dashboard | **20+** |
| Tabelas no banco | **30+** |

---

## 💳 Planos e preços

O PyTrack usa um modelo de **freemium + tiers cumulativos**: cada plano superior inclui **tudo** do anterior e adiciona mais.

| Plano | Preço | Acesso |
|-------|-------|--------|
| **Grátis** | R$ 0 | Trilha de Fundamentos + IDE Python + leitura da comunidade |
| **Essencial** | **R$ 10/mês** (R$ 96/ano) | Todas as trilhas de conteúdo, exercícios com IA, IDE, evolução/XP, materiais, livros, aulas e **comunidade** |
| **Completo** | **R$ 19/mês** (R$ 182/ano) | Tudo do Essencial **+** projetos, especializações, consultor de carreira IA, vagas, perguntas de entrevista e **download do app (Android + Desktop)** |
| **Suprema** | **R$ 46/mês** (R$ 442/ano) | Tudo do Completo **+** a **Trilha Suprema Python Mastery** (120+ módulos) e o projeto final SaaS |
| **Vitalício** | **R$ 697 (pagamento único)** | **Acesso total e permanente a tudo**, para sempre, incluindo atualizações futuras |

### Benefícios transversais

- 🎁 **7 dias grátis** na primeira assinatura (trial).
- 🔁 **Upgrade e downgrade** a qualquer momento (cobrança proporcional / proration).
- 🛡️ **Garantia de 7 dias** — reembolso integral, autoatendimento.
- 👥 **Indique e ganhe** — 1 mês grátis por indicação que assina.
- 💳 Pagamento seguro processado pela **Stripe** (cartão + Pix via Stripe).

### Acesso cumulativo (importante)

O controle de acesso é por **ranking de tier**:

```
free (0) < essencial (1) < completo (2) < suprema (3) < vitalicio (4)
```

Toda verificação usa `tierAtLeast(tierDoUsuário, tierExigido)`. Logo, **comprar um plano maior libera tudo do menor** automaticamente — em rotas, conteúdo, trilhas, app e UI.

---

## 🌐 Funcionalidades — Site público

O site institucional (`/`) é a vitrine de marketing, otimizada para SEO e conversão.

| Rota | Descrição |
|------|-----------|
| `/` | Landing page com hero, prova social, features, planos e CTA. |
| `/sobre` | História, missão e diferenciais da plataforma. |
| `/trilhas` | As **16 trilhas** agrupadas por plano (sincronizadas com o dashboard). |
| `/recursos` | Conteúdos, exercícios, IDE, comunidade — visão geral. |
| `/projetos` | **Os melhores projetos** de alto nível (SaaS, IA/RAG, microsserviços…). |
| `/carreira` | Roadmap de carreira em Python e áreas de atuação. |
| `/precos` | Planos, **comparativo completo**, plano vitalício e **garantia de reembolso**. |
| `/blog` | Artigos SEO (público, indexável) com CTA de conversão. |
| `/blog/[slug]` | Artigo individual renderizado em Markdown. |
| `/aprender` | **Lições públicas** (1º módulo) — conteúdo aberto para SEO. |
| `/aprender/[licao]` | Lição pública individual, indexável. |
| `/auth/login` · `/auth/register` | Telas de autenticação profissionais. |

**Destaques do site:**

- Tema claro/escuro com persistência (sem flash de tema).
- Navegação destacando a rota ativa.
- Menu mobile em tela cheia.
- Rodapé rico com links e animações.
- Logo e favicon próprios (`/new-logo.png`).
- Metadata, Open Graph (imagem gerada dinamicamente), Twitter cards e JSON-LD.

---

## 🧭 Funcionalidades — Dashboard

O dashboard privado (`/inicio`, `/minhas-trilhas`, etc.) é o coração do produto. Acesso por **plano**, com cadeados visuais no menu para rotas acima do tier do usuário.

### Grupo "Estudar"

| Rota | O que faz |
|------|-----------|
| `/inicio` | Hub do aluno: progresso, próximos passos, atalhos, pomodoro, dicas de carreira. |
| `/minhas-trilhas` | **Trilhas de aprendizado** — escolha por objetivo, com progresso, cadeados por plano e detalhe por trilha. |
| `/minhas-trilhas/[id]` | Detalhe da trilha: currículo (tópicos), módulos agrupados por área e progresso. |
| `/comunidade` | Rede social interna (Essencial+). |
| `/evolucao` | Gráficos de evolução, XP, horas e progresso por área. |
| `/stack` | Stack do ecossistema Python com logos reais e docs. |
| `/exercicios` | Exercícios práticos com **correção por IA** e melhor solução. |
| `/ide` | **IDE Python no navegador** (Pyodide/WASM). |
| `/conteudos/[modulo]` | Leitor de módulo (mantido; acessível via trilhas). |
| `/conteudos/[modulo]/[licao]` | Leitor de lição em Markdown, com TOC e "marcar como concluída". |

### Grupo "Recursos"

| Rota | O que faz |
|------|-----------|
| `/aulas-udemy` | Cursos Udemy: detalhe, gráficos de evolução, stack e **análise por IA**. |
| `/aulas-youtube` | Playlists/cursos YouTube com o mesmo nível de detalhe e IA. |
| `/material` | CRUD completo de materiais + upload (SQL via REST). |
| `/livros` | Biblioteca: upload de capa e PDF, editar, excluir, baixar. |
| `/aplicativo` | **Apps Android e Desktop** (download liberado para Completo+). |

### Grupo "Carreira"

| Rota | O que faz |
|------|-----------|
| `/minha-carreira` | Roadmap pessoal de carreira. |
| `/especializacoes` | Trilhas/áreas avançadas. |
| `/consultor-ia` | Consultor de carreira com IA. |
| `/vagas` | Vagas de Python. |
| `/perguntas-carreira-python` | Banco de perguntas de entrevista. |

### Grupo "Conta"

| Rota | O que faz |
|------|-----------|
| `/perfil` | Perfil público do usuário. |
| `/configuracoes/conta` | Dados da conta + badge do plano atual. |
| `/configuracoes/perfil` | Edição de perfil e avatar. |
| `/configuracoes/plano` | Status do plano, **upgrade, downgrade, reembolso** e portal Stripe. |
| `/configuracoes/indicacoes` | Programa "Indique e ganhe". |
| `/configuracoes/aparencia` | Tema e preferências visuais. |
| `/configuracoes/plataforma` | Configurações da plataforma. |
| `/configuracoes/dados` | Dados e privacidade. |
| `/configuracoes/admin` | **Painel admin** (somente administradores). |
| `/configuracoes/sobre` | Sobre/ajuda. |

### Recursos transversais do dashboard

- 🔒 **Cadeados no menu**: rotas acima do plano aparecem com cadeado e levam à tela de upgrade.
- ⬆️ **Banner de upgrade** para usuários no plano gratuito.
- 🔔 **Notificação de "subiu de nível"** no topo.
- ⌨️ **Command menu** (busca rápida por rotas/conteúdo).
- ⏱️ **Pomodoro** integrado.
- 🎓 **Onboarding** com tour de boas-vindas no primeiro login.
- 📱 Totalmente responsivo (sidebar desktop + drawer mobile).

---

## 💰 Sistema de billing (Stripe)

O billing é o núcleo do Micro-SaaS. Tudo é automatizado e autoatendido.

### Componentes

| Componente | Arquivo / recurso |
|------------|-------------------|
| Configuração Stripe | `lib/stripe/server.ts` |
| Regras de acesso (puro) | `lib/billing-access.ts` |
| Helpers de assinatura | `lib/stripe/subscriptions.ts` |
| Checkout | `app/api/stripe/create-checkout-session/route.ts` |
| Portal do cliente | `app/api/stripe/create-portal-session/route.ts` |
| Webhook | `app/api/stripe/webhook/route.ts` |
| Reembolso | `app/(dashboard)/configuracoes/plano/actions.ts` |
| Indicações | `supabase/referrals-schema.sql` |

### Fluxos suportados

1. **Assinatura recorrente** (mensal/anual) — Stripe Checkout em modo `subscription`.
2. **Trial de 7 dias** — `trial_period_days` apenas na primeira assinatura.
3. **Upgrade/Downgrade** — quando já há assinatura ativa, o checkout faz `subscriptions.update` com **proration** (sem novo checkout, sem duplicar assinatura).
4. **Plano vitalício** — Stripe Checkout em modo `payment` (pagamento único); o webhook concede acesso permanente (`metadata.lifetime = true`).
5. **Reembolso (garantia 7 dias)** — autoatendimento: localiza o `payment_intent`, valida a janela de 7 dias, processa `refunds.create`, cancela a assinatura e revoga o acesso.
6. **Indicações** — código por usuário; quando o indicado assina, o indicador ganha crédito (1 mês).
7. **Portal do cliente** — gerenciar cartão, recibos e cancelamento pelo portal seguro da Stripe.

### Webhook

Endpoint: `https://www.pytrack.com.br/api/stripe/webhook` (runtime Node, raw body, verificação de assinatura, **deduplicação** via `payment_events`).

Eventos tratados:

- `checkout.session.completed` (assinatura **e** pagamento único/vitalício)
- `customer.subscription.created` / `updated` / `deleted`
- `invoice.payment_succeeded` / `payment_failed`
- `customer.updated`

### Mapa de planos → preços (Stripe)

| Plano | Tipo | Variável de ambiente |
|-------|------|----------------------|
| Essencial mensal | recorrente | `STRIPE_PRICE_ID` |
| Essencial anual | recorrente | `STRIPE_PRICE_ID_ANNUAL` |
| Completo mensal | recorrente | `STRIPE_PRICE_ID_COMPLETO` |
| Completo anual | recorrente | `STRIPE_PRICE_ID_COMPLETO_ANNUAL` |
| Suprema mensal | recorrente | `STRIPE_PRICE_ID_SUPREMA` |
| Suprema anual | recorrente | `STRIPE_PRICE_ID_SUPREMA_ANNUAL` |
| Vitalício | pagamento único | `STRIPE_PRICE_ID_VITALICIO` |

### Modelo de acesso

```ts
// lib/billing-access.ts (resumo)
export type Tier = "free" | "essencial" | "completo" | "suprema" | "vitalicio";

export function hasDashboardAccess(sub): boolean {
  // active/trialing OU current_period_end > agora; bloqueia unpaid/incomplete_expired
}

export function tierOf(sub): Tier {
  if (sub?.metadata?.lifetime) return "vitalicio";
  if (sub?.metadata?.comp)     return "suprema";   // cortesia/admin
  return TIER_BY_PRICE[sub?.stripe_price_id] ?? "essencial";
}

export function tierAtLeast(userTier, required): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[required];
}
```

O **gating é feito no middleware** (`lib/supabase/middleware.ts`), por rota, lendo a assinatura via RLS. Rotas gratuitas, rotas Essencial e rotas Completo são distinguidas por `isFreeDashboardPath`, `requiresCompleto` e `requiredTierForPath`.

---

## 🛤️ Trilhas de aprendizado e tiers de conteúdo

As **trilhas** são caminhos guiados que agrupam módulos por objetivo de carreira. Fonte única: `lib/trilhas.ts` (usada no dashboard **e** no site).

### Catálogo de trilhas

**Grátis**
- 🌱 **Primeiros Passos** — Fundamentos de Python.

**Essencial (R$10)**
- 💻 **Python Developer** — POO, type hints, async, testing, packaging.
- 🖥️ **Backend Developer** — FastAPI, Django, SQLAlchemy, PostgreSQL, Redis.
- 📊 **Data Analytics** — Pandas, NumPy, Polars, visualização, BI.
- 🤖 **Automação & Produtividade** — Selenium, Playwright, scraping, RPA.
- 🎮 **Apps Desktop & Jogos** — PySide6, Flet, Tkinter, Pygame.

**Completo (R$19)**
- 🗄️ **Engenharia de Dados** — Airflow, Kafka, Spark, Delta Lake.
- 🧠 **Machine Learning & IA** — scikit-learn, PyTorch, LangChain, RAG, agentes.
- ⚙️ **DevOps & Cloud** — Docker, Kubernetes, Terraform, AWS/GCP/Azure.
- 🧱 **Arquitetura de Software** — Clean Architecture, DDD, CQRS, SOLID.
- 🔌 **IoT & Embarcados** — Raspberry Pi, MicroPython, ESP32, MQTT.
- 🛡️ **Cyber Security** — pentest, análise de rede, ethical hacking.
- ⛓️ **Blockchain** — Web3.py, smart contracts, DeFi, NFTs.
- 🧬 **Bioinformática** — Biopython, genômica, ML para biologia.
- 📈 **Quant & Finanças** — backtesting, trading bots, portfolio.

**Suprema (R$46)**
- 👑 **Python Mastery (Trilha Suprema)** — todos os módulos + projeto final SaaS completo (FastAPI, Postgres, Redis, Docker, K8s, CI/CD, RAG, agentes IA, deploy AWS).

### Tier de cada módulo

A função `moduleTier(area, slug)` define o nível mínimo para acessar um módulo:

- **Grátis** — apenas o módulo de Fundamentos (`parte-1-basico`).
- **Completo** — áreas avançadas (`Machine Learning`, `Engenharia de Dados`, `IoT`, `Arquitetura`, `Especializações`, `Segurança`).
- **Essencial** — todo o restante.

No `/conteudos/[modulo]`, módulos acima do plano do usuário exibem uma **tela de upgrade com cadeado** em vez do conteúdo.

---

## 🐍 IDE Python no navegador

A rota `/ide` roda **Python real no navegador** via **Pyodide (WebAssembly)** — sem backend, sem instalação.

- Editor com **CodeMirror** (`@uiw/react-codemirror`), realce de sintaxe e atalhos.
- Execução de código Python no cliente (stdout/stderr capturados).
- Disponível **gratuitamente** (gancho de aquisição do freemium).
- Ideal para praticar enquanto se estuda uma lição.

---

## 🤖 Inteligência Artificial (OpenRouter)

A IA é usada para **correção de exercícios** e **análise de conteúdo**.

- Integração via **OpenRouter** (`lib/ai/openrouter.ts`, `lib/ai/actions.ts`).
- `chatJson(...)` — chamada tipada que retorna JSON estruturado.
- Casos de uso:
  - Correção de exercícios + melhor solução comentada.
  - Análise de cursos (Udemy/YouTube) individualmente e da rota como um todo.
  - Consultor de carreira: avalia prontidão e sugere próximos passos.

> A chave fica **somente no servidor** (`OPENROUTER_API_KEY`) — nunca exposta ao cliente.

---

## 👥 Comunidade

Rede social interna em `/comunidade` (disponível a partir do **Essencial**).

- 10+ tabelas `community_*` com **RLS**, triggers e **realtime**.
- Posts, curtidas, comentários, conexões e ranking.
- Perfis de comunidade com **código de indicação** embutido.
- Código em `lib/community/*` e `components/community/*`.

---

## 🛠️ Administração

Administradores têm **acesso vitalício** e um painel para criar usuários.

- Lista de admins: `lib/admin.ts` (`ADMIN_EMAILS` + `isAdmin(email)`).
- Admin = assinatura `metadata.comp` (acesso máximo, sem cobrança).
- **Painel `/configuracoes/admin`** (somente admins; link no menu de configurações só aparece para eles):
  - Criar **usuários com plano Suprema vitalício** (conta já confirmada).
  - Listar usuários vitalícios.
- Implementação: `app/(dashboard)/configuracoes/admin/` (page + server action) usando `admin.auth.admin.createUser` (service role) + upsert de assinatura cortesia.

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────────────┐
│                         Navegador                            │
│  Next.js App Router (RSC) · React 19 · Tailwind · Framer     │
│  Pyodide (WASM) · CodeMirror · Zustand · Recharts            │
└───────────────┬──────────────────────────────┬──────────────┘
                │ Server Actions / Route Handlers │
                ▼                                ▼
        ┌───────────────┐               ┌─────────────────┐
        │   Supabase     │               │     Stripe      │
        │  Postgres+RLS  │◀── webhook ───│  Billing/Checkout│
        │  Auth/Storage  │               │  Portal/Refunds  │
        │  Realtime/cron │               └─────────────────┘
        └───────┬───────┘
                │ Management API (DDL)
                ▼
        ┌───────────────┐               ┌─────────────────┐
        │  OpenRouter    │               │     Vercel      │
        │  (IA / LLMs)   │               │  Edge/Hosting   │
        └───────────────┘               └─────────────────┘
```

### Princípios

- **Server-first**: a maior parte renderiza no servidor (RSC); o cliente só onde há interatividade.
- **RLS por padrão**: o banco protege os dados; o `service_role` é usado só no servidor (webhook, admin, jobs).
- **Gating no middleware**: acesso por plano resolvido na borda, antes de renderizar.
- **Fonte única de verdade**: tiers em `billing-access.ts`, trilhas em `trilhas.ts`, conteúdo no manifest gerado.
- **Fail-safe**: se o billing não estiver configurado, o acesso é liberado (não derruba o produto).

---

## 🧱 Stack tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | **Next.js 15** (App Router, RSC, Server Actions) |
| UI | **React 19**, **Tailwind CSS**, Radix UI, **Framer Motion**, lucide-react |
| Linguagem | **TypeScript** (strict) |
| Estado | **Zustand** (+ persist) |
| Gráficos | **Recharts** |
| Banco/Auth/Storage | **Supabase** (Postgres, RLS, Auth, Storage, Realtime, pg_cron) |
| Pagamentos | **Stripe** (Checkout, Portal, Webhooks, Refunds) |
| IA | **OpenRouter** (LLMs) |
| Python no browser | **Pyodide** (WebAssembly) |
| Editor de código | **CodeMirror** (`@uiw/react-codemirror`) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| Deploy | **Vercel** |

---

## 📁 Estrutura de pastas

```
.
├── app/
│   ├── (site)/                 # site público (landing, trilhas, projetos, blog, aprender…)
│   ├── (dashboard)/            # dashboard privado (inicio, trilhas, conteudos, comunidade…)
│   │   └── configuracoes/      # conta, plano, indicações, admin…
│   ├── assinar/                # página de planos (checkout)
│   ├── auth/                   # login, register, actions
│   ├── api/stripe/             # checkout, portal, webhook
│   ├── layout.tsx              # metadata, JSON-LD, tema
│   ├── sitemap.ts · robots.ts  # SEO
│   ├── opengraph-image.tsx     # OG image gerada
│   └── icon.png · apple-icon.png  # favicon (novo logo)
├── components/
│   ├── site/                   # navbar, footer, hero, cards do site
│   ├── layout/                 # sidebar, header, shell, mobile
│   ├── dashboard/              # views do dashboard (trilhas, conteúdos…)
│   ├── billing/                # PlanSelector, SubscribeButton, RefundButton…
│   ├── community/              # feed, posts, perfis
│   ├── admin/                  # formulário de criação de usuários
│   └── ui/                     # primitives (button, card, input, badge…)
├── lib/
│   ├── billing-access.ts       # tiers, ranking, gating (puro)
│   ├── trilhas.ts              # catálogo de trilhas
│   ├── stripe/                 # server, subscriptions
│   ├── content/                # manifest + registry de conteúdo
│   ├── community/              # lógica da comunidade
│   ├── ai/                     # OpenRouter
│   ├── data/                   # queries e actions
│   ├── supabase/               # client, server, admin, middleware
│   └── admin.ts                # allowlist de administradores
├── supabase/                   # schemas SQL (subscriptions, community, referrals…)
├── scripts/                    # geradores de conteúdo, exercícios, projetos
├── doc/Conteudos/              # lições em Markdown (fonte do conteúdo)
├── cron/                       # jobs pg_cron
└── public/                     # logo, imagens, arquivo de verificação do Google
```

---

## 🗃️ Modelo de dados

Principais tabelas (Postgres/Supabase, todas com **RLS**):

| Tabela | Função |
|--------|--------|
| `users_profile` | Perfil do usuário (nome, avatar, XP, nível). |
| `contents` | Módulos de conteúdo (slug, área, nível, horas, nº de lições). |
| `progress` | Progresso por conteúdo (percentual, status). |
| `stripe_customers` | Vínculo usuário ↔ Stripe customer. |
| `subscriptions` | Assinatura por usuário (status, price, período, `metadata` comp/lifetime). |
| `payment_events` | Deduplicação de eventos de webhook. |
| `referrals` | Indicações (indicador, indicado, status, recompensa). |
| `community_profiles` | Perfil social + `referral_code`. |
| `community_posts`, `community_likes`, `community_comments`, … | Rede social (10+ tabelas). |
| `books`, `materials`, `courses`, `jobs`, `questions` | Recursos (livros, materiais, cursos, vagas, perguntas). |

> DDL aplicado via **Supabase Management API** (token PAT) — ver `supabase/*.sql`.

---

## 🗺️ Rotas da aplicação

### Públicas (site)
`/` · `/sobre` · `/trilhas` · `/recursos` · `/projetos` · `/carreira` · `/precos` · `/blog` · `/blog/[slug]` · `/aprender` · `/aprender/[licao]` · `/auth/login` · `/auth/register`

### SEO/infra
`/sitemap.xml` · `/robots.txt` · `/opengraph-image` · `/twitter-image` · arquivo de verificação do Google Search Console

### Privadas (dashboard) — gated por plano
`/inicio` · `/minhas-trilhas` · `/minhas-trilhas/[id]` · `/comunidade` · `/evolucao` · `/stack` · `/exercicios` · `/ide` · `/conteudos/[modulo]` · `/conteudos/[modulo]/[licao]` · `/aulas-udemy` · `/aulas-youtube` · `/material` · `/livros` · `/aplicativo` · `/minha-carreira` · `/especializacoes` · `/consultor-ia` · `/vagas` · `/perguntas-carreira-python` · `/perfil` · `/configuracoes/*`

### Billing
`/assinar` · `/api/stripe/create-checkout-session` · `/api/stripe/create-portal-session` · `/api/stripe/webhook`

---

## 🏭 Pipeline de conteúdo

O conteúdo é **gerado** a partir de dados estruturados e materializado em Markdown + manifest + SQL.

### Fontes

- `doc/Conteudos/**/*.md` — lições em Markdown.
- `lib/content/manifest.ts` — módulos base (gerado).
- `lib/content/extra-manifest.ts` — módulos do ecossistema (gerado).
- `lib/content/registry.ts` — junta tudo, lê o corpo das lições, extrai TOC.

### Geradores (`scripts/`)

| Script | O que gera |
|--------|-----------|
| `generate-content.mjs` | Manifest base a partir de `doc/Conteudos`. |
| `gen-ecosystem-content.mjs` | Módulos do ecossistema (`ext-*`) + `extra-manifest.ts` + `contents_extra.sql`. |
| `generate-exercises.mjs` / `expand-exercises.mjs` | Exercícios. |
| `generate-projects.mjs` / `generate-projects-mega.mjs` | Projetos. |
| `generate-questions.mjs` / `-v2` | Perguntas de carreira. |

### Como adicionar conteúdo novo

1. Edite o array de módulos em `scripts/gen-ecosystem-content.mjs` (título, área, nível, lições com pontos-chave, código, boas práticas, doc).
2. Rode: `node scripts/gen-ecosystem-content.mjs`.
3. Aplique `supabase/contents_extra.sql` no banco (Management API).
4. Os módulos entram **automaticamente** nas trilhas pela área.

---

## 🚀 SEO e crescimento

Estratégia **product-led** para um Micro-SaaS de ticket baixo.

- **SEO técnico**: `sitemap.xml`, `robots.txt`, metadata por rota, Open Graph (imagem gerada), Twitter cards, **JSON-LD** (Organization + WebSite), Google Search Console verificado.
- **Conteúdo público indexável**: `/blog` (artigos) + `/aprender` (lições do 1º módulo).
- **Freemium**: trilha de Fundamentos + IDE liberados sem pagar → topo de funil.
- **Trial de 7 dias**: experimentar antes de pagar.
- **Indicações**: crescimento viral (1 mês grátis por indicação).
- **Garantia de reembolso**: remove o risco da compra → aumenta conversão.
- **Planos anuais e vitalício**: aumentam LTV e caixa.

---

## 🔒 Segurança

- **RLS** em todas as tabelas; usuário só acessa os próprios dados.
- `service_role` usado **somente no servidor** (webhook, admin, jobs).
- Chaves sensíveis (`STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE`, `OPENROUTER_API_KEY`) **nunca** vão ao cliente.
- Webhook Stripe com **verificação de assinatura** e **deduplicação**.
- Senhas via Supabase Auth; e-mails de admin em allowlist.
- Middleware redireciona não autenticados e bloqueia rotas por plano.
- Reembolso valida janela de 7 dias antes de processar.

> ⚠️ **Nota de segurança operacional:** chaves live que forem expostas (ex.: coladas em chat) devem ser **rotacionadas** imediatamente no painel da Stripe/Supabase.

---

## ⚙️ Variáveis de ambiente

| Variável | Uso | Lado |
|----------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | cliente |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (RLS) | cliente |
| `SUPABASE_SERVICE_ROLE` / `SUPABASE_SERVICE_ROLE_KEY` | Admin (ignora RLS) | **servidor** |
| `NEXT_PUBLIC_APP_URL` | URL canônica (`https://www.pytrack.com.br`) | ambos |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Chave pública Stripe | cliente |
| `STRIPE_SECRET_KEY` | Chave secreta Stripe | **servidor** |
| `STRIPE_WEBHOOK_SECRET` | Assinatura do webhook | **servidor** |
| `STRIPE_PRICE_ID` | Essencial mensal | servidor |
| `STRIPE_PRICE_ID_ANNUAL` | Essencial anual | servidor |
| `STRIPE_PRICE_ID_COMPLETO(_ANNUAL)` | Completo | servidor |
| `STRIPE_PRICE_ID_SUPREMA(_ANNUAL)` | Suprema | servidor |
| `STRIPE_PRICE_ID_VITALICIO` | Vitalício (one-time) | servidor |
| `STRIPE_TRIAL_DAYS` | Dias de trial (7) | servidor |
| `STRIPE_REFERRAL_COUPON` | Cupom de indicação | servidor |
| `OPENROUTER_API_KEY` | IA (correção/análise) | **servidor** |

---

## 💻 Como rodar localmente

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env.local   # e preencha os valores

# 3. Rode em desenvolvimento
npm run dev                  # http://localhost:3000

# 4. Build de produção
npm run build && npm start
```

> Dica: ao buildar localmente, se aparecer "Cannot find module for page", limpe o cache: `rm -rf .next && npm run build`.

---

## ☁️ Deploy

- **Hospedagem:** Vercel (`vercel --prod`).
- **Domínio:** `www.pytrack.com.br` (apex redireciona para www).
- **Banco/Auth/Storage:** Supabase (gerenciado).
- **Variáveis:** configuradas via `vercel env add` (production/preview/development).
- **Webhook Stripe:** aponta para `https://www.pytrack.com.br/api/stripe/webhook`.

Checklist de go-live de domínio:
1. Adicionar domínio na Vercel + configurar DNS (registro A / nameservers).
2. Atualizar `NEXT_PUBLIC_APP_URL`.
3. Apontar o webhook da Stripe para o domínio.
4. Redeploy.

---

## 🧰 Scripts utilitários

```bash
node scripts/generate-content.mjs        # manifest base de conteúdo
node scripts/gen-ecosystem-content.mjs   # módulos do ecossistema + SQL
node scripts/generate-exercises.mjs      # exercícios
node scripts/generate-projects-mega.mjs  # projetos
node scripts/generate-questions-v2.mjs   # perguntas de carreira
```

---

## 🧭 Roadmap

- [ ] Apps nativos **Android** e **Desktop** (Win/Mac/Linux) — download já gated para Completo+.
- [ ] Mais módulos de conteúdo (IA avançada, Cloud, Web full-stack a fundo).
- [ ] Certificados de conclusão de trilha.
- [ ] Integração de e-mail transacional (boas-vindas, lembretes, recuperação).
- [ ] Painel de métricas (MRR, churn, conversão) para o fundador.
- [ ] Relocação opcional das URLs de leitura sob `/minhas-trilhas`.

---

## ❓ FAQ

**O PyTrack é gratuito?**
Sim, há um plano grátis (Fundamentos + IDE). Os demais recursos são pagos, com 7 dias de trial.

**Posso cancelar quando quiser?**
Sim, pelo portal da Stripe em Configurações → Plano. E há garantia de reembolso de 7 dias.

**Como funciona o upgrade/downgrade?**
A mudança é imediata e a diferença é cobrada/creditada proporcionalmente (proration).

**O que é o plano Vitalício?**
Um pagamento único (R$697) que dá acesso permanente a tudo, incluindo atualizações futuras.

**Preciso instalar Python?**
Não. A IDE roda Python no navegador via WebAssembly.

---

## 📚 Apêndice A — Catálogo detalhado das 16 trilhas

Cada trilha tem um **objetivo**, um **currículo** (tópicos) e um **escopo** divulgado. O conteúdo real é mapeado por área a partir dos módulos existentes.

### 🌱 Trilha Gratuita

#### Primeiros Passos · `free`
- **Objetivo:** estou começando agora em Python.
- **Escopo:** 2 módulos · 25 aulas · ~20h.
- **Currículo:** Introdução ao Python 3.14+, instalação e ambiente, VS Code + Cursor + Windsurf, sintaxe fundamental, variáveis e tipos, condicionais, loops, funções, módulos, PEP8, Git e GitHub.

### 🔵 Trilhas Essencial (R$10/mês)

#### Python Developer · `essencial`
- **Objetivo:** dominar Python de verdade.
- **Escopo:** 15 módulos · 120 aulas · ~180h.
- **Currículo:** POO, Dataclasses, Type Hints, Generics, Protocols, Design Patterns, AsyncIO, Context Managers, Decorators avançados, Metaclasses, Testing com Pytest, Packaging, Publicação no PyPI.

#### Backend Developer · `essencial`
- **Objetivo:** criar APIs e back-ends profissionais.
- **Escopo:** 20 módulos · 160 aulas · ~250h.
- **Currículo:** FastAPI, Django, Django Ninja, SQLAlchemy, Alembic, PostgreSQL, Redis, JWT, OAuth2, WebSockets, RabbitMQ, Celery, Microservices, API Gateway, Event Driven Architecture.

#### Data Analytics · `essencial`
- **Objetivo:** analisar e visualizar dados.
- **Escopo:** 10 módulos · 80 aulas · ~120h.
- **Currículo:** Pandas, NumPy, Polars, Matplotlib, Plotly, Seaborn, DuckDB, Excel Automation, Dashboarding, BI com Python.

#### Automação & Produtividade · `essencial`
- **Objetivo:** automatizar tarefas e processos.
- **Escopo:** 12 módulos · 90 aulas · ~130h.
- **Currículo:** Selenium, Playwright, PyAutoGUI, OCR, PDF Processing, Scraping, APIs, Bots, RPA, Automação Empresarial.

#### Apps Desktop & Jogos · `essencial`
- **Objetivo:** criar aplicativos desktop e jogos.
- **Escopo:** 8 módulos · 60 aulas · ~90h.
- **Currículo:** PySide6, Qt Designer, Flet, Tkinter Moderno, Tauri + Python, Desktop Packaging, Pygame.

### 🟣 Trilhas Completo (R$19/mês)

#### Engenharia de Dados · `completo`
- **Objetivo:** construir pipelines de dados em escala.
- **Escopo:** 15 módulos · 130 aulas · ~200h.
- **Currículo:** Apache Airflow, Kafka, Spark, PySpark, Delta Lake, Data Warehouse, ETL, ELT, Data Lake, Lakehouse.

#### Machine Learning & IA · `completo`
- **Objetivo:** trabalhar com IA e machine learning.
- **Escopo:** 18 módulos · 150 aulas · ~220h.
- **Currículo:** Scikit-Learn, TensorFlow, PyTorch, HuggingFace, LangChain, LlamaIndex, RAG, Fine-Tuning, Agentes IA, Multi-Agent Systems.

#### DevOps & Cloud · `completo`
- **Objetivo:** deploy, infraestrutura e nuvem.
- **Escopo:** 12 módulos · 100 aulas · ~150h.
- **Currículo:** Docker, Docker Compose, Kubernetes, Terraform, GitHub Actions, CI/CD, AWS, GCP, Azure, Observabilidade.

#### Arquitetura de Software · `completo`
- **Objetivo:** projetar sistemas robustos e escaláveis.
- **Escopo:** 10 módulos · 90 aulas · ~140h.
- **Currículo:** Clean Architecture, DDD, Hexagonal Architecture, CQRS, Event Sourcing, SOLID, Design Patterns Avançados, Arquiteturas Distribuídas.

#### IoT & Embarcados · `completo`
- **Objetivo:** programar dispositivos e IoT.
- **Escopo:** 8 módulos · 60 aulas · ~90h.
- **Currículo:** Raspberry Pi, MicroPython, ESP32, Sensores, MQTT, Edge Computing.

#### Cyber Security com Python · `completo`
- **Objetivo:** atuar com segurança ofensiva e defensiva.
- **Escopo:** 10 módulos · 85 aulas · ~120h.
- **Currículo:** Pentest Automation, Network Analysis, Packet Inspection, Ethical Hacking, Malware Analysis, Security Tools.

#### Blockchain com Python · `completo`
- **Objetivo:** trabalhar com Web3 e contratos inteligentes.
- **Escopo:** 8 módulos · 70 aulas · ~100h.
- **Currículo:** Web3.py, Ethereum, Solidity Integration, Smart Contracts, DeFi, NFTs.

#### Bioinformática · `completo`
- **Objetivo:** usar Python na biologia.
- **Escopo:** 6 módulos · 50 aulas · ~80h.
- **Currículo:** Biopython, Genômica, DNA Analysis, Machine Learning para Biologia.

#### Quant & Finanças · `completo`
- **Objetivo:** atuar no mercado financeiro.
- **Escopo:** 10 módulos · 90 aulas · ~130h.
- **Currículo:** Quantitative Finance, Backtesting, Trading Bots, Risk Analysis, Portfolio Optimization.

### 👑 Trilha Suprema (R$46/mês)

#### Python Mastery — Trilha Suprema · `suprema`
- **Objetivo:** dominar o ecossistema inteiro.
- **Escopo:** 120+ módulos · 1000+ aulas · ~2000h.
- **Inclui tudo:** Backend, Data Analytics, Engenharia de Dados, Machine Learning, IA Generativa, DevOps, Cloud, Arquitetura, Desktop, IoT, Segurança, Blockchain, Finanças Quant, Bioinformática.
- **Projeto Final:** uma plataforma SaaS completa com FastAPI, PostgreSQL, Redis, Docker, Kubernetes, CI/CD, IA Generativa, RAG, Agentes IA, Observabilidade e deploy na AWS.

---

## 🧪 Apêndice B — As 22 áreas do ecossistema

O conteúdo é classificado por área, e cada trilha agrega áreas:

`Fundamentos` · `Matemática` · `Algoritmos` · `Persistência` · `Banco de Dados` · `Engenharia de Software` · `Performance & Assincronia` · `Automação` · `Finanças` · `Redes` · `Qualidade` · `Backend` · `DevOps` · `IoT` · `Data Science` · `Especializações` · `Segurança` · `Arquitetura` · `Machine Learning` · `Engenharia de Dados` · `Desktop` · `Jogos`

As áreas em **negrito** abaixo exigem o plano **Completo** ou superior:

- **Machine Learning**, **Engenharia de Dados**, **IoT**, **Arquitetura**, **Especializações**, **Segurança**.

Todas as demais áreas (exceto Fundamentos, que é grátis) ficam no **Essencial**.

---

## 🎮 Apêndice C — Gamificação (XP e níveis)

A plataforma mantém o aluno engajado com mecânicas de progresso:

- **XP (pontos de experiência)** — ganhos ao concluir lições, exercícios e projetos.
- **Níveis** — o XP acumulado sobe o nível do aluno no "ecossistema Python".
- **Notificação de level-up** — feedback imediato no topo da tela.
- **Progresso por área e por trilha** — barras de progresso reais calculadas a partir da tabela `progress`.
- **Ranking** — comparação na comunidade.
- **Sequência (streak)** — incentivo a estudar todos os dias (com lembretes no app).

O objetivo é transformar o aprendizado em um hábito recompensador, reduzindo o churn — métrica crítica para um Micro-SaaS.

---

## 🧠 Apêndice D — Sistema de exercícios e projetos

### Exercícios (2.400+)

- Enunciado claro + ambiente de execução.
- O aluno escreve o código e a **IA corrige**: aponta erros, sugere melhorias e mostra **a melhor solução comentada**.
- Cobrem desde lógica básica até estruturas de dados, POO e algoritmos.

### Projetos (1.300+)

- Cada projeto traz **requisitos**, **tecnologias** e um **passo a passo**.
- Vão de CLIs e APIs a **SaaS multi-tenant**, **IA com RAG**, **microsserviços** e **pipelines de dados** — projetos de nível profissional.
- Servem para montar um **portfólio que comprova senioridade**.

---

## 📈 Apêndice E — KPIs do Micro-SaaS

Métricas que o produto foi desenhado para otimizar:

| KPI | Por que importa | Alavanca no produto |
|-----|-----------------|---------------------|
| **MRR** (receita recorrente mensal) | Saúde financeira | Planos mensais/anuais + upgrades |
| **Conversão free → pago** | Eficiência do funil | Freemium + trial + cadeados de upgrade |
| **Churn** | Retenção | Gamificação, trilhas guiadas, comunidade |
| **LTV** | Valor por cliente | Planos anuais + vitalício |
| **CAC** | Custo de aquisição | SEO + blog + indicações (orgânico) |
| **Ativação** | 1º valor percebido | IDE grátis + 1º módulo aberto |
| **Viralidade (K)** | Crescimento orgânico | Programa de indicações |

---

## 🤝 Apêndice F — Guia de contribuição de conteúdo

1. Defina o módulo: título, **área** (define a trilha), nível (`basico`/`intermediario`/`avancado`) e categoria.
2. Escreva as lições no formato do gerador: `[título, intro, [pontos-chave], código, [boas práticas], url-doc]`.
3. Rode o gerador e aplique o SQL no banco.
4. Verifique no dashboard (`/minhas-trilhas`) — o módulo aparece na trilha correspondente à área.
5. Para conteúdo **grátis**, use a área `Fundamentos`; para **Completo**, use uma das áreas avançadas.

---

## 🧾 Apêndice G — Glossário

| Termo | Significado |
|-------|-------------|
| **Tier** | Nível de plano (free, essencial, completo, suprema, vitalicio). |
| **Trilha** | Caminho de aprendizado guiado, agrupando módulos por objetivo. |
| **Módulo** | Unidade de conteúdo com várias lições, pertencente a uma área. |
| **Proration** | Cobrança proporcional ao trocar de plano no meio do ciclo. |
| **Freemium** | Modelo com um nível grátis + níveis pagos. |
| **RLS** | Row Level Security — segurança por linha no Postgres. |
| **RSC** | React Server Components. |
| **Comp** | Assinatura cortesia (admin/vitalício sem cobrança). |
| **Webhook** | Notificação servidor-a-servidor (aqui, da Stripe). |

---

## 🗓️ Apêndice H — Histórico (resumo de evolução)

- **Fundação** — site + dashboard, conteúdo, exercícios, IDE, comunidade, evolução.
- **Billing** — assinatura Stripe, guard de acesso, webhook, portal.
- **Freemium & SEO** — plano grátis, trial, blog, lições públicas, sitemap/robots/OG/JSON-LD, Google Search Console.
- **Tiers** — Essencial, Completo, Suprema; gating por tier; comparativo de planos.
- **Domínio** — `www.pytrack.com.br` em produção; webhook no domínio.
- **Trilhas** — hub único `/minhas-trilhas` consolidando todo o conteúdo.
- **Crescimento** — indicações, plano anual.
- **Conteúdo** — geração de módulos de IA/RAG/Agentes, Web full-stack, AWS/Cloud, POO e SOLID avançados.
- **App** — rota de download de apps Android/Desktop (gated por plano).
- **Admin & UX** — painel admin, usuários vitalícios, cadeados no menu.
- **Vitalício & reembolso** — plano de pagamento único, downgrade e reembolso autoatendido (garantia de 7 dias).

---

## 💳 Apêndice I — Configuração da Stripe (passo a passo)

1. **Crie os produtos e preços** no painel (ou via API):
   - Essencial: mensal (R$10) + anual (R$96).
   - Completo: mensal (R$19) + anual (R$182).
   - Suprema: mensal (R$46) + anual (R$442).
   - Vitalício: preço **one-time** (R$697).
2. **Copie os `price_id`** de cada um para as variáveis `STRIPE_PRICE_ID_*`.
3. **Crie o cupom de indicação** e configure `STRIPE_REFERRAL_COUPON`.
4. **Configure o webhook** apontando para `https://www.pytrack.com.br/api/stripe/webhook` e habilite os eventos:
   - `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.payment_succeeded/failed`, `customer.updated`.
5. **Copie o signing secret** do webhook para `STRIPE_WEBHOOK_SECRET`.
6. **Ative o Customer Portal** (Settings → Billing → Customer portal).
7. Defina `STRIPE_TRIAL_DAYS=7` para o trial.

> Use **chaves de produção** (`pk_live`/`sk_live` ou restricted `rk_live`) apenas em produção. Rotacione qualquer chave exposta.

---

## 🗄️ Apêndice J — Configuração do Supabase

1. Crie um projeto no Supabase e copie a URL + a `anon key` + a `service_role`.
2. Aplique os schemas SQL de `supabase/` (via SQL Editor ou Management API):
   - `stripe-subscriptions-schema.sql`
   - `community-schema.sql` (+ seed)
   - `referrals-schema.sql`
   - `material-schema.sql`
   - `contents_docs.sql` / `contents_extra.sql`
3. Crie os **buckets de Storage** (avatares, capas de livros, materiais).
4. Configure os **cron jobs** (`cron/supabase-cron.sql`) se desejar tarefas agendadas.
5. Garanta que **RLS está ligado** em todas as tabelas e que as políticas existem.
6. Em produção, configure `SUPABASE_SERVICE_ROLE` na Vercel (servidor) — sem ela, webhook e admin falham.

---

## 🧩 Apêndice K — Principais componentes de UI

| Componente | Função |
|------------|--------|
| `components/billing/PlanSelector` | Seletor de planos (Essencial/Completo/Suprema + Vitalício) com toggle mensal/anual. |
| `components/billing/SubscribeButton` | Botão que inicia o checkout/upgrade. |
| `components/billing/RefundButton` | Solicitação de reembolso (garantia 7 dias). |
| `components/billing/UpgradeBanner` | Banner para usuários no plano grátis. |
| `components/billing/SubscriptionStatusCard` | Card com o plano atual. |
| `components/dashboard/trilhas-view` | Grade de trilhas com cadeados por plano. |
| `components/layout/sidebar-item` | Item do menu com cadeado por tier. |
| `components/admin/create-user-form` | Formulário de criação de usuários (admin). |
| `components/community/*` | Feed, posts, perfis da comunidade. |
| `components/ui/*` | Primitives (button, card, input, badge, progress, tooltip…). |

---

## 📏 Apêndice L — Convenções de código

- **TypeScript estrito** — sem `any` desnecessário; tipos compartilhados em `lib/`.
- **Server Components por padrão** — `"use client"` só onde há interatividade.
- **Lógica pura separada** — regras de acesso (`billing-access.ts`) e trilhas (`trilhas.ts`) sem dependências de servidor, para uso no middleware e na UI.
- **Acesso ao banco** — sempre via `lib/supabase/{server,admin}` e `lib/data/*`.
- **Estilização** — Tailwind + tokens de tema (RGB com alpha) para suporte claro/escuro.
- **Conteúdo gerado** — nunca editar `manifest.ts`/`extra-manifest.ts` à mão; usar os scripts.
- **Idioma** — UI e conteúdo em **pt-BR**.

---

## 🆘 Apêndice M — Suporte e atendimento

- **Autoatendimento:** a maior parte das ações é self-service — assinar, trocar de plano (upgrade/downgrade), gerenciar cartão, cancelar e **pedir reembolso** (garantia de 7 dias), tudo em **Configurações → Plano**.
- **Portal Stripe:** recibos, faturas e meios de pagamento.
- **Conta:** dados, privacidade e exclusão em **Configurações → Conta / Dados e privacidade**.
- **Admin:** criação de acessos vitalícios em **Configurações → Admin** (restrito).

---

## 🙏 Apêndice N — Tecnologias e créditos

Construído sobre ombros de gigantes do open source e serviços gerenciados:

- **Next.js / React / Vercel** — framework e hospedagem.
- **Supabase** — Postgres, Auth, Storage, Realtime, pg_cron.
- **Stripe** — pagamentos, assinaturas, portal e reembolsos.
- **Pyodide** — Python no navegador (WebAssembly).
- **CodeMirror** — editor de código.
- **Tailwind CSS / Radix UI / Framer Motion / lucide** — interface.
- **OpenRouter** — acesso a LLMs para IA.
- **Recharts** — gráficos.
- **react-markdown / remark / rehype** — renderização de conteúdo.

---

## 🧷 Apêndice O — Resumo executivo

> **PyTrack** é um **Micro-SaaS vertical de EdTech** que ensina o ecossistema Python do zero à carreira. Tem **freemium + 4 planos pagos (R$10 a R$697 vitalício)**, **16 trilhas**, **80+ módulos**, **2.400+ exercícios com IA**, **1.300+ projetos**, **IDE no navegador**, **comunidade** e **billing 100% automatizado** (trial, upgrade/downgrade, reembolso e indicações). Arquitetura **Next.js 15 + Supabase + Stripe**, operável por um fundador, em produção em **www.pytrack.com.br**.

---

## 📄 Licença

Projeto proprietário — © PyTrack. Todos os direitos reservados.

<div align="center">
<br/>
Feito com 🐍 e ☕ — <a href="https://www.pytrack.com.br">www.pytrack.com.br</a>
</div>
