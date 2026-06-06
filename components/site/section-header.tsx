import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
  className,
}: {
  badge?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "text-left mx-0",
        className,
      )}
    >
      {badge && (
        <span className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
