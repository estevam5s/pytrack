import { Route, Sparkles } from "lucide-react";
import type { Career } from "@/lib/site-data";

export function CareerCard({ career }: { career: Career }) {
  const Icon = career.icon;
  return (
    <div className="card card-hover h-full p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">{career.title}</h3>
      </div>

      <div className="mt-5">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
          <Sparkles className="h-3.5 w-3.5" /> Habilidades
        </p>
        <div className="flex flex-wrap gap-1.5">
          {career.skills.map((s) => (
            <span
              key={s}
              className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] text-text-secondary"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
          Tecnologias essenciais
        </p>
        <div className="flex flex-wrap gap-1.5">
          {career.technologies.map((t) => (
            <span
              key={t}
              className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary-light"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-sm text-text-secondary">
        <Route className="mt-0.5 h-4 w-4 shrink-0 text-green" />
        <span>{career.path}</span>
      </div>
    </div>
  );
}
