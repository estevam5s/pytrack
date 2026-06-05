"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ExternalLink,
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  User2,
} from "lucide-react";
import type { UdemyCourse } from "@/types";
import { deleteCourse } from "@/lib/data/udemy-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { CourseForm } from "@/components/forms/course-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LEVEL_LABELS,
  STATUS_LABELS,
  levelColor,
  statusColor,
} from "@/lib/utils";

function CourseCard({
  course,
  onEdit,
  onDelete,
}: {
  course: UdemyCourse;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card hover className="group flex flex-col overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary/20 via-surface to-secondary/10">
        {course.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="rounded-md bg-background/80 p-1.5 text-foreground backdrop-blur hover:bg-primary hover:text-white"
            aria-label="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-md bg-background/80 p-1.5 text-foreground backdrop-blur hover:bg-danger hover:text-white"
            aria-label="Remover"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <Badge className={levelColor(course.level)}>
            {LEVEL_LABELS[course.level]}
          </Badge>
          <Badge className={statusColor(course.status)}>
            {STATUS_LABELS[course.status]}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug">{course.title}</h3>
        {course.description && (
          <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary">
            {course.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
          {course.instructor && (
            <span className="inline-flex items-center gap-1">
              <User2 className="h-3 w-3" /> {course.instructor}
            </span>
          )}
          {course.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {course.duration}
            </span>
          )}
          {course.category && (
            <span className="rounded-full bg-surface px-2 py-0.5">
              {course.category}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          {course.url ? (
            <Button asChild size="sm" variant="outline" className="flex-1">
              <a href={course.url} target="_blank" rel="noopener noreferrer">
                Abrir curso <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          ) : (
            <span className="flex-1 text-xs text-text-secondary">Sem link</span>
          )}
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function UdemyView({ courses }: { courses: UdemyCourse[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UdemyCourse | null>(null);
  const [deleting, setDeleting] = useState<UdemyCourse | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (c: UdemyCourse) => {
    setEditing(c);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    startTransition(async () => {
      await deleteCourse(deleting.id);
      setDeleting(null);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {courses.length} {courses.length === 1 ? "curso" : "cursos"} salvos
        </p>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Adicionar curso
        </Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Nenhum curso ainda"
          description="Adicione seus cursos da Udemy. Cole a URL e importe título, banner e descrição automaticamente."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Adicionar primeiro curso
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onEdit={() => openEdit(c)}
              onDelete={() => setDeleting(c)}
            />
          ))}
        </div>
      )}

      <CourseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        course={editing}
        onSaved={() => router.refresh()}
      />

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover curso?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.title}&quot; será removido permanentemente da sua
              lista.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="danger" onClick={confirmDelete} disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
