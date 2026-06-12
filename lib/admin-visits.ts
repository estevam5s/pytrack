import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// nome do país + bandeira a partir do código ISO (alpha-2)
export function countryInfo(code: string | null): { name: string; flag: string } {
  if (!code) return { name: "Desconhecido", flag: "🌐" };
  const cc = code.toUpperCase();
  const flag = cc.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  let name = cc;
  try { name = new Intl.DisplayNames(["pt-BR"], { type: "region" }).of(cc) ?? cc; } catch { /* fallback */ }
  return { name, flag };
}

export async function getVisitAnalytics() {
  const admin = createAdminClient();
  const dayAgo = new Date(Date.now() - 86400000).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const [{ count: total }, { count: today }, { count: week }, { data: rows }, { data: recent }] = await Promise.all([
    admin.from("site_visits").select("id", { count: "exact", head: true }),
    admin.from("site_visits").select("id", { count: "exact", head: true }).gte("created_at", dayAgo),
    admin.from("site_visits").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    admin.from("site_visits").select("country, session_id, path, created_at").order("created_at", { ascending: false }).limit(5000),
    admin.from("site_visits").select("country, city, path, created_at").order("created_at", { ascending: false }).limit(15),
  ]);

  const list = rows ?? [];
  // por país
  const byCountry = new Map<string, number>();
  const sessions = new Set<string>();
  const byPath = new Map<string, number>();
  const byDay = new Map<string, number>();
  for (const r of list) {
    const c = (r.country as string) ?? "??";
    byCountry.set(c, (byCountry.get(c) ?? 0) + 1);
    if (r.session_id) sessions.add(r.session_id as string);
    const p = (r.path as string) ?? "/";
    byPath.set(p, (byPath.get(p) ?? 0) + 1);
    const day = new Date(r.created_at as string).toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  const countries = [...byCountry.entries()].map(([code, count]) => ({ code, count, ...countryInfo(code === "??" ? null : code) })).sort((a, b) => b.count - a.count);
  const topPaths = [...byPath.entries()].map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10);
    return { day: d, count: byDay.get(d) ?? 0 };
  });

  return {
    total: total ?? 0, today: today ?? 0, week: week ?? 0,
    uniqueVisitors: sessions.size, countriesCount: countries.length,
    countries, topPaths, last14,
    recent: (recent ?? []).map((r) => ({ ...countryInfo(r.country as string), city: r.city as string | null, path: r.path as string | null, created_at: r.created_at as string })),
  };
}
