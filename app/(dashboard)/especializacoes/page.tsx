import { PageHeader } from "@/components/dashboard/page-header";
import { SpecializationsView } from "@/components/dashboard/specializations-view";
import { SPECIALIZATIONS } from "@/lib/specializations";

export const metadata = { title: "Especializações · PyTrack" };

export default function EspecializacoesPage() {
  const total = SPECIALIZATIONS.length;
  return (
    <div>
      <PageHeader
        title="Especializações"
        description="Trilhas avançadas para você se especializar em áreas de ponta do ecossistema Python — com roadmap, tecnologias e projetos."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["🚀", `${total}`, "Especializações"],
          ["🧭", "Roadmaps", "Passo a passo"],
          ["🛠️", "Projetos", "Para o portfólio"],
          ["💼", "Carreira", "Cargos e salários"],
        ].map(([emoji, value, label]) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="text-xl">{emoji}</div>
            <p className="mt-1 text-lg font-bold">{value}</p>
            <p className="text-xs text-text-secondary">{label}</p>
          </div>
        ))}
      </div>

      <SpecializationsView />
    </div>
  );
}
