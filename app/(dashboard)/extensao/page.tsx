import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Puzzle, Download, Crown, Check, Sparkles, Package, Code2, BookOpen,
  KeyRound, Terminal, ShieldCheck, ExternalLink, Palette, Zap, Lock,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast, TIER_LABEL, type Tier } from "@/lib/billing-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Extensões VS Code · PyTrack" };
export const dynamic = "force-dynamic";

type ExtCard = {
  id: string;
  name: string;
  tagline: string;
  badge: { label: string; tier: Tier };
  accent: string;
  marketplaceId: string;
  vsix?: string; // download estático em /public
  features: { icon: typeof Palette; title: string; desc: string }[];
};

const EXTENSIONS: ExtCard[] = [
  {
    id: "themes",
    name: "PyTrack Themes",
    tagline: "5 temas premium para Python — grátis para todos.",
    badge: { label: "Grátis", tier: "free" },
    accent: "from-green/15 via-surface to-surface border-green/30",
    marketplaceId: "EstevamSouza.pytrack-themes",
    vsix: "/extensions/pytrack-themes-1.0.0.vsix",
    features: [
      { icon: Palette, title: "5 temas da marca", desc: "Dark, Midnight, Neon, Forest e Light." },
      { icon: Code2, title: "Syntax p/ Python", desc: "f-strings, decorators, self, type hints." },
      { icon: Sparkles, title: "Bracket colorization", desc: "Gradiente da marca nos parênteses." },
      { icon: Check, title: "Sem login", desc: "Instalou, escolheu, usou. 100% grátis." },
    ],
  },
  {
    id: "autocomplete",
    name: "PyTrack Autocomplete",
    tagline: "Autocomplete pro de Python + 28 tipos de projeto.",
    badge: { label: "Plano Completo", tier: "completo" },
    accent: "from-blue/15 via-surface to-surface border-blue/30",
    marketplaceId: "EstevamSouza.pytrack-autocomplete",
    vsix: "/extensions/pytrack-autocomplete-1.0.0.vsix",
    features: [
      { icon: Zap, title: "Autocomplete completo", desc: "Builtins, stdlib, snippets e contexto." },
      { icon: Package, title: "28 tipos de projeto", desc: "API, POO, Data, ML, bots, microsserviço…" },
      { icon: Terminal, title: "Scaffolding instantâneo", desc: "Arquivos reais prontos para rodar." },
      { icon: Lock, title: "Verificação de plano", desc: "Liberado para Completo (R$19) ou superior." },
    ],
  },
  {
    id: "pytrack",
    name: "PyTrack — Python na IDE",
    tagline: "Projetos, aulas, exercícios e IA dentro do editor.",
    badge: { label: "Plano Suprema", tier: "suprema" },
    accent: "from-primary/15 via-surface to-surface border-primary/30",
    marketplaceId: "EstevamSouza.pytrack",
    features: [
      { icon: KeyRound, title: "Sua conta no editor", desc: "Login e gestão da assinatura." },
      { icon: Package, title: "Importar projetos", desc: "Traga os projetos do plano para o workspace." },
      { icon: BookOpen, title: "Aulas e exercícios", desc: "Módulos e +5.000 exercícios na sidebar." },
      { icon: Sparkles, title: "IA com sua chave", desc: "OpenAI, OpenRouter, Anthropic, NVIDIA…" },
    ],
  },
];

export default async function ExtensaoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const tier = await getUserTier(user.id);

  const admin = createAdminClient();
  const { data: meta } = await admin
    .from("extension_meta")
    .select("version, marketplace_url")
    .eq("id", 1)
    .maybeSingle();

  return (
    <div>
      <PageHeader
        title="Extensões para VS Code"
        description="Leve a PyTrack para dentro do seu editor: temas, autocomplete profissional, projetos, aulas e IA."
      />

      {/* resumo das 3 extensões */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {EXTENSIONS.map((e) => (
          <a key={e.id} href={`#${e.id}`} className="card card-hover flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
              {e.id === "themes" ? <Palette className="h-5 w-5" /> : e.id === "autocomplete" ? <Zap className="h-5 w-5" /> : <Puzzle className="h-5 w-5" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{e.name}</p>
              <p className="text-xs text-text-secondary">{e.badge.label}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="space-y-6">
        {EXTENSIONS.map((e) => {
          const unlocked = tierAtLeast(tier, e.badge.tier);
          return (
            <section
              key={e.id}
              id={e.id}
              className={`scroll-mt-24 overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-8 ${e.accent}`}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <Image
                  src="/extensions/pytrack-icon.png"
                  alt={e.name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-2xl"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">{e.name}</h2>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        e.badge.tier === "free"
                          ? "border-green/40 bg-green/10 text-green"
                          : "border-primary/30 bg-primary/10 text-primary-light"
                      }`}
                    >
                      {e.badge.tier === "free" ? <Check className="h-3 w-3" /> : <Crown className="h-3 w-3" />}
                      {e.badge.label}
                    </span>
                    {unlocked && e.badge.tier !== "free" && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-green/40 bg-green/10 px-2.5 py-0.5 text-xs font-semibold text-green">
                        <Check className="h-3 w-3" /> Liberado no seu plano ({TIER_LABEL[tier]})
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{e.tagline}</p>

                  {/* recursos */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {e.features.map((f) => (
                      <div key={f.title} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
                          <f.icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{f.title}</p>
                          <p className="text-xs text-text-secondary">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* instalar */}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <a
                      href={`https://marketplace.visualstudio.com/items?itemName=${e.marketplaceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      <Puzzle className="h-4 w-4" /> Instalar no VS Code
                    </a>

                    {e.badge.tier === "free" ? (
                      e.vsix && (
                        <a
                          href={e.vsix}
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold hover:border-primary/40"
                        >
                          <Download className="h-4 w-4" /> Baixar .vsix
                        </a>
                      )
                    ) : unlocked ? (
                      e.vsix ? (
                        <a
                          href={e.vsix}
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold hover:border-primary/40"
                        >
                          <Download className="h-4 w-4" /> Baixar .vsix
                        </a>
                      ) : (
                        <a
                          href="/api/extension/download"
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold hover:border-primary/40"
                        >
                          <Download className="h-4 w-4" /> Baixar .vsix
                        </a>
                      )
                    ) : (
                      <Link
                        href="/assinar"
                        className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary-light"
                      >
                        <Crown className="h-4 w-4" /> Fazer upgrade para o {e.badge.label.replace("Plano ", "")}
                      </Link>
                    )}
                  </div>

                  <pre className="mt-3 max-w-md overflow-x-auto rounded-lg bg-[#0d0d10] p-3 text-xs text-zinc-300">
                    <code>code --install-extension {e.marketplaceId}</code>
                  </pre>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* segurança + docs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4 text-green" /> Privacidade & segurança
          </p>
          <ul className="mt-2 space-y-1 text-sm text-text-secondary">
            <li>• Token de sessão e chave de IA no SecretStorage do sistema.</li>
            <li>• Comunicação só com a PyTrack e o provedor de IA que você escolher.</li>
            <li>• Código aberto e auditável.</li>
          </ul>
        </div>
        <div className="card p-5">
          <p className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-4 w-4 text-primary-light" /> Documentação
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Cada extensão traz um guia completo (instalação, comandos, atalhos e configuração) na própria página do Marketplace.
          </p>
          <a
            href={meta?.marketplace_url || "https://marketplace.visualstudio.com/publishers/EstevamSouza"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-light hover:underline"
          >
            Ver todas as extensões PyTrack <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
