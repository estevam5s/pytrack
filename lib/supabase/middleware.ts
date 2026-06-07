import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  hasDashboardAccess,
  isFreeDashboardPath,
  requiresCompleto,
  tierOf,
  tierAtLeast,
} from "@/lib/billing-access";

// Rotas públicas (site institucional) acessíveis sem login.
const PUBLIC_EXACT = ["/"];
const PUBLIC_PREFIX = [
  "/sobre",
  "/trilhas",
  "/recursos",
  "/precos",
  "/projetos",
  "/carreira",
  "/blog",
  "/aprender", // lições públicas (SEO)
  "/auth",
  "/api", // rotas de API fazem a própria autenticação (ex.: webhook Stripe)
  "/sitemap",
  "/robots",
  "/opengraph-image",
  "/twitter-image",
  "/google", // arquivo de verificação do Google Search Console
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic =
    PUBLIC_EXACT.includes(pathname) ||
    PUBLIC_PREFIX.some((p) => pathname.startsWith(p));

  // rota protegida (dashboard) sem login -> vai para o login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // logado tentando ver as telas de auth -> vai para o dashboard
  if (user && pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/inicio";
    return NextResponse.redirect(url);
  }

  // gating de acesso. Se o billing não estiver configurado, libera tudo.
  const billingEnabled = Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID,
  );
  if (user && !isPublic && billingEnabled) {
    // sempre acessível (para pagar/gerenciar a conta)
    const essential =
      pathname === "/assinar" ||
      pathname === "/suporte" ||
      pathname === "/admin" ||
      pathname.startsWith("/admin/") ||
      pathname === "/configuracoes" ||
      pathname.startsWith("/configuracoes/");

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, current_period_end, stripe_price_id, metadata")
      .eq("user_id", user.id)
      .maybeSingle();

    if (hasDashboardAccess(sub)) {
      // assinante / cortesia → gating por tier (recursos exclusivos do Completo)
      if (requiresCompleto(pathname) && !tierAtLeast(tierOf(sub), "completo")) {
        const url = request.nextUrl.clone();
        url.pathname = "/assinar";
        url.searchParams.set("upgrade", "completo");
        return NextResponse.redirect(url);
      }
    } else if (!essential) {
      // usuário no plano grátis (sem assinatura paga): acesso por 7 dias
      const createdMs = user.created_at
        ? new Date(user.created_at).getTime()
        : Date.now();
      const days = (Date.now() - createdMs) / 86400000;
      const url = request.nextUrl.clone();
      url.pathname = "/assinar";
      if (days > 7) {
        // período grátis de 7 dias expirou → bloqueia tudo até assinar
        url.searchParams.set("trial", "expired");
        return NextResponse.redirect(url);
      }
      if (!isFreeDashboardPath(pathname)) {
        // dentro dos 7 dias, mas a rota é de plano pago
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}
