import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashKey } from "@/lib/api-keys-util";
import { rateLimit } from "@/lib/rate-limit";
import { TRILHAS } from "@/lib/trilhas";
import { TIER_LABEL } from "@/lib/billing-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cors(json: unknown, status = 200) {
  return NextResponse.json(json, { status, headers: { "Access-Control-Allow-Origin": "*" } });
}

async function auth(req: Request): Promise<boolean> {
  const key = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!key.startsWith("pytk_live_")) return false;
  if (!(await rateLimit(`api:${key.slice(0, 16)}`, 60, 60))) return false;
  const admin = createAdminClient();
  const { data } = await admin
    .from("api_keys")
    .select("id, revoked")
    .eq("key_prefix", key.slice(0, 16))
    .eq("key_hash", hashKey(key))
    .maybeSingle();
  if (!data || data.revoked) return false;
  await admin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", data.id);
  return true;
}

/**
 * GET /api/v1/tracks
 * Lista as trilhas/cursos disponíveis na PyTrack (público para chaves válidas).
 */
export async function GET(req: Request) {
  if (!(await auth(req))) return cors({ error: "Chave de API inválida ou revogada." }, 401);

  return cors({
    data: TRILHAS.map((t) => ({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      level: t.level,
      plan: TIER_LABEL[t.tier],
      modules: t.adModules,
      lessons: t.adLessons,
      hours: t.adHours,
      topics: t.topics,
      url: `https://www.pytrack.com.br/trilhas`,
    })),
    count: TRILHAS.length,
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
