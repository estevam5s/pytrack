"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FilterBar({
  query,
  onQuery,
  filters,
  placeholder = "Buscar...",
}: {
  query: string;
  onQuery: (v: string) => void;
  filters: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
  }[];
  placeholder?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      {filters.map((f) => (
        <div key={f.label} className="flex flex-wrap items-center gap-1.5">
          {f.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => f.onChange(opt.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                f.value === opt.value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-text-secondary hover:border-primary/40 hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
