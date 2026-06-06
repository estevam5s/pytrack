import { ArrowUpRight, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIGNUP_URL } from "@/lib/site-links";
import type { Project } from "@/lib/site-data";

const DIFF: Record<string, string> = {
  "Básico": "border-green/30 bg-green/10 text-green",
  "Intermediário": "border-blue/30 bg-blue/10 text-blue",
  "Avançado": "border-primary-light/30 bg-primary/10 text-primary-light",
  "Desafio": "border-magenta/30 bg-magenta/10 text-magenta",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card card-hover group flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-primary-light">
          <FolderGit2 className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
            DIFF[project.difficulty] ?? "border-border text-text-secondary",
          )}
        >
          {project.difficulty}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{project.title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary">
        {project.result}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.map((t) => (
          <span
            key={t}
            className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-primary-light"
          >
            {t}
          </span>
        ))}
      </div>
      <a
        href={SIGNUP_URL}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
      >
        Explorar projeto
        <ArrowUpRight className="h-4 w-4 text-primary-light transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>
  );
}
