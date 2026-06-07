import Link from "next/link";
import {
  Apple,
  ArrowRight,
  Bell,
  Cloud,
  Download,
  Lock,
  Monitor,
  Smartphone,
  Sparkles,
  Terminal,
  WifiOff,
  Zap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast, TIER_LABEL } from "@/lib/billing-access";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

function DownloadButton({
  label,
  icon: Icon,
  canDownload,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  canDownload: boolean;
}) {
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
    <button
      disabled
      className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-primary/15 px-4 py-2.5 text-sm font-semibold text-primary-light opacity-90"
      title="Em breve"
    >
      <Icon className="h-4 w-4" /> {label}
      <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] uppercase">Em breve</span>
    </button>
  );
}

export default async function AplicativoPage() {
  const user = await getCurrentUser();
  const tier = user ? await getUserTier(user.id) : "free";
  const canDownload = tierAtLeast(tier, "completo");

  return (
    <div>
      <PageHeader
        title="PyTrack no seu dispositivo"
        description="Leve o aprendizado para onde for. Apps nativos para Android e Desktop (Windows, macOS e Linux), com estudo offline, IDE e sincronização."
      />

      {/* aviso de plano */}
      <div
        className={cn(
          "mb-6 flex flex-col items-start gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
          canDownload
            ? "border-secondary/30 bg-secondary/5"
            : "border-primary/30 bg-primary/5",
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
                : "Download exclusivo dos planos Completo e Suprema"}
            </p>
            <p className="text-xs text-text-secondary">
              {canDownload
                ? "Os apps estão em desenvolvimento — você será avisado assim que lançarem."
                : "Você pode conhecer o app aqui, mas o download é liberado a partir do plano Completo (R$19/mês)."}
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
        {/* Android */}
        <Card className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-green/15 via-surface to-surface p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green/15 text-green">
              <Smartphone className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold">PyTrack para Android</h2>
            <p className="mt-1 text-sm text-text-secondary">
              App nativo para celulares e tablets Android. Estude em qualquer lugar.
            </p>
          </div>
          <CardContent className="space-y-2.5 p-6">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <DownloadButton label="Google Play" icon={Smartphone} canDownload={canDownload} />
              <DownloadButton label="Baixar APK" icon={Download} canDownload={canDownload} />
            </div>
            <p className="text-xs text-text-secondary">Android 8.0 ou superior.</p>
          </CardContent>
        </Card>

        {/* Desktop */}
        <Card className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-primary/15 via-surface to-surface p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
              <Monitor className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold">PyTrack para Desktop</h2>
            <p className="mt-1 text-sm text-text-secondary">
              App completo para Windows, macOS e Linux, com IDE integrada.
            </p>
          </div>
          <CardContent className="space-y-2.5 p-6">
            <div className="grid gap-2.5 sm:grid-cols-3">
              <DownloadButton label="Windows" icon={Monitor} canDownload={canDownload} />
              <DownloadButton label="macOS" icon={Apple} canDownload={canDownload} />
              <DownloadButton label="Linux" icon={Terminal} canDownload={canDownload} />
            </div>
            <p className="text-xs text-text-secondary">Windows 10+, macOS 12+, Linux (AppImage/.deb).</p>
          </CardContent>
        </Card>
      </div>

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
