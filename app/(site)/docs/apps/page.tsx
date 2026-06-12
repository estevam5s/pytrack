import type { Metadata } from "next";
import Link from "next/link";
import {
  Smartphone, Monitor, Send, Download, Shield, Terminal, Puzzle,
  Container, RefreshCw, KeyRound, Sparkles, ArrowRight, Apple,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentação dos Apps & Bot",
  description: "Documentação completa dos apps PyTrack: Android, Desktop (Windows/macOS/Linux), extensão VS Code e o bot do Telegram — instalação, recursos e segurança.",
};

const SECTIONS = [
  { id: "mobile", label: "App Android" },
  { id: "desktop", label: "App Desktop" },
  { id: "extensao", label: "Extensão VS Code" },
  { id: "bot", label: "Bot do Telegram" },
  { id: "instalacao", label: "Métodos de instalação" },
  { id: "seguranca", label: "Segurança" },
];

function Section({ id, icon: Icon, title, children }: { id: string; icon: typeof Smartphone; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10 first:border-0 first:pt-0">
      <h2 className="flex items-center gap-2.5 text-2xl font-bold">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><Icon className="h-5 w-5" /></span>
        {title}
      </h2>
      <div className="mt-4 max-w-none space-y-3 text-[15px] leading-relaxed text-text-secondary">{children}</div>
    </section>
  );
}

function Code({ children }: { children: string }) {
  return <pre className="overflow-x-auto rounded-lg bg-[#0d0d10] p-3 text-xs text-zinc-300"><code>{children}</code></pre>;
}

