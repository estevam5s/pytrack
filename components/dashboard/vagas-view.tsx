"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Banknote,
  Building2,
  ExternalLink,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wifi,
} from "lucide-react";
import type { Job } from "@/types";
import { deleteJob } from "@/lib/data/jobs-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { JobForm } from "@/components/forms/job-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function modalityCls(m: string | null) {
  if (m?.toLowerCase().includes("remoto"))
    return "border-secondary/30 bg-secondary/10 text-secondary";
  if (m?.toLowerCase().includes("hí") || m?.toLowerCase().includes("hi"))
    return "border-warning/30 bg-warning/10 text-warning";
  return "border-primary/30 bg-primary/10 text-primary";
}

function JobCard({
  job,
  onEdit,
  onDelete,
}: {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card hover className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-snug">{job.title}</h3>
            {job.company && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-text-secondary">
                <Building2 className="h-3 w-3" /> {job.company}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              onClick={onEdit}
              className="rounded-md p-1.5 text-text-secondary hover:bg-surface hover:text-foreground"
              aria-label="Editar"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="rounded-md p-1.5 text-text-secondary hover:bg-danger/10 hover:text-danger"
              aria-label="Remover"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.modality && (
            <Badge className={modalityCls(job.modality)}>
              <Wifi className="mr-1 h-3 w-3" /> {job.modality}
            </Badge>
          )}
          {job.seniority && (
            <Badge className="border-border bg-surface text-text-secondary">
              {job.seniority}
            </Badge>
          )}
          {job.type && (
            <Badge className="border-border bg-surface text-text-secondary">
              {job.type}
            </Badge>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
          {job.salary && job.salary !== "Não informado" && (
            <span className="inline-flex items-center gap-1 font-medium text-secondary">
              <Banknote className="h-3.5 w-3.5" /> {job.salary}
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
          )}
        </div>

        {job.description && (
          <p className="mt-3 line-clamp-3 text-sm text-text-secondary">
            {job.description}
          </p>
        )}

        {job.stack.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-[11px] font-semibold uppercase text-text-secondary">
              Stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {job.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-text-secondary"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {job.url && (
          <div className="mt-auto pt-4">
            <Button asChild size="sm" variant="outline" className="w-full">
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                Ver vaga original <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function VagasView({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState<Job | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return jobs.filter(
      (j) =>
        !q ||
        `${j.title} ${j.company ?? ""} ${j.stack.join(" ")} ${j.location ?? ""}`
          .toLowerCase()
          .includes(q),
    );
  }, [jobs, query]);

  const confirmDelete = () =>
    deleting &&
    startTransition(async () => {
      await deleteJob(deleting.id);
      setDeleting(null);
      router.refresh();
    });

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Minhas vagas</h2>
          <p className="text-sm text-text-secondary">
            {jobs.length} vaga{jobs.length === 1 ? "" : "s"} salva
            {jobs.length === 1 ? "" : "s"} · cole um link e a IA preenche tudo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="pl-9 sm:w-48"
            />
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Adicionar vaga
          </Button>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: (i % 9) * 0.03 }}
            >
              <JobCard
                job={job}
                onEdit={() => {
                  setEditing(job);
                  setFormOpen(true);
                }}
                onDelete={() => setDeleting(job)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={jobs.length ? "Nenhuma vaga encontrada" : "Nenhuma vaga salva ainda"}
          description="Adicione uma vaga colando o link do LinkedIn e/ou a descrição — a IA identifica cargo, salário, modalidade, stack e habilidades."
          action={
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Adicionar vaga
            </Button>
          }
        />
      )}

      <JobForm
        open={formOpen}
        onOpenChange={setFormOpen}
        job={editing}
        onSaved={() => router.refresh()}
      />

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover vaga?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.title}&quot; será removida da sua lista.
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
