import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Registra uma visita ao site com geolocalização (headers geográficos da Vercel).
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const h = req.headers;
    const country = h.get("x-vercel-ip-country") || null;
    const city = h.get("x-vercel-ip-city") ? decodeURIComponent(h.get("x-vercel-ip-city")!) : null;
    const region = h.get("x-vercel-ip-country-region") || null;

    const admin = createAdminClient();
    await admin.from("site_visits").insert({
      country,
      city,
      region,
      path: typeof body.path === "string" ? body.path.slice(0, 300) : null,
      referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 300) : null,
      session_id: typeof body.session === "string" ? body.session.slice(0, 64) : null,
      user_agent: (h.get("user-agent") || "").slice(0, 300),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
