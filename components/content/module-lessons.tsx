"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonRef {
  slug: string;
  title: string;
  order: number;
}

export function ModuleLessons({
  moduleSlug,
  lessons,
}: {
  moduleSlug: string;
  lessons: LessonRef[];
}) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    try {
      setCompleted(
        JSON.parse(localStorage.getItem(`pytrack-lessons-${moduleSlug}`) ?? "[]"),
      );
    } catch {
      setCompleted([]);
    }
  }, [moduleSlug]);

  const firstUndone =
    lessons.find((l) => !completed.includes(l.slug)) ?? lessons[0];
  const started = completed.length > 0;

  return (
    <div>
      <Button asChild size="lg" className="mb-6 w-full sm:w-auto">
        <Link href={`/conteudos/${moduleSlug}/${firstUndone.slug}`}>
          <PlayCircle className="h-5 w-5" />
          {started ? "Continuar estudando" : "Começar a estudar"}
        </Link>
      </Button>

      <div className="space-y-2">
        {lessons.map((l, i) => {
          const done = completed.includes(l.slug);
          return (
            <Link
              key={l.slug}
              href={`/conteudos/${moduleSlug}/${l.slug}`}
              className={cn(
                "group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-primary/40 hover:-translate-y-0.5",
                done && "border-secondary/30",
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-semibold text-text-secondary">
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                ) : (
                  <Circle className="h-4 w-4 text-text-secondary/40" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="mr-1.5 text-xs text-text-secondary/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {l.title}
                </span>
              </span>
              <PlayCircle className="h-5 w-5 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
