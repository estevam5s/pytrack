"use client";

import { Menu, PanelLeft, Search } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { UserMenu } from "./user-menu";
import { HeaderLevelBar } from "./header-level-bar";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header({
  name,
  email,
  avatarUrl,
  levelCounts,
}: {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  levelCounts: { modules: number; books: number; courses: number };
}) {
  const { setMobileSidebar, setCommandOpen, toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-8">
      <button
        onClick={() => setMobileSidebar(true)}
        className="rounded-md p-2 text-text-secondary hover:bg-card hover:text-foreground lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        onClick={toggleSidebar}
        className="hidden rounded-md p-2 text-text-secondary transition-colors hover:bg-card hover:text-foreground lg:inline-flex"
        aria-label="Mostrar ou esconder menu"
        title="Mostrar/esconder menu"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => setCommandOpen(true)}
        className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-text-secondary transition-colors hover:border-primary/40 sm:max-w-xs"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden truncate sm:inline">Buscar...</span>
        <kbd className="ml-auto hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-text-secondary sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <HeaderLevelBar serverCounts={levelCounts} />
        <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
