import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

const TRIAL_DAYS = 7;

export function UpgradeBanner({ createdAt }: { createdAt?: string | null }) {
  // calcula os dias exatos restantes do período grátis
  let daysLeft: number | null = null;
  let expiresLabel = "";
  let expired = false;
  if (createdAt) {
    const created = new Date(createdAt).getTime();
    const endMs = created + TRIAL_DAYS * 86400000;
    const remainingMs = endMs - Date.now();
    daysLeft = Math.max(0, Math.ceil(remainingMs / 86400000));
    expired = remainingMs <= 0;
    expiresLabel = new Date(endMs).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    });
  }

  const pct =
    daysLeft !== null ? Math.max(0, Math.min(100, (daysLeft / TRIAL_DAYS) * 100)) : 100;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 via-surface to-surface">
      <div className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">
              {expired
                ? "Seu período grátis terminou"
                : daysLeft !== null
                  ? daysLeft === 0
                    ? "Seu período grátis termina hoje!"
                    : `Plano gratuito — ${daysLeft} ${daysLeft === 1 ? "dia restante" : "dias restantes"}`
                  : "Você está no plano gratuito"}
            </p>
            <p className="text-xs text-text-secondary">
              {expired
                ? "Assine para voltar a acessar todas as trilhas, exercícios com IA, projetos e comunidade."
                : daysLeft !== null
                  ? `Seu acesso grátis vai até ${expiresLabel}. Assine e mantenha tudo desbloqueado.`
                  : "Desbloqueie todas as trilhas, exercícios com IA, projetos e mais — 7 dias grátis."}
            </p>
            {daysLeft !== null && !expired && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
                  <Clock className="h-3 w-3" /> expira em {expiresLabel}
                </span>
              </div>
            )}
          </div>
        </div>
        <Link
          href="/assinar"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
        >
          {expired ? "Assinar agora" : "Fazer upgrade"} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
