import { Briefcase, ExternalLink, MapPin, Target } from "lucide-react";
import { getJobs } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VagasView } from "@/components/dashboard/vagas-view";

export const metadata = { title: "Vagas · PyTrack" };

const BOARDS = [
  { name: "LinkedIn", url: "https://www.linkedin.com/jobs/search/?keywords=python", desc: "Maior rede profissional, vagas nacionais e remotas." },
  { name: "Gupy", url: "https://portal.gupy.io/", desc: "Plataforma de recrutamento usada por muitas empresas brasileiras." },
  { name: "Remotar", url: "https://remotar.com.br/", desc: "Vagas 100% remotas em tecnologia." },
  { name: "We Work Remotely", url: "https://weworkremotely.com/categories/remote-programming-jobs", desc: "Vagas remotas internacionais." },
  { name: "Trampos.co", url: "https://trampos.co/", desc: "Oportunidades em tecnologia e produto no Brasil." },
  { name: "RemoteOK", url: "https://remoteok.com/remote-python-jobs", desc: "Agregador de vagas remotas de Python." },
];

const ROLES = [
  { title: "Python Developer Jr", level: "Júnior", area: "Backend", terms: "python+junior" },
  { title: "Backend Developer (Python)", level: "Pleno", area: "Backend", terms: "python+backend" },
  { title: "Data Analyst", level: "Júnior/Pleno", area: "Dados", terms: "data+analyst+python" },
  { title: "Data Engineer", level: "Pleno/Sênior", area: "Dados", terms: "data+engineer+python" },
  { title: "Automation Engineer", level: "Pleno", area: "Automação", terms: "automation+python" },
  { title: "ML Engineer", level: "Sênior", area: "IA", terms: "machine+learning+python" },
];

export default async function VagasPage() {
  const jobs = await getJobs();

  return (
    <div>
      <PageHeader
        title="Vagas"
        description="Salve e organize vagas de TI: cole o link e a IA identifica cargo, salário, modalidade, stack e habilidades."
      />

      <section className="mb-10">
        <VagasView jobs={jobs} />
      </section>

      <div className="mb-8 h-px bg-border" />

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Plataformas de vagas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOARDS.map((b) => (
            <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer">
              <Card hover className="group h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <ExternalLink className="h-4 w-4 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <h3 className="mt-3 font-semibold">{b.name}</h3>
                  <p className="mt-1 text-xs text-text-secondary">{b.desc}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Cargos para buscar
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => (
            <a
              key={r.title}
              href={`https://www.linkedin.com/jobs/search/?keywords=${r.terms}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card hover className="h-full">
                <CardContent className="p-5">
                  <h3 className="font-medium">{r.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                    <Badge className="border-primary/30 bg-primary/10 text-primary">
                      {r.level}
                    </Badge>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {r.area}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <Card className="card-gradient">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Como se preparar</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
              <li>• Monte um portfólio com 3 a 5 projetos da página de Projetos.</li>
              <li>• Pratique os exercícios e domine os fundamentos antes das entrevistas.</li>
              <li>• Escolha uma trilha de carreira e siga o roadmap até o fim.</li>
              <li>• Tenha um GitHub organizado com READMEs claros e commits frequentes.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
