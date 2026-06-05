"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookMarked,
  FileText,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";
import { createBook, fetchBookMeta, updateBook } from "@/lib/data/books-actions";
import { uploadToBucket } from "@/lib/storage";
import type { Book } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const selectCls =
  "flex h-10 w-full rounded-md border border-input bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const EMPTY = {
  title: "",
  author: "",
  category: "",
  level: "basico",
  status: "nao_iniciado",
  url: "",
  cover_url: "",
  file_url: "",
  description: "",
};

export function BookForm({
  open,
  onOpenChange,
  book,
  userId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  book?: Book | null;
  userId: string;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (open) {
      setError(null);
      setMsg(null);
      setForm(
        book
          ? {
              title: book.title,
              author: book.author ?? "",
              category: book.category ?? "",
              level: book.level,
              status: book.status,
              url: book.url ?? "",
              cover_url: book.cover_url ?? "",
              file_url: book.file_url ?? "",
              description: book.description ?? "",
            }
          : EMPTY,
      );
    }
  }, [open, book]);

  const identify = async () => {
    if (!form.url) {
      setMsg("Cole a URL do livro (loja, editora, Goodreads...) primeiro.");
      return;
    }
    setFetching(true);
    setMsg(null);
    const meta = await fetchBookMeta(form.url);
    setFetching(false);
    if (meta.error) {
      setMsg(meta.error);
      return;
    }
    setForm((f) => ({
      ...f,
      title: meta.title || f.title,
      author: meta.author || f.author,
      cover_url: meta.cover_url || f.cover_url,
      description: meta.description || f.description,
    }));
    setMsg("Dados identificados! Revise e salve.");
  };

  const onCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError(null);
    const up = await uploadToBucket("book-covers", file, userId);
    setUploadingCover(false);
    if (up.error || !up.url) return setError(up.error ?? "Falha no upload da capa.");
    set("cover_url", up.url);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024)
      return setError("Arquivo muito grande (máx. 100 MB).");
    setUploadingFile(true);
    setError(null);
    const up = await uploadToBucket("book-files", file, userId);
    setUploadingFile(false);
    if (up.error || !up.url) return setError(up.error ?? "Falha no upload do arquivo.");
    set("file_url", up.url);
    setMsg("Arquivo do livro enviado.");
  };

  const save = async () => {
    if (!form.title.trim()) return setError("Informe o título do livro.");
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      level: form.level as "basico" | "intermediario" | "avancado",
      status: form.status as "nao_iniciado" | "em_andamento" | "concluido",
    };
    const res = book
      ? await updateBook(book.id, payload)
      : await createBook(payload);
    setSaving(false);
    if (res?.error) return setError(res.error);
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Editar livro" : "Adicionar livro"}</DialogTitle>
          <DialogDescription>
            Identifique a capa pela URL ou faça upload da capa e do arquivo do
            livro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">URL do livro</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://... (loja, editora, Goodreads)"
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={identify}
                disabled={fetching}
                className="shrink-0"
              >
                {fetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Identificar
              </Button>
            </div>
            {msg && <p className="text-xs text-text-secondary">{msg}</p>}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Capa */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-44 w-32 items-center justify-center overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/15 to-secondary/10">
                {form.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.cover_url}
                    alt="Capa"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookMarked className="h-9 w-9 text-primary/60" />
                )}
              </div>
              <label className="cursor-pointer text-xs font-medium text-primary hover:underline">
                {uploadingCover ? (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Enviando...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Upload className="h-3 w-3" /> Upload da capa
                  </span>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  className="hidden"
                  onChange={onCover}
                />
              </label>
            </div>

            <div className="flex-1 space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Título *</label>
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Autor</label>
                <Input value={form.author} onChange={(e) => set("author", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Categoria</label>
                  <Input
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Nível</label>
                  <select
                    className={selectCls}
                    value={form.level}
                    onChange={(e) => set("level", e.target.value)}
                  >
                    <option value="basico">Básico</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status de leitura</label>
              <select
                className={selectCls}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="nao_iniciado">Não iniciado</option>
                <option value="em_andamento">Lendo</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Arquivo do livro (PDF/EPUB)</label>
              <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-surface px-3 text-sm text-text-secondary hover:border-primary/50">
                {uploadingFile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : form.file_url ? (
                  <>
                    <FileText className="h-4 w-4 text-secondary" /> Arquivo enviado
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Selecionar arquivo
                  </>
                )}
                <input
                  type="file"
                  accept="application/pdf,application/epub+zip"
                  className="hidden"
                  onChange={onFile}
                />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving || uploadingCover || uploadingFile}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {book ? "Salvar" : "Adicionar livro"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
