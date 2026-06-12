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
 * GET /api/v1/progress
 * Retorna o progresso de aprendizado do dono da chave: módulos concluídos,
 * XP, nível e contadores. Útil para dashboards externos e gestão de cursos.
 */
export async function GET(req: Request) {
  const key = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!key.startsWith("pytk_live_")) {
    return cors({ error: "Chave de API inválida." }, 401);
  }
  if (!(await rateLimit(`api:${key.slice(0, 16)}`, 60, 60))) {
    return cors({ error: "Limite de requisições excedido (60/min)." }, 429);
  }

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("api_keys")
    .select("id, user_id, revoked")
    .eq("key_prefix", key.slice(0, 16))
    .eq("key_hash", hashKey(key))
    .maybeSingle();
  if (!row || row.revoked) return cors({ error: "Chave inválida ou revogada." }, 401);

  await admin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", row.id);

  const { data: profile } = await admin
    .from("users_profile")
    .select("name, xp, current_level")
    .eq("user_id", row.user_id)
    .maybeSingle();

  // módulos concluídos
  const { data: progress } = await admin
    .from("progress")
    .select("content_id, completed, updated_at")
    .eq("user_id", row.user_id)
    .eq("completed", true)
    .order("updated_at", { ascending: false })
    .limit(200);

  return cors({
    data: {
      student: profile?.name ?? null,
      xp: profile?.xp ?? 0,
      level: profile?.current_level ?? "basico",
      modulesCompleted: progress?.length ?? 0,
      recent: (progress ?? []).slice(0, 20).map((p) => ({
        moduleId: p.content_id,
        completedAt: p.updated_at,
      })),
    },
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
