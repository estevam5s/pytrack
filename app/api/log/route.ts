import { NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";

export const runtime = "nodejs";

// Recebe erros do cliente (error boundary) e registra no monitoramento.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    await logEvent("error", "client", String(body?.message ?? "client error"), {
      digest: body?.digest,
      url: body?.url,
      stack: body?.stack,
    });
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: true });
}
