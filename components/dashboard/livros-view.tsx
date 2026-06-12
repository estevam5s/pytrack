"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookMarked,
  BookOpen,
  Download,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  User2,
  X,
} from "lucide-react";
import type { Book } from "@/types";
import { deleteBook } from "@/lib/data/books-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { BookForm } from "@/components/forms/book-form";
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
  cn,
} from "@/lib/utils";

function BookCard({ book, onOpen }: { book: Book; onOpen: () => void }) {
  return (
    <Card hover className="group flex h-full cursor-pointer flex-col overflow-hidden" onClick={onOpen}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-primary/15 via-surface to-secondary/10">
        {book.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.cover_url}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookMarked className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <div className="absolute left-2 top-2">
          <Badge className={levelColor(book.level)}>{LEVEL_LABELS[book.level]}</Badge>
        </div>
        {book.file_url && (
          <span className="absolute right-2 top-2 rounded-full bg-secondary/90 px-2 py-0.5 text-[10px] font-medium text-[#04261a]">
            PDF
          </span>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{book.title}</h3>
        {book.author && <p className="mt-0.5 text-xs text-text-secondary">{book.author}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge className={statusColor(book.status)}>{STATUS_LABELS[book.status]}</Badge>
          {book.category && (
            <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-text-secondary">
              {book.category}
            </span>
          )}
        </div>
        <span className="mt-auto pt-3 text-xs font-medium text-primary-light">
          Ver detalhes →
        </span>
      </CardContent>
    </Card>
  );
}

export function LivrosView({ books, userId }: { books: Book[]; userId: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"todos" | "meus" | "recomendados">("todos");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [detail, setDetail] = useState<Book | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return books.filter((b) => {
      const owned = b.user_id === userId;
      if (scope === "meus" && !owned) return false;
      if (scope === "recomendados" && owned) return false;
      if (q && !`${b.title} ${b.author ?? ""} ${b.category ?? ""}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [books, query, scope, userId]);

  const confirmDelete = () =>
    deleting &&
    startTransition(async () => {
      await deleteBook(deleting.id);
      setDeleting(null);
      router.refresh();
    });

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar livros..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {(["todos", "meus", "recomendados"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  scope === s ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-text-secondary hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((b) => (
            <BookCard key={b.id} book={b} onOpen={() => setDetail(b)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookMarked}
          title="Nenhum livro encontrado"
          description="Adicione um livro à sua biblioteca ou ajuste a busca."
          action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" /> Adicionar livro</Button>}
        />
      )}

      {/* detalhe do livro */}
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
              className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-6 sm:rounded-2xl"
            >
              <button onClick={() => setDetail(null)} className="float-right text-text-secondary hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
              <div className="flex gap-4">
                <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2">
                  {detail.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={detail.cover_url} alt={detail.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><BookMarked className="h-10 w-10 text-primary/50" /></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold leading-tight">{detail.title}</h2>
                  {detail.author && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                      <User2 className="h-3.5 w-3.5" /> {detail.author}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge className={levelColor(detail.level)}>{LEVEL_LABELS[detail.level]}</Badge>
                    <Badge className={statusColor(detail.status)}>{STATUS_LABELS[detail.status]}</Badge>
                    {detail.category && <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">{detail.category}</span>}
                  </div>
                </div>
              </div>

              {detail.description && (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{detail.description}</p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {detail.file_url && (
                  <Button asChild size="sm">
                    <a href={detail.file_url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" /> Baixar PDF
                    </a>
                  </Button>
                )}
                {detail.url && (
                  <Button asChild size="sm" variant="outline">
                    <a href={detail.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" /> Acessar
                    </a>
                  </Button>
                )}
                {!detail.file_url && !detail.url && (
                  <span className="text-xs text-text-secondary"><BookOpen className="mr-1 inline h-3.5 w-3.5" /> Sem arquivo ou link</span>
                )}
                {detail.user_id === userId ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(detail); setDetail(null); setFormOpen(true); }}>
                      <Pencil className="h-4 w-4" /> Editar
                    </Button>
                    <Button size="sm" variant="ghost" className="text-danger" onClick={() => { setDeleting(detail); setDetail(null); }}>
                      <Trash2 className="h-4 w-4" /> Remover
                    </Button>
                  </>
                ) : (
                  <span className="ml-auto self-center rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">Recomendado</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookForm open={formOpen} onOpenChange={setFormOpen} book={editing} userId={userId} onSaved={() => router.refresh()} />

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover livro?</DialogTitle>
            <DialogDescription>&quot;{deleting?.title}&quot; será removido da sua biblioteca.</DialogDescription>
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
