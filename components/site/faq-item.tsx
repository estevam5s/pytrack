"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-text-secondary transition-transform duration-300",
            open && "rotate-180 text-primary-light",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-text-secondary">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
