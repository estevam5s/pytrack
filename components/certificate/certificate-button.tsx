"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Loader2, ExternalLink, X, Share2, Linkedin, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { issueCertificate, shareCertificateOnFeed } from "@/lib/certificates";
import { CertificateView, type CertificateData } from "./certificate-view";
import { CertDownload } from "./cert-download";

function ShareButtons({ code, title }: { code: string; title: string }) {
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(false);
  const url = `https://www.pytrack.com.br/certificado/${code}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  async function toFeed() {
    setLoading(true);
    const r = await shareCertificateOnFeed(code);
    setLoading(false);
    if (!r.error) setShared(true);
  }
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
      <button onClick={toFeed} disabled={loading || shared} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {shared ? "Compartilhado no feed" : "Compartilhar no feed"}
      </button>
      <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white">
        <Linkedin className="h-4 w-4" /> LinkedIn
      </a>
    </div>
  );
}

export function CertificateButton({ trilhaId, existingCode }: { trilhaId: string; existingCode?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(existingCode ?? null);
  const [show, setShow] = useState(false);
  const [cert, setCert] = useState<CertificateData | null>(null);

  async function generate() {
    setLoading(true); setError(null);
    const res = await issueCertificate(trilhaId);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    setCode(res.code ?? null);
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    // busca os dados para exibir
    if (res.code) openCert(res.code);
  }

  async function openCert(c: string) {
    const r = await fetch(`/api/certificate/${c}`).then((x) => x.json()).catch(() => null);
    if (r) { setCert(r); setShow(true); }
  }

  return (
    <div className="rounded-2xl border border-[#d4af37]/40 bg-gradient-to-br from-[#d4af37]/10 to-transparent p-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/20 text-[#d4af37]"><Award className="h-6 w-6" /></span>
          <div>
            <p className="font-bold">🎉 Trilha concluída!</p>
            <p className="text-sm text-text-secondary">Gere seu certificado oficial com código de verificação.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {code ? (
            <>
              <button onClick={() => openCert(code)} className="rounded-lg bg-gradient-to-r from-[#d4af37] to-[#c19a2e] px-4 py-2 text-sm font-semibold text-[#0b1020]">Ver certificado</button>
              <Link href={`/certificado/${code}`} target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm">Página pública <ExternalLink className="h-3.5 w-3.5" /></Link>
            </>
          ) : (
            <button onClick={generate} disabled={loading} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#c19a2e] px-5 py-2 text-sm font-semibold text-[#0b1020] disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Gerar certificado
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {show && cert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4" onClick={() => setShow(false)}>
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button onClick={() => setShow(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
            </div>
            <CertificateView data={cert} verifyUrl={`https://www.pytrack.com.br/certificado/${cert.credential_code}`} />
            <div className="mt-3"><CertDownload code={cert.credential_code} /></div>
            <ShareButtons code={cert.credential_code} title={cert.trilha_title} />
            <p className="mt-2 text-center text-xs text-white/70">
              Salvo no seu perfil · <Link href={`/certificado/${cert.credential_code}`} target="_blank" className="underline">página pública</Link> · dica: use a impressão do navegador para salvar em PDF.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
