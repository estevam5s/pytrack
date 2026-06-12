import { NextResponse } from "next/server";
import { verifyCertificate } from "@/lib/certificates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await verifyCertificate(code);
  if (!cert) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(cert);
}
