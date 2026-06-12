import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getActivityDays, streakFromDays } from "@/lib/streak";
import { getProgressMap } from "@/lib/data/queries";

export interface MonthlyStat {
  month: string; // "2026-06"
  label: string; // "jun/26"
  studyHours: number;
  activeDays: number;
  exercises: number;
}

export interface EvolutionReport {
  user: { name: string; email: string; memberSince: string; daysOnPlatform: number };
  activity: { streak: number; longestStreak: number; activeDays: number; studyHours: number; studySessions: number };
  practice: { exercisesCompleted: number; lastActivity: string | null };
  learning: { modulesStarted: number; modulesCompleted: number; avgProgress: number };
  badges: { total: number; names: string[] };
  monthly: MonthlyStat[];
  aiSummary: string;
  generatedAt: string;
}

const MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export async function getEvolutionReport(): Promise<EvolutionReport | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, days, daily, ex, badges, progress] = await Promise.all([
    supabase.from("users_profile").select("name").eq("user_id", user.id).maybeSingle(),
    getActivityDays(supabase, user.id),
    supabase.from("daily_activity").select("day, seconds").eq("user_id", user.id),
    supabase.from("exercise_completions").select("completed_at").eq("user_id", user.id).order("completed_at", { ascending: false }),
    supabase.from("user_badges").select("badge_id").eq("user_id", user.id),
    getProgressMap(),
  ]);

  const dailyRows = daily.data ?? [];
  const studySecs = dailyRows.reduce((s, r) => s + ((r.seconds as number) ?? 0), 0);

  // resumo mês a mês (últimos 6 meses)
  const monthMap = new Map<string, { secs: number; activeDays: number; ex: number }>();
  const bump = (key: string) => monthMap.get(key) ?? { secs: 0, activeDays: 0, ex: 0 };
  for (const r of dailyRows) {
    const key = (r.day as string).slice(0, 7);
    const m = bump(key); m.secs += (r.seconds as number) ?? 0; m.activeDays += 1; monthMap.set(key, m);
  }
  for (const r of ex.data ?? []) {
    const key = new Date(r.completed_at as string).toISOString().slice(0, 7);
    const m = bump(key); m.ex += 1; monthMap.set(key, m);
  }
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth() - i); months.push(d.toISOString().slice(0, 7)); }
  const monthly: MonthlyStat[] = months.map((key) => {
    const m = monthMap.get(key) ?? { secs: 0, activeDays: 0, ex: 0 };
    return { month: key, label: `${MES[Number(key.slice(5, 7)) - 1]}/${key.slice(2, 4)}`, studyHours: Math.round((m.secs / 3600) * 10) / 10, activeDays: m.activeDays, exercises: m.ex };
  });
  const created = new Date(user.created_at);
  const daysOnPlatform = Math.max(1, Math.floor((Date.now() - created.getTime()) / 86400000) + 1);

  // streak mais longo
  const sortedDays = [...days].sort();
  let longest = 0, run = 0; let prev: Date | null = null;
  for (const ds of sortedDays) {
    const d = new Date(ds);
    if (prev && (d.getTime() - prev.getTime()) === 86400000) run++; else run = 1;
    longest = Math.max(longest, run); prev = d;
  }

  const progValues = Object.values(progress).map((p) => (p as { progress_percentage?: number }).progress_percentage ?? 0);
  const started = progValues.filter((v) => v > 0).length;
  const completed = progValues.filter((v) => v >= 100).length;
  const avg = progValues.length ? Math.round(progValues.reduce((s, v) => s + v, 0) / progValues.length) : 0;

  const exList = ex.data ?? [];

  // resumo executivo gerado por IA (com fallback se a IA falhar)
  const last3 = monthly.slice(-3);
  let aiSummary = "";
  try {
    const { chatComplete } = await import("@/lib/ai/openrouter");
    const ctx = `Dias na plataforma: ${daysOnPlatform}. Streak atual: ${streakFromDays(days)} dias. Dias ativos: ${days.size}. Horas de estudo totais: ${Math.round(studySecs / 3600)}. Exercícios concluídos: ${exList.length}. Módulos iniciados: ${started}, concluídos: ${completed}, progresso médio ${avg}%. Conquistas: ${(badges.data ?? []).length}. Últimos 3 meses (estudo h / exercícios): ${last3.map((m) => `${m.label}: ${m.studyHours}h/${m.exercises}ex`).join(", ")}.`;
    const res = await chatComplete(
      [
        { role: "system", content: "Você é um mentor de carreira em Python. Escreva um resumo executivo curto (2-3 frases, em português, tom motivador e direto) da evolução do estudante: destaque um ponto forte e uma recomendação de foco. Sem markdown, sem listas." },
        { role: "user", content: ctx },
      ],
      { maxTokens: 180, temperature: 0.6 },
    );
    aiSummary = res.content?.trim() || "";
  } catch { /* fallback abaixo */ }
  if (!aiSummary) {
    const trend = last3.length >= 2 && last3[last3.length - 1].studyHours >= last3[last3.length - 2].studyHours;
    aiSummary = `Você já são ${daysOnPlatform} dias na PyTrack, com ${exList.length} exercícios concluídos e ${Math.round(studySecs / 3600)}h de estudo. ${trend ? "Seu ritmo está subindo" : "Mantenha a constância"} — foque em concluir os módulos em andamento (progresso médio de ${avg}%).`;
  }

  return {
    user: {
      name: (profile?.name as string) ?? user.email?.split("@")[0] ?? "Estudante",
      email: user.email ?? "",
      memberSince: created.toISOString().slice(0, 10),
      daysOnPlatform,
    },
    activity: {
      streak: streakFromDays(days),
      longestStreak: longest,
      activeDays: days.size,
      studyHours: Math.round((studySecs / 3600) * 10) / 10,
      studySessions: dailyRows.filter((r) => ((r.seconds as number) ?? 0) > 0).length,
    },
    practice: {
      exercisesCompleted: exList.length,
      lastActivity: exList[0]?.completed_at ? new Date(exList[0].completed_at as string).toISOString().slice(0, 10) : null,
    },
    learning: { modulesStarted: started, modulesCompleted: completed, avgProgress: avg },
    badges: { total: (badges.data ?? []).length, names: (badges.data ?? []).map((b) => b.badge_id as string) },
    monthly,
    aiSummary,
    generatedAt: new Date().toISOString(),
  };
}
