import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Rocket, Code2, Brain, Users, Briefcase, Smartphone, Puzzle,
  Terminal, Shield, CreditCard, Layers, HelpCircle, ArrowRight,
  Network, Database, Cpu, Webhook, Gauge, Keyboard, Sparkles, GraduationCap,
  CheckCircle2, Lightbulb, Trophy, Zap,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { TechIcon } from "@/components/ui/tech-icon";
import { getPlatformStats, fmtStat } from "@/lib/data/platform-stats";

export const metadata: Metadata = {
  title: "Documentação",
  description:
    "Documentação completa da PyTrack: como usar a plataforma — trilhas, exercícios com IA, IDE Python, projetos, carreira, comunidade, apps, API, planos, segurança e arquitetura.",
};

const SECTIONS = [
  { id: "sobre", label: "Sobre a PyTrack" },
  { id: "inicio-rapido", label: "Início rápido" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "trilhas", label: "Trilhas de aprendizado" },
  { id: "conteudos", label: "Conteúdos e lições" },
  { id: "exercicios", label: "Exercícios com IA" },
  { id: "categorias", label: "Categorias de exercícios" },
  { id: "ide", label: "IDE Python" },
  { id: "atalhos", label: "Atalhos de teclado" },
  { id: "projetos", label: "Projetos" },
  { id: "carreira", label: "Carreira & IA" },
  { id: "comunidade", label: "Comunidade" },
  { id: "apps", label: "Apps & Extensões" },
  { id: "api", label: "API da plataforma" },
  { id: "planos", label: "Planos & comparação" },
  { id: "tecnologia", label: "Tecnologias que você aprende" },
  { id: "stack-plataforma", label: "Stack da plataforma" },
  { id: "arquitetura", label: "Arquitetura" },
  { id: "modelo-dados", label: "Modelo de dados" },
  { id: "ia-byok", label: "IA & BYOK" },
  { id: "api-webhooks", label: "API & Webhooks" },
  { id: "performance", label: "Performance & Cache" },
  { id: "seguranca", label: "Segurança & Privacidade" },
  { id: "glossario", label: "Glossário" },
  { id: "dicas", label: "Dicas de quem rende mais" },
  { id: "faq", label: "Perguntas frequentes" },
];

// tecnologias do ecossistema Python (ícones reais via Devicon/Simple Icons)
const STACK_APRENDE = [
  "python", "fastapi", "django", "flask", "pandas", "numpy", "matplotlib",
  "jupyter", "scikit-learn", "pytorch", "polars", "duckdb", "sqlalchemy",
  "postgresql", "redis", "docker", "pytest", "pydantic", "streamlit",
  "plotly", "kafka", "airflow", "spark", "celery", "rabbitmq", "opencv",
  "graphql", "git", "github", "supabase",
];

function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section
        id={id}
        className="scroll-mt-24 border-t border-border pt-10 first:border-0 first:pt-0"
      >
        <h2 className="flex items-center gap-2.5 text-2xl font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
            <Icon className="h-5 w-5" />
          </span>
          {title}
        </h2>
        <div className="prose-docs mt-4 max-w-none space-y-3 text-[15px] leading-relaxed text-text-secondary">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

function Callout({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-4 flex gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <div className="mt-1 text-sm text-text-secondary">{children}</div>
      </div>
    </div>
  );
}

