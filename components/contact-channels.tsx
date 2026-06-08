import { Github, Globe, Linkedin, Mail } from "lucide-react";

const CHANNELS = [
  {
    icon: Mail,
    label: "E-mail",
    desc: "contato@estevamsouza.com.br",
    href: "mailto:contato@estevamsouza.com.br",
    accent: "text-primary-light bg-primary/10",
  },
  {
    icon: Github,
    label: "GitHub",
    desc: "@PyTrackOrganization",
    href: "https://github.com/PyTrackOrganization",
    accent: "text-foreground bg-surface-2",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    desc: "PyTrack",
    href: "https://www.linkedin.com/company/pytrack/about/?viewAsMember=true",
    accent: "text-blue bg-blue/10",
  },
  {
    icon: Globe,
    label: "Site",
    desc: "www.pytrack.com.br",
    href: "https://www.pytrack.com.br",
    accent: "text-green bg-green/10",
  },
];

/** Canais oficiais de contato/comunidade da PyTrack. Reutilizável. */
export function ContactChannels({ columns = 4 }: { columns?: 2 | 3 | 4 }) {
  const grid =
    columns === 2 ? "sm:grid-cols-2" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div className={`grid gap-3 ${grid}`}>
      {CHANNELS.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target={c.href.startsWith("http") ? "_blank" : undefined}
          rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-primary/40 hover:bg-surface-2"
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${c.accent}`}>
            <c.icon className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">{c.label}</span>
            <span className="block truncate text-xs text-text-secondary">{c.desc}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
