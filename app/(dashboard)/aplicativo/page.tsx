import Link from "next/link";
import {
  Apple,
  ArrowRight,
  BarChart3,
  Bell,
  Cloud,
  Download,
  Lock,
  Monitor,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Trash2,
  UploadCloud,
  WifiOff,
  Zap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast, TIER_LABEL } from "@/lib/billing-access";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteRelease } from "./actions";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppUploader } from "@/components/admin/app-uploader";
import { cn } from "@/lib/utils";

export const metadata = { title: "Aplicativo · PyTrack" };
export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: WifiOff, title: "Estude offline", desc: "Baixe trilhas e lições para estudar sem internet." },
  { icon: Cloud, title: "Sincronização", desc: "Seu progresso, XP e níveis sincronizados em todos os aparelhos." },
  { icon: Bell, title: "Lembretes", desc: "Notificações para manter sua sequência de estudos." },
  { icon: Terminal, title: "IDE no bolso", desc: "Rode código Python direto no app, a qualquer hora." },
  { icon: Zap, title: "Mais rápido", desc: "Experiência nativa, fluida e otimizada." },
  { icon: Sparkles, title: "Consultor IA", desc: "Tire dúvidas com a IA onde estiver." },
];

const PLATFORM_LABEL: Record<string, string> = {
  android: "Android",
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

function DownloadBtn({
  label,
  icon: Icon,
  href,
  canDownload,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string | null;
  canDownload: boolean;
}) {
  if (!href) {
    return (
      <span
        className="inline-flex cursor-default items-center justify-center gap-2 rounded-lg bg-surface-2 px-4 py-2.5 text-sm font-medium text-text-secondary"
        title="Em breve"
      >
        <Icon className="h-4 w-4" /> {label}
        <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] uppercase text-primary-light">Em breve</span>
      </span>
    );
  }
  if (!canDownload) {
    return (
      <Link
        href="/assinar?upgrade=completo"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
      >
        <Lock className="h-4 w-4" /> {label}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary/15 px-4 py-2.5 text-sm font-semibold text-primary-light transition-colors hover:bg-primary hover:text-white"
    >
      <Download className="h-4 w-4" /> {label}
    </a>
  );
}

interface Release {
  id: string;
  platform: string;
  version: string | null;
  notes: string | null;
  file_path: string | null;
  download_url: string | null;
  size_bytes: number | null;
  download_count?: number | null;
  created_at: string;
}

export default async function AplicativoPage() {
  const user = await getCurrentUser();
  const tier = user ? await getUserTier(user.id) : "free";
  const canDownload = tierAtLeast(tier, "completo");
  const admin = isAdmin(user?.email);

  // releases
  let releases: Release[] = [];
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("app_releases")
      .select("*")
      .order("created_at", { ascending: false });
    releases = (data ?? []) as Release[];
  } catch {
    /* ignore */
  }
  const latest: Record<string, Release | undefined> = {};
  for (const r of releases) if (!latest[r.platform]) latest[r.platform] = r;

  return (
    <div>
      <PageHeader
        title="PyTrack no seu dispositivo"
        description="Leve o aprendizado para onde for. Apps nativos para Android e Desktop (Windows, macOS e Linux), com estudo offline, IDE e sincronização."
      />

      {/* painel de downloads (somente admin) */}
      {admin && (() => {
        const dc = (p: string) => (latest[p]?.download_count ?? 0) as number;
        const total = ["android", "windows", "macos", "linux"].reduce((s, p) => s + dc(p), 0);
        const cards = [
          { label: "Total de downloads", value: total, color: "text-primary-light", icon: Download },
          { label: "Android", value: dc("android"), color: "text-green", icon: Smartphone },
          { label: "Windows", value: dc("windows"), color: "text-blue-400", icon: Monitor },
          { label: "macOS", value: dc("macos"), color: "text-foreground", icon: Apple },
          { label: "Linux", value: dc("linux"), color: "text-amber-400", icon: Terminal },
        ];
        return (
          <div className="mb-6 rounded-2xl border border-primary/20 bg-surface p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><BarChart3 className="h-4 w-4 text-primary-light" /> Downloads (admin)</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {cards.map((c) => (
                <div key={c.label} className="rounded-xl border border-border bg-surface-2 p-3 text-center">
                  <c.icon className={cn("mx-auto h-5 w-5", c.color)} />
                  <p className={cn("mt-1.5 text-2xl font-bold", c.color)}>{c.value.toLocaleString("pt-BR")}</p>
                  <p className="text-xs text-text-secondary">{c.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-text-secondary">Contagem real via rota <code>/api/download</code>. Atualiza a cada download.</p>
          </div>
        );
      })()}

      {/* aviso de plano */}
      <div
        className={cn(
          "mb-6 flex flex-col items-start gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
          canDownload ? "border-secondary/30 bg-secondary/5" : "border-primary/30 bg-primary/5",
        )}
      >
        <div className="flex items-start gap-3">
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", canDownload ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary-light")}>
            {canDownload ? <Download className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </span>
          <div>
            <p className="text-sm font-semibold">
              {canDownload
                ? `Download liberado no seu plano ${TIER_LABEL[tier]}`
                : "Download exclusivo dos planos Completo, Suprema e Vitalício"}
            </p>
            <p className="text-xs text-text-secondary">
              {canDownload
                ? "Baixe os apps disponíveis abaixo."
                : "Conheça o app aqui — o download é liberado a partir do plano Completo (R$19/mês)."}
            </p>
          </div>
        </div>
        {!canDownload && (
          <Button asChild>
            <Link href="/assinar?upgrade=completo">
              Fazer upgrade <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* apps */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-green/15 via-surface to-surface p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green/15 text-green">
              <Smartphone className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold">PyTrack para Android</h2>
            <p className="mt-1 text-sm text-text-secondary">
              App nativo para celulares e tablets Android.
              {latest.android?.version ? ` Versão ${latest.android.version}.` : ""}
            </p>
          </div>
          <CardContent className="space-y-2.5 p-6">
            <DownloadBtn label="Baixar APK" icon={Smartphone} href={latest.android?.download_url ?? null} canDownload={canDownload} />
            <p className="text-xs text-text-secondary">Android 8.0 ou superior.</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-primary/15 via-surface to-surface p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
              <Monitor className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold">PyTrack para Desktop</h2>
            <p className="mt-1 text-sm text-text-secondary">App completo para Windows, macOS e Linux.</p>
          </div>
          <CardContent className="space-y-2.5 p-6">
            <div className="grid gap-2.5 sm:grid-cols-3">
              <DownloadBtn label="Windows" icon={Monitor} href={latest.windows?.download_url ?? null} canDownload={canDownload} />
              <DownloadBtn label="macOS" icon={Apple} href={latest.macos?.download_url ?? null} canDownload={canDownload} />
              <DownloadBtn label="Linux" icon={Terminal} href={latest.linux?.download_url ?? null} canDownload={canDownload} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GESTÃO (somente admin) */}
      {admin && (
        <Card className="mt-8 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary-light" /> Gerenciar aplicativos (admin)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
                <UploadCloud className="h-4 w-4 text-primary" /> Publicar novo app
              </p>
              <AppUploader />
            </div>

            {releases.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold">Releases publicados ({releases.length})</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead className="bg-surface-2 text-left text-xs text-text-secondary">
                      <tr>
                        <th className="p-3 font-medium">Plataforma</th>
                        <th className="p-3 font-medium">Versão</th>
                        <th className="p-3 font-medium">Tamanho</th>
                        <th className="p-3 font-medium">Data</th>
                        <th className="p-3 font-medium">Link</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {releases.map((r, i) => (
                        <tr key={r.id} className={cn("border-t border-border", i % 2 && "bg-surface/40")}>
                          <td className="p-3">{PLATFORM_LABEL[r.platform] ?? r.platform}</td>
                          <td className="p-3 text-text-secondary">{r.version ?? "—"}</td>
                          <td className="p-3 text-text-secondary">
                            {r.size_bytes ? `${(r.size_bytes / 1024 / 1024).toFixed(1)} MB` : "—"}
                          </td>
                          <td className="p-3 text-text-secondary">
                            {new Date(r.created_at).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="p-3">
                            {r.download_url ? (
                              <a href={r.download_url} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
                                abrir
                              </a>
                            ) : "—"}
                          </td>
                          <td className="p-3 text-right">
                            <form action={deleteRelease}>
                              <input type="hidden" name="id" value={r.id} />
                              <input type="hidden" name="path" value={r.file_path ?? ""} />
                              <button className="inline-flex items-center gap-1 text-xs text-red-400 hover:underline">
                                <Trash2 className="h-3.5 w-3.5" /> excluir
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* recursos do app */}
      <h2 className="mb-4 mt-10 text-lg font-semibold">Por que usar o app</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card flex items-start gap-3 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
              <f.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">{f.title}</p>
              <p className="text-sm text-text-secondary">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
