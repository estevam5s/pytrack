import { FolderGit2, Layers, Trophy, Wrench } from "lucide-react";
import { getProjects } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { ProjetosView } from "@/components/dashboard/projetos-view";

export const metadata = { title: "Projetos · PyTrack" };

export default async function ProjetosPage() {
  const projects = await getProjects();
  const areas = new Set(projects.map((p) => p.area)).size;
  const advanced = projects.filter(
    (p) => p.difficulty === "avancado" || p.difficulty === "desafio",
  ).length;
  const techs = new Set(projects.flatMap((p) => p.technologies)).size;

  return (
    <div>
      <PageHeader
        title="Projetos práticos"
        description="Milhares de projetos para aprender construindo — cada um com objetivo, requisitos, tecnologias e passo a passo, do básico ao desafio real. Filtre por área, dificuldade ou tecnologia, favorite e acompanhe seu progresso."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projetos" value={projects.length} icon={FolderGit2} />
        <StatCard label="Áreas" value={areas} icon={Layers} accent="secondary" />
        <StatCard label="Avançado / Desafio" value={advanced} icon={Trophy} accent="warning" />
        <StatCard label="Tecnologias" value={techs} icon={Wrench} />
      </div>

      <ProjetosView projects={projects} />
    </div>
  );
}
