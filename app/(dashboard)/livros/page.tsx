import { createClient } from "@/lib/supabase/server";
import { getBooks } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { LivrosView } from "@/components/dashboard/livros-view";

export const metadata = { title: "Livros · PyTrack" };

export default async function LivrosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const books = await getBooks();

  return (
    <div>
      <PageHeader
        title="Biblioteca"
        description="Livros recomendados e a sua biblioteca pessoal. Adicione, edite, faça upload da capa e do arquivo do livro."
      />
      <LivrosView books={books} userId={user?.id ?? ""} />
    </div>
  );
}
