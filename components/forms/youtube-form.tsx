"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, ListVideo, Sparkles, Youtube } from "lucide-react";
import {
  createYoutube,
  fetchYoutubeMeta,
  updateYoutube,
} from "@/lib/data/youtube-actions";
import type { YoutubeItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMPTY = {
  kind: "video" as "video" | "playlist",
  title: "",
  url: "",
  thumbnail_url: "",
  channel: "",
  category: "",
  description: "",
};

export function YoutubeForm({
  open,
  onOpenChange,
  item,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item?: YoutubeItem | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [fetching, setFetching] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof EMPTY, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (open) {
      setMsg(null);
      setError(null);
      setForm(
        item
          ? {
              kind: item.kind,
              title: item.title,
              url: item.url,
              thumbnail_url: item.thumbnail_url ?? "",
              channel: item.channel ?? "",
              category: item.category ?? "",
              description: item.description ?? "",
            }
          : EMPTY,
      );
    }
  }, [open, item]);

  const importMeta = async () => {
    if (!form.url) {
      setMsg("Cole o link do YouTube primeiro.");
      return;
    }
    setFetching(true);
    setMsg(null);
    const meta = await fetchYoutubeMeta(form.url);
    setFetching(false);
    if (meta.error) {
      setMsg(meta.error);
      if (meta.kind) set("kind", meta.kind);
      return;
    }
    setForm((f) => ({
      ...f,
      kind: meta.kind ?? f.kind,
      title: meta.title || f.title,
      channel: meta.channel || f.channel,
      thumbnail_url: meta.thumbnail_url || f.thumbnail_url,
    }));
    setMsg("Informações importadas! Revise e salve.");
  };

  const save = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      setError("Informe o link e o título.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = item
      ? await updateYoutube(item.id, form)
      : await createYoutube(form);
    setSaving(false);
    if (res?.error) return setError(res.error);
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? "Editar aula" : "Adicionar aula do YouTube"}
          </DialogTitle>
          <DialogDescription>
            Cole o link de um vídeo ou playlist e importe o banner e as
            informações automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Link do YouTube</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://www.youtube.com/watch?v=... ou /playlist?list=..."
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={importMeta}
                disabled={fetching}
                className="shrink-0"
              >
                {fetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Importar
              </Button>
            </div>
            {msg && <p className="text-xs text-text-secondary">{msg}</p>}
          </div>

          {form.thumbnail_url && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.thumbnail_url}
                alt="banner"
                className="h-44 w-full rounded-lg border border-border object-cover"
              />
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                {form.kind === "playlist" ? (
                  <>
                    <ListVideo className="h-3 w-3" /> Playlist
                  </>
                ) : (
                  <>
                    <Youtube className="h-3 w-3" /> Vídeo
                  </>
                )}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Título *</label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Canal</label>
              <Input value={form.channel} onChange={(e) => set("channel", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Categoria / Tecnologia</label>
              <Input
                placeholder="Ex.: FastAPI, Data Science..."
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tipo</label>
            <div className="flex gap-2">
              {(["video", "playlist"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set("kind", k)}
                  className={cn(
                    "flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                    form.kind === k
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-surface text-text-secondary",
                  )}
                >
                  {k === "video" ? "Vídeo" : "Playlist"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Anotações</label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="O que você quer aprender com essa aula?"
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
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {item ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
