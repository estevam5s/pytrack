import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/extension/download
 * Baixa o .vsix da extensão — exclusivo de assinantes Suprema.
 * Gera uma URL assinada temporária do bucket privado.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login", "https://www.pytrack.com.br"));

  if (!tierAtLeast(await getUserTier(user.id), "suprema")) {
    return NextResponse.json(
      { error: "Download do .vsix é exclusivo do plano Suprema (R$46)." },
      { status: 403 },
    );
  }

  const admin = createAdminClient();
  const { data: meta } = await admin.from("extension_meta").select("vsix_path").eq("id", 1).maybeSingle();
  const path = meta?.vsix_path ?? "pytrack-1.0.0.vsix";

  const { data, error } = await admin.storage.from("extension").createSignedUrl(path, 120, { download: true });
  if (error || !data) {
    return NextResponse.json({ error: "Arquivo indisponível no momento." }, { status: 404 });
  }
  return NextResponse.redirect(data.signedUrl);
}
