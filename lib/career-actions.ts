"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addCareerEntry(kind: string, title: string, description: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  if (!title.trim()) return { error: "Informe um título." };
  const { error } = await supabase.from("career_entries").insert({ user_id: user.id, kind, title: title.trim(), description: description.trim() || null });
  if (error) return { error: error.message };
  revalidatePath("/plano-carreira");
  return { ok: true };
}

export async function deleteCareerEntry(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  await supabase.from("career_entries").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/plano-carreira");
  return { ok: true };
}

// check-in semanal com feedback de IA
export async function weeklyCheckin(reflection: string): Promise<{ feedback?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  if (!reflection.trim()) return { error: "Escreva sua reflexão da semana." };
  const { chatComplete } = await import("@/lib/ai/openrouter");
  const res = await chatComplete([
    { role: "system", content: "Você é um coach de carreira de tecnologia. Dê um feedback curto, prático e motivador (pt-BR) sobre a semana do dev, com 2-3 ações concretas para a próxima semana." },
    { role: "user", content: `Minha reflexão da semana: ${reflection}` },
  ], { temperature: 0.6, maxTokens: 600 });
  if (res.error || !res.content) return { error: res.error || "IA indisponível." };
  // salva como entrada
  await supabase.from("career_entries").insert({ user_id: user.id, kind: "checkin", title: "Check-in semanal", description: reflection.trim().slice(0, 500) });
  revalidatePath("/plano-carreira");
  return { feedback: res.content };
}
