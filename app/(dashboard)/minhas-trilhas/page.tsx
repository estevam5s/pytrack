import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { getContents, getProgressMap } from "@/lib/data/queries";
import { MODULES } from "@/lib/content/registry";
import { TRILHAS, moduleInTrilha } from "@/lib/trilhas";
import { PageHeader } from "@/components/dashboard/page-header";
import { TrilhasView, type TrilhaStat } from "@/components/dashboard/trilhas-view";
import { CareerPlanPanel } from "@/components/trilhas/career-plan-panel";
import { getCareerPlan } from "@/lib/career-plan-actions";

export const metadata = { title: "Trilhas · PyTrack" };
export const dynamic = "force-dynamic";

export default async function TrilhasPage() {
  const user = await getCurrentUser();
  const [tier, contents, progress, careerPlan] = await Promise.all([
    user ? getUserTier(user.id) : Promise.resolve("free" as const),
    getContents(),
    getProgressMap(),
    getCareerPlan(),
  ]);

  const slugProgress = new Map<string, number>();
  for (const c of contents) {
    if (c.slug) slugProgress.set(c.slug, progress[c.id]?.progress_percentage ?? 0);
  }

  const stats: Record<string, TrilhaStat> = {};
  for (const t of TRILHAS) {
    const mods = MODULES.filter((m) => moduleInTrilha(t, m.area, m.slug));
    const lessons = mods.reduce((s, m) => s + m.lessons.length, 0);
    const hours = mods.reduce((s, m) => s + (m.estimatedHours || 0), 0);
    const prog = mods.length
      ? Math.round(
          mods.reduce((s, m) => s + (slugProgress.get(m.slug) ?? 0), 0) /
            mods.length,
        )
      : 0;
    stats[t.id] = {
      modules: mods.length, lessons, hours, progress: prog,
      moduleSlugs: mods.map((m) => ({ slug: m.slug, total: m.lessons.length, serverPct: slugProgress.get(m.slug) ?? 0 })),
    };
  }

  const totals = {
    modules: MODULES.length,
    lessons: MODULES.reduce((s, m) => s + m.lessons.length, 0),
    hours: MODULES.reduce((s, m) => s + (m.estimatedHours || 0), 0),
    areas: new Set(MODULES.map((m) => m.area)).size,
  };

  return (
    <div>
      <PageHeader
        title="Trilhas de aprendizado"
        description="Escolha a trilha que combina com o seu objetivo. Cada trilha é um caminho guiado de módulos no ecossistema Python — do básico ao avançado. Todo o conteúdo da plataforma está aqui."
      />

      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Trilhas", value: TRILHAS.length },
          { label: "Módulos", value: totals.modules },
          { label: "Lições", value: totals.lessons },
          { label: "Áreas", value: totals.areas },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-bold text-gradient">{s.value}</p>
            <p className="text-xs text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      <CareerPlanPanel tier={tier} initial={careerPlan ? { plan: careerPlan.plan ?? "", recommended_tracks: (careerPlan.recommended_tracks as string[]) ?? [] } : null} />

      <TrilhasView stats={stats} userTier={tier} />
    </div>
  );
}
