"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FEED_FILTERS, POPULAR_TAGS, PYTHON_AREAS } from "@/lib/community/levels";
import { cn } from "@/lib/utils";

function useActive() {
  const params = useSearchParams();
  return params.get("filtro") ?? "feed";
}

export function CommunitySidebar() {
  const active = useActive();
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-2">
          <nav className="space-y-0.5">
            {FEED_FILTERS.map((f) => (
              <Link
                key={f.key}
                href={`/comunidade?filtro=${f.key}`}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active === f.key
                    ? "bg-primary/15 text-primary"
                    : "text-text-secondary hover:bg-surface hover:text-foreground",
                )}
              >
                <f.icon className="h-4 w-4" /> {f.label}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Áreas Python
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PYTHON_AREAS.map((a) => (
              <Link
                key={a}
                href={`/comunidade?q=${encodeURIComponent(a)}`}
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {a}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Tags populares
          </p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_TAGS.map((t) => (
              <Link
                key={t}
                href={`/comunidade?q=${encodeURIComponent(t)}`}
                className="inline-flex items-center gap-0.5 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-primary-light transition-opacity hover:opacity-80"
              >
                <Hash className="h-2.5 w-2.5" />
                {t}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function MobileFilterBar() {
  const active = useActive();
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
      {FEED_FILTERS.map((f) => (
        <Link
          key={f.key}
          href={`/comunidade?filtro=${f.key}`}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            active === f.key
              ? "border-primary bg-primary/15 text-primary"
              : "border-border bg-surface text-text-secondary",
          )}
        >
          <f.icon className="h-3.5 w-3.5" /> {f.label}
        </Link>
      ))}
    </div>
  );
}
