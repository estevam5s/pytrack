import { NextResponse } from "next/server";
import { broadcastToUsers } from "@/lib/notifications/broadcast";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/broadcast
 * Dispara um aviso/notificação para os usuários. Protegido por BROADCAST_SECRET
 * (header Authorization: Bearer <secret>). Usado pelo CI ao publicar releases.
 */
export async function POST(req: Request) {
  const secret = process.env.BROADCAST_SECRET ?? process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: { title?: string; body?: string; link?: string; type?: string; audience?: "all" | "paid" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }
  if (!body.title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });

  const res = await broadcastToUsers({
    title: body.title,
    body: body.body ?? null,
    link: body.link ?? null,
    type: body.type ?? "success",
    audience: body.audience === "paid" ? "paid" : "all",
  });
  if (res.error) return NextResponse.json({ error: res.error }, { status: 500 });
  return NextResponse.json({ ok: true, sent: res.sent });
}
