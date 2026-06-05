import { HelpCircle, Layers, MessageCircleQuestion } from "lucide-react";
import { getInterviewQuestions } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionsView } from "@/components/dashboard/questions-view";
import { FaqAccordion, type FaqItem } from "@/components/dashboard/faq-accordion";

export const metadata = { title: "Perguntas de Carreira · PyTrack" };

const FAQ: FaqItem[] = [
  {
    question: "Por onde começar a aprender Python para carreira?",
    answer:
      "Comece pelos fundamentos: sintaxe, tipos, coleções, controle de fluxo e funções. Em seguida, POO e estruturas de dados. Só depois escolha uma área (backend, dados, automação) e siga o roadmap correspondente na página de Carreira. Aprenda escolhendo a stack pelo problema, não pela popularidade.",
  },
  {
    question: "Preciso de faculdade para trabalhar com Python?",
    answer:
      "Não é obrigatório. O mercado valoriza muito portfólio, projetos reais e capacidade de resolver problemas. Faculdade ajuda em fundamentos de computação (algoritmos, redes, sistemas), mas você pode construir uma carreira sólida com estudo direcionado, projetos e contribuições open source.",
  },
  {
    question: "Quais áreas pagam melhor com Python?",
    answer:
      "Engenharia de Dados, Machine Learning Engineering e Engenharia de Software sênior costumam ter as melhores faixas. Backend pleno/sênior com FastAPI/Django e bom domínio de PostgreSQL, Docker e arquitetura também é muito bem remunerado. A senioridade e o impacto pesam mais que a área isolada.",
  },
  {
    question: "Como me preparar para entrevistas técnicas em Python?",
    answer:
      "Use a aba 'Tecnologias' desta página: são centenas de perguntas reais por tema, com conceito-chave, aplicação prática, erros comuns e como fixar rápido. Domine fundamentos, saiba explicar decisões de design (SOLID, KISS, YAGNI) e conheça bem seu stack: testes, tipagem, async, banco e Git.",
  },
  {
    question: "O que colocar no portfólio?",
    answer:
      "De 3 a 5 projetos que demonstrem o que a vaga pede: uma API REST com autenticação e testes, um projeto de dados (ETL ou dashboard), uma automação útil e, se possível, algo com deploy real (Docker + nuvem). READMEs claros e commits frequentes valem mais que muitos projetos incompletos.",
  },
  {
    question: "Como evoluir de júnior para pleno e sênior?",
    answer:
      "Júnior domina a linguagem e entrega tarefas. Pleno escolhe boas ferramentas, escreve testes, faz deploy e opera o que constrói. Sênior pensa em arquitetura, modelagem de domínio, performance, segurança e mentora o time. Busque profundidade em fundamentos, internals e avaliação de trade-offs.",
  },
];

export default async function PerguntasPage() {
  const questions = await getInterviewQuestions();
  const categories = new Set(questions.map((q) => q.category)).size;

  return (
    <div>
      <PageHeader
        title="Perguntas de Carreira em Python"
        description="Banco de perguntas reais de entrevista organizadas por tecnologia, cada uma com conceito-chave, aplicação prática, erros comuns e como fixar rápido."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Perguntas" value={questions.length} icon={MessageCircleQuestion} />
        <StatCard label="Tecnologias" value={categories} icon={Layers} accent="secondary" />
        <StatCard label="Guia de carreira" value={FAQ.length} icon={HelpCircle} accent="warning" />
      </div>

      <Tabs defaultValue="tecnologias">
        <TabsList>
          <TabsTrigger value="tecnologias">Por tecnologia</TabsTrigger>
          <TabsTrigger value="carreira">Carreira</TabsTrigger>
        </TabsList>
        <TabsContent value="tecnologias">
          <QuestionsView questions={questions} />
        </TabsContent>
        <TabsContent value="carreira">
          <div className="max-w-3xl">
            <FaqAccordion items={FAQ} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
