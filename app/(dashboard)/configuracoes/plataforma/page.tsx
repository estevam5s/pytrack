import { CheckCircle2, Database } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Plataforma · Configurações · PyTrack" };

export default async function PlataformaPage() {
  const supabase = await createClient();

  const head = (table: string) =>
    supabase.from(table).select("id", { count: "exact", head: true });
  const [contents, exercises, questions, projects, books, stack] =
    await Promise.all([
      head("contents"),
      head("practice_exercises"),
      head("interview_questions"),
      head("projects"),
      head("books"),
      head("stack_items"),
    ]);

  const supabaseProject = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
    .replace("https://", "")
    .split(".")[0];

  const platformStats = [
    { label: "Módulos", value: contents.count ?? 0 },
    { label: "Exercícios", value: exercises.count ?? 0 },
    { label: "Perguntas", value: questions.count ?? 0 },
    { label: "Projetos", value: projects.count ?? 0 },
    { label: "Livros", value: books.count ?? 0 },
    { label: "Tecnologias", value: stack.count ?? 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" /> Plataforma e Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm">
            <span className="text-text-secondary">Projeto</span>
            <span className="font-mono text-xs">{supabaseProject}</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm">
            <span className="text-text-secondary">Status</span>
            <span className="inline-flex items-center gap-1.5 text-secondary">
              <CheckCircle2 className="h-3.5 w-3.5" /> Conectado
            </span>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Conteúdo disponível
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {platformStats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-surface/60 p-3 text-center"
              >
                <p className="text-lg font-bold leading-none">
                  {s.value.toLocaleString("pt-BR")}
                </p>
                <p className="mt-1 text-[10px] text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
