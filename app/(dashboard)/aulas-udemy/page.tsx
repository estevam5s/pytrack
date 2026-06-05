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
        description="Organize seus cursos da Udemy: adicione, edite e remova. Cole a URL para importar o banner e as informações automaticamente."
      />
      <UdemyView courses={courses} />
    </div>
  );
}
