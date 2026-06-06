"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubscribeButton({
  label = "Assinar agora",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Não foi possível iniciar o pagamento.");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={subscribe}
        disabled={loading}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-opacity hover:opacity-90 disabled:opacity-60",
          className,
        )}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {label}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
      {error && <p className="mt-2 text-center text-xs text-danger">{error}</p>}
    </div>
  );
}