export default function AppsDocsPage() {
  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-10">
        <Link href="/docs" className="text-sm text-primary-light hover:underline">← Documentação</Link>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Apps, Extensão & Bot</h1>
        <p className="mt-3 max-w-2xl text-lg text-text-secondary">
          A PyTrack vai além do navegador: app Android, app desktop nativo para os três sistemas,
          extensão para o VS Code e um bot completo no Telegram. Veja como instalar e usar cada um.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-foreground">{s.label}</a>
            ))}
          </nav>
        </aside>

        <div className="space-y-10">
          <Section id="mobile" icon={Smartphone} title="App Android">
            <p>App nativo (Expo / React Native) que sincroniza com a sua conta. Login por e-mail/senha, GitHub OAuth e 2FA. Inclui trilhas, +5.000 exercícios (com <strong className="text-foreground">correção por IA</strong>), comunidade, notificações e perfil.</p>
            <p><strong className="text-foreground">Segurança:</strong> a sessão fica no <em>keystore</em> do Android; apenas a chave pública (anon) está no app, protegida por RLS.</p>
            <p>Instale o APK em <Link href="/apps" className="text-primary-light hover:underline">/apps</Link> (exclusivo do plano Suprema).</p>
          </Section>

          <Section id="desktop" icon={Monitor} title="App Desktop (Windows · macOS · Linux)">
            <p>App nativo e leve (~7 MB) feito com <strong className="text-foreground">Tauri</strong>, com <strong className="text-foreground">IDE Python embutida</strong> (Pyodide) rodando localmente, <strong className="text-foreground">atualização automática</strong> (binários assinados) e a mesma experiência do dashboard.</p>
            <p>Instaladores: <strong className="text-foreground">.msi/.exe</strong> (Windows), <strong className="text-foreground">.dmg</strong> universal (macOS Intel+ARM), <strong className="text-foreground">.AppImage/.deb/.rpm</strong> (Linux) e suporte a <strong className="text-foreground">Arch Linux</strong>.</p>
            <div className="flex items-center gap-2 text-sm"><RefreshCw className="h-4 w-4 text-primary-light" /> Ao abrir, o app verifica novas versões e oferece "Atualizar e reiniciar".</div>
          </Section>

          <Section id="extensao" icon={Puzzle} title="Extensão VS Code">
            <p>Gerencie sua assinatura, importe projetos/aulas/exercícios, use 58 snippets de Python e uma <strong className="text-foreground">IA com a sua própria chave</strong> (BYOK) — sem sair do editor. Exclusiva do plano Suprema.</p>
            <Code>{`code --install-extension EstevamSouza.pytrack`}</Code>
          </Section>

          <Section id="bot" icon={Send} title="Bot do Telegram (@PyTrack_SaaS_Bot)">
            <p>Um bot completo para usar a PyTrack pelo chat. Faça login e o bot identifica seu plano. Você pode:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Ver <strong className="text-foreground">perfil, plano e XP</strong> (<code>/perfil</code>, <code>/plano</code>).</li>
              <li>Listar <strong className="text-foreground">trilhas, projetos e ranking</strong>.</li>
              <li><strong className="text-foreground">Resolver exercícios</strong>: escolha um, envie um arquivo <code>.py</code> e a <strong className="text-foreground">IA corrige</strong> (nota, feedback e solução) — concluindo o exercício e dando XP.</li>
            </ul>
            <p className="mt-2"><strong className="text-foreground">Administradores</strong> têm comandos exclusivos: métricas (<code>/stats</code>), gestão de usuários (<code>/usuarios</code>, <code>/usuario</code>), alterar planos (<code>/plano_set</code>) e enviar avisos a todos (<code>/broadcast</code>).</p>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm font-semibold">Fluxo de exercício</p>
              <ol className="ml-5 mt-1 list-decimal text-sm text-text-secondary">
                <li><code>/exercicios fastapi</code> → o bot lista opções.</li>
                <li>Toque em um exercício → veja o objetivo.</li>
                <li>Envie o arquivo <code>.py</code> com a solução.</li>
                <li>A IA corrige e marca como concluído (nota ≥ 60).</li>
              </ol>
            </div>
            <a href="https://t.me/PyTrack_SaaS_Bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-light hover:underline">
              Abrir @PyTrack_SaaS_Bot <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Section>

          <Section id="instalacao" icon={Download} title="Métodos de instalação">
            <p>O app desktop pode ser instalado de várias formas:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><p className="mb-1 text-xs font-medium text-text-secondary">🍎 Homebrew</p><Code>{`brew install --cask estevam5s/tap/pytrack`}</Code></div>
              <div><p className="mb-1 text-xs font-medium text-text-secondary">🪟 Chocolatey</p><Code>{`choco install pytrack`}</Code></div>
              <div><p className="mb-1 text-xs font-medium text-text-secondary">🐧 Arch (AUR)</p><Code>{`yay -S pytrack-desktop-bin`}</Code></div>
              <div><p className="mb-1 text-xs font-medium text-text-secondary">🐳 Docker</p><Code>{`docker run -p 6080:6080 \\
  ghcr.io/estevam5s/pytrack-desktop`}</Code></div>
              <div><p className="mb-1 text-xs font-medium text-text-secondary">🐧 curl (Linux/macOS)</p><Code>{`curl -fsSL https://www.pytrack.com.br/install.sh | sh`}</Code></div>
              <div><p className="mb-1 text-xs font-medium text-text-secondary">🪟 PowerShell</p><Code>{`irm https://www.pytrack.com.br/install.ps1 | iex`}</Code></div>
            </div>
          </Section>

          <Section id="seguranca" icon={Shield} title="Segurança">
            <ul className="ml-5 list-disc space-y-1">
              <li>Sessões em armazenamento seguro do SO (keychain/keystore); no bot, a senha é apagada da conversa.</li>
              <li>Apenas a chave pública (anon) nos clientes — autorização por RLS.</li>
              <li>App desktop com CSP restritiva e binários do updater assinados.</li>
              <li>2FA (TOTP) suportado nos apps mobile e desktop.</li>
            </ul>
          </Section>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <p className="text-lg font-bold">Baixe e comece agora</p>
            <Link href="/apps" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">
              Ver todos os apps <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
