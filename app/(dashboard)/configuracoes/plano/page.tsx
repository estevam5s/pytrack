import Link from "next/link";
import { CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  getUserSubscription,
  getStripeCustomerId,
  getUserTier,
  hasDashboardAccess,
} from "@/lib/stripe/subscriptions";
import { billingEnabled } from "@/lib/stripe/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionStatusCard } from "@/components/billing/SubscriptionStatusCard";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { SubscribeButton } from "@/components/billing/SubscribeButton";

export const metadata = { title: "Plano · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function PlanoPage() {
  const user = await getCurrentUser();
  const subscription = user ? await getUserSubscription(user.id) : null;
  const customerId = user ? await getStripeCustomerId(user.id) : null;
  const tier = user ? await getUserTier(user.id) : "free";
  const active = hasDashboardAccess(subscription);

  return (
    <div className="space-y-6">
      <SubscriptionStatusCard subscription={subscription} tier={tier} />

      {/* upgrade (quem ainda não está no plano máximo) */}
      {active && tier !== "suprema" && billingEnabled && (
        <Card className="border-primary/30">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="h-4 w-4 text-primary-light" />
                {tier === "essencial"
                  ? "Desbloqueie mais com o Completo ou Suprema"
                  : "Vá além com o plano Suprema"}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {tier === "essencial"
                  ? "Comunidade, projetos, especializações, consultor IA e mais."
                  : "Trilha Suprema Python Mastery (120+ módulos) + projeto final SaaS."}{" "}
                A diferença é cobrada proporcionalmente.
              </p>
            </div>
            <Button asChild>
              <Link href="/assinar">Ver planos</Link>
            </Button>
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
                Assine novamente por R$10/mês e recupere o acesso completo.
              </p>
              <div className="mt-3 max-w-xs">
                <SubscribeButton label="Assinar novamente" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
