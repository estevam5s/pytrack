import { cn } from "@/lib/utils";
import { type LucideIcon, Inbox, Loader2 } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex animate-fade-in flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-text-secondary">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("shimmer rounded-md bg-muted/60", className)}
      aria-hidden
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-5">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}
