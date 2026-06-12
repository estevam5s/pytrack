import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ShieldX, ArrowRight } from "lucide-react";
import { verifyCertificate } from "@/lib/certificates";
import { CertificateView } from "@/components/certificate/certificate-view";
import { CertDownload } from "@/components/certificate/cert-download";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const cert = await verifyCertificate(code);
  const title = cert ? `Certificado de ${cert.recipient_name} — ${cert.trilha_title} · PyTrack` : `Verificação de certificado ${code} · PyTrack`;
  const description = cert
    ? `${cert.recipient_name} concluiu 100% da trilha ${cert.trilha_title} (${cert.level}${cert.hours ? ` · ${cert.hours}h` : ""}) na PyTrack. Certificado autêntico ${cert.credential_code}.`
    : "Verificação de autenticidade de certificado da PyTrack.";
  const url = `https://www.pytrack.com.br/certificado/${code}`;
  return {
    title,
    description,
    openGraph: { title, description, url, type: "website", images: [`/api/certificate/${code}/image`] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/certificate/${code}/image`] },
  };
}

export default async function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await verifyCertificate(code);
  const verifyUrl = `https://www.pytrack.com.br/certificado/${code}`;

  if (!cert) {
    return (
      <div className="container max-w-lg py-20 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400"><ShieldX className="h-8 w-8" /></span>
        <h1 className="text-2xl font-bold">Certificado não encontrado</h1>
        <p className="mt-2 text-text-secondary">O código <code className="rounded bg-surface-2 px-1.5">{code}</code> não corresponde a nenhum certificado válido da PyTrack.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm">Ir para a PyTrack <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12">
      {/* badge de autenticidade */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-green/30 bg-green/5 p-4">
        <ShieldCheck className="h-8 w-8 shrink-0 text-green" />
        <div>
          <p className="font-bold text-green">Certificado autêntico ✓</p>
          <p className="text-sm text-text-secondary">
            Emitido pela PyTrack para <strong className="text-foreground">{cert.recipient_name}</strong> em {new Date(cert.issued_at).toLocaleDateString("pt-BR")}. Código: <code className="rounded bg-surface-2 px-1.5">{cert.credential_code}</code>
          </p>
        </div>
      </div>

      <CertificateView data={cert} verifyUrl={verifyUrl} />

      <div className="mt-5">
        <CertDownload code={cert.credential_code} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-5 text-sm text-text-secondary">
        <p>Este certificado comprova que <strong className="text-foreground">{cert.recipient_name}</strong> concluiu 100% da trilha <strong className="text-foreground">{cert.trilha_title}</strong> ({cert.level}{cert.hours ? ` · ${cert.hours}h` : ""}) na plataforma PyTrack.</p>
        <Link href="/trilhas" className="mt-3 inline-flex items-center gap-2 text-primary-light hover:underline">Conheça as trilhas da PyTrack <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  );
}
