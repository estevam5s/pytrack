import Image from "next/image";
import { Github, Linkedin, Quote } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { GradientText } from "@/components/site/gradient-text";

export function FounderSection() {
  return (
    <section className="container py-20">
      <SectionHeader
        badge="Quem está por trás"
        title={<>Conheça o <GradientText>fundador</GradientText></>}
        description="A PyTrack nasce da paixão por ensinar Python de forma prática e acessível."
      />

      <Reveal className="mx-auto mt-12 max-w-4xl">
        <div className="grid items-center gap-8 rounded-3xl border border-border bg-gradient-to-br from-surface-2 to-surface p-8 sm:p-10 lg:grid-cols-[280px_1fr]">
          {/* foto */}
          <div className="relative mx-auto w-fit">
            <div className="absolute -inset-2 rounded-3xl bg-brand opacity-30 blur-xl" />
            <Image
              src="/founder.jpg"
              alt="Estevam Souza — fundador da PyTrack"
              width={260}
              height={260}
              className="relative aspect-square w-56 rounded-3xl object-cover sm:w-64"
            />
          </div>

          {/* descrição */}
          <div>
            <h3 className="text-2xl font-bold">Estevam Souza</h3>
            <p className="text-sm font-medium text-primary-light">
              Fundador & Desenvolvedor · PyTrack
            </p>

            <div className="mt-4 flex gap-2.5">
              <Quote className="h-6 w-6 shrink-0 text-primary/40" />
              <p className="text-sm leading-relaxed text-text-secondary">
                Desenvolvedor apaixonado pelo ecossistema Python, criei a PyTrack
                para resolver um problema que eu mesmo vivi: aprender de forma
                fragmentada, sem direção. A plataforma reúne trilhas guiadas,
                prática real com IA, IDE no navegador, projetos de portfólio e
                preparação de carreira — tudo pensado para transformar
                iniciantes em desenvolvedores Python empregáveis.
              </p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              Construí cada detalhe da PyTrack com tecnologia moderna (Next.js,
              Supabase, IA) e foco total na experiência de quem estuda — do
              primeiro <code className="rounded bg-surface px-1.5 py-0.5 text-xs">print()</code> ao
              primeiro emprego. Minha missão é simples: deixar o caminho até a
              carreira em Python mais claro, prático e ao alcance de todos.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/company/pytrack/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href="https://github.com/PyTrackOrganization"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
