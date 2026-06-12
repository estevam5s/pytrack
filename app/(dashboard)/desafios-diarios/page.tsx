import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, Flame, Calendar, ArrowRight, CheckCircle2, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActivityStreak } from "@/lib/streak";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Desafios Diários · PyTrack" };
export const dynamic = "force-dynamic";

function dayIndex(offset = 0) {
  return Math.floor(Date.now() / 86400000) - offset;
}

export default async function DesafiosDiariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const tier = await getUserTier(user.id);
  if (!tierAtLeast(tier as never, "essencial" as never)) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary-light"><Lock className="h-8 w-8" /></span>
        <h1 className="text-2xl font-bold">Desafios Diários — plano Essencial</h1>
        <p className="mt-2 text-text-secondary">Um novo desafio de Python todos os dias para manter o ritmo e evoluir com consistência. Disponível a partir do plano <strong className="text-foreground">Essencial</strong> (R$10/mês).</p>
        <Link href="/assinar?upgrade=essencial" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">Assinar Essencial</Link>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: exercises } = await admin.from("practice_exercises").select("ex_id, title, category, level, objective").order("order_index").limit(200);
  const list = exercises ?? [];

  // concluídos do usuário (streak)
  const { data: completed } = await admin.from("exercise_completions").select("ex_id, completed_at").eq("user_id", user.id);
  const doneSet = new Set((completed ?? []).map((c) => c.ex_id as string));

  function challengeFor(offset: number) {
    if (!list.length) return null;
    return list[Math.abs(dayIndex(offset)) % list.length];
  }
  const today = challengeFor(0);

  // streak unificado (exercícios + estudo) — mesma fonte do sidebar/evolução
  const streak = await getActivityStreak(admin, user.id);

  const last7 = Array.from({ length: 7 }, (_, i) => ({ offset: i, ex: challengeFor(i), date: new Date(Date.now() - i * 86400000) }));

  return (
    <div>
      <PageHeader title="Desafios Diários" description="Um novo desafio de Python por dia. Mantenha a constância e construa sua sequência (streak)." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4"><Flame className="h-7 w-7 text-orange-400" /><div><p className="text-2xl font-bold">{streak}</p><p className="text-xs text-text-secondary">dias de sequência</p></div></div>
        <div className="card flex items-center gap-3 p-4"><CheckCircle2 className="h-7 w-7 text-green" /><div><p className="text-2xl font-bold">{doneSet.size}</p><p className="text-xs text-text-secondary">desafios resolvidos</p></div></div>
        <div className="card flex items-center gap-3 p-4"><Calendar className="h-7 w-7 text-primary-light" /><div><p className="text-2xl font-bold">{list.length}</p><p className="text-xs text-text-secondary">desafios no banco</p></div></div>
      </div>

      {/* desafio de hoje */}
      {today && (
        <div className="mb-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-light"><Target className="h-3.5 w-3.5" /> Desafio de hoje</span>
          <h2 className="mt-3 text-xl font-bold">{today.title}</h2>
          <p className="text-xs text-text-secondary">{today.level} · {today.category}</p>
          <p className="mt-2 text-sm text-text-secondary line-clamp-3">{today.objective}</p>
          <Link href={`/exercicios?ex=${today.ex_id}`} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white">
            {doneSet.has(today.ex_id) ? "Revisar" : "Resolver agora"} <ArrowRight className="h-4 w-4" />
          </Link>
          {doneSet.has(today.ex_id) && <span className="ml-3 inline-flex items-center gap-1 text-sm text-green"><CheckCircle2 className="h-4 w-4" /> Concluído hoje!</span>}
        </div>
      )}

      {/* últimos 7 dias */}
      <p className="mb-2 text-sm font-semibold">Últimos 7 dias</p>
      <div className="space-y-2">
        {last7.map(({ offset, ex, date }) => ex && (
          <div key={offset} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
            <span className="w-12 shrink-0 text-center text-xs text-text-secondary">{offset === 0 ? "Hoje" : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{ex.title}</p><p className="text-xs text-text-secondary">{ex.level} · {ex.category}</p></div>
            {doneSet.has(ex.ex_id) ? <CheckCircle2 className="h-5 w-5 shrink-0 text-green" /> : <Link href={`/exercicios?ex=${ex.ex_id}`} className="shrink-0 text-xs text-primary-light hover:underline">resolver</Link>}
          </div>
        ))}
      </div>
    </div>
  );
}
