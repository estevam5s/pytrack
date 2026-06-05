import { getContents, getProgressMap } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConteudosView } from "@/components/dashboard/conteudos-view";

export const metadata = { title: "Conteúdos · PyTrack" };

export default async function ConteudosPage() {
  const [contents, progressMap] = await Promise.all([
    getContents(),
    getProgressMap(),
  ]);

  return (
    <div>
      <PageHeader
        title="Conteúdos"
        description="Trilhas e módulos do ecossistema Python organizados por área, nível e categoria. Marque seu progresso à medida que avança."
      />
      <ConteudosView contents={contents} progressMap={progressMap} />
    </div>
  );
}
