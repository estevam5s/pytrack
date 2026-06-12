"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function solveItem(kind: "bug" | "challenge", itemId: string, xp: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase.from("user_solved").upsert(
    { user_id: user.id, kind, item_id: itemId, xp },
    { onConflict: "user_id,kind,item_id" },
  );
  if (error) return { error: error.message };
  try { await supabase.rpc("community_add_xp", { uid: user.id, amount: xp }); } catch { /* opcional */ }
  revalidatePath(kind === "bug" ? "/debug" : "/desafios");
  return { ok: true };
}

export async function getSolvedIds(kind: "bug" | "challenge"): Promise<Set<string>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase.from("user_solved").select("item_id").eq("user_id", user.id).eq("kind", kind);
  return new Set((data ?? []).map((r) => r.item_id as string));
}

export async function getSolvedRanking(kind: "bug" | "challenge", limit = 12) {
  const admin = createAdminClient();
  const { data } = await admin.from("user_solved").select("user_id, xp").eq("kind", kind);
  if (!data?.length) return [];
  const agg = new Map<string, { xp: number; count: number }>();
  for (const r of data) {
    const a = agg.get(r.user_id as string) ?? { xp: 0, count: 0 };
    a.xp += (r.xp as number) ?? 0; a.count += 1;
    agg.set(r.user_id as string, a);
  }
  const top = [...agg.entries()].sort((a, b) => b[1].xp - a[1].xp).slice(0, limit);
  const ids = top.map(([id]) => id);
  const { data: profs } = await admin.from("users_profile").select("user_id, name, avatar_url").in("user_id", ids);
  const pmap = new Map((profs ?? []).map((p) => [p.user_id, p]));
  return top.map(([id, a]) => ({
    user_id: id,
    name: (pmap.get(id)?.name as string) ?? "Membro",
    avatar: (pmap.get(id)?.avatar_url as string) ?? null,
    xp: a.xp, count: a.count,
  }));
}
