import { BarChart3, Code2, Sparkles, Trophy } from "lucide-react";
import { SectionHeader } from "@/components/site/section-header";
import { GradientText } from "@/components/site/gradient-text";
import { Reveal } from "@/components/site/reveal";
import { ScrollVideo } from "@/components/site/scroll-video";

const HIGHLIGHTS = [
  { icon: BarChart3, title: "Acompanhe sua evolução", desc: "XP, níveis, progresso por área e horas estudadas em um painel claro." },
  { icon: Code2, title: "IDE Python integrada", desc: "Rode código no navegador e resolva exercícios sem instalar nada." },
  { icon: Sparkles, title: "Foco com café", desc: "Pomodoro embutido para estudar com ritmo e constância." },
  { icon: Trophy, title: "Gamificação", desc: "Suba de nível, ganhe conquistas e mantenha a sequência de estudos." },
];

export function DashboardShowcase() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
      <div className="container relative">
        <SectionHeader
          badge="Por dentro da plataforma"
          title={<>Veja como é o seu <GradientText>painel de aprendizado</GradientText></>}
          description="Tudo o que você precisa para aprender Python, organizado em um dashboard profissional e intuitivo."
        />

        <Reveal className="mx-auto mt-12 max-w-5xl">
          {/* moldura estilo navegador */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-warning/70" />
              <span className="h-3 w-3 rounded-full bg-green/70" />
              <span className="ml-3 hidden rounded-md bg-surface px-3 py-1 text-xs text-text-secondary sm:inline">
                www.pytrack.com.br/inicio
              </span>
            </div>
            <ScrollVideo poster="/dashboard-preview.jpg" className="w-full" />
          </div>
        </Reveal>

        {/* destaques */}
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.08}>
              <div className="rounded-xl border border-border bg-surface p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
                  <h.icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-semibold">{h.title}</p>
                <p className="text-sm text-text-secondary">{h.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
