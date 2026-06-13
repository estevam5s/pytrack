import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { TRILHAS } from "@/lib/trilhas";

export interface PlatformStats {
  trilhas: number;
  modulos: number;
  exercicios: number;
  projetos: number;
  perguntas: number;
}

async function fetchStats(): Promise<PlatformStats> {
  try {
    const admin = createAdminClient();
    const [contents, exercises, projects, questions] = await Promise.all([
      admin.from("contents").select("id", { count: "exact", head: true }),
      admin.from("practice_exercises").select("id", { count: "exact", head: true }),
      admin.from("projects").select("id", { count: "exact", head: true }),
      admin.from("interview_questions").select("id", { count: "exact", head: true }),
    ]);
    return {
      trilhas: TRILHAS.length,
      modulos: contents.count ?? 99,
      exercicios: exercises.count ?? 10237,
      projetos: projects.count ?? 4178,
      perguntas: questions.count ?? 1719,
    };
  } catch {
    // fallback se o banco falhar — números conhecidos
    return { trilhas: TRILHAS.length, modulos: 99, exercicios: 10237, projetos: 4178, perguntas: 1719 };
  }
}

// cache de 1h — os números mudam pouco e refletem o banco ao vivo
export const getPlatformStats = unstable_cache(fetchStats, ["platform-stats"], {
  revalidate: 3600,
  tags: ["platform-stats"],
});

// formata 5269 -> "5.2k+", 1364 -> "1.3k+", 86 -> "86", 17 -> "17"
export function fmtStat(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k+`;
  if (n >= 100) return `${Math.floor(n / 10) * 10}+`;
  return String(n);
}
