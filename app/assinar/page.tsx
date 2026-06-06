import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { userHasAccess } from "@/lib/stripe/subscriptions";
import { STRIPE_TRIAL_DAYS } from "@/lib/stripe/server";
import { PricingCard } from "@/components/billing/PricingCard";

export const metadata = { title: "Assinar · PyTrack" };
export const dynamic = "force-dynamic";

const HIGHLIGHTS = [
  "Acesso completo ao dashboard",
  "Conteúdos, trilhas e exercícios com IA",
  "IDE Python, projetos e comunidade",
  "Materiais, livros, aulas e carreira",
];

export default async function AssinarPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const access = await userHasAccess(user.id);
  const { checkout } = await searchParams;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />

      <header className="container relative flex h-[77px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="PyTrack" width={36} height={36} className="h-9 w-9 rounded-lg object-contain" />
          <span className="text-lg font-bold">PyTrack</span>
        </Link>
      </header>

      <main className="container relative grid items-center gap-12 py-10 lg:grid-cols-2 lg:py-16">
        <div>
          {checkout === "cancelled" && (
            <div className="mb-5 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2.5 text-sm text-warning">
              Pagamento cancelado. Você pode tentar novamente quando quiser.
            </div>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
            <Sparkles className="h-3.5 w-3.5" /> Assinatura mensal
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Desbloqueie todo o{" "}
            <span className="text-gradient">ecossistema Python</span>
          </h1>
          <p className="mt-4 max-w-md text-text-secondary">
            Por apenas R$10/mês você libera o dashboard completo e evolui do
            básico à carreira profissional. Cancele quando quiser.
          </p>

          <ul className="mt-7 space-y-3">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green" />
                <span className="text-text-secondary">{h}</span>
              </li>
            ))}
          </ul>

          {access && (
            <div className="mt-7 rounded-xl border border-secondary/30 bg-secondary/10 p-4">
              <p className="text-sm font-medium text-secondary">
                Você já tem acesso ativo. 🎉
              </p>
              <Link
                href="/inicio"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-light hover:underline"
              >
                Ir para o dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        <div>
          <PricingCard trialDays={STRIPE_TRIAL_DAYS} />
        </div>
      </main>
    </div>
  );
}
