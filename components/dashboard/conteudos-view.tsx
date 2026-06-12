"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
} from "lucide-react";
import type { Content, Progress } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as Bar } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/states";
import { FilterBar } from "./filter-bar";
import { LEVEL_LABELS, levelColor, STATUS_LABELS } from "@/lib/utils";

function uniq(values: string[]) {
  return Array.from(new Set(values));
}

function ModuleCard({
  content,
  progress,
}: {
  content: Content;
  progress?: Progress;
}) {
  const status = progress?.status ?? "nao_iniciado";
  const pct = progress?.progress_percentage ?? 0;
  const href = content.slug ? `/conteudos/${content.slug}` : "/conteudos";

  return (
    <Card hover className="group flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <Badge className={levelColor(content.level)}>
            {LEVEL_LABELS[content.level]}
          </Badge>
        </div>

        <Link href={href} className="mt-3">
          <h3 className="font-semibold leading-snug transition-colors group-hover:text-primary">
            {content.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-text-secondary">
          {content.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> {content.lessons_count} lições
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> ~{content.estimated_hours}h
          </span>
          <span className="rounded-full bg-surface px-2 py-0.5">
            {content.area}
          </span>
        </div>

        {status !== "nao_iniciado" && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1">
                {status === "concluido" ? (
                  <CheckCircle2 className="h-3 w-3 text-secondary" />
                ) : null}
                {STATUS_LABELS[status]}
              </span>
              <span>{pct}%</span>
            </div>
            <Bar value={pct} className="h-1.5" />
          </div>
        )}

        <Link
          href={href}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <PlayCircle className="h-4 w-4" />
          {status === "concluido"
            ? "Revisar"
            : status === "em_andamento"
              ? "Continuar"
              : "Estudar"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function ConteudosView({
  contents,
  progressMap,
}: {
  contents: Content[];
  progressMap: Record<string, Progress>;
}) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("todos");
  const [area, setArea] = useState("todas");

  const areas = useMemo(() => uniq(contents.map((c) => c.area)).sort(), [contents]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return contents.filter((c) => {
      if (level !== "todos" && c.level !== level) return false;
      if (area !== "todas" && c.area !== area) return false;
      if (
        q &&
        !`${c.title} ${c.description} ${c.area} ${c.category}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [contents, query, level, area]);

  // agrupa por "Parte" usando order_index para manter a progressão
  const sorted = [...filtered].sort((a, b) => a.order_index - b.order_index);

  return (
    <div>
      <FilterBar
        query={query}
        onQuery={setQuery}
        placeholder="Buscar módulos, áreas, tópicos..."
        filters={[
          {
            label: "Nível",
            value: level,
            onChange: setLevel,
            options: [
              { value: "todos", label: "Todos" },
              { value: "basico", label: "Básico" },
              { value: "intermediario", label: "Intermediário" },
              { value: "avancado", label: "Avançado" },
            ],
          },
        ]}
      />

      <div className="mb-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setArea("todas")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            area === "todas"
              ? "border-primary bg-primary/15 text-primary"
              : "border-border bg-card text-text-secondary hover:text-foreground"
          }`}
        >
          Todas as áreas
        </button>
        {areas.map((a) => (
          <button
            key={a}
            onClick={() => setArea(a)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              area === a
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-text-secondary hover:text-foreground"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {sorted.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {sorted.map((c) => (
            <ModuleCard key={c.id} content={c} progress={progressMap[c.id]} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum módulo encontrado"
          description="Ajuste a busca ou os filtros para ver outras trilhas."
        />
      )}
    </div>
  );
}
