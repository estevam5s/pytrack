import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast, TIER_LABEL } from "@/lib/billing-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cors(json: unknown, status = 200) {
  return NextResponse.json(json, {
    status,
    headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization" },
  });
}

/**
 * GET /api/extension/sync   (Authorization: Bearer <access_token>)
 * Retorna assinatura + projetos + aulas + exercícios do aluno.
 * A extensão completa é exclusiva do plano Suprema (R$46).
 */
export async function GET(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return cors({ error: "Não autenticado." }, 401);

  const admin = createAdminClient();
  const { data: u, error } = await admin.auth.getUser(token);
  if (error || !u.user) return cors({ error: "Sessão inválida ou expirada." }, 401);
  const userId = u.user.id;

  const tier = await getUserTier(userId);
  const isSuprema = tierAtLeast(tier, "suprema");

  const { data: prof } = await admin
    .from("users_profile")
    .select("name, xp, current_level, github_username")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: sub } = await admin
    .from("subscriptions")
    .select("status, current_period_end, stripe_price_id")
    .eq("user_id", userId)
    .maybeSingle();

  const base = {
    user: { id: userId, email: u.user.email, name: prof?.name ?? null },
    tier,
    tierLabel: TIER_LABEL[tier],
    isSuprema,
    xp: prof?.xp ?? 0,
    level: prof?.current_level ?? "basico",
    subscription: sub
      ? { status: sub.status, renewsAt: sub.current_period_end }
      : { status: "free", renewsAt: null },
  };

  // conteúdo completo só para Suprema
  if (!isSuprema) {
    return cors({
      ...base,
      locked: true,
      message: "A extensão completa é exclusiva do plano Suprema (R$46).",
      projects: [],
      lessons: [],
      exercises: [],
    });
  }

  const [projects, lessons, exercises] = await Promise.all([
    admin.from("projects").select("id, title, description, level, area, estimated_hours").order("order_index").limit(200),
    admin.from("contents").select("slug, title, description, area, level, lessons_count, estimated_hours").order("order_index").limit(200),
    admin.from("practice_exercises").select("ex_id, title, category, level, objective").order("order_index").limit(500),
  ]);

  return cors({
    ...base,
    locked: false,
    projects: projects.data ?? [],
    lessons: lessons.data ?? [],
    exercises: exercises.data ?? [],
    counts: {
      projects: projects.data?.length ?? 0,
      lessons: lessons.data?.length ?? 0,
      exercises: exercises.data?.length ?? 0,
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
