import { AlertCircle, CalendarClock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SubscriptionRow } from "@/lib/stripe/subscriptions";
import { hasDashboardAccess } from "@/lib/stripe/subscriptions";
import { TIER_LABEL, type Tier } from "@/lib/billing-access";

const STATUS_PT: Record<string, string> = {
  active: "Ativa",
  trialing: "Período de teste",
  past_due: "Pagamento atrasado",
  canceled: "Cancelada",
  unpaid: "Não paga",
  incomplete: "Incompleta",
  incomplete_expired: "Expirada",
  paused: "Pausada",
};

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function SubscriptionStatusCard({
  subscription,
  tier = "free",
}: {
  subscription: SubscriptionRow | null;
  tier?: Tier;
}) {
  const active = hasDashboardAccess(subscription);
  const isActiveStatus =
    subscription?.status === "active" || subscription?.status === "trialing";

  return (
    <Card className={cn(active ? "border-secondary/30" : "border-border")}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Plano atual
            </p>
            <p className="mt-1 text-lg font-bold">
              {subscription ? `PyTrack ${TIER_LABEL[tier]}` : "Sem assinatura"}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
              active
                ? "border-secondary/30 bg-secondary/10 text-secondary"
                : "border-danger/30 bg-danger/10 text-danger",
            )}
          >
            {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {subscription ? STATUS_PT[subscription.status] ?? subscription.status : "Inativo"}
          </span>
        </div>

        {subscription && (
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="inline-flex items-center gap-2 text-text-secondary">
                <CalendarClock className="h-4 w-4" />
                {subscription.cancel_at_period_end ? "Acesso até" : "Renova em"}
              </span>
              <span className="font-medium">{fmt(subscription.current_period_end)}</span>
            </div>

            {subscription.cancel_at_period_end && isActiveStatus && (
              <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Sua assinatura foi cancelada e não será renovada. Você mantém o
                acesso até {fmt(subscription.current_period_end)}.
              </div>
            )}

            {!active && (
              <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Sua assinatura não está ativa. Assine novamente para recuperar o
                acesso ao dashboard.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
