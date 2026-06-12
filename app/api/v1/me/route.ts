import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashKey } from "@/lib/api-keys-util";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cors(json: unknown, status = 200) {
  return NextResponse.json(json, {
    status,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

/**
 * GET /api/v1/me
 * Funcionalidade da API PyTrack: retorna o perfil público de aprendizado do
 * dono da chave (XP, nível, progresso) — para badges, portfólios, integrações.
 * Auth: Authorization: Bearer pytk_live_...   (planos Completo+)
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const key = auth.replace(/^Bearer\s+/i, "").trim();
  if (!key.startsWith("pytk_live_")) {
    return cors({ error: "Chave de API ausente ou inválida. Use 'Authorization: Bearer pytk_live_...'." }, 401);
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

  if (!row || row.revoked) {
    return cors({ error: "Chave inválida ou revogada." }, 401);
  }

  // atualiza último uso
  await admin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", row.id);

  // dados de aprendizado do usuário
  const { data: profile } = await admin
    .from("users_profile")
    .select("name, xp, current_level, headline, skills, github_username")
    .eq("user_id", row.user_id)
    .maybeSingle();

  const { count: modules } = await admin
    .from("progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", row.user_id)
    .eq("completed", true);

  return cors({
    data: {
      name: profile?.name ?? null,
      headline: profile?.headline ?? null,
      level: profile?.current_level ?? "basico",
      xp: profile?.xp ?? 0,
      skills: profile?.skills ?? [],
      github: profile?.github_username ?? null,
      modulesCompleted: modules ?? 0,
      profileUrl: "https://www.pytrack.com.br",
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
