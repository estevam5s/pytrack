"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export function ReferralLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const share = async () => {
    const text = "Aprenda Python na PyTrack — use meu convite:";
    if (navigator.share) {
      try {
        await navigator.share({ title: "PyTrack", text, url });
        return;
      } catch {
        /* fallback */
      }
    }
    const wa = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(wa, "_blank");
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="flex min-w-0 flex-1 items-center rounded-lg border border-border bg-surface px-3 py-2">
        <span className="truncate text-sm text-text-secondary">{url}</span>
      </div>
      <button
        onClick={copy}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
      >
        {copied ? <Check className="h-4 w-4 text-secondary" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copiado" : "Copiar"}
      </button>
      <button
        onClick={share}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        <Share2 className="h-4 w-4" /> Compartilhar
      </button>
    </div>
  );
}
