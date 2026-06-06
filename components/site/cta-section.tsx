import { ArrowRight } from "lucide-react";
import { Button } from "@/components/site/site-button";
import { GradientText } from "./gradient-text";
import { Reveal } from "./reveal";
import { LOGIN_URL, SIGNUP_URL } from "@/lib/site-links";

export function CTASection({
  title = "Comece sua jornada Python hoje",
  subtitle = "Crie sua conta gratuita e tenha acesso a trilhas, exercícios, projetos e um dashboard que mostra sua evolução de verdade.",
}: {
  title?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="container py-20">
      <Reveal className="relative overflow-hidden rounded-3xl border border-primary/30 bg-surface px-6 py-16 text-center sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-60" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            {typeof title === "string" ? (
              <>
                {title.split(" Python")[0]} <GradientText>Python</GradientText>
                {title.split(" Python")[1] ?? ""}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">{subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={SIGNUP_URL} variant="gradient" size="lg">
              Começar minha jornada Python <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href={LOGIN_URL} variant="outline" size="lg">
              Já tenho conta
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
