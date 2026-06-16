import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface LogRow {
  id: string;
  level: string;
  source: string;
  message: string;
  stack: string | null;
  path: string | null;
  user_id: string | null;
  created_at: string;
}

export async function getLogsData() {
  const admin = createAdminClient();
  const dayAgo = new Date(Date.now() - 86400000).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const [{ data: rows }, { count: total }, { count: last24h }, { count: last7d }] = await Promise.all([
    admin.from("error_logs").select("id, level, source, message, stack, path, user_id, created_at").order("created_at", { ascending: false }).limit(800),
    admin.from("error_logs").select("id", { count: "exact", head: true }),
    admin.from("error_logs").select("id", { count: "exact", head: true }).gte("created_at", dayAgo),
    admin.from("error_logs").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
  ]);

  const list = (rows ?? []) as LogRow[];
  const byLevel = new Map<string, number>();
  const bySource = new Map<string, number>();
  for (const r of list) {
    byLevel.set(r.level, (byLevel.get(r.level) ?? 0) + 1);
    bySource.set(r.source, (bySource.get(r.source) ?? 0) + 1);
  }

  return {
    logs: list,
    stats: {
      total: total ?? 0,
      last24h: last24h ?? 0,
      last7d: last7d ?? 0,
      errors: byLevel.get("error") ?? 0,
      warns: byLevel.get("warn") ?? 0,
      fatal: byLevel.get("fatal") ?? 0,
    },
    sources: [...bySource.entries()].map(([s, n]) => ({ source: s, count: n })).sort((a, b) => b.count - a.count),
  };
}
