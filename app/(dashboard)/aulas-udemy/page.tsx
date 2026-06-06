import { getUdemyCourses } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { UdemyView } from "@/components/dashboard/udemy-view";

export const metadata = { title: "Aulas Udemy · PyTrack" };

export default async function UdemyPage() {
  const courses = await getUdemyCourses();

  return (
    <div>
      <PageHeader
        title="Aulas Udemy"
        description="Organize seus cursos, acompanhe a evolução em gráficos e clique em cada curso para ver detalhes, stack e análise com IA — além de analisar sua trilha de cursos como um todo."
      />
      <UdemyView courses={courses} />
    </div>
  );
}
