"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";
import type { SearchItem } from "@/lib/data/queries";
import { useUIStore } from "@/store/ui";

export function CommandMenu({ index = [] }: { index?: SearchItem[] }) {
  const router = useRouter();
  const { commandOpen, setCommandOpen } = useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (e.key === "Escape") setCommandOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandOpen, setCommandOpen]);

  // agrupa o índice por grupo, na ordem desejada
  const groups = useMemo(() => {
    const order = [
      "Conteúdos",
      "Tecnologias",
      "Carreiras",
      "Projetos",
      "Livros",
      "Materiais",
    ];
    const map = new Map<string, SearchItem[]>();
    for (const it of index) {
      if (!map.has(it.group)) map.set(it.group, []);
      map.get(it.group)!.push(it);
    }
    return [...map.entries()].sort(
      (a, b) => order.indexOf(a[0]) - order.indexOf(b[0]),
    );
  }, [index]);

  if (!commandOpen) return null;

  const goInternal = (href: string) => {
    setCommandOpen(false);
    router.push(href);
  };
  const open = (it: SearchItem) => {
    setCommandOpen(false);
    if (it.external) window.open(it.href, "_blank", "noopener");
    else router.push(it.href);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setCommandOpen(false)}
    >
      <Command
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        loop
        filter={(value, search) =>
          value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
        }
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 text-text-secondary" />
          <Command.Input
            autoFocus
            placeholder="Buscar conteúdos, tecnologias, carreiras, projetos, páginas..."
            className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-text-secondary"
          />
          <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-secondary sm:inline">
            esc
          </kbd>
        </div>
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-text-secondary">
            Nenhum resultado encontrado.
          </Command.Empty>

          <Command.Group
            heading="Navegação"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-text-secondary"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Command.Item
                  key={item.href}
                  value={`${item.title} ${item.group} página`}
                  onSelect={() => goInternal(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary aria-selected:bg-primary/10 aria-selected:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Command.Item>
              );
            })}
          </Command.Group>

          {groups.map(([group, list]) => (
            <Command.Group
              key={group}
              heading={group}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-text-secondary"
            >
              {list.map((it, i) => (
                <Command.Item
                  key={`${group}-${i}-${it.label}`}
                  value={`${it.label} ${it.sub ?? ""} ${group}`}
                  onSelect={() => open(it)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-text-secondary aria-selected:bg-primary/10 aria-selected:text-foreground"
                >
                  <span className="truncate">{it.label}</span>
                  {it.sub && (
                    <span className="shrink-0 text-[11px] text-text-secondary/60">
                      {it.sub}
                    </span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
