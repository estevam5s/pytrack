import { Briefcase, ExternalLink, MapPin } from "lucide-react";
import type { CommunityJob } from "@/types/community";

export function JobCard({ job }: { job: CommunityJob }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
          <Briefcase className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{job.title}</p>
          <p className="truncate text-xs text-text-secondary">{job.company}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-text-secondary">
            {job.seniority && (
              <span className="rounded-full bg-surface-2 px-1.5">{job.seniority}</span>
            )}
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {job.remote ? "Remoto" : job.location || "—"}
            </span>
            {job.salary_range && <span className="text-secondary">{job.salary_range}</span>}
          </div>
        </div>
      </div>
      {job.apply_url && (
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-light hover:underline"
        >
          Candidatar-se <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
