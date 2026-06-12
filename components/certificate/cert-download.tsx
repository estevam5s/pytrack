"use client";

import { Download, Printer } from "lucide-react";

export function CertDownload({ code }: { code: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <a
        href={`/api/certificate/${code}/image`}
        download={`certificado-${code}.png`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#c19a2e] px-4 py-2 text-sm font-semibold text-[#0b1020]"
      >
        <Download className="h-4 w-4" /> Baixar PNG
      </a>
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium"
      >
        <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
      </button>
    </div>
  );
}
