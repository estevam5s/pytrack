import { NextResponse } from "next/server";
import { createClient as createSupa } from "@supabase/supabase-js";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { generateScaffold } from "@/lib/saas-scaffold";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CLI: valida credenciais → identifica o plano → gera o scaffold (Completo+).
export async function POST(req: Request) {
  try {
    const { email, password, stack, name } = await req.json().catch(() => ({}));
    if (!email || !password) {
      return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
    }

    // autentica com as credenciais (cliente isolado, sem cookies)
    const supabase = createSupa(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

    // identifica o plano — disponível a partir do Completo (R$19). Bloqueia free e essencial.
    const tier = await getUserTier(data.user.id);
    if (!tierAtLeast(tier, "completo")) {
      return NextResponse.json(
        { error: `Recurso disponível a partir do plano Completo (R$19). Seu plano: ${tier}. Faça upgrade em www.pytrack.com.br/assinar` },
        { status: 403 },
      );
    }

    const script = generateScaffold(String(name ?? "meu-saas"), String(stack ?? "nextjs-supabase"));
    return new NextResponse(script, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro" }, { status: 500 });
  }
}
