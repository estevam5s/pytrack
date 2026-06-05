"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import type { StackItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TechIcon } from "@/components/ui/tech-icon";
import { EmptyState } from "@/components/ui/states";
import { LEVEL_LABELS, levelColor, cn } from "@/lib/utils";

export function StackView({ items }: { items: StackItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [level, setLevel] = useState("todos");

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((i) => {
      if (category !== "todas" && i.category !== category) return false;
      if (level !== "todos" && i.level !== level) return false;
      if (
        q &&
        !`${i.name} ${i.description ?? ""} ${i.category}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [items, query, category, level]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3">
        <div className="relative sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tecnologia..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { v: "todos", l: "Todos os níveis" },
            { v: "basico", l: "Básico" },
            { v: "intermediario", l: "Intermediário" },
            { v: "avancado", l: "Avançado" },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => setLevel(f.v)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                level === f.v
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-text-secondary hover:text-foreground",
              )}
            >
              {f.l}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory("todas")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              category === "todas"
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-text-secondary hover:text-foreground",
            )}
          >
            Todas as categorias
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === c
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-text-secondary hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.documentation_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: (i % 16) * 0.015 }}
            >
              <Card hover className="group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface p-2">
                      <TechIcon
                        name={item.name}
                        icon={item.icon}
                        className="h-full w-full text-primary"
                      />
                    </div>
                    <ExternalLink className="h-4 w-4 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <h3 className="mt-3 font-semibold">{item.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge className={levelColor(item.level)}>
                      {LEVEL_LABELS[item.level]}
                    </Badge>
                    <span className="text-[11px] text-text-secondary">
                      {item.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhuma tecnologia encontrada" />
      )}
    </div>
  );
}
