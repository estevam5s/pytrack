"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenText,
  Download,
  ExternalLink,
  FileCode2,
  FileText,
  FolderGit2,
  Link2,
  Loader2,
  Pencil,
  Plus,
  ScrollText,
  Search,
  Trash2,
  Video,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Material } from "@/types";
import { deleteMaterial } from "@/lib/data/material-actions";
import { MaterialForm } from "@/components/forms/material-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LEVEL_LABELS, cn, levelColor } from "@/lib/utils";

const TYPE_ICON: Record<string, LucideIcon> = {
  Documentação: BookOpenText,
  Artigos: FileText,
  Vídeos: Video,
  Cheatsheets: FileCode2,
  Repositórios: FolderGit2,
  Guias: ScrollText,
  PDFs: FileText,
  "Links úteis": Link2,
};

export function MaterialView({
  materials,
  userId,
}: {
  materials: Material[];
  userId: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("todos");
  const [scope, setScope] = useState<"todos" | "meus">("todos");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [deleting, setDeleting] = useState<Material | null>(null);
  const [detail, setDetail] = useState<Material | null>(null);
  const [pending, start] = useTransition();

  const types = useMemo(
    () => Array.from(new Set(materials.map((m) => m.type))),
    [materials],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return materials.filter((m) => {
      if (typeFilter !== "todos" && m.type !== typeFilter) return false;
      if (scope === "meus" && m.user_id !== userId) return false;
      if (q && !`${m.title} ${m.description ?? ""} ${m.category ?? ""}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [materials, query, typeFilter, scope, userId]);

  const confirmDelete = () =>
    deleting &&
    start(async () => {
      await deleteMaterial(deleting.id);
      setDeleting(null);
      router.refresh();
    });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative lg:max-w-xs lg:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar materiais..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {(["todos", "meus"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  scope === s ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-text-secondary hover:text-foreground",
                )}
              >
                {s === "meus" ? "Meus" : "Todos"}
              </button>
            ))}
          </div>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>

      {/* filtro por tipo */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {["todos", ...types].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              typeFilter === t ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-text-secondary hover:text-foreground",
            )}
          >
            {t === "todos" ? "Todos os tipos" : t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum material"
          description="Adicione documentação, artigos, cheatsheets ou faça upload de um PDF."
          action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" /> Adicionar material</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => {
            const Icon = TYPE_ICON[m.type] ?? FileText;
            const owned = m.user_id === userId;
            return (
              <Card key={m.id} hover className="group flex cursor-pointer flex-col" onClick={() => setDetail(m)}>
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
                      <Icon className="h-5 w-5" />
                    </span>
                    {owned && (
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={(e) => { e.stopPropagation(); setEditing(m); setFormOpen(true); }} className="rounded-md p-1 text-text-secondary hover:bg-surface hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleting(m); }} className="rounded-md p-1 text-text-secondary hover:bg-surface hover:text-danger"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 line-clamp-2 font-medium leading-snug">{m.title}</h3>
                  {m.description && <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary">{m.description}</p>}
                  <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                    <Badge className={levelColor(m.level)}>{LEVEL_LABELS[m.level]}</Badge>
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">{m.type}</span>
                    {m.file_url && <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[11px] text-secondary">PDF</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* detalhe */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDetail(null)}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-6 sm:rounded-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {(() => { const Icon = TYPE_ICON[detail.type] ?? FileText; return (
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><Icon className="h-5 w-5" /></span>
                  ); })()}
                  <div>
                    <h2 className="font-bold leading-tight">{detail.title}</h2>
                    <p className="text-xs text-text-secondary">{detail.type}{detail.category ? ` · ${detail.category}` : ""}</p>
                  </div>
                </div>
                <button onClick={() => setDetail(null)} className="text-text-secondary hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge className={levelColor(detail.level)}>{LEVEL_LABELS[detail.level]}</Badge>
              </div>

              {detail.description && <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{detail.description}</p>}

              <div className="mt-5 flex flex-wrap gap-2">
                {detail.file_url && (
                  <Button asChild size="sm">
                    <a href={detail.file_url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" /> Baixar arquivo
                    </a>
                  </Button>
                )}
                {detail.url && (
                  <Button asChild size="sm" variant="outline">
                    <a href={detail.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" /> Abrir link
                    </a>
                  </Button>
                )}
                {detail.user_id === userId && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(detail); setDetail(null); setFormOpen(true); }}>
                      <Pencil className="h-4 w-4" /> Editar
                    </Button>
                    <Button size="sm" variant="ghost" className="text-danger" onClick={() => { setDeleting(detail); setDetail(null); }}>
                      <Trash2 className="h-4 w-4" /> Remover
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MaterialForm open={formOpen} onOpenChange={setFormOpen} material={editing} userId={userId} onSaved={() => router.refresh()} />

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover material?</DialogTitle>
            <DialogDescription>&quot;{deleting?.title}&quot; será removido permanentemente.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
            <Button variant="danger" onClick={confirmDelete} disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
