import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID = ["android", "windows", "macos", "linux"];

/**
 * GET /api/download?platform=android|windows|macos|linux
 * Incrementa o contador de downloads e redireciona para o arquivo real.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const platform = (url.searchParams.get("platform") ?? "").toLowerCase();
  if (!VALID.includes(platform)) {
    return NextResponse.json({ error: "Plataforma inválida." }, { status: 400 });
  }
  const admin = createAdminClient();
  // incrementa atomicamente e devolve a URL de download
  const { data: target } = await admin.rpc("increment_download", { p_platform: platform });
  if (!target) {
    return NextResponse.json({ error: "Release não encontrada." }, { status: 404 });
  }
  return NextResponse.redirect(target as string, { status: 302 });
}
