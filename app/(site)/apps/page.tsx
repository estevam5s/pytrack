import type { Metadata } from "next";
import Link from "next/link";
import { Smartphone, Monitor, Puzzle, Download, Check, ExternalLink, Apple, Terminal, Lock, Crown, Container } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { getDownloadStats, fmtDownloads } from "@/lib/data/download-stats";

export const metadata: Metadata = {
  title: "Apps e Extensão",
  description:
    "Leve a PyTrack para onde estiver: app para Android, app desktop (Windows, macOS e Linux), extensão para o VS Code e imagem Docker. Exclusivos do plano Suprema.",
};

export const dynamic = "force-dynamic";

const MARKETPLACE = "https://marketplace.visualstudio.com/items?itemName=EstevamSouza.pytrack";
const DESKTOP_RELEASES = "https://github.com/estevam5s/pytrack-desktop/releases/latest";

export default async function AppsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const canDownload = user ? tierAtLeast(await getUserTier(user.id), "suprema") : false;
  const dl = await getDownloadStats();

  return (
    <>
      <PageHero
        badge="Apps & Extensão · Suprema"
        title="A PyTrack onde"
        highlight="você estiver"
        description="Navegador, celular, desktop, editor ou container. Apps e extensão são exclusivos do plano Suprema (R$46), com login seguro e sincronização em tempo real."
      />

      <section className="container max-w-6xl py-14">
        {!canDownload && (
          <Reveal>
            <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center sm:flex-row sm:text-left">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
                <Crown className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="font-bold">Apps e extensão são do plano Suprema</p>
                <p className="text-sm text-text-secondary">
                  {user ? "Faça upgrade para o Suprema (R$46) para baixar a extensão, os apps e a imagem Docker." : "Entre e assine o plano Suprema (R$46) para baixar tudo."}
                </p>
              </div>
              <Link href="/assinar" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white">
                <Crown className="h-4 w-4" /> {user ? "Fazer upgrade" : "Assinar Suprema"}
              </Link>
            </div>
          </Reveal>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Extensão VS Code */}
          <Reveal>
            <ProductCard accent="#9956F6" icon={Puzzle} tag="Plano Suprema" title="Extensão para VS Code"
              desc="Gerencie sua assinatura, importe projetos, aulas e exercícios, use snippets e uma IA com a sua própria chave — sem sair do editor."
              features={["Login + dashboard do plano", "58 snippets de Python", "IA (sua chave) + ferramentas", "Instalar pacotes, rodar, formatar"]}
              downloads={dl.extension} downloadsLabel="instalações">
              {canDownload ? (
                <DownloadBtn href={MARKETPLACE} accent="#9956F6" icon={Puzzle}>Instalar no VS Code</DownloadBtn>
              ) : <LockedBtn />}
            </ProductCard>
          </Reveal>

          {/* App Android */}
          <Reveal delay={0.08}>
            <ProductCard accent="#29E0A9" icon={Smartphone} tag="Android" title="App Mobile"
              desc="Estude no celular e tablet: trilhas, +5.000 exercícios (com correção por IA), comunidade e carreira — tudo sincronizado com a web."
              features={["Login + GitHub + 2FA", "Trilhas e exercícios", "Correção de código por IA", "Sessão segura (keychain)"]}
              downloads={dl.android} downloadsLabel="downloads">
              {canDownload ? (
                <DownloadBtn href="/api/download?platform=android" accent="#29E0A9" icon={Download}>Baixar APK</DownloadBtn>
              ) : <LockedBtn />}
            </ProductCard>
          </Reveal>

          {/* App Desktop */}
          <Reveal delay={0.16}>
            <ProductCard accent="#5F75F2" icon={Monitor} tag="Windows · macOS · Linux" title="App Desktop"
              desc="App nativo e leve (~7 MB) com IDE Python embutida (Pyodide), atualização automática e a mesma experiência do dashboard — para todos os sistemas."
              features={["IDE Python no app", "Atualização automática", "Windows, macOS e Linux", "~7 MB, nativo (Tauri)"]}
              downloads={dl.desktop} downloadsLabel="downloads">
              {canDownload ? (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <OsBtn href="/api/download?platform=windows" label="Windows" icon={Monitor} />
                    <OsBtn href="/api/download?platform=macos" label="macOS" icon={Apple} />
                    <OsBtn href="/api/download?platform=linux" label="Linux" icon={Terminal} />
                  </div>
                  <a href={DESKTOP_RELEASES} target="_blank" rel="noopener noreferrer" className="text-center text-xs text-text-secondary hover:text-foreground">
                    Ver todas as versões e checksums →
                  </a>
                </div>
              ) : <LockedBtn />}
            </ProductCard>
          </Reveal>
        </div>

        {/* Instalação avançada: CLI / curl / Docker */}
        <Reveal>
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center gap-2">
              <Container className="h-5 w-5 text-blue" />
              <h2 className="text-lg font-bold">Instalação avançada — CLI, gerenciadores de pacote e Docker</h2>
            </div>
            {canDownload ? (
              <div className="grid gap-4 md:grid-cols-2">
                <CodeBox title="🍎 macOS (Homebrew)" code={"brew install --cask estevam5s/tap/pytrack"} />
                <CodeBox title="🪟 Windows (Chocolatey)" code={"choco install pytrack"} />
                <CodeBox title="🐧 Arch Linux (AUR)" code={"yay -S pytrack-desktop-bin"} />
                <CodeBox title="🐧 Linux / macOS (curl)" code={"curl -fsSL https://www.pytrack.com.br/install.sh | sh"} />
                <CodeBox title="🪟 Windows (PowerShell)" code={"irm https://www.pytrack.com.br/install.ps1 | iex"} />
                <CodeBox title="🐳 Docker" code={"docker run --rm -p 6080:6080 \\\n  ghcr.io/estevam5s/pytrack-desktop:latest"} />
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                Instalação via CLI, curl e Docker disponível no plano <strong>Suprema</strong>.{" "}
                <Link href="/assinar" className="text-primary-light hover:underline">Fazer upgrade →</Link>
              </p>
            )}
            <p className="mt-4 text-xs text-text-secondary">
              A imagem Docker roda o app desktop no navegador (noVNC em <code>http://localhost:6080</code>). Veja o{" "}
              <Link href="https://github.com/estevam5s/pytrack-desktop#docker" className="text-primary-light hover:underline">guia completo</Link>.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-sm font-semibold">Disponível em todas as plataformas</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-text-secondary">
              <span className="flex items-center gap-2"><Monitor className="h-5 w-5" /> Windows</span>
              <span className="flex items-center gap-2"><Apple className="h-5 w-5" /> macOS</span>
              <span className="flex items-center gap-2"><Terminal className="h-5 w-5" /> Linux</span>
              <span className="flex items-center gap-2"><Terminal className="h-5 w-5" /> Arch Linux</span>
              <span className="flex items-center gap-2"><Smartphone className="h-5 w-5" /> Android</span>
              <span className="flex items-center gap-2"><Puzzle className="h-5 w-5" /> VS Code</span>
              <span className="flex items-center gap-2"><Container className="h-5 w-5" /> Docker</span>
            </div>
            <p className="mt-4 text-xs text-text-secondary">
              Veja o <Link href="https://github.com/estevam5s/pytrack-desktop/blob/main/CHANGELOG.md" className="text-primary-light hover:underline">changelog completo</Link> de todas as versões.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function ProductCard({ accent, icon: Icon, tag, title, desc, features, downloads, downloadsLabel, children }: {
  accent: string; icon: typeof Puzzle; tag: string; title: string; desc: string; features: string[]; downloads: number; downloadsLabel: string; children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: accent + "22", color: accent }}>
          <Icon className="h-6 w-6" />
        </span>
        {downloads > 0 && (
          <div className="text-right">
            <p className="text-lg font-bold" style={{ color: accent }}>{fmtDownloads(downloads)}</p>
            <p className="text-[10px] text-text-secondary">{downloadsLabel}</p>
          </div>
        )}
      </div>
      <span className="mt-4 inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium" style={{ borderColor: accent + "55", color: accent }}>{tag}</span>
      <h2 className="mt-2 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-text-secondary">{desc}</p>
      <ul className="mt-4 flex-1 space-y-1.5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-text-secondary"><Check className="h-4 w-4" style={{ color: accent }} /> {f}</li>
        ))}
      </ul>
      <div className="mt-5 pt-2">{children}</div>
    </div>
  );
}

function DownloadBtn({ href, accent, icon: Icon, children }: { href: string; accent: string; icon: typeof Download; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
      style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }}>
      <Icon className="h-4 w-4" /> {children}
    </a>
  );
}

function OsBtn({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Monitor }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface-2 px-2 py-2.5 text-xs font-medium text-text-secondary hover:border-primary/40 hover:text-foreground">
      <Icon className="h-4 w-4" /> {label}
    </a>
  );
}

function LockedBtn() {
  return (
    <Link href="/assinar" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:border-primary/40 hover:text-foreground">
      <Lock className="h-4 w-4" /> Disponível no Suprema
    </Link>
  );
}

function CodeBox({ title, code }: { title: string; code: string }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-text-secondary">{title}</p>
      <pre className="overflow-x-auto rounded-lg bg-[#0d0d10] p-3 text-xs text-zinc-300"><code>{code}</code></pre>
    </div>
  );
}
