import { Dumbbell, Layers, Trophy } from "lucide-react";
import { getPracticeExercises } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { PracticeExercisesView } from "@/components/dashboard/practice-exercises-view";

export const metadata = { title: "Exercícios · PyTrack" };

export default async function ExerciciosPage() {
  const practice = await getPracticeExercises();

  const groups = new Set(practice.map((p) => p.group_label)).size;
  const advanced = practice.filter(
    (p) => p.level === "avancado" || p.level === "desafio",
  ).length;

  return (
    <div>
      <PageHeader
        title="Exercícios"
        description="Banco progressivo de prática com objetivo, requisitos, critérios de aceite e checklist de entrega para cada exercício — do básico ao nível especialista."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Exercícios de prática" value={practice.length} icon={Dumbbell} />
        <StatCard label="Categorias" value={groups} icon={Layers} accent="secondary" />
        <StatCard label="Avançado / Especialista" value={advanced} icon={Trophy} accent="warning" />
      </div>

      <PracticeExercisesView exercises={practice} />
    </div>
  );
}
