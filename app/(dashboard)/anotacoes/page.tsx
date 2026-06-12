import Link from "next/link";
import { redirect } from "next/navigation";
import { NotebookPen, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/states";

export const metadata = { title: "Anotações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AnotacoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: notes } = await supabase
    .from("module_notes")
    .select("content_slug, content_title, body, updated_at")
    .eq("user_id", user.id)
    .not("body", "eq", "")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Minhas anotações" description="Tudo o que você anotou enquanto estudava, num só lugar. As anotações são salvas automaticamente em cada módulo." />
      {!notes || notes.length === 0 ? (
        <EmptyState title="Nenhuma anotação ainda" description="Abra um conteúdo em Trilhas e clique em 'Anotações' para começar a escrever." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((n) => (
            <div key={n.content_slug} className="card flex flex-col p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 font-semibold"><NotebookPen className="h-4 w-4 text-primary-light" /> {(n.content_title as string) ?? n.content_slug}</p>
                <span className="text-[11px] text-text-secondary">{new Date(n.updated_at as string).toLocaleDateString("pt-BR")}</span>
              </div>
              <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary line-clamp-[10]">{n.body as string}</p>
              <Link href={`/conteudos/${n.content_slug}`} className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary-light hover:underline"><BookOpen className="h-3.5 w-3.5" /> Abrir módulo</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