export default async function DocsPage() {
  const s = await getPlatformStats();
  const HERO_STATS = [
    [String(s.trilhas), "trilhas"],
    [fmtStat(s.modulos), "módulos"],
    [fmtStat(s.exercicios), "exercícios"],
    [fmtStat(s.projetos), "projetos"],
  ];

  return (
    <div className="relative">
      {/* fundo ambiente */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 top-40 h-72 w-72 rounded-full bg-magenta/10 blur-3xl" />
      </div>

      <div className="container max-w-6xl py-12">
        {/* hero */}
        <Reveal>
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light">
              <BookOpen className="h-3.5 w-3.5" /> Documentação
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Documentação da PyTrack
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-text-secondary">
              Tudo o que você precisa para usar a plataforma e dominar todo o
              ecossistema Python — do primeiro <code>print()</code> à carreira
              profissional. Guias práticos, referências e dicas.
            </p>
            <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {HERO_STATS.map(([n, l]) => (
                <div
                  key={l}
                  className="rounded-xl border border-border bg-surface/50 p-3 text-center"
                >
                  <p className="text-2xl font-bold text-gradient">{n}</p>
                  <p className="text-xs text-text-secondary">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[230px_1fr]">
          {/* índice lateral */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-0.5 overflow-y-auto pr-2">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70">
                Nesta página
              </p>
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  {sec.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* conteúdo */}
          <div className="space-y-10">
            <Section id="sobre" icon={Rocket} title="Sobre a PyTrack">
              <p>
                <strong className="text-foreground">PyTrack</strong> é uma
                plataforma completa para aprender, praticar e dominar{" "}
                <strong className="text-foreground">todo o ecossistema Python</strong>{" "}
                — do absoluto zero à carreira profissional. Reúne, num único
                lugar, trilhas guiadas, milhares de exercícios corrigidos por IA,
                uma IDE Python no navegador, projetos reais, comunidade, roadmap
                de carreira e ferramentas de produtividade.
              </p>
              <p>
                A proposta é eliminar a fragmentação do aprendizado: em vez de
                juntar dezenas de cursos, vídeos e tutoriais soltos, você tem um
                caminho estruturado, com prática constante e feedback imediato —
                em qualquer dispositivo.
              </p>
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <strong className="text-foreground">{s.trilhas} trilhas</strong>{" "}
                  cobrindo backend, dados, IA, DevOps, segurança, IoT e mais.
                </li>
                <li>
                  <strong className="text-foreground">
                    {fmtStat(s.exercicios)} exercícios
                  </strong>{" "}
                  com correção por IA, em dezenas de categorias.
                </li>
                <li>
                  <strong className="text-foreground">
                    {fmtStat(s.projetos)} projetos
                  </strong>{" "}
                  reais para o portfólio.
                </li>
                <li>
                  <strong className="text-foreground">IDE Python</strong> rodando
                  no navegador (WebAssembly) — sem instalar nada.
                </li>
                <li>
                  Apps nativos (Android, Windows, macOS, Linux) e extensões para o
                  VS Code.
                </li>
              </ul>
            </Section>

            <Section id="inicio-rapido" icon={Zap} title="Início rápido">
              <p>
                Comece a aprender em menos de 2 minutos. Siga estes passos:
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    n: "1",
                    icon: GraduationCap,
                    t: "Crie sua conta",
                    d: "Cadastro grátis em /auth/register — 7 dias de acesso, sem cartão.",
                  },
                  {
                    n: "2",
                    icon: Layers,
                    t: "Escolha uma trilha",
                    d: "Em /minhas-trilhas, pegue o caminho do seu objetivo (backend, dados, IA…).",
                  },
                  {
                    n: "3",
                    icon: Terminal,
                    t: "Pratique na hora",
                    d: "Abra a IDE no navegador, resolva exercícios e receba feedback da IA.",
                  },
                ].map((c) => (
                  <div key={c.n} className="card h-full p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gradient">
                        {c.n}
                      </span>
                      <c.icon className="h-5 w-5 text-primary-light" />
                    </div>
                    <p className="mt-3 font-semibold text-foreground">{c.t}</p>
                    <p className="mt-1 text-sm text-text-secondary">{c.d}</p>
                  </div>
                ))}
              </div>
              <Callout icon={Lightbulb} title="Dica de ouro">
                Estude um pouco todos os dias. A sequência (streak) e o XP foram
                feitos para criar o hábito — 30 minutos diários rendem mais do que
                maratonas esporádicas.
              </Callout>
            </Section>

            <Section id="como-funciona" icon={BookOpen} title="Como funciona">
              <p>
                O aprendizado segue um ciclo simples e eficaz:{" "}
                <strong className="text-foreground">
                  aprender → praticar → construir → evoluir
                </strong>
                .
              </p>
              <ol className="ml-5 list-decimal space-y-1">
                <li>
                  <strong className="text-foreground">Escolha uma trilha</strong>{" "}
                  de acordo com seu objetivo (backend, dados, IA…).
                </li>
                <li>
                  <strong className="text-foreground">Estude as lições</strong>{" "}
                  com teoria objetiva e exemplos de código.
                </li>
                <li>
                  <strong className="text-foreground">Pratique</strong> com
                  exercícios corrigidos por IA, que dão nota e feedback.
                </li>
                <li>
                  <strong className="text-foreground">Construa projetos reais</strong>{" "}
                  para o portfólio.
                </li>
                <li>
                  <strong className="text-foreground">Acompanhe sua evolução</strong>{" "}
                  com XP, níveis e o mapa de domínio da stack.
                </li>
              </ol>
            </Section>

            <Section id="trilhas" icon={Layers} title="Trilhas de aprendizado">
              <p>
                São <strong className="text-foreground">{s.trilhas} trilhas</strong>{" "}
                organizadas por nível e plano, cada uma com objetivo, currículo e
                projetos. A trilha{" "}
                <strong className="text-foreground">Primeiros Passos</strong> é
                gratuita; as demais cobrem áreas como Python Developer, Backend,
                Data Analytics, Engenharia de Dados, Machine Learning & IA, DevOps
                & Cloud, Arquitetura, IoT, Segurança, Blockchain, Quant, Web
                Full-Stack, QA, Performance, MLOps, Agentes de IA, Computação
                Científica, Cloud Native e a trilha{" "}
                <strong className="text-foreground">Suprema (Python Mastery)</strong>{" "}
                com projeto final de SaaS completo.
              </p>
              <p>
                <strong className="text-foreground">Como usar:</strong> abra{" "}
                <Link href="/minhas-trilhas" className="text-primary-light hover:underline">
                  /minhas-trilhas
                </Link>
                , escolha a trilha, e siga os módulos na ordem. Cada lição lida é
                registrada e some no seu progresso e XP. Você pode pausar e
                retomar quando quiser — a plataforma lembra onde você parou.
              </p>
            </Section>

            <Section id="conteudos" icon={BookOpen} title="Conteúdos e lições">
              <p>
                Cada trilha é feita de <strong className="text-foreground">módulos</strong>,
                e cada módulo de várias <strong className="text-foreground">lições</strong>{" "}
                em Markdown, com teoria direta, exemplos de código copiáveis,
                tabela de conteúdo navegável e marcação de progresso.
              </p>
              <ul className="ml-5 list-disc space-y-1">
                <li>Marque uma lição como concluída para ganhar XP.</li>
                <li>Use o índice lateral (TOC) para pular entre tópicos.</li>
                <li>
                  Copie qualquer bloco de código com um clique e teste na IDE.
                </li>
                <li>
                  O conteúdo é atualizado continuamente — novas lições aparecem
                  automaticamente.
                </li>
              </ul>
            </Section>

            <Section id="exercicios" icon={Code2} title="Exercícios com IA">
              <p>
                <strong className="text-foreground">{fmtStat(s.exercicios)} exercícios</strong>{" "}
                práticos, do básico ao especialista, em dezenas de categorias de
                todo o ecossistema. Ao enviar sua solução, uma{" "}
                <strong className="text-foreground">IA avalia o código</strong> e
                retorna nota (0–100), pontos fortes, melhorias e uma solução de
                referência idiomática.
              </p>
              <p>
                <strong className="text-foreground">Como resolver:</strong> abra{" "}
                <Link href="/exercicios" className="text-primary-light hover:underline">
                  /exercicios
                </Link>
                , clique em um exercício para expandir (objetivo, requisitos,
                critérios de aceite e checklist), escreva sua solução e clique em{" "}
                <em>Analisar com IA</em> — ou abra direto na IDE. Com nota ≥ 60, o
                exercício é marcado como concluído.
              </p>
              <Callout icon={Sparkles} title="Resolva pelo Telegram e sincronize">
                Você pode resolver exercícios pelo bot{" "}
                <a href="https://t.me/PyTrack_SaaS_Bot" className="text-primary-light hover:underline">
                  @PyTrack_SaaS_Bot
                </a>
                : envie o arquivo <code>.py</code> da solução e, ao ser aprovado,
                o exercício é marcado como concluído também na plataforma —
                automaticamente.
              </Callout>
            </Section>

            <Section id="categorias" icon={Trophy} title="Categorias de exercícios">
              <p>
                Os exercícios cobrem todo o ecossistema, com complexidades do
                básico ao especialista. Principais grupos:
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  "Fundamentos & Sintaxe",
                  "Strings & Texto",
                  "Coleções & Comprehensions",
                  "POO & Design",
                  "Arquivos, CSV & JSON",
                  "Bancos de Dados & SQL",
                  "Web & APIs (FastAPI/Flask)",
                  "Data Science (NumPy/Pandas)",
                  "Machine Learning",
                  "Automação, CLI & Scraping",
                  "Async & Concorrência",
                  "Testes & Qualidade",
                  "Segurança",
                  "DevOps & Deploy",
                  "Algoritmos & Performance",
                  "Visualização & Dashboards",
                ].map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary" />
                    {c}
                  </div>
                ))}
              </div>
            </Section>

            <Section id="ide" icon={Terminal} title="IDE Python no navegador">
              <p>
                A IDE roda{" "}
                <strong className="text-foreground">Python de verdade no navegador</strong>{" "}
                via WebAssembly (Pyodide) — sem instalar nada. Tem temas, snippets,
                execução com um clique e integração com os exercícios. No app
                desktop, a IDE roda localmente.
              </p>
              <p>
                Também é possível{" "}
                <strong className="text-foreground">salvar seu código no GitHub</strong>{" "}
                (criando repositórios) direto da IDE. Acesse em{" "}
                <Link href="/ide" className="text-primary-light hover:underline">
                  /ide
                </Link>
                .
              </p>
            </Section>

            <Section id="atalhos" icon={Keyboard} title="Atalhos de teclado">
              <p>Ganhe velocidade com os atalhos da plataforma e da IDE:</p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-text-secondary">
                      <th className="py-2 pr-4 font-semibold">Atalho</th>
                      <th className="py-2 font-semibold">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="text-text-secondary">
                    {[
                      ["⌘K / Ctrl+K", "Busca global (trilhas, conteúdos, tecnologias…)"],
                      ["Ctrl+Enter", "Rodar o código na IDE"],
                      ["Tab", "Indentar / aceitar sugestão"],
                      ["⌘B / Ctrl+B", "Recolher ou mostrar o menu lateral"],
                      ["Esc", "Fechar modais e painéis"],
                    ].map(([k, a]) => (
                      <tr key={k} className="border-b border-border/60">
                        <td className="py-2 pr-4">
                          <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
                            {k}
                          </kbd>
                        </td>
                        <td className="py-2">{a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="projetos" icon={Briefcase} title="Projetos">
              <p>
                <strong className="text-foreground">{fmtStat(s.projetos)} projetos</strong>{" "}
                reais de vários níveis para construir um portfólio sólido. Cada
                projeto traz objetivo, requisitos, tecnologias e um passo a passo.
                Você envia sua solução e a IA avalia o atendimento aos requisitos.
              </p>
              <p>
                <strong className="text-foreground">Como usar:</strong> em{" "}
                <Link href="/meus-projetos" className="text-primary-light hover:underline">
                  /meus-projetos
                </Link>
                , filtre por área, dificuldade ou tecnologia, favorite os que
                quiser fazer e acompanhe seu progresso. Use o botão{" "}
                <em>Surpreenda-me</em> para um desafio aleatório.
              </p>
            </Section>

            <Section id="carreira" icon={Brain} title="Carreira & IA">
              <p>
                Ferramentas para acelerar sua empregabilidade:{" "}
                <strong className="text-foreground">roadmap de carreira</strong>,{" "}
                <strong className="text-foreground">consultor de IA</strong>, banco
                de <strong className="text-foreground">{fmtStat(s.perguntas)} perguntas</strong>{" "}
                de entrevista,{" "}
                <strong className="text-foreground">simulador de entrevista técnica</strong>{" "}
                (Suprema) e um{" "}
                <strong className="text-foreground">gerador de currículo</strong>{" "}
                com 12 modelos profissionais e exportação em PDF/DOCX/DOC/TXT.
              </p>
            </Section>

            <Section id="comunidade" icon={Users} title="Comunidade">
              <p>
                Um espaço para{" "}
                <strong className="text-foreground">conectar-se com outros devs Python</strong>
                : feed com publicações em Markdown, vagas, comentários, curtidas,
                perfis, conexões/seguidores e ranking por XP. Disponível a partir
                do plano Completo, em{" "}
                <Link href="/comunidade" className="text-primary-light hover:underline">
                  /comunidade
                </Link>
                .
              </p>
            </Section>

            <Section id="apps" icon={Smartphone} title="Apps & Extensões">
              <p>Leve a PyTrack para onde estiver:</p>
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <strong className="text-foreground">App Android</strong> —
                  trilhas, exercícios e comunidade no celular.
                </li>
                <li>
                  <strong className="text-foreground">App Desktop</strong>{" "}
                  (Windows, macOS, Linux e Arch) — nativo, leve (~7 MB), com IDE
                  Python e atualização automática.
                </li>
                <li>
                  <strong className="text-foreground">Extensão VS Code (PyTrack)</strong>{" "}
                  — gerencie a assinatura, importe projetos/aulas/exercícios, use
                  snippets e IA dentro do editor.
                </li>
                <li>
                  <strong className="text-foreground">PyTrack Themes</strong>{" "}
                  (grátis) — 5 temas para Python no VS Code.
                </li>
                <li>
                  <strong className="text-foreground">PyTrack Autocomplete</strong>{" "}
                  (Completo) — autocomplete profissional de Python e 28 tipos de
                  projeto.
                </li>
                <li>
                  Instalação via{" "}
                  <strong className="text-foreground">Homebrew, Chocolatey, AUR, curl e Docker</strong>
                  .
                </li>
              </ul>
              <p>
                Tudo em{" "}
                <Link href="/apps" className="text-primary-light hover:underline">
                  /apps
                </Link>
                . Há também um{" "}
                <strong className="text-foreground">bot completo no Telegram</strong>{" "}
                (
                <a href="https://t.me/PyTrack_SaaS_Bot" className="text-primary-light hover:underline">
                  @PyTrack_SaaS_Bot
                </a>
                ). 📖 Documentação detalhada em{" "}
                <Link href="/docs/apps" className="text-primary-light hover:underline">
                  /docs/apps
                </Link>
                .
              </p>
            </Section>

            <Section id="api" icon={Puzzle} title="API da plataforma">
              <p>
                Assinantes <strong className="text-foreground">Suprema</strong> têm
                acesso a uma <strong className="text-foreground">API REST</strong>{" "}
                para integrar o progresso da PyTrack a outros serviços (badges,
                portfólios, automações). Endpoints: <code>/api/v1/me</code>,{" "}
                <code>/progress</code>, <code>/tracks</code> e <code>/ranking</code>.
                Autenticação via chave <code>pytk_live_</code>.
              </p>
              <p>
                Veja a referência completa em{" "}
                <Link href="/docs/api" className="text-primary-light hover:underline">
                  /docs/api
                </Link>
                , com um playground para testar ao vivo.
              </p>
            </Section>

            <Section id="planos" icon={CreditCard} title="Planos & comparação">
              <p>
                Comece com <strong className="text-foreground">7 dias grátis</strong>
                . Compare os planos:
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-text-secondary">
                      <th className="py-2 pr-4 font-semibold">Recurso</th>
                      <th className="px-3 py-2 text-center font-semibold">Essencial<br />R$10</th>
                      <th className="px-3 py-2 text-center font-semibold">Completo<br />R$19</th>
                      <th className="px-3 py-2 text-center font-semibold">Suprema<br />R$46</th>
                    </tr>
                  </thead>
                  <tbody className="text-text-secondary">
                    {[
                      ["Todas as trilhas + IDE", true, true, true],
                      ["Exercícios com IA", true, true, true],
                      ["Comunidade + carreira IA", false, true, true],
                      ["Projetos + especializações", false, true, true],
                      ["Autocomplete (extensão)", false, true, true],
                      ["Apps + extensão PyTrack + API", false, false, true],
                      ["Entrevista IA + Trilha Suprema", false, false, true],
                    ].map(([r, e, c, su]) => (
                      <tr key={r as string} className="border-b border-border/60">
                        <td className="py-2 pr-4">{r}</td>
                        {[e, c, su].map((v, i) => (
                          <td key={i} className="px-3 py-2 text-center">
                            {v ? (
                              <CheckCircle2 className="mx-auto h-4 w-4 text-secondary" />
                            ) : (
                              <span className="text-text-secondary/40">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                Há ainda o{" "}
                <strong className="text-foreground">Vitalício (R$697, único)</strong>{" "}
                — tudo, para sempre. Detalhes em{" "}
                <Link href="/precos" className="text-primary-light hover:underline">
                  /precos
                </Link>
                . Você pode trocar de plano quando quiser: upgrade é imediato (com
                cobrança proporcional) e downgrade vale a partir do próximo ciclo.
              </p>
            </Section>

            <Section
              id="tecnologia"
              icon={Layers}
              title="Tecnologias que você aprende"
            >
              <p>
                A PyTrack cobre o ecossistema Python que o mercado usa de verdade —
                com logos reais e links de documentação na página{" "}
                <Link href="/stack" className="text-primary-light hover:underline">
                  /stack
                </Link>
                :
              </p>
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
                {STACK_APRENDE.map((tech) => (
                  <div
                    key={tech}
                    className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface/50 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
                    title={tech}
                  >
                    <TechIcon
                      name={tech}
                      className="h-8 w-8 transition-transform duration-200 group-hover:scale-110"
                    />
                    <span className="truncate text-center text-[10px] capitalize text-text-secondary">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="stack-plataforma" icon={Cpu} title="Stack da plataforma">
              <p>
                A PyTrack é construída com a mesma stack usada por gigantes da
                indústria:{" "}
                <strong className="text-foreground">
                  Next.js, React, TypeScript, Tailwind, Supabase (Postgres), Stripe
                </strong>{" "}
                e infraestrutura na Vercel. A IDE usa{" "}
                <strong className="text-foreground">Pyodide</strong> (Python em
                WebAssembly). Os apps usam{" "}
                <strong className="text-foreground">Expo/React Native</strong>{" "}
                (mobile) e <strong className="text-foreground">Tauri</strong>{" "}
                (desktop).
              </p>
            </Section>

            <Section id="arquitetura" icon={Network} title="Arquitetura">
              <p>
                A plataforma roda em{" "}
                <strong className="text-foreground">Next.js (App Router, RSC)</strong>{" "}
                na Vercel, com{" "}
                <strong className="text-foreground">Server Components</strong> para
                data fetching no servidor e{" "}
                <strong className="text-foreground">Server Actions</strong> para
                mutações — sem expor uma camada de API intermediária ao cliente.
              </p>
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <strong className="text-foreground">Route groups</strong>:{" "}
                  <code>(site)</code> (público), <code>(dashboard)</code> (app
                  autenticado), <code>(rede)</code> (comunidade standalone).
                </li>
                <li>
                  <strong className="text-foreground">Middleware</strong> de borda
                  faz a sessão Supabase e o <em>gating</em> por plano antes de
                  renderizar.
                </li>
                <li>
                  <strong className="text-foreground">Edge Functions (Deno)</strong>{" "}
                  no Supabase para a correção de exercícios por IA.
                </li>
                <li>
                  <strong className="text-foreground">Realtime</strong> (Postgres
                  changes) para chat, notificações e comunidade.
                </li>
              </ul>
            </Section>

            <Section id="modelo-dados" icon={Database} title="Modelo de dados">
              <p>
                O banco é{" "}
                <strong className="text-foreground">PostgreSQL</strong> (Supabase).
                As principais entidades:
              </p>
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <code>users_profile</code> — perfil canônico (XP, nível, capa,
                  headline, skills, links, vanity URL).
                </li>
                <li>
                  <code>contents</code> + <code>progress</code> — módulos/aulas e o
                  progresso por usuário (base das trilhas).
                </li>
                <li>
                  <code>practice_exercises</code>, <code>exercise_completions</code>{" "}
                  — exercícios e conclusões (sincronizadas entre site e bot).
                </li>
                <li>
                  <code>projects</code>, <code>community_*</code>,{" "}
                  <code>certificates</code>, <code>user_badges</code>,{" "}
                  <code>subscriptions</code> + <code>stripe_customers</code>.
                </li>
              </ul>
              <p>
                Toda tabela tem{" "}
                <strong className="text-foreground">RLS</strong> com políticas por
                operação baseadas em <code>auth.uid()</code>.
              </p>
            </Section>

            <Section id="ia-byok" icon={Cpu} title="IA & BYOK (Bring Your Own Key)">
              <p>
                A correção de exercícios e os recursos de IA aceitam a{" "}
                <strong className="text-foreground">sua própria chave</strong>{" "}
                (OpenAI, Anthropic, OpenRouter, NVIDIA ou endpoint custom). Sem
                chave, há um <em>fallback</em> da plataforma. Configure em{" "}
                <strong className="text-foreground">Configurações → IA</strong>.
              </p>
            </Section>

            <Section id="api-webhooks" icon={Webhook} title="API & Webhooks">
              <p>
                Assinantes <strong className="text-foreground">Suprema</strong> têm
                uma <strong className="text-foreground">API REST</strong> (chave{" "}
                <code>pytk_live_</code>). Há também o{" "}
                <strong className="text-foreground">webhook do Stripe</strong>{" "}
                (idempotente) e um endpoint de broadcast protegido por secret.
                Referência e playground em{" "}
                <Link href="/docs/api" className="text-primary-light hover:underline">
                  /docs/api
                </Link>
                .
              </p>
            </Section>

            <Section id="performance" icon={Gauge} title="Performance & Cache">
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <code>unstable_cache</code> + <code>revalidateTag</code> para
                  conteúdo derivado do banco (stats, catálogos).
                </li>
                <li>
                  Componentes pesados são{" "}
                  <strong className="text-foreground">Server Components</strong>{" "}
                  (zero JS no cliente quando possível).
                </li>
                <li>
                  Índices em colunas de busca/junção; paginação por cursor;{" "}
                  <code>head: true</code> para contagens.
                </li>
                <li>
                  Imagens otimizadas (<code>next/image</code>) e vídeos em
                  MP4/WebM sob demanda.
                </li>
              </ul>
            </Section>

            <Section id="seguranca" icon={Shield} title="Segurança & Privacidade">
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <strong className="text-foreground">RLS</strong> em todas as
                  tabelas do banco.
                </li>
                <li>
                  <strong className="text-foreground">2FA (TOTP)</strong> opcional e
                  dispositivos confiáveis.
                </li>
                <li>Sessões em armazenamento seguro nos apps (keychain/keystore).</li>
                <li>
                  Cabeçalhos de segurança (CSP, HSTS), rate limiting e proteção
                  anti-brute-force.
                </li>
                <li>
                  Conformidade com a <strong className="text-foreground">LGPD</strong>:
                  exportar e excluir conta a qualquer momento.
                </li>
              </ul>
              <p>
                Divulgação responsável de vulnerabilidades em{" "}
                <Link href="/.well-known/security.txt" className="text-primary-light hover:underline">
                  /.well-known/security.txt
                </Link>
                .
              </p>
            </Section>

            <Section id="glossario" icon={BookOpen} title="Glossário">
              <div className="space-y-2">
                {[
                  ["Trilha", "Caminho guiado de módulos com um objetivo de carreira."],
                  ["Módulo", "Conjunto de lições sobre um tema dentro de uma trilha."],
                  ["XP", "Pontos de experiência ganhos ao estudar, praticar e concluir."],
                  ["Streak", "Sequência de dias seguidos estudando — alimenta o hábito."],
                  ["BYOK", "Bring Your Own Key: use sua própria chave de IA."],
                  ["RLS", "Row Level Security: isolamento de dados por usuário no banco."],
                  ["Pyodide", "Python compilado para WebAssembly, roda no navegador."],
                ].map(([t, d]) => (
                  <p key={t}>
                    <strong className="text-foreground">{t}</strong> — {d}
                  </p>
                ))}
              </div>
            </Section>

            <Section id="dicas" icon={Lightbulb} title="Dicas de quem rende mais">
              <ul className="ml-5 list-disc space-y-1">
                <li>Defina um objetivo (ex.: “virar dev backend”) e siga a trilha correspondente.</li>
                <li>Pratique todo dia, mesmo que pouco — mantenha o streak.</li>
                <li>Refaça os exercícios que errou; releia o feedback da IA.</li>
                <li>Construa pelo menos um projeto por trilha e suba no GitHub.</li>
                <li>Use a busca global (⌘K) para achar qualquer conteúdo em segundos.</li>
                <li>Instale a extensão de autocomplete para acelerar na IDE.</li>
              </ul>
            </Section>

            <Section id="faq" icon={HelpCircle} title="Perguntas frequentes">
              <p>
                <strong className="text-foreground">Preciso saber programar para começar?</strong>{" "}
                Não. Há trilhas do zero absoluto.
              </p>
              <p>
                <strong className="text-foreground">Preciso instalar o Python?</strong>{" "}
                Não — a IDE roda no navegador.
              </p>
              <p>
                <strong className="text-foreground">Funciona no celular?</strong>{" "}
                Sim, no app Android e no navegador.
              </p>
              <p>
                <strong className="text-foreground">Como cancelo?</strong> A
                qualquer momento em Configurações → Plano, sem burocracia.
              </p>
            </Section>

            <Reveal>
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
                <p className="text-lg font-bold">Pronto para começar?</p>
                <p className="mt-1 text-sm text-text-secondary">
                  7 dias grátis, sem cartão. Comece a dominar Python hoje.
                </p>
                <Link
                  href="/auth/register"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white"
                >
                  Criar conta grátis <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
