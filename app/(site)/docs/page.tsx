import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Rocket, Code2, Brain, Users, Briefcase, Smartphone, Puzzle,
  Terminal, Shield, CreditCard, Layers, HelpCircle, ArrowRight,
  Network, Database, Cpu, Webhook, Gauge,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentação",
  description: "Documentação completa da PyTrack: como a plataforma funciona, trilhas, exercícios com IA, IDE, projetos, apps, API, planos, segurança e mais.",
};

const SECTIONS = [
  { id: "sobre", label: "Sobre a PyTrack" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "trilhas", label: "Trilhas de aprendizado" },
  { id: "exercicios", label: "Exercícios com IA" },
  { id: "ide", label: "IDE Python" },
  { id: "projetos", label: "Projetos" },
  { id: "carreira", label: "Carreira & IA" },
  { id: "comunidade", label: "Comunidade" },
  { id: "apps", label: "Apps & Extensão" },
  { id: "api", label: "API da plataforma" },
  { id: "planos", label: "Planos" },
  { id: "tecnologia", label: "Tecnologia" },
  { id: "arquitetura", label: "Arquitetura" },
  { id: "modelo-dados", label: "Modelo de dados" },
  { id: "ia-byok", label: "IA & BYOK" },
  { id: "api-webhooks", label: "API & Webhooks" },
  { id: "performance", label: "Performance & Cache" },
  { id: "seguranca", label: "Segurança & Privacidade" },
  { id: "faq", label: "Perguntas frequentes" },
];

