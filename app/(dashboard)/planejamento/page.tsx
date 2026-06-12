import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { PageHeader } from "@/components/dashboard/page-header";
import { PlanningHub } from "@/components/planning/planning-hub";

export const metadata = { title: "Planejamento · PyTrack" };
export const dynamic = "force-dynamic";

export default async function PlanejamentoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const tier = await getUserTier(user.id);
  if (!tierAtLeast(tier as never, "completo" as never)) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary-light"><Lock className="h-8 w-8" /></span>
        <h1 className="text-2xl font-bold">Planejamento — plano Completo</h1>
        <p className="mt-2 text-text-secondary">Plano de Estudos com IA, planejamento semanal de Python, guia de carreira e planejamento financeiro. Disponível a partir do plano <strong className="text-foreground">Completo</strong> (R$19/mês).</p>
        <Link href="/assinar?upgrade=completo" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">Assinar Completo</Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Planejamento" description="Plano de estudos com IA, planejamento semanal, guia de carreira e planejamento financeiro — tudo personalizado para você." />
      <PlanningHub />
    </div>
  );
}
