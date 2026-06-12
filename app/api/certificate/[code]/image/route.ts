import { ImageResponse } from "next/og";
import { verifyCertificate } from "@/lib/certificates";
import { certImageElement } from "@/lib/certificate-image";

export const runtime = "nodejs";

// PNG do certificado para download.
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await verifyCertificate(code);
  return new ImageResponse(certImageElement(cert, code), {
    width: 1200,
    height: 630,
    headers: { "Content-Disposition": `inline; filename="certificado-${code}.png"` },
  });
}
