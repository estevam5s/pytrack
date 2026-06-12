import Link from "next/link";
import { CreditCard, Sparkles, RefreshCw, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  getUserSubscription,
  getStripeCustomerId,
  getUserTier,
  hasDashboardAccess,
} from "@/lib/stripe/subscriptions";
import { billingEnabled } from "@/lib/stripe/server";
import { type Tier } from "@/lib/billing-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionStatusCard } from "@/components/billing/SubscriptionStatusCard";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { RefundButton } from "@/components/billing/RefundButton";
import { PlanChangePanel } from "@/components/billing/PlanChangePanel";

export const metadata = { title: "Plano · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function PlanoPage() {
  const user = await getCurrentUser();
  const subscription = user ? await getUserSubscription(user.id) : null;
  const customerId = user ? await getStripeCustomerId(user.id) : null;
  const tier = user ? await getUserTier(user.id) : "free";
  const active = hasDashboardAccess(subscription);

  const meta =
    ((subscription as unknown as { metadata?: Record<string, unknown> } | null)
      ?.metadata) ?? {};
  const isCourtesy = !!meta.comp && !meta.lifetime;
  const isLifetime = !!meta.lifetime || tier === "vitalicio";
  const recurringId = (subscription as unknown as { stripe_subscription_id?: string } | null)
    ?.stripe_subscription_id;
  const isRecurring = !!recurringId && !isLifetime && active;

  // troca de plano agendada (downgrade aplicado no fim do período)
  const pendingTier = (subscription?.pending_tier as Tier | null) ?? null;
  const pendingEffectiveAt = subscription?.pending_effective_at ?? null;

  // janela de reembolso (7 dias a partir da compra) — fonte: created_at da assinatura
  const REFUND_WINDOW_DAYS = 7;
  const purchaseDate = (subscription as unknown as { created_at?: string } | null)?.created_at;
  const daysSincePurchase = purchaseDate
    ? Math.floor((Date.now() - new Date(purchaseDate).getTime()) / 86400000)
    : 0;
  const refundOpen = daysSincePurchase <= REFUND_WINDOW_DAYS;
  const daysLeft = Math.max(0, REFUND_WINDOW_DAYS - daysSincePurchase);

  return (
    <div className="space-y-6">
      <SubscriptionStatusCard subscription={subscription} tier={tier} />

      {/* troca de plano (upgrade imediato / downgrade agendado) — assinaturas recorrentes */}
      {isRecurring && billingEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" /> Trocar de plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlanChangePanel
              currentTier={tier}
              pendingTier={pendingTier}
              pendingEffectiveAt={pendingEffectiveAt}
              periodEnd={subscription?.current_period_end ?? null}
            />
          </CardContent>
        </Card>
      )}

      {/* upgrade para Vitalício (pagamento único) — fora da grade recorrente */}
      {active && tier !== "vitalicio" && billingEnabled && (
        <Card className="border-primary/30">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="h-4 w-4 text-primary-light" /> Acesso vitalício
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Pague uma vez e tenha acesso para sempre, sem mensalidade. Veja a
                condição na página de planos.
              </p>
            </div>
            <SubscribeButton
              plan="vitalicio"
              label="Ver Vitalício"
              className="sm:max-w-[200px]"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" /> Gerenciar pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!billingEnabled && (
            <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
              Os pagamentos ainda não foram configurados pelo administrador. O
              acesso está liberado por enquanto.
            </p>
          )}

          {customerId ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text-secondary">
                Altere a forma de pagamento, baixe recibos ou cancele a
                assinatura pelo portal seguro da Stripe.
              </p>
              <ManageSubscriptionButton />
            </div>
          ) : (
            <p className="text-sm text-text-secondary">
              Você ainda não possui um histórico de pagamento.
            </p>
          )}

          {!active && billingEnabled && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-primary-light">
                <Sparkles className="h-4 w-4" /> Reative seu acesso
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Assine novamente e recupere o acesso completo.
              </p>
              <div className="mt-3 max-w-xs">
                <SubscribeButton label="Assinar novamente" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* reembolso — garantia de 7 dias */}
      {active && billingEnabled && !isCourtesy && (isRecurring || isLifetime) && (
        <Card className={refundOpen ? "border-green/30" : "border-border"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className={`h-4 w-4 ${refundOpen ? "text-green" : "text-text-secondary"}`} /> Garantia de 7 dias — reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {refundOpen ? (
              <>
                <p className="text-sm text-text-secondary">
                  Não ficou satisfeito? Você ainda tem{" "}
                  <strong className="text-green">
                    {daysLeft === 0 ? "menos de 1 dia" : `${daysLeft} ${daysLeft === 1 ? "dia" : "dias"}`}
                  </strong>{" "}
                  para solicitar <strong>100% do dinheiro de volta</strong>. O reembolso
                  é processado na hora e seu acesso premium é encerrado.
                </p>
                <RefundButton />
              </>
            ) : (
              <p className="text-sm text-text-secondary">
                O prazo de <strong>7 dias</strong> para reembolso já passou (compra há{" "}
                {daysSincePurchase} dias). Não é mais possível solicitar reembolso desta compra.
                Você pode cancelar a renovação a qualquer momento acima.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-text-secondary">
        Dúvidas sobre cobrança?{" "}
        <Link href="/configuracoes/sobre" className="text-primary hover:underline">
          Saiba mais
        </Link>
        .
      </p>
    </div>
  );
}
