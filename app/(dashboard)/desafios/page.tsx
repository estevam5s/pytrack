import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChallengesExplorer } from "@/components/challenges/challenges-explorer";
import { XpRanking } from "@/components/shared/xp-ranking";
import { getSolvedIds, getSolvedRanking } from "@/lib/solved-actions";
import { getAllChallenges } from "@/lib/challenges-data";

export const metadata = { title: "Desafios · PyTrack" };
export const dynamic = "force-dynamic";

export default async function DesafiosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const total = getAllChallenges().length;
  const tier = await getUserTier(user.id);
  if (!tierAtLeast(tier as never, "essencial" as never)) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary-light"><Lock className="h-8 w-8" /></span>
        <h1 className="text-2xl font-bold">Desafios (plano Essencial)</h1>
        <p className="mt-2 text-text-secondary">{total.toLocaleString("pt-BR")}+ desafios de Python, do básico ao especialista, em todo o ecossistema. Disponível a partir do plano <strong className="text-foreground">Essencial</strong> (R$10/mês).</p>
        <Link href="/assinar?upgrade=essencial" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">Assinar Essencial</Link>
      </div>
    );
  }

  const topics = [...new Set(getAllChallenges().map((c) => c.topic))].sort();
  const [solvedIds, ranking] = await Promise.all([getSolvedIds("challenge"), getSolvedRanking("challenge")]);

  return (
    <div>
      <PageHeader title="Desafios" description={`${total.toLocaleString("pt-BR")} desafios de Python para dominar lógica e o ecossistema — do básico ao especialista.`} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0"><ChallengesExplorer solvedIds={Array.from(solvedIds)} topics={topics} /></div>
        <aside className="hidden xl:block"><div className="xl:sticky xl:top-20"><XpRanking title="Ranking de Desafios" entries={ranking} unit="desafios" /></div></aside>
      </div>
    </div>
  );
}
