import { ImageResponse } from "next/og";
import { verifyCertificate } from "@/lib/certificates";
import { certImageElement } from "@/lib/certificate-image";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Certificado PyTrack";

export default async function CertificateOG({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await verifyCertificate(code);
  return new ImageResponse(certImageElement(cert, code), { ...size });
}
