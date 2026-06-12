import { Megaphone, Rocket, Sparkles, Wrench, Bug, Clock } from "lucide-react";
import { PLATFORM_NEWS, ROADMAP } from "@/lib/news-data";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Novidades · PyTrack" };

const TYPE: Record<string, { label: string; cls: string; icon: typeof Sparkles }> = {
  novo: { label: "Novo", cls: "border-green/30 bg-green/10 text-green", icon: Sparkles },
  melhoria: { label: "Melhoria", cls: "border-blue/30 bg-blue/10 text-blue", icon: Wrench },
  correcao: { label: "Correção", cls: "border-warning/30 bg-warning/10 text-warning", icon: Bug },
  "em-breve": { label: "Em breve", cls: "border-primary/30 bg-primary/10 text-primary-light", icon: Clock },
};

export default function NovidadesPage() {
  return (
    <div>
      <PageHeader
        title="Novidades da plataforma"
        description="Tudo que está melhorando na PyTrack e as novas funcionalidades que estão por vir."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* changelog */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
            <Megaphone className="h-4 w-4 text-primary" /> Atualizações recentes
          </h2>
          <div className="relative space-y-4 border-l border-border pl-6">
            {PLATFORM_NEWS.map((n, i) => {
              const t = TYPE[n.type] ?? TYPE.novo;
              const Icon = t.icon;
              return (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-primary-light">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase", t.cls)}>{t.label}</span>
                        <span className="text-xs text-text-secondary">
                          {new Date(n.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                      </div>
                      <p className="mt-2 font-semibold">{n.title}</p>
                      <p className="text-sm text-text-secondary">{n.description}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* roadmap */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
            <Rocket className="h-4 w-4 text-primary" /> Próximos passos
          </h2>
          <div className="space-y-3">
            {ROADMAP.map((r, i) => (
              <Card key={i} className="border-primary/20">
                <CardContent className="p-4">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-light">{r.quarter}</span>
                  <p className="mt-2 font-semibold">{r.title}</p>
                  <p className="text-sm text-text-secondary">{r.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
