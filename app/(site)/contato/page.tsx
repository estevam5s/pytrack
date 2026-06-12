import type { Metadata } from "next";
import { Mail, MessageSquare, MapPin, Clock, Github, Linkedin } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe da PyTrack. Envie sua mensagem, dúvida ou sugestão — respondemos por e-mail.",
};

const CHANNELS = [
  { icon: Mail, label: "E-mail", value: "contato@estevamsouza.com.br", href: "mailto:contato@estevamsouza.com.br" },
  { icon: Github, label: "GitHub", value: "@PyTrackOrganization", href: "https://github.com/PyTrackOrganization" },
  { icon: Linkedin, label: "LinkedIn", value: "PyTrack", href: "https://www.linkedin.com/company/pytrack/about/?viewAsMember=true" },
];

export default function ContatoPage() {
  return (
    <>
      <PageHero
        badge="Contato"
        title="Fale com a"
        highlight="PyTrack"
        description="Dúvidas, sugestões, parcerias ou suporte? Envie sua mensagem — ela chega direto para a nossa equipe e respondemos no seu e-mail."
      />

      <section className="container max-w-5xl py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* formulário */}
          <Reveal>
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <MessageSquare className="h-5 w-5 text-primary-light" /> Envie uma mensagem
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Preencha o formulário abaixo. Sua mensagem é enviada diretamente ao proprietário da plataforma.
              </p>
              <div className="mt-5">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          {/* canais + info */}
          <Reveal delay={0.1}>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm font-semibold">Canais diretos</p>
                <div className="mt-3 space-y-2.5">
                  {CHANNELS.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 p-3 transition-colors hover:border-primary/40"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
                        <c.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{c.label}</span>
                        <span className="block truncate text-xs text-text-secondary">{c.value}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5 text-sm text-text-secondary">
                <p className="flex items-center gap-2 text-foreground"><Clock className="h-4 w-4 text-primary-light" /> Tempo de resposta</p>
                <p className="mt-1">Normalmente respondemos em até <strong className="text-foreground">24 horas úteis</strong>.</p>
                <p className="mt-3 flex items-center gap-2 text-foreground"><MapPin className="h-4 w-4 text-primary-light" /> Onde estamos</p>
                <p className="mt-1">Brasil 🇧🇷 — plataforma 100% online.</p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 text-sm">
                <p className="font-medium">Já é assinante?</p>
                <p className="mt-1 text-text-secondary">
                  Use o <strong>Suporte</strong> dentro da plataforma para um atendimento vinculado à sua conta.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