function Section({ id, icon: Icon, title, children }: { id: string; icon: typeof BookOpen; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10 first:border-0 first:pt-0">
      <h2 className="flex items-center gap-2.5 text-2xl font-bold">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><Icon className="h-5 w-5" /></span>
        {title}
      </h2>
      <div className="prose-docs mt-4 max-w-none space-y-3 text-[15px] leading-relaxed text-text-secondary">{children}</div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light">
          <BookOpen className="h-3.5 w-3.5" /> Documentação
        </span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Documentação da PyTrack</h1>
        <p className="mt-3 max-w-2xl text-lg text-text-secondary">
          Tudo o que você precisa saber sobre a plataforma: como aprender, praticar, construir
          e crescer na carreira com todo o ecossistema Python.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        {/* índice lateral */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-foreground">
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* conteúdo */}
        <div className="space-y-10">
          <Section id="sobre" icon={Rocket} title="Sobre a PyTrack">
            <p><strong className="text-foreground">PyTrack</strong> é uma plataforma completa para aprender, praticar e dominar <strong className="text-foreground">todo o ecossistema Python</strong> — do absoluto zero à carreira profissional. Reúne, num único lugar, trilhas guiadas, mais de 5.000 exercícios corrigidos por IA, uma IDE Python no navegador, projetos reais, comunidade, roadmap de carreira e ferramentas de produtividade.</p>
            <p>A proposta é eliminar a fragmentação do aprendizado: em vez de juntar dezenas de cursos, vídeos e tutoriais soltos, você tem um caminho estruturado, com prática constante e feedback imediato — em qualquer dispositivo.</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong className="text-foreground">17 trilhas</strong> cobrindo backend, dados, IA, DevOps, segurança, IoT e mais.</li>
              <li><strong className="text-foreground">+5.000 exercícios</strong> em 81 categorias, com correção por IA.</li>
              <li><strong className="text-foreground">IDE Python</strong> rodando no navegador (WebAssembly) — sem instalar nada.</li>
              <li>Apps nativos (Android, Windows, macOS, Linux) e extensão para o VS Code.</li>
            </ul>
          </Section>

          <Section id="como-funciona" icon={BookOpen} title="Como funciona">
            <p>O aprendizado segue um ciclo simples e eficaz: <strong className="text-foreground">aprender → praticar → construir → evoluir</strong>.</p>
            <ol className="ml-5 list-decimal space-y-1">
              <li><strong className="text-foreground">Escolha uma trilha</strong> de acordo com seu objetivo (backend, dados, IA…).</li>
              <li><strong className="text-foreground">Estude as lições</strong> com teoria objetiva e exemplos de código.</li>
              <li><strong className="text-foreground">Pratique</strong> com exercícios corrigidos por IA, que dão nota e feedback.</li>
              <li><strong className="text-foreground">Construa projetos reais</strong> para o portfólio.</li>
              <li><strong className="text-foreground">Acompanhe sua evolução</strong> com XP, níveis e o mapa de domínio da stack.</li>
            </ol>
          </Section>

          <Section id="trilhas" icon={Layers} title="Trilhas de aprendizado">
            <p>São <strong className="text-foreground">17 trilhas</strong> organizadas por nível e plano, cada uma com objetivo, currículo e projetos. A trilha <strong className="text-foreground">Primeiros Passos</strong> é gratuita; as demais cobrem áreas como Python Developer, Backend, Data Analytics, Engenharia de Dados, Machine Learning & IA, DevOps & Cloud, Arquitetura, IoT, Segurança, Blockchain, Quant e a trilha <strong className="text-foreground">Suprema (Python Mastery)</strong> com projeto final de SaaS completo.</p>
            <p>Veja todas em <Link href="/trilhas" className="text-primary-light hover:underline">/trilhas</Link>.</p>
          </Section>

          <Section id="exercicios" icon={Code2} title="Exercícios com IA">
            <p>Mais de <strong className="text-foreground">5.000 exercícios</strong> práticos, do básico ao avançado, em 81 categorias de todo o ecossistema. Ao enviar sua solução, uma <strong className="text-foreground">IA avalia o código</strong> e retorna nota (0–100), pontos fortes, melhorias e uma solução de referência idiomática.</p>
            <p>Você pode usar a IA da plataforma ou a <strong className="text-foreground">sua própria chave (BYOK)</strong> — OpenAI, OpenRouter, Anthropic, NVIDIA ou custom.</p>
          </Section>

          <Section id="ide" icon={Terminal} title="IDE Python no navegador">
            <p>A IDE roda <strong className="text-foreground">Python de verdade no navegador</strong> via WebAssembly (Pyodide) — sem instalar nada. Tem temas, snippets, execução com um clique e integração com os exercícios. No app desktop, a IDE roda localmente.</p>
            <p>Também é possível <strong className="text-foreground">salvar seu código no GitHub</strong> (criando repositórios) direto da IDE.</p>
          </Section>

          <Section id="projetos" icon={Briefcase} title="Projetos">
            <p>Centenas de <strong className="text-foreground">projetos reais</strong> de vários níveis para construir um portfólio sólido. Cada projeto traz objetivo, requisitos e um passo a passo. Você envia sua solução e a IA avalia o atendimento aos requisitos.</p>
          </Section>

          <Section id="carreira" icon={Brain} title="Carreira & IA">
            <p>Ferramentas para acelerar sua empregabilidade: <strong className="text-foreground">roadmap de carreira</strong>, <strong className="text-foreground">consultor de IA</strong>, banco de perguntas de entrevista, <strong className="text-foreground">simulador de entrevista técnica</strong> (Suprema) e um <strong className="text-foreground">gerador de currículo</strong> com 12 modelos profissionais e exportação em PDF/DOCX/DOC/TXT.</p>
          </Section>

          <Section id="comunidade" icon={Users} title="Comunidade">
            <p>Um espaço para <strong className="text-foreground">conectar-se com outros devs Python</strong>: feed com publicações em Markdown, vagas, comentários, curtidas, perfis, conexões/seguidores e ranking por XP. Disponível a partir do plano Completo.</p>
          </Section>

          <Section id="apps" icon={Smartphone} title="Apps & Extensão">
            <p>Leve a PyTrack para onde estiver:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong className="text-foreground">App Android</strong> — trilhas, exercícios e comunidade no celular.</li>
              <li><strong className="text-foreground">App Desktop</strong> (Windows, macOS, Linux e Arch) — nativo, leve (~7 MB), com IDE Python e atualização automática.</li>
              <li><strong className="text-foreground">Extensão VS Code</strong> — gerencie a assinatura, importe projetos/aulas/exercícios, use snippets e IA dentro do editor.</li>
              <li>Instalação via <strong className="text-foreground">Homebrew, Chocolatey, AUR, curl e Docker</strong>.</li>
            </ul>
            <p>Tudo em <Link href="/apps" className="text-primary-light hover:underline">/apps</Link>. Apps e extensão são exclusivos do plano Suprema. Há também um <strong className="text-foreground">bot completo no Telegram</strong> (<a href="https://t.me/PyTrack_SaaS_Bot" className="text-primary-light hover:underline">@PyTrack_SaaS_Bot</a>).</p>
            <p>📖 Documentação detalhada dos apps e do bot em <Link href="/docs/apps" className="text-primary-light hover:underline">/docs/apps</Link>.</p>
          </Section>

          <Section id="api" icon={Puzzle} title="API da plataforma">
            <p>Assinantes <strong className="text-foreground">Suprema</strong> têm acesso a uma <strong className="text-foreground">API REST</strong> para integrar o progresso da PyTrack a outros serviços (badges, portfólios, automações). Endpoints: <code>/api/v1/me</code>, <code>/progress</code>, <code>/tracks</code> e <code>/ranking</code>. Autenticação via chave <code>pytk_live_</code>.</p>
            <p>Veja a referência completa em <Link href="/docs/api" className="text-primary-light hover:underline">/docs/api</Link>, com um playground para testar ao vivo.</p>
          </Section>

          <Section id="planos" icon={CreditCard} title="Planos">
            <p>Comece com <strong className="text-foreground">7 dias grátis</strong>. Depois:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong className="text-foreground">Essencial (R$10/mês)</strong> — trilhas essenciais, exercícios com IA, IDE.</li>
              <li><strong className="text-foreground">Completo (R$19/mês)</strong> — comunidade, carreira, gerador de currículo.</li>
              <li><strong className="text-foreground">Suprema (R$46/mês)</strong> — apps, extensão, API, entrevista com IA, trilha Mastery.</li>
              <li><strong className="text-foreground">Vitalício (R$697, único)</strong> — tudo, para sempre.</li>
            </ul>
            <p>Detalhes em <Link href="/precos" className="text-primary-light hover:underline">/precos</Link>.</p>
          </Section>

          <Section id="tecnologia" icon={Layers} title="Tecnologia">
            <p>A PyTrack é construída com a mesma stack usada por gigantes da indústria: <strong className="text-foreground">Next.js, React, TypeScript, Tailwind, Supabase (Postgres), Stripe</strong> e infraestrutura na Vercel. A IDE usa <strong className="text-foreground">Pyodide</strong> (Python em WebAssembly). Os apps usam <strong className="text-foreground">Expo/React Native</strong> (mobile) e <strong className="text-foreground">Tauri</strong> (desktop). Veja a stack completa em <Link href="/stack" className="text-primary-light hover:underline">/stack</Link>.</p>
          </Section>

          <Section id="arquitetura" icon={Network} title="Arquitetura">
            <p>A plataforma roda em <strong className="text-foreground">Next.js (App Router, RSC)</strong> na Vercel, com <strong className="text-foreground">Server Components</strong> para data fetching no servidor e <strong className="text-foreground">Server Actions</strong> para mutações — sem expor uma camada de API intermediária ao cliente.</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong className="text-foreground">Route groups</strong>: <code>(site)</code> (público), <code>(dashboard)</code> (app autenticado), <code>(rede)</code> (comunidade standalone).</li>
              <li><strong className="text-foreground">Middleware</strong> de borda faz a sessão Supabase e o <em>gating</em> por plano antes de renderizar.</li>
              <li><strong className="text-foreground">Edge Functions (Deno)</strong> no Supabase para a correção de exercícios por IA.</li>
              <li><strong className="text-foreground">Realtime</strong> (Postgres changes) para chat, notificações e comunidade.</li>
              <li>Apps: <strong className="text-foreground">Tauri</strong> (desktop, ~7 MB) e <strong className="text-foreground">Expo</strong> (mobile), com IDE via <strong className="text-foreground">Pyodide/WebAssembly</strong>.</li>
            </ul>
          </Section>

          <Section id="modelo-dados" icon={Database} title="Modelo de dados">
            <p>O banco é <strong className="text-foreground">PostgreSQL</strong> (Supabase). As principais entidades:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><code>users_profile</code> — perfil canônico (XP, nível, capa, headline, skills, links, vanity URL).</li>
              <li><code>contents</code> + <code>progress</code> — módulos/aulas e o progresso por usuário (base das trilhas).</li>
              <li><code>practice_exercises</code>, <code>exercise_completions</code>, <code>user_solved</code> — exercícios, bugs e desafios resolvidos.</li>
              <li><code>community_*</code> (posts, comments, likes, follows, connections, messages, events, recommendations…), <code>certificates</code>, <code>user_badges</code>.</li>
              <li><code>subscriptions</code> + <code>stripe_customers</code> — billing; <code>career_plans</code>, <code>saas_projects</code> — features de IA.</li>
            </ul>
            <p>Toda tabela tem <strong className="text-foreground">RLS</strong> com políticas por operação (select/insert/update/delete) baseadas em <code>auth.uid()</code>.</p>
          </Section>

          <Section id="ia-byok" icon={Cpu} title="IA & BYOK (Bring Your Own Key)">
            <p>A correção de exercícios e os recursos de IA aceitam a <strong className="text-foreground">sua própria chave</strong> (OpenAI, Anthropic, OpenRouter, NVIDIA ou endpoint custom). Sem chave, há um <em>fallback</em> da plataforma.</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>O parser de resposta é <strong className="text-foreground">tolerante a falhas</strong>: tenta JSON e cai para extração por regex se o modelo retornar JSON malformado.</li>
              <li>Modelos são tentados em cascata (lista de fallback) para resiliência.</li>
              <li>Recursos com IA: correção, boilerplate do SaaS, plano de estudos, plano de carreira, coach e consultor.</li>
            </ul>
          </Section>

          <Section id="api-webhooks" icon={Webhook} title="API & Webhooks">
            <p>Assinantes <strong className="text-foreground">Suprema</strong> têm uma <strong className="text-foreground">API REST</strong> (chave <code>pytk_live_</code>) para ler progresso e ranking. Endpoints: <code>/api/v1/me</code>, <code>/progress</code>, <code>/tracks</code>, <code>/ranking</code>.</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Autenticação por header <code>Authorization: Bearer pytk_live_…</code>.</li>
              <li><strong className="text-foreground">Webhook do Stripe</strong> (<code>/api/stripe/webhook</code>) processa assinaturas e a conversão de indicações (idempotente).</li>
              <li><strong className="text-foreground">Broadcast</strong> (<code>/api/broadcast</code>, protegido por secret) usado pelo CI para avisar usuários de novas versões.</li>
            </ul>
            <p>Referência completa e playground em <Link href="/docs/api" className="text-primary-light hover:underline">/docs/api</Link>.</p>
          </Section>

          <Section id="performance" icon={Gauge} title="Performance & Cache">
            <p>Estratégias para manter a plataforma rápida em escala:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><code>unstable_cache</code> + <code>revalidateTag</code>/<code>revalidatePath</code> para conteúdo derivado do banco (stats, catálogos).</li>
              <li>Componentes pesados são <strong className="text-foreground">Server Components</strong> (zero JS no cliente quando possível).</li>
              <li>Geradores determinísticos com <strong className="text-foreground">cache em memória</strong> para 3.300+ bugs e 2.000+ desafios (IDs estáveis).</li>
              <li>Índices em colunas de busca/junção; paginação por cursor; <code>head: true</code> para contagens.</li>
              <li>Imagens otimizadas (<code>next/image</code>) e vídeos servidos como MP4/WebM com autoplay sob demanda.</li>
            </ul>
          </Section>

          <Section id="seguranca" icon={Shield} title="Segurança & Privacidade">
            <p>Levamos a sério a proteção dos seus dados:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong className="text-foreground">RLS (Row Level Security)</strong> em todas as tabelas do banco.</li>
              <li><strong className="text-foreground">2FA (TOTP)</strong> opcional e dispositivos confiáveis.</li>
              <li>Sessões em armazenamento seguro nos apps (keychain/keystore).</li>
              <li>Cabeçalhos de segurança (CSP, HSTS), rate limiting e proteção anti-brute-force.</li>
              <li>Conformidade com a <strong className="text-foreground">LGPD</strong>: exportar e excluir conta a qualquer momento.</li>
            </ul>
            <p>Divulgação responsável de vulnerabilidades em <Link href="/.well-known/security.txt" className="text-primary-light hover:underline">/.well-known/security.txt</Link>.</p>
          </Section>

          <Section id="faq" icon={HelpCircle} title="Perguntas frequentes">
            <p><strong className="text-foreground">Preciso saber programar para começar?</strong> Não. Há trilhas do zero absoluto.</p>
            <p><strong className="text-foreground">Preciso instalar o Python?</strong> Não — a IDE roda no navegador.</p>
            <p><strong className="text-foreground">Funciona no celular?</strong> Sim, no app Android e no navegador.</p>
            <p><strong className="text-foreground">Como cancelo?</strong> A qualquer momento em Configurações → Plano, sem burocracia.</p>
          </Section>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <p className="text-lg font-bold">Pronto para começar?</p>
            <p className="mt-1 text-sm text-text-secondary">7 dias grátis, sem cartão. Comece a dominar Python hoje.</p>
            <Link href="/auth/register" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">
              Criar conta grátis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
