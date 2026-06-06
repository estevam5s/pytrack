import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function UpgradeBanner() {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 via-surface to-surface">
      <div className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">
              Você está no plano gratuito
            </p>
            <p className="text-xs text-text-secondary">
              Desbloqueie todas as trilhas, exercícios com IA, projetos,
              comunidade e mais — 7 dias grátis.
            </p>
          </div>
        </div>
        <Link
          href="/assinar"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
        >
          Fazer upgrade <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
