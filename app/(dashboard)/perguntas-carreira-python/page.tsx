import { Layers, MessageCircleQuestion } from "lucide-react";
import { getInterviewQuestions } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { QuestionsView } from "@/components/dashboard/questions-view";

export const metadata = { title: "Perguntas de Carreira · PyTrack" };

export default async function PerguntasPage() {
  const questions = await getInterviewQuestions();
  const categories = new Set(questions.map((q) => q.category)).size;

  return (
    <div>
      <PageHeader
        title="Perguntas de Carreira em Python"
        description="Banco de perguntas reais de entrevista organizadas por tecnologia, cada uma com conceito-chave, aplicação prática, erros comuns e como fixar rápido."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-2">
        <StatCard label="Perguntas" value={questions.length} icon={MessageCircleQuestion} />
        <StatCard label="Tecnologias" value={categories} icon={Layers} accent="secondary" />
      </div>

      <QuestionsView questions={questions} />
    </div>
  );
}
