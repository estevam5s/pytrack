import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
  "/auth",
  "/api", // rotas de API fazem a própria autenticação (ex.: webhook Stripe)
  "/sitemap",
  "/robots",
  "/opengraph-image",
  "/twitter-image",
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

  return response;
}
