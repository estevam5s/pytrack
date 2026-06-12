"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarClock,
  Check,
  Loader2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TIER_LABEL, TIER_RANK, type Tier } from "@/lib/billing-access";
import { cn } from "@/lib/utils";

// planos recorrentes mensais e seus valores de exibição (R$/mês)
const PLANS: { tier: Tier; plan: string; priceLabel: string }[] = [
  { tier: "essencial", plan: "essencial_monthly", priceLabel: "R$ 10/mês" },
  { tier: "completo", plan: "completo_monthly", priceLabel: "R$ 19/mês" },
  { tier: "suprema", plan: "suprema_monthly", priceLabel: "R$ 46/mês" },
];

const PERKS: Record<Tier, string> = {
  free: "Acesso básico",
  essencial: "Trilhas, desafios diários, debug e exercícios",
  completo: "Tudo do Essencial + comunidade, carreira IA e projetos",
  suprema: "Tudo do Completo + Construa SaaS e boilerplate com IA",
  vitalicio: "Acesso vitalício a tudo",
};

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function fmtMoney(cents?: number | null) {
  if (typeof cents !== "number") return null;
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface Preview {
  kind: "upgrade" | "downgrade";
  chargedNowCents?: number | null;
  effectiveAt?: string | null;
}

export function PlanChangePanel({
  currentTier,
  pendingTier,
  pendingEffectiveAt,
  periodEnd,
}: {
  currentTier: Tier;
  pendingTier?: Tier | null;
  pendingEffectiveAt?: string | null;
  periodEnd?: string | null;
}) {
  const router = useRouter();
  const [target, setTarget] = useState<(typeof PLANS)[number] | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openChange = async (p: (typeof PLANS)[number]) => {
    setTarget(p);
    setPreview(null);
    setError(null);
    setLoadingPreview(true);
    try {
      const res = await fetch("/api/stripe/change-plan/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: p.plan }),
      });
      const data = await res.json();
      if (res.ok) setPreview(data as Preview);
    } catch {
      /* prévia é opcional */
    } finally {
      setLoadingPreview(false);
    }
  };

  const confirm = async () => {
    if (!target) return;
    setConfirming(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: target.plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Não foi possível trocar.");
      setTarget(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setConfirming(false);
    }
  };

  const cancelScheduled = async () => {
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/change-plan/cancel", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Não foi possível cancelar.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setCancelling(false);
    }
  };

  const isDowngrade = target ? TIER_RANK[target.tier] < TIER_RANK[currentTier] : false;

  return (
    <div className="space-y-4">
      {/* mudança agendada (downgrade no fim do período) */}
      {pendingTier && (
        <div className="flex flex-col gap-3 rounded-xl border border-blue/30 bg-blue/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">
                Troca agendada para {TIER_LABEL[pendingTier]}
              </p>
              <p className="mt-0.5 text-text-secondary">
                Você mantém o plano <strong>{TIER_LABEL[currentTier]}</strong> até{" "}
                <strong>{fmtDate(pendingEffectiveAt ?? periodEnd)}</strong>. A
                partir daí, a cobrança passa a ser do plano{" "}
                {TIER_LABEL[pendingTier]} — nada é cobrado agora.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={cancelScheduled}
            disabled={cancelling}
            className="shrink-0"
          >
            {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Manter {TIER_LABEL[currentTier]}
          </Button>
        </div>
      )}

      {/* grade de planos */}
      <div className="grid gap-3 sm:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = p.tier === currentTier;
          const dir = TIER_RANK[p.tier] > TIER_RANK[currentTier] ? "up" : "down";
          return (
            <div
              key={p.tier}
              className={cn(
                "flex flex-col rounded-xl border p-4 transition-colors",
                isCurrent
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-surface",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{TIER_LABEL[p.tier]}</p>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary-light">
                    <Check className="h-3 w-3" /> Atual
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-text-secondary">{p.priceLabel}</p>
              <p className="mt-2 flex-1 text-xs text-text-secondary">
                {PERKS[p.tier]}
              </p>
              {!isCurrent && (
                <Button
                  variant={dir === "up" ? "default" : "outline"}
                  size="sm"
                  className="mt-3"
                  onClick={() => openChange(p)}
                >
                  {dir === "up" ? (
                    <ArrowUpCircle className="h-4 w-4" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4" />
                  )}
                  {dir === "up" ? "Fazer upgrade" : "Mudar para este"}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-text-secondary">
        <strong>Como o cálculo funciona:</strong> no upgrade, você paga só a
        diferença proporcional aos dias restantes do mês e o acesso é liberado na
        hora. No downgrade, você continua no plano atual até o fim do período já
        pago e a próxima fatura já vem com o valor do plano novo — sem cobrança
        agora.
      </p>

      {/* diálogo de confirmação com a prévia do cálculo */}
      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isDowngrade ? "Mudar para" : "Fazer upgrade para"}{" "}
              {target ? TIER_LABEL[target.tier] : ""}
            </DialogTitle>
            <DialogDescription>
              {target ? PERKS[target.tier] : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-surface-2 p-4 text-sm">
            {loadingPreview ? (
              <p className="flex items-center gap-2 text-text-secondary">
                <Loader2 className="h-4 w-4 animate-spin" /> Calculando…
              </p>
            ) : preview?.kind === "upgrade" ? (
              <div className="space-y-1.5">
                <p className="flex items-center justify-between">
                  <span className="text-text-secondary">Cobrança agora</span>
                  <span className="font-semibold text-foreground">
                    {fmtMoney(preview.chargedNowCents) ?? "valor proporcional"}
                  </span>
                </p>
                <p className="text-xs text-text-secondary">
                  Diferença proporcional aos dias restantes. O acesso ao plano{" "}
                  {target ? TIER_LABEL[target.tier] : ""} é liberado
                  imediatamente.
                </p>
              </div>
            ) : preview?.kind === "downgrade" ? (
              <div className="space-y-1.5">
                <p className="flex items-center justify-between">
                  <span className="text-text-secondary">Passa a valer em</span>
                  <span className="font-semibold text-foreground">
                    {fmtDate(preview.effectiveAt ?? periodEnd)}
                  </span>
                </p>
                <p className="text-xs text-text-secondary">
                  Você continua com o plano {TIER_LABEL[currentTier]} até lá. Nada
                  é cobrado agora; a próxima fatura já será do plano{" "}
                  {target ? TIER_LABEL[target.tier] : ""}.
                </p>
              </div>
            ) : (
              <p className="text-text-secondary">
                Confirme para aplicar a troca de plano.
              </p>
            )}
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-sm text-danger">
              <X className="h-4 w-4" /> {error}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setTarget(null)}>
              Cancelar
            </Button>
            <Button onClick={confirm} disabled={confirming || loadingPreview}>
              {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isDowngrade ? "Confirmar troca" : "Confirmar upgrade"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
