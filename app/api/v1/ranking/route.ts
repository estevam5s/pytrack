import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashKey } from "@/lib/api-keys-util";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cors(json: unknown, status = 200) {
  return NextResponse.json(json, { status, headers: { "Access-Control-Allow-Origin": "*" } });
}

/**
 * GET /api/v1/ranking?limit=10
 * Ranking público da comunidade por XP (top estudantes).
 */
export async function GET(req: Request) {
  const key = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!key.startsWith("pytk_live_")) return cors({ error: "Chave de API inválida." }, 401);
  if (!(await rateLimit(`api:${key.slice(0, 16)}`, 60, 60))) {
    return cors({ error: "Limite de requisições excedido (60/min)." }, 429);
  }

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("api_keys")
    .select("id, revoked")
    .eq("key_prefix", key.slice(0, 16))
    .eq("key_hash", hashKey(key))
    .maybeSingle();
  if (!row || row.revoked) return cors({ error: "Chave inválida ou revogada." }, 401);
  await admin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", row.id);

  const url = new URL(req.url);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 10)));

  const { data } = await admin
    .from("community_profiles")
    .select("display_name, username, level, xp, avatar_url")
    .order("xp", { ascending: false })
    .limit(limit);

  return cors({
    data: (data ?? []).map((p, i) => ({
      position: i + 1,
      name: p.display_name ?? p.username,
      level: p.level,
      xp: p.xp ?? 0,
    })),
  });
}

export function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization",
    },
  });
}
