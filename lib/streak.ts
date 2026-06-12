import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Streak unificado: dias consecutivos com QUALQUER atividade
// (exercícios concluídos OU tempo de estudo). Fonte única para sidebar,
// desafios diários, badges e evolução — assim os números sempre batem.
export async function getActivityDays(supabase: SupabaseClient, userId: string): Promise<Set<string>> {
  const [ex, da] = await Promise.all([
    supabase.from("exercise_completions").select("completed_at").eq("user_id", userId),
    supabase.from("daily_activity").select("day").eq("user_id", userId),
  ]);
  const days = new Set<string>();
  for (const r of ex.data ?? []) {
    const d = r.completed_at as string | null;
    if (d) days.add(new Date(d).toISOString().slice(0, 10));
  }
  for (const r of da.data ?? []) {
    const d = r.day as string | null;
    if (d) days.add(d.slice(0, 10));
  }
  return days;
}

export function streakFromDays(days: Set<string>): number {
  let streak = 0;
  const t = new Date();
  for (let i = 0; i < 400; i++) {
    const d = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() - i));
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else if (i > 0) break; // hoje pode ainda não ter atividade
  }
  return streak;
}

export async function getActivityStreak(supabase: SupabaseClient, userId: string): Promise<number> {
  return streakFromDays(await getActivityDays(supabase, userId));
}
