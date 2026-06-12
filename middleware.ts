import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { langFromCountry } from "@/lib/geo-lang";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Detecção automática de idioma por geolocalização (uma única vez por visitante).
  // Respeita a escolha manual: se já houver googtrans ou o marcador, não mexe.
  const hasMarker = request.cookies.get("pytrack-geo")?.value;
  const hasGoogtrans = request.cookies.get("googtrans")?.value;
  if (!hasMarker && !hasGoogtrans) {
    const country = request.headers.get("x-vercel-ip-country") ?? null;
    const lang = langFromCountry(country);
    // marcador para não repetir a detecção
    response.cookies.set("pytrack-geo", lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    // se não for português, aplica a tradução automática via cookie do Google Translate
    if (lang !== "pt") {
      response.cookies.set("googtrans", `/pt/${lang}`, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
