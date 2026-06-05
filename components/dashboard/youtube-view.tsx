"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ListVideo,
  Loader2,
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
  Youtube,
} from "lucide-react";
import type { YoutubeItem } from "@/types";
import { deleteYoutube } from "@/lib/data/youtube-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { YoutubeForm } from "@/components/forms/youtube-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function VideoCard({
  item,
  onEdit,
  onDelete,
}: {
  item: YoutubeItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card hover className="group flex flex-col overflow-hidden">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/10"
      >
        {item.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Youtube className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger text-white">
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </span>
        </span>
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
          {item.kind === "playlist" ? (
            <>
              <ListVideo className="h-3 w-3" /> Playlist
            </>
          ) : (
            <>
              <Youtube className="h-3 w-3" /> Vídeo
            </>
          )}
        </span>
      </a>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {item.title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
          {item.channel && <span>{item.channel}</span>}
          {item.category && (
            <Badge className="border-primary/30 bg-primary/10 text-primary">
              {item.category}
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="mt-2 line-clamp-2 text-xs text-text-secondary">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-3">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <Play className="h-3.5 w-3.5" /> Assistir
            </a>
          </Button>
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5 text-danger" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function YoutubeView({ items }: { items: YoutubeItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"todos" | "video" | "playlist">("todos");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<YoutubeItem | null>(null);
  const [deleting, setDeleting] = useState<YoutubeItem | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((i) => {
      if (kind !== "todos" && i.kind !== kind) return false;
      if (
        q &&
        !`${i.title} ${i.channel ?? ""} ${i.category ?? ""}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [items, query, kind]);

  const confirmDelete = () =>
    deleting &&
    startTransition(async () => {
      await deleteYoutube(deleting.id);
      setDeleting(null);
      router.refresh();
    });

  const videos = items.filter((i) => i.kind === "video").length;
  const playlists = items.filter((i) => i.kind === "playlist").length;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar aulas..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {([
              ["todos", `Todas (${items.length})`],
              ["video", `Vídeos (${videos})`],
              ["playlist", `Playlists (${playlists})`],
            ] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setKind(v)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  kind === v
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-text-secondary hover:text-foreground",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: (i % 12) * 0.03 }}
            >
              <VideoCard
                item={item}
                onEdit={() => {
                  setEditing(item);
                  setFormOpen(true);
                }}
                onDelete={() => setDeleting(item)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Youtube}
          title="Nenhuma aula ainda"
          description="Cole o link de um vídeo ou playlist do YouTube — o banner e as informações são importados automaticamente."
          action={
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Adicionar primeira aula
            </Button>
          }
        />
      )}

      <YoutubeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editing}
        onSaved={() => router.refresh()}
      />

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover aula?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.title}&quot; será removido da sua lista.
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
