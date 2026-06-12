"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MODULES } from "@/lib/content/registry";
import { TRILHAS, moduleInTrilha } from "@/lib/trilhas";
import { BADGES, type BadgeStats, type BadgeDef } from "@/lib/badges-defs";

async function computeStats(userId: string): Promise<BadgeStats> {
  const admin = createAdminClient();
  const [prof, contentsRes, progressRes, exRes, postsRes, connRes, certRes] = await Promise.all([
    admin.from("users_profile").select("xp, current_level").eq("user_id", userId).maybeSingle(),
    admin.from("contents").select("id, area, slug"),
    admin.from("progress").select("content_id, progress_percentage").eq("user_id", userId),
    admin.from("exercise_completions").select("id", { count: "exact", head: true }).eq("user_id", userId),
    admin.from("community_posts").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "active"),
    admin.from("community_connections").select("id", { count: "exact", head: true }).eq("status", "accepted").or(`requester_id.eq.${userId},receiver_id.eq.${userId}`),
    admin.from("certificates").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  // streak: dias consecutivos em daily_activity
  const { data: actDays } = await admin.from("daily_activity").select("day").eq("user_id", userId).order("day", { ascending: false }).limit(60);
  const daySet = new Set((actDays ?? []).map((d) => d.day as string));
  let streak = 0;
  const t0 = new Date();
  for (let i = 0; i < 60; i++) { const d = new Date(t0); d.setDate(d.getDate() - i); if (daySet.has(d.toISOString().slice(0, 10))) streak++; else if (i > 0) break; }

  const contents = contentsRes.data ?? [];
  const progById = new Map((progressRes.data ?? []).map((p) => [p.content_id as string, (p.progress_percentage as number) ?? 0]));
  const slugPct = new Map<string, number>();
  for (const c of contents) if (c.slug) slugPct.set(c.slug as string, progById.get(c.id as string) ?? 0);

  // trilhas 100%
  const trails: string[] = [];
  for (const t of TRILHAS) {
    const mods = MODULES.filter((m) => moduleInTrilha(t, m.area, m.slug));
    if (!mods.length) continue;
    const pct = Math.round(mods.reduce((s, m) => s + (slugPct.get(m.slug) ?? 0), 0) / mods.length);
    if (pct >= 100) trails.push(t.id);
  }

  // % por área (média das % dos conteúdos da área)
  const areaAgg = new Map<string, { sum: number; n: number }>();
  for (const c of contents) {
    const area = (c.area as string) ?? "Geral";
    const a = areaAgg.get(area) ?? { sum: 0, n: 0 };
    a.sum += progById.get(c.id as string) ?? 0; a.n += 1;
    areaAgg.set(area, a);
  }
  const areaPct: Record<string, number> = {};
  for (const [area, a] of areaAgg) areaPct[area] = a.n ? Math.round(a.sum / a.n) : 0;

  return {
    xp: (prof.data?.xp as number) ?? 0,
    level: (prof.data?.current_level as string) ?? "basico",
    exercises: exRes.count ?? 0,
    trails,
    areaPct,
    posts: postsRes.count ?? 0,
    connections: connRes.count ?? 0,
    certificates: certRes.count ?? 0,
    streak,
  };
}

export interface BadgeWithStatus extends Omit<BadgeDef, "check"> { earned: boolean }

// Avalia as badges do usuário logado, concede as novas e notifica.
export async function evaluateMyBadges(): Promise<{ badges: BadgeWithStatus[]; newlyEarned: string[] }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { badges: [], newlyEarned: [] };

  const stats = await computeStats(user.id);
  const admin = createAdminClient();
  const { data: existing } = await admin.from("user_badges").select("badge_id").eq("user_id", user.id);
  const owned = new Set((existing ?? []).map((b) => b.badge_id as string));

  const newlyEarned: string[] = [];
  const toInsert: { user_id: string; badge_id: string }[] = [];
  for (const b of BADGES) {
    if (b.check(stats) && !owned.has(b.id)) {
      toInsert.push({ user_id: user.id, badge_id: b.id });
      newlyEarned.push(b.id);
      owned.add(b.id);
    }
  }
  if (toInsert.length) {
    await admin.from("user_badges").insert(toInsert);
    // notifica as novas conquistas
    const rows = toInsert.map((t) => {
      const def = BADGES.find((x) => x.id === t.badge_id)!;
      return { user_id: user.id, type: "success", title: `🏆 Nova conquista: ${def.name}`, body: def.description, link: "/comunidade/badges", is_read: false };
    });
    await admin.from("notifications").insert(rows);

    // MURAL DE DESTAQUE: conquistas DIAMANTE viram post na comunidade
    const diamonds = toInsert.map((t) => BADGES.find((x) => x.id === t.badge_id)!).filter((d) => d.tier === "diamante");
    for (const d of diamonds) {
      try {
        await admin.rpc("community_ensure_profile", { uid: user.id });
        await admin.from("community_posts").insert({
          user_id: user.id, category: "conquista",
          title: `Conquista rara desbloqueada: ${d.name}`,
          content: `${d.emoji} Acabei de desbloquear a conquista **DIAMANTE** "${d.name}" na PyTrack! ${d.description} 💎`,
          tags: ["conquista", "diamante"], visibility: "public",
        });
      } catch { /* best-effort */ }
    }
  }

  const badges: BadgeWithStatus[] = BADGES.map(({ check, ...rest }) => ({ ...rest, earned: owned.has(rest.id) }));
  return { badges, newlyEarned };
}

// Ranking: quem tem mais conquistas na comunidade.
export async function getBadgeRanking(limit = 10): Promise<{ user_id: string; name: string; avatar: string | null; count: number; diamonds: number }[]> {
  const admin = createAdminClient();
  const { data } = await admin.from("user_badges").select("user_id, badge_id");
  if (!data?.length) return [];
  const diamondIds = new Set(BADGES.filter((b) => b.tier === "diamante").map((b) => b.id));
  const agg = new Map<string, { count: number; diamonds: number }>();
  for (const r of data) {
    const uid = r.user_id as string;
    const a = agg.get(uid) ?? { count: 0, diamonds: 0 };
    a.count += 1;
    if (diamondIds.has(r.badge_id as string)) a.diamonds += 1;
    agg.set(uid, a);
  }
  const top = [...agg.entries()].sort((a, b) => b[1].count - a[1].count || b[1].diamonds - a[1].diamonds).slice(0, limit);
  const ids = top.map(([id]) => id);
  const { data: profs } = await admin.from("users_profile").select("user_id, name, avatar_url").in("user_id", ids);
  const pmap = new Map((profs ?? []).map((p) => [p.user_id, p]));
  return top.map(([id, a]) => ({
    user_id: id,
    name: (pmap.get(id)?.name as string) ?? "Membro",
    avatar: (pmap.get(id)?.avatar_url as string) ?? null,
    count: a.count, diamonds: a.diamonds,
  }));
}

// Badges já conquistadas de qualquer usuário (para o perfil).
export async function getEarnedBadges(userId: string): Promise<BadgeWithStatus[]> {
  const admin = createAdminClient();
  const { data } = await admin.from("user_badges").select("badge_id").eq("user_id", userId);
  const owned = new Set((data ?? []).map((b) => b.badge_id as string));
  return BADGES.filter((b) => owned.has(b.id)).map(({ check, ...rest }) => ({ ...rest, earned: true }));
}
