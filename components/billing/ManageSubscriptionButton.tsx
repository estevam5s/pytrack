"use client";

import { useState } from "react";
import { ExternalLink, Loader2, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ManageSubscriptionButton({
  className,
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPortal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Não foi possível abrir o portal.");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={openPortal}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-60",
          className,
        )}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}
        Gerenciar assinatura
        {!loading && <ExternalLink className="h-3.5 w-3.5" />}
      </button>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
