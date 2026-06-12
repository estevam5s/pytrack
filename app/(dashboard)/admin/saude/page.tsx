import { redirect } from "next/navigation";
import { Heart, Activity, Users, CreditCard, Clock, Zap, Lightbulb, Database } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { getPlatformHealth } from "@/lib/admin-health";

export const metadata = { title: "Saúde da Plataforma · Admin · PyTrack" };
export const dynamic = "force-dynamic";

const STATUS_COLOR = { ok: "text-green border-green/30 bg-green/5", warn: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5", down: "text-red-400 border-red-400/30 bg-red-400/5" } as const;
const OVERALL_LABEL = { ok: "Tudo estável", warn: "Atenção", down: "Incidente" } as const;

export default async function AdminSaudePage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const h = await getPlatformHealth();

  return (
    <div>
      <PageHeader title="Saúde da Plataforma" description="Monitoramento em tempo real dos serviços, capacidade e engajamento — com insights para agir." />

      {/* status geral + vidas */}
      <div className={`mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border p-6 sm:flex-row ${STATUS_COLOR[h.overall]}`}>
        <div className="flex items-center gap-4">
          <span className="text-5xl" style={{ animation: "pulse 2s ease-in-out infinite" }}>{h.overallEmoji}</span>
          <div>
            <p className="text-2xl font-bold">{OVERALL_LABEL[h.overall]}</p>
            <p className="text-sm opacity-80">{h.lives}/{h.totalServices} serviços operacionais</p>
          </div>
        </div>
        {/* corações de vida */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: h.totalServices }).map((_, i) => (
            <Heart key={i} className={`h-7 w-7 ${i < h.lives ? "fill-red-500 text-red-500" : "text-text-secondary/30"}`} style={i < h.lives ? { animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite` } : undefined} />
          ))}
        </div>
      </div>

      {/* serviços */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {h.services.map((s) => (
          <div key={s.name} className={`flex items-center gap-3 rounded-xl border p-4 ${STATUS_COLOR[s.status]}`}>
            <span className="text-3xl">{s.emoji}</span>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{s.name}</p>
              <p className="text-xs opacity-80">{s.detail}</p>
            </div>
            {s.latencyMs != null && (
              <span className="ml-auto text-right text-xs">
                <span className="block font-mono font-bold">{s.latencyMs}ms</span>
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* métricas de negócio */}
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric icon={Users} label="Usuários" value={h.metrics.users.toLocaleString("pt-BR")} />
            <Metric icon={CreditCard} label="Assinantes ativos" value={h.metrics.subscribers} />
            <Metric icon={Zap} label="Em trial" value={h.metrics.trialing} />
          </div>

          {/* capacidade */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 flex items-center gap-2 font-bold"><Database className="h-5 w-5 text-primary-light" /> Capacidade do banco</h2>
            <div className="mb-1 flex justify-between text-xs text-text-secondary"><span>Uso estimado (referência plano free)</span><span>{h.metrics.capacityPct}%</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-surface-2">
              <div className={`h-full rounded-full ${h.metrics.capacityStatus === "warn" ? "bg-yellow-400" : "bg-gradient-to-r from-green to-primary-light"}`} style={{ width: `${Math.max(3, h.metrics.capacityPct)}%`, transition: "width 1s ease" }} />
            </div>
            <p className="mt-2 text-xs text-text-secondary">{h.metrics.capacityPct > 80 ? "Perto do limite — considere o Supabase Pro (mais conexões, backups, escala)." : "Folga confortável. A plataforma suporta o volume atual com tranquilidade."}</p>
          </div>

          {/* engajamento */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><Activity className="h-5 w-5 text-primary-light" /> Engajamento</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Mini icon={Users} label="Ativos (7 dias)" value={h.engagement.activeUsers7d} />
              <Mini icon={Clock} label="Horas estudadas (7d)" value={`${h.engagement.totalHours}h`} />
              <Mini icon={Clock} label="Média por ativo" value={`${h.engagement.avgMinutes} min`} />
              <Mini icon={Zap} label="Praticando (24h)" value={h.engagement.practiceEvents24h} />
            </div>
            <p className="mt-3 text-xs text-text-secondary">{h.engagement.studyEvents24h} sessões de estudo e {h.engagement.practiceEvents24h} exercícios resolvidos nas últimas 24h.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* insights */}
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
            <h2 className="mb-3 flex items-center gap-2 font-bold"><Lightbulb className="h-5 w-5 text-primary-light" /> Insights</h2>
            <div className="space-y-2.5">
              {h.insights.map((i, idx) => (
                <div key={idx} className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-sm text-text-secondary">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" /> {i}
                </div>
              ))}
            </div>
          </div>

          {/* erros recentes */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 flex items-center gap-2 font-bold">🩺 Erros recentes <span className="text-sm font-normal text-text-secondary">· {h.errors.last24h} em 24h</span></h2>
            {h.errors.recent.length === 0 ? (
              <p className="text-sm text-green">Nenhum erro registrado. 🎉</p>
            ) : (
              <div className="space-y-1.5">
                {h.errors.recent.map((e, i) => (
                  <div key={i} className="rounded-lg border border-border bg-surface-2 p-2.5 text-xs">
                    <div className="flex items-center justify-between"><span className="font-mono font-semibold text-red-400">{e.source}</span><span className="text-text-secondary">{new Date(e.created_at).toLocaleString("pt-BR")}</span></div>
                    <p className="mt-0.5 truncate text-text-secondary">{e.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number | string }) {
  return <div className="card flex items-center gap-3 p-4"><Icon className="h-6 w-6 text-primary-light" /><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-text-secondary">{label}</p></div></div>;
}
function Mini({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number | string }) {
  return <div className="rounded-xl border border-border bg-surface-2 p-3"><Icon className="h-4 w-4 text-primary-light" /><p className="mt-1 text-lg font-bold">{value}</p><p className="text-[11px] text-text-secondary">{label}</p></div>;
}
