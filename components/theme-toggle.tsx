"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    const el = document.documentElement;
    el.classList.toggle("light", next);
    el.classList.toggle("dark", !next);
    try {
      localStorage.setItem("pytrack-theme", next ? "light" : "dark");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema claro/escuro"
      title={light ? "Tema escuro" : "Tema claro"}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground",
        className,
      )}
    >
      {mounted && light ? (
        <Moon className="h-[18px] w-[18px]" />
      ) : (
        <Sun className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
