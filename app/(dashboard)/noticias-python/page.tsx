import { Newspaper, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Notícias do Python · PyTrack" };

// Fontes oficiais e confiáveis do ecossistema Python (curado, sempre atualizável).
const SOURCES = [
  { name: "Python Insider (oficial)", desc: "Anúncios de releases e novidades da linguagem.", url: "https://blog.python.org/", tag: "Linguagem" },
  { name: "PyCoder's Weekly", desc: "Newsletter semanal com o melhor do Python.", url: "https://pycoders.com/", tag: "Newsletter" },
  { name: "Real Python", desc: "Tutoriais e artigos aprofundados.", url: "https://realpython.com/", tag: "Tutoriais" },
  { name: "PSF News", desc: "Notícias da Python Software Foundation.", url: "https://pyfound.blogspot.com/", tag: "Comunidade" },
  { name: "Talk Python (podcast)", desc: "Entrevistas com criadores e libs do ecossistema.", url: "https://talkpython.fm/", tag: "Podcast" },
  { name: "Hugging Face Blog", desc: "Novidades de IA/ML em Python.", url: "https://huggingface.co/blog", tag: "IA/ML" },
  { name: "FastAPI / Releases", desc: "Atualizações do framework de APIs.", url: "https://fastapi.tiangolo.com/release-notes/", tag: "Backend" },
  { name: "Pandas Blog", desc: "Novidades de análise de dados.", url: "https://pandas.pydata.org/community/blog/", tag: "Dados" },
];

const HIGHLIGHTS = [
  { title: "Python 3.14 — novidades", text: "Acompanhe as melhorias de performance, type hints e a evolução do interpretador sem GIL.", tag: "Linguagem" },
  { title: "IA Generativa com Python", text: "LangChain, LlamaIndex, vLLM e os frameworks que dominam o desenvolvimento de aplicações com LLMs.", tag: "IA" },
  { title: "Polars vs Pandas", text: "A engine de dados em Rust continua ganhando espaço pela performance em grandes volumes.", tag: "Dados" },
  { title: "FastAPI + async", text: "O padrão moderno para APIs Python de alta performance segue em forte adoção no mercado.", tag: "Backend" },
];

export default function NoticiasPythonPage() {
  return (
    <div>
      <PageHeader
        title="Notícias do ecossistema Python"
        description="Acompanhe as novidades de tecnologia em Python: linguagem, IA, dados, backend e comunidade."
      />

      {/* destaques */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">Em destaque</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {HIGHLIGHTS.map((h) => (
          <Card key={h.title} className="card-hover">
            <CardContent className="p-5">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-light">{h.tag}</span>
              <p className="mt-2 font-semibold">{h.title}</p>
              <p className="text-sm text-text-secondary">{h.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* fontes */}
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
        <Newspaper className="h-4 w-4 text-primary" /> Fontes recomendadas
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SOURCES.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover flex flex-col p-4"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-text-secondary">{s.tag}</span>
              <ExternalLink className="h-3.5 w-3.5 text-text-secondary" />
            </div>
            <p className="mt-2 font-semibold">{s.name}</p>
            <p className="text-sm text-text-secondary">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
