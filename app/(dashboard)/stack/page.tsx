import { Layers } from "lucide-react";
import { getStackItems } from "@/lib/data/queries";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { StackExplorer } from "@/components/dashboard/stack-explorer";
import { EmptyState } from "@/components/ui/states";

export const metadata = { title: "Stack · PyTrack" };
export const dynamic = "force-dynamic";

export default async function StackPage() {
  const items = await getStackItems();

  // progresso real do usuário (XP, nível, módulos concluídos por área)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let xp = 0;
  let level = "basico";
  const areaProgress: Record<string, { done: number; total: number }> = {};

  if (user) {
    const [{ data: prof }, { data: contents }, { data: progress }] = await Promise.all([
      supabase.from("users_profile").select("xp, current_level").eq("user_id", user.id).maybeSingle(),
      supabase.from("contents").select("id, area"),
      supabase.from("progress").select("content_id, completed").eq("user_id", user.id).eq("completed", true),
    ]);
    xp = (prof?.xp as number) ?? 0;
    level = (prof?.current_level as string) ?? "basico";
    const doneIds = new Set((progress ?? []).map((p) => p.content_id as string));
    for (const c of contents ?? []) {
      const area = (c.area as string) ?? "Geral";
      if (!areaProgress[area]) areaProgress[area] = { done: 0, total: 0 };
      areaProgress[area].total += 1;
      if (doneIds.has(c.id as string)) areaProgress[area].done += 1;
    }
  }

  return (
    <div>
      <PageHeader
        title="Stack do Python"
        description="Explore as tecnologias do ecossistema por categoria: onde cada stack é usada, o que estudar antes, ferramentas, tecnologias relacionadas e quanto falta para você dominar — com seu progresso em tempo real."
      />

      {items.length === 0 ? (
        <EmptyState title="Nenhuma tecnologia cadastrada" />
      ) : (
        <StackExplorer items={items} userXp={xp} userLevel={level} areaProgress={areaProgress} loggedIn={!!user} />
      )}
    </div>
  );
}
