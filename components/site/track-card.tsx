import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIGNUP_URL } from "@/lib/site-links";
import type { Track } from "@/lib/site-data";

export function TrackCard({ track }: { track: Track }) {
  const Icon = track.icon;
  return (
    <a href={SIGNUP_URL} className="card card-hover group flex h-full flex-col p-6">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
          track.accent,
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">
          {track.level}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
          <Clock className="h-3 w-3" /> {track.duration}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold">{track.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
        {track.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-light">
        Ver trilha
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </a>
  );
}
