import Image from "next/image";
import {
  BookOpen,
  Code2,
  FolderGit2,
  LayoutDashboard,
  Layers,
  Library,
  TrendingUp,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Início", active: true },
  { icon: BookOpen, label: "Conteúdos" },
  { icon: TrendingUp, label: "Evolução" },
  { icon: Layers, label: "Stack" },
  { icon: Code2, label: "Exercícios" },
  { icon: FolderGit2, label: "Projetos" },
  { icon: Library, label: "Livros" },
];

const BARS = [35, 62, 48, 80, 55, 92, 70];

export function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
      {/* topo */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-magenta/70" />
        <span className="h-3 w-3 rounded-full bg-blue/70" />
        <span className="h-3 w-3 rounded-full bg-green/70" />
        <div className="ml-3 h-6 flex-1 rounded-md bg-surface-2" />
      </div>

      <div className="flex">
        {/* sidebar */}
        <aside className="hidden w-44 shrink-0 border-r border-border p-3 sm:block">
          <div className="mb-4 flex items-center gap-2 px-1">
            <Image
              src="/new-logo.png"
              alt="PyTrack"
              width={28}
              height={28}
              className="h-7 w-7 rounded-md object-contain"
            />
            <span className="text-xs font-bold">PyTrack</span>
          </div>
          <div className="space-y-1">
            {NAV.map((n) => (
              <div
                key={n.label}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
                  n.active
                    ? "bg-primary/15 text-foreground"
                    : "text-text-secondary"
                }`}
              >
                <n.icon className="h-3.5 w-3.5" />
                {n.label}
              </div>
            ))}
          </div>
        </aside>

        {/* conteúdo */}
        <div className="flex-1 p-4">
          {/* nível */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/15 to-surface-2 p-4">
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">
              Seu nível no ecossistema Python
            </p>
            <p className="mt-1 text-lg font-bold">🚀 Praticante</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
              <div className="h-full w-2/3 rounded-full bg-brand" />
            </div>
          </div>

          {/* stats */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ["74", "Módulos", "text-primary-light"],
              ["68%", "Conclusão", "text-green"],
              ["120h", "Estudadas", "text-blue"],
            ].map(([v, l, c]) => (
              <div key={l} className="rounded-lg border border-border bg-surface-2 p-2.5">
                <p className={`text-base font-bold ${c}`}>{v}</p>
                <p className="text-[10px] text-text-secondary">{l}</p>
              </div>
            ))}
          </div>

          {/* gráfico */}
          <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3">
            <p className="mb-2 text-[10px] text-text-secondary">Progresso por área</p>
            <div className="flex h-20 items-end gap-1.5">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-brand"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
