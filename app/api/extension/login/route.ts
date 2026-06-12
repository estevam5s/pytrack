import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cors(json: unknown, status = 200) {
  return NextResponse.json(json, {
    status,
    headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" },
  });
}

/**
 * POST /api/extension/login  { email, password }
 * Autentica o aluno (somente login, sem registro) via Supabase GoTrue e
 * devolve tokens + tier. Usado pela extensão do VS Code.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!(await rateLimit(`ext-login:${ip}`, 10, 60))) {
    return cors({ error: "Muitas tentativas. Aguarde um minuto." }, 429);
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return cors({ error: "Corpo inválido." }, 400);
  }
  const { email, password } = body;
  if (!email || !password) return cors({ error: "Informe e-mail e senha." }, 400);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anon, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    return cors({ error: data.error_description || data.msg || "E-mail ou senha inválidos." }, 401);
  }

  return cors({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    user: { id: data.user?.id, email: data.user?.email, name: data.user?.user_metadata?.name ?? null },
  });
}

export function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
