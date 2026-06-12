import Link from "next/link";
import { Smartphone, Monitor, Puzzle, Send, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";

const ITEMS = [
  { icon: Puzzle, accent: "#9956F6", title: "Extensão VS Code", desc: "Plano, projetos, snippets e IA dentro do seu editor.", tag: "Suprema", href: "/apps" },
  { icon: Smartphone, accent: "#29E0A9", title: "App Android", desc: "Estude no celular: trilhas, exercícios e comunidade.", tag: "Mobile", href: "/apps" },
  { icon: Monitor, accent: "#5F75F2", title: "App Desktop", desc: "Windows, macOS e Linux — com IDE Python embutida.", tag: "Desktop", href: "/apps" },
  { icon: Send, accent: "#2CA5E0", title: "Bot do Telegram", desc: "Gerencie o plano e resolva exercícios com IA no chat.", tag: "Telegram", href: "/bot" },
];

export function AppsShowcase() {
  return (
    <section className="container max-w-6xl py-16">
      <SectionHeader
        badge="Multiplataforma"
        title="A PyTrack onde você estiver"
        description="Além da web: extensão para VS Code, app Android e app desktop para Windows, macOS e Linux — tudo conectado ao mesmo progresso."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.08}>
            <Link href={it.href} className="group block h-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/40">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: it.accent + "22", color: it.accent }}>
                <it.icon className="h-6 w-6" />
              </span>
              <span className="mt-4 inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium" style={{ borderColor: it.accent + "55", color: it.accent }}>
                {it.tag}
              </span>
              <h3 className="mt-2 text-lg font-bold">{it.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{it.desc}</p>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/apps" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">
          Ver apps e extensão <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
