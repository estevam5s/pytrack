import {
  computeStats,
  getBooks,
  getContents,
  getProfile,
  getProgressMap,
  getUdemyCourses,
} from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  CareerConsultant,
  type ConsultantData,
} from "@/components/career/career-consultant";

export const metadata = { title: "Consultor de Carreira IA · PyTrack" };

export default async function ConsultorPage() {
  const [profile, contents, progress, books, courses] = await Promise.all([
    getProfile(),
    getContents(),
    getProgressMap(),
    getBooks(),
    getUdemyCourses(),
  ]);

  const stats = computeStats(contents, progress);
  const data: ConsultantData = {
    modulesCompleted: stats.completed,
    modulesTotal: stats.total,
    overallPct: stats.overallPercentage,
    hours: stats.hoursStudied,
    books: books.filter((b) => b.status === "concluido").length,
    courses: courses.filter((c) => c.status === "concluido").length,
    byArea: stats.byArea.map((a) => ({
      area: a.area,
      percentage: a.percentage,
    })),
    goal: profile?.goal ?? undefined,
  };

  return (
    <div>
      <PageHeader
        title="Consultor de Carreira IA"
        description="Um agente de IA analisa sua evolução e experiência em todo o ecossistema Python e avalia se você está apto a ser um profissional de TI em Python."
      />
      <CareerConsultant data={data} />
    </div>
  );
}
