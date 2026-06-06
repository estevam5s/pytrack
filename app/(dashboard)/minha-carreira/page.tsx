import Link from "next/link";
import { Briefcase, Layers, MapPinned, Sparkles } from "lucide-react";
import { getCareerPaths, getStackItems } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { CarreiraView } from "@/components/dashboard/carreira-view";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { EmptyState } from "@/components/ui/states";

export const metadata = { title: "Carreira · PyTrack" };

export default async function CarreiraPage() {
  const [careers, stack] = await Promise.all([
    getCareerPaths(),
    getStackItems(),
  ]);
  const stackCategories = Array.from(new Set(stack.map((s) => s.category))).sort();
  const areas = new Set(careers.map((c) => c.area)).size;

  return (
    <div>
      <PageHeader
        title="Trilhas de carreira"
        description="Caminhos profissionais com Python: habilidades, roadmap, tecnologias, demanda de mercado e progressão de senioridade e salário."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Trilhas de carreira" value={careers.length} icon={Briefcase} />
        <StatCard label="Áreas" value={areas} icon={MapPinned} accent="secondary" />
        <StatCard label="Tecnologias no ecossistema" value={stack.length} icon={Layers} accent="warning" />
      </div>

      {careers.length === 0 ? (
        <EmptyState icon={Briefcase} title="Nenhuma trilha cadastrada" />
      ) : (
        <CarreiraView careers={careers} />
      )}

      {/* Ecossistema do Python */}
      <section className="mt-12">
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Sparkles className="h-5 w-5 text-primary" /> Ecossistema do Python
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {stack.length} tecnologias que sustentam essas carreiras.{" "}
            <Link href="/stack" className="text-primary hover:underline">
              Ver detalhes na Stack
            </Link>
            .
          </p>
        </div>

        <div className="space-y-6">
          {stackCategories.map((cat) => (
            <div key={cat}>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {cat}
              </h3>
              <div className="flex flex-wrap gap-2">
                {stack
                  .filter((s) => s.category === cat)
                  .map((s) => (
                    <a
                      key={s.id}
                      href={s.documentation_url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.description ?? s.name}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <DynamicIcon name={s.icon} className="h-4 w-4 text-primary" />
                      {s.name}
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
