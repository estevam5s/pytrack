import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { userHasAccess } from "@/lib/stripe/subscriptions";
import { STRIPE_TRIAL_DAYS } from "@/lib/stripe/server";
import { PlanSelector } from "@/components/billing/PlanSelector";

export const metadata = { title: "Assinar · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AssinarPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; upgrade?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const access = await userHasAccess(user.id);
  const { checkout, upgrade } = await searchParams;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />

      <header className="container relative flex h-[77px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="PyTrack" width={36} height={36} className="h-9 w-9 rounded-lg object-contain" />
          <span className="text-lg font-bold">PyTrack</span>
        </Link>
        {access && (
          <Link href="/inicio" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-light hover:underline">
            Ir para o dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </header>

      <main className="container relative py-10 lg:py-14">
        <div className="mx-auto max-w-2xl text-center">
          {checkout === "cancelled" && (
            <div className="mb-5 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2.5 text-sm text-warning">
              Pagamento cancelado. Você pode tentar novamente quando quiser.
            </div>
          )}
          {upgrade === "completo" && (
            <div className="mb-5 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm text-primary-light">
              Esse recurso faz parte do plano <strong>Completo</strong>. Faça upgrade para desbloquear.
            </div>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
            <Sparkles className="h-3.5 w-3.5" /> Escolha seu plano
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Desbloqueie o <span className="text-gradient">ecossistema Python</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-text-secondary">
            Comece com {STRIPE_TRIAL_DAYS} dias grátis. Aprenda Python a fundo no
            Essencial ou tenha a plataforma inteira no Completo. Cancele quando quiser.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <PlanSelector trialDays={STRIPE_TRIAL_DAYS} />
        </div>

        {access && (
          <p className="mt-8 text-center text-sm text-text-secondary">
            Você já tem um plano ativo.{" "}
            <Link href="/configuracoes/plano" className="text-primary-light hover:underline">
              Gerenciar assinatura
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
