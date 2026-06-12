import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { PageHeader } from "@/components/dashboard/page-header";
import { CareerHub } from "@/components/career/career-hub";

export const metadata = { title: "Plano de Carreira · PyTrack" };
export const dynamic = "force-dynamic";

export default async function PlanoCarreiraPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const tier = await getUserTier(user.id);
  if (!tierAtLeast(tier as never, "completo" as never)) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary-light"><Lock className="h-8 w-8" /></span>
        <h1 className="text-2xl font-bold">Plano de Carreira — plano Completo</h1>
        <p className="mt-2 text-text-secondary">Coach de carreira com IA e tracker de evolução profissional: check-ins semanais, conquistas, feedbacks e marcos. Disponível a partir do plano <strong className="text-foreground">Completo</strong> (R$19/mês).</p>
        <Link href="/assinar?upgrade=completo" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">Assinar Completo</Link>
      </div>
    );
  }

  const { data: entries } = await supabase.from("career_entries").select("id, kind, title, description, entry_date").eq("user_id", user.id).order("entry_date", { ascending: false }).limit(100);

  return (
    <div>
      <PageHeader title="Plano de Carreira" description="Coach de carreira com IA e tracker de evolução profissional." />
      <CareerHub entries={(entries ?? []) as never} />
    </div>
  );
}
