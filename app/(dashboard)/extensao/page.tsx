import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Puzzle, Download, Crown, Check, Sparkles, Package, Code2, BookOpen,
  KeyRound, Terminal, RefreshCw, ShieldCheck, ExternalLink,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Extensão VS Code · PyTrack" };
export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: KeyRound, title: "Login da sua conta", desc: "Entre com a conta PyTrack direto no editor (só login)." },
  { icon: Crown, title: "Gerenciar assinatura", desc: "Veja plano, status e renovação sem sair do VS Code." },
  { icon: Package, title: "Importar projetos", desc: "Traga os projetos do seu plano para o workspace, prontos." },
  { icon: BookOpen, title: "Aulas e exercícios", desc: "Acesse módulos e +5.000 exercícios na barra lateral." },
  { icon: Code2, title: "Snippets do ecossistema", desc: "FastAPI, pandas, pytest, async, SQLAlchemy e muito mais." },
  { icon: Sparkles, title: "Assistente de IA", desc: "Use a SUA chave de IA e o modelo que preferir." },
  { icon: Terminal, title: "Sintaxe por versão", desc: "Compare o mesmo código do Python 3.0 ao 3.13." },
  { icon: Download, title: "Instalar pacotes (pip)", desc: "Instale dependências pela paleta, sem decorar comandos." },
];

export default async function ExtensaoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const tier = await getUserTier(user.id);
  const isSuprema = tierAtLeast(tier, "suprema");

  const admin = createAdminClient();
  const { data: meta } = await admin
    .from("extension_meta")
    .select("version, marketplace_url")
    .eq("id", 1)
    .maybeSingle();
  const marketplaceUrl = meta?.marketplace_url || "https://marketplace.visualstudio.com/items?itemName=EstevamSouza.pytrack";

  return (
    <div>
      <PageHeader
        title="Extensão para VS Code"
        description="Leve a PyTrack para dentro do seu editor: projetos, aulas, exercícios, snippets e IA."
      />

      {/* hero */}
      <div className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Image src="/new-logo.png" alt="PyTrack" width={88} height={88} className="rounded-2xl" />
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light">
              <Crown className="h-3.5 w-3.5" /> Exclusivo do plano Suprema
            </span>
            <h2 className="mt-2 text-2xl font-bold">PyTrack — Python na sua IDE</h2>
            <p className="mt-1 text-text-secondary">
              v{meta?.version ?? "1.0.0"} · Gerencie tudo da PyTrack sem sair do VS Code.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={marketplaceUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white">
                <Puzzle className="h-4 w-4" /> Instalar no VS Code
              </a>
              {isSuprema ? (
                <a href="/api/extension/download"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold hover:border-primary/40">
                  <Download className="h-4 w-4" /> Baixar .vsix (alternativa)
                </a>
              ) : (
                <Link href="/assinar"
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary-light">
                  <Crown className="h-4 w-4" /> Fazer upgrade para o Suprema
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* duas formas de instalar */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="flex items-center gap-2 font-semibold"><Puzzle className="h-4 w-4 text-primary-light" /> 1. Pela loja do VS Code</p>
          <p className="mt-1 text-sm text-text-secondary">Busque por <strong>PyTrack</strong> nas extensões do VS Code, ou clique no botão acima. Atualizações automáticas.</p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0d0d10] p-3 text-xs text-zinc-300"><code>code --install-extension EstevamSouza.pytrack</code></pre>
        </div>
        <div className="card p-5">
          <p className="flex items-center gap-2 font-semibold"><Download className="h-4 w-4 text-primary-light" /> 2. Arquivo .vsix (Suprema)</p>
          <p className="mt-1 text-sm text-text-secondary">Baixe o arquivo e instale manualmente — ideal para ambientes offline ou corporativos.</p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0d0d10] p-3 text-xs text-zinc-300"><code>code --install-extension pytrack-{meta?.version ?? "1.0.0"}.vsix</code></pre>
        </div>
      </div>

      {/* recursos */}
      <h3 className="mt-8 mb-3 text-lg font-bold">O que ela faz</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="card p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><f.icon className="h-5 w-5" /></span>
            <p className="mt-3 font-semibold">{f.title}</p>
            <p className="text-sm text-text-secondary">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* IA com sua chave */}
      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold"><Sparkles className="h-5 w-5 text-primary-light" /> IA com a sua própria chave</h3>
        <p className="mt-2 text-sm text-text-secondary">
          A extensão <strong>não cobra tokens</strong>: você usa a sua chave (OpenAI, OpenRouter, Anthropic, NVIDIA ou custom)
          e escolhe o modelo. A chave fica guardada com segurança no <strong>SecretStorage</strong> do VS Code — nunca sai do seu computador.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3 text-sm">
          {["1. PyTrack: Configurar IA", "2. Escolha provedor + modelo", "3. Cole sua chave e use"].map((s) => (
            <div key={s} className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 p-3">
              <Check className="h-4 w-4 text-green" /> {s}
            </div>
          ))}
        </div>
      </div>

      {/* segurança + docs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-green" /> Privacidade & segurança</p>
          <ul className="mt-2 space-y-1 text-sm text-text-secondary">
            <li>• Token de sessão e chave de IA no SecretStorage do sistema.</li>
            <li>• Comunicação só com a PyTrack e o provedor de IA que você escolher.</li>
            <li>• Código aberto e auditável.</li>
          </ul>
        </div>
        <div className="card p-5">
          <p className="flex items-center gap-2 font-semibold"><BookOpen className="h-4 w-4 text-primary-light" /> Documentação</p>
          <p className="mt-1 text-sm text-text-secondary">Guia completo de instalação, comandos, snippets e configuração da IA.</p>
          <a href="https://github.com/PyTrackOrganization/pytrack-vscode#readme" target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-light hover:underline">
            Ler documentação <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {!isSuprema && (
        <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
          <RefreshCw className="mx-auto h-7 w-7 text-primary-light" />
          <p className="mt-3 text-lg font-bold">Desbloqueie a extensão completa</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-text-secondary">
            Projetos, aulas, exercícios e o download do .vsix são exclusivos do plano <strong>Suprema (R$46/mês)</strong>.
          </p>
          <Link href="/assinar" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">
            <Crown className="h-4 w-4" /> Assinar o Suprema
          </Link>
        </div>
      )}
    </div>
  );
}
