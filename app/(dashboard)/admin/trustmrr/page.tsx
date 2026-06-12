import { redirect } from "next/navigation";
import {
  BadgeCheck,
  TrendingUp,
  Users,
  CreditCard,
  Trophy,
  Globe,
  ExternalLink,
  DollarSign,
  Eye,
  Layers,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { getTrustMrr } from "@/lib/trustmrr";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "TrustMRR · Admin · PyTrack" };
export const dynamic = "force-dynamic";

const fmtUSD = (n?: number) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
    : "—";

export default async function AdminTrustMrrPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const d = await getTrustMrr();

  return (
    <div>
      <PageHeader
        title="TrustMRR — Receita Verificada"
        description="Dados públicos e verificados da PyTrack no TrustMRR, ligados à Stripe."
      />

      {!d ? (
        <Card className="border-warning/30">
          <CardContent className="p-5 text-sm text-warning">
            Não foi possível carregar os dados do TrustMRR agora. Verifique a chave da API
            (<code>TRUSTMRR_API_KEY</code>) ou tente novamente em instantes.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* topo: identidade + badge */}
          <Card className="overflow-hidden border-primary/30">
            <CardContent className="flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {d.icon && <img src={d.icon} alt="" className="h-14 w-14 rounded-xl object-contain" />}
                <div>
                  <p className="flex items-center gap-2 text-lg font-bold">
                    {d.name}
                    <BadgeCheck className="h-5 w-5 text-green" />
                  </p>
                  <p className="text-sm text-text-secondary">
                    {d.category} · {d.targetAudience} · {d.country} · Pagamentos via {d.paymentProvider}
                  </p>
                </div>
              </div>
              {/* badge oficial */}
              <a href="https://trustmrr.com/startup/pytrack" target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://trustmrr.com/api/embed/pytrack?format=svg&theme=dark"
                  alt="TrustMRR verified revenue badge"
                  width={220}
                  height={90}
                />
              </a>
            </CardContent>
          </Card>

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={DollarSign} accent="text-green bg-green/10" label="MRR (verificado)" value={fmtUSD(d.revenue?.mrr)} />
            <Kpi icon={TrendingUp} accent="text-blue bg-blue/10" label="Receita (30 dias)" value={fmtUSD(d.revenue?.last30Days)} />
            <Kpi icon={Layers} accent="text-primary-light bg-primary/10" label="Receita total" value={fmtUSD(d.revenue?.total)} />
            <Kpi icon={Trophy} accent="text-warning bg-warning/10" label="Rank TrustMRR" value={d.rank ? `#${d.rank.toLocaleString("pt-BR")}` : "—"} />
            <Kpi icon={CreditCard} accent="text-primary-light bg-primary/10" label="Assinaturas ativas" value={String(d.activeSubscriptions ?? 0)} />
            <Kpi icon={Users} accent="text-blue bg-blue/10" label="Clientes" value={String(d.customers ?? 0)} />
            <Kpi icon={TrendingUp} accent="text-green bg-green/10" label="Crescimento MRR 30d" value={`${((d.growthMRR30d ?? 0) * 100).toFixed(1)}%`} />
            <Kpi icon={Eye} accent="text-magenta bg-magenta/10" label="Visitantes 30d" value={String(d.visitorsLast30Days ?? 0)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* sobre */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Perfil público</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-text-secondary">{d.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a href={d.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 hover:text-foreground">
                    <Globe className="h-3.5 w-3.5" /> Site
                  </a>
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 hover:text-foreground">
                    <ExternalLink className="h-3.5 w-3.5" /> Página TrustMRR
                  </a>
                  {d.xHandle && (
                    <a href={`https://x.com/${d.xHandle}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 hover:text-foreground">
                      @{d.xHandle}
                    </a>
                  )}
                </div>
                <p className="text-xs text-text-secondary">
                  Fundada em {d.foundedDate ? new Date(d.foundedDate).toLocaleDateString("pt-BR") : "—"}
                  {d.isMerchantOfRecord ? " · Merchant of Record" : ""}
                </p>
              </CardContent>
            </Card>

            {/* tech stack */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Stack pública</CardTitle></CardHeader>
              <CardContent>
                {d.techStack && d.techStack.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {d.techStack.map((t) => (
                      <span key={t.slug} className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs text-text-secondary">
                        {t.slug}<span className="text-text-secondary/50"> · {t.category}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">—</p>
                )}
              </CardContent>
            </Card>
          </div>

          <p className="text-xs text-text-secondary">
            Dados via TrustMRR API (cache de 5 min). MRR verificado diretamente pela Stripe.
          </p>
        </div>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, accent, label, value }: { icon: typeof Users; accent: string; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accent)}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="mt-3 text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-text-secondary">{label}</p>
      </CardContent>
    </Card>
  );
}
