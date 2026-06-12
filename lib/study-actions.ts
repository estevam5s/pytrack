"use server";

import { createClient } from "@/lib/supabase/server";

async function uid() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

// Registra tempo de estudo (segundos) num conteúdo + atualiza a atividade do dia.
export async function recordStudyTime(input: { slug: string; title?: string; area?: string; seconds: number; lesson?: boolean }) {
  const { supabase, user } = await uid();
  if (!user || input.seconds <= 0 || input.seconds > 1800) return { ok: false };
  // sessão
  await supabase.from("study_sessions").insert({
    user_id: user.id, content_slug: input.slug, content_title: input.title ?? null, area: input.area ?? null, seconds: Math.round(input.seconds),
  });
  // atividade diária (acumula)
  const today = new Date().toISOString().slice(0, 10);
  const { data: existing } = await supabase.from("daily_activity").select("seconds, lessons").eq("user_id", user.id).eq("day", today).maybeSingle();
  await supabase.from("daily_activity").upsert({
    user_id: user.id, day: today,
    seconds: ((existing?.seconds as number) ?? 0) + Math.round(input.seconds),
    lessons: ((existing?.lessons as number) ?? 0) + (input.lesson ? 1 : 0),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,day" });
  return { ok: true };
}

export async function saveNote(input: { slug: string; title?: string; area?: string; body: string }) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase.from("module_notes").upsert({
    user_id: user.id, content_slug: input.slug, content_title: input.title ?? null, area: input.area ?? null,
    body: input.body.slice(0, 20000), updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,content_slug" });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function getNote(slug: string): Promise<string> {
  const { supabase, user } = await uid();
  if (!user) return "";
  const { data } = await supabase.from("module_notes").select("body").eq("user_id", user.id).eq("content_slug", slug).maybeSingle();
  return (data?.body as string) ?? "";
}

// info de streak + dias na plataforma (a partir de daily_activity + created_at)
export async function getStreakInfo(): Promise<{ current: number; longest: number; daysOnPlatform: number; activeDays: number }> {
  const { supabase, user } = await uid();
  if (!user) return { current: 0, longest: 0, daysOnPlatform: 0, activeDays: 0 };
  const { data } = await supabase.from("daily_activity").select("day").eq("user_id", user.id).order("day", { ascending: false }).limit(400);
  const days = new Set((data ?? []).map((d) => d.day as string));
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  // streak atual (conta a partir de hoje ou ontem)
  let current = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    if (days.has(fmt(d))) current++;
    else if (i > 0) break; // hoje pode não ter atividade ainda
  }
  // maior streak
  const sorted = [...days].sort();
  let longest = 0, run = 0; let prev: Date | null = null;
  for (const ds of sorted) {
    const d = new Date(ds);
    if (prev && (d.getTime() - prev.getTime()) === 86400000) run++; else run = 1;
    longest = Math.max(longest, run); prev = d;
  }
  const created = new Date(user.created_at);
  const daysOnPlatform = Math.max(1, Math.floor((today.getTime() - created.getTime()) / 86400000) + 1);
  return { current, longest, daysOnPlatform, activeDays: days.size };
}
