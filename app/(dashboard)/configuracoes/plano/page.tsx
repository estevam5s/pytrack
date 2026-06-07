import Link from "next/link";
import { CreditCard, Sparkles, ArrowDownCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  getUserSubscription,
  getStripeCustomerId,
  getUserTier,
  hasDashboardAccess,
} from "@/lib/stripe/subscriptions";
import { billingEnabled } from "@/lib/stripe/server";
import { TIER_LABEL, TIER_RANK, type Tier } from "@/lib/billing-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionStatusCard } from "@/components/billing/SubscriptionStatusCard";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { RefundButton } from "@/components/billing/RefundButton";

export const metadata = { title: "Plano · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

const RECURRING_TIERS: Tier[] = ["essencial", "completo", "suprema"];

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
  const isRecurring = !!recurringId && !isLifetime;

  // planos abaixo do atual (downgrade) — só para assinaturas recorrentes
  const lowerTiers = isRecurring
    ? RECURRING_TIERS.filter((t) => TIER_RANK[t] < TIER_RANK[tier])
    : [];

  return (
    <div className="space-y-6">
      <SubscriptionStatusCard subscription={subscription} tier={tier} />

      {/* upgrade (quem ainda não está no topo) */}
      {active && tier !== "vitalicio" && billingEnabled && (
        <Card className="border-primary/30">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="h-4 w-4 text-primary-light" /> Quer mais? Faça upgrade
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Suba para um plano maior (até o Vitalício) e desbloqueie mais
                trilhas e recursos. A diferença é cobrada proporcionalmente.
              </p>
            </div>
            <Button asChild>
              <Link href="/assinar">Ver planos</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* downgrade — voltar para um plano menor */}
      {lowerTiers.length > 0 && billingEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-text-secondary" /> Mudar para um plano menor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-text-secondary">
              Você pode voltar para um plano anterior quando quiser. O ajuste de
              valor é proporcional (você recebe crédito da diferença).
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {lowerTiers.map((t) => (
                <div key={t} className="sm:max-w-[240px]">
                  <SubscribeButton
                    plan={`${t}_monthly`}
                    label={`Mudar para ${TIER_LABEL[t]}`}
                    className="!from-surface-2 !to-surface-2 !text-foreground !shadow-none ring-1 ring-border hover:!opacity-80"
                  />
                </div>
              ))}
            </div>
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
        <Card className="border-green/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green" /> Garantia de 7 dias — reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-text-secondary">
              Não ficou satisfeito? Dentro de <strong>7 dias</strong> da compra você
              recebe <strong>100% do dinheiro de volta</strong> — o reembolso é
              processado na hora e seu acesso premium é encerrado.
            </p>
            <RefundButton />
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
