"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Layers,
  ListVideo,
  Loader2,
  Pencil,
  Play,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Tv,
  Users,
  Youtube,
  X,
} from "lucide-react";
import type { YoutubeItem } from "@/types";
import { deleteYoutube } from "@/lib/data/youtube-actions";
import {
  analyzeUdemyCourse,
  analyzeUdemyCollection,
  type CourseAnalysis,
  type CollectionAnalysis,
} from "@/lib/ai/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { StatCard } from "@/components/cards/stat-card";
import { AreaProgressChart } from "@/components/dashboard/evolution-charts";
import {
  CourseAnalysisPanel,
  CollectionAnalysisPanel,
} from "@/components/dashboard/ai-analysis";
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

function VideoCard({ item, onOpen }: { item: YoutubeItem; onOpen: () => void }) {
  return (
    <Card hover className="group flex cursor-pointer flex-col overflow-hidden" onClick={onOpen}>
      <div className="relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/10">
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
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{item.title}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
          {item.channel && <span>{item.channel}</span>}
          {item.category && (
            <Badge className="border-primary/30 bg-primary/10 text-primary">{item.category}</Badge>
          )}
        </div>
        <span className="mt-auto pt-3 text-xs font-medium text-primary-light">
          Ver detalhes & análise IA →
        </span>
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
  const [detail, setDetail] = useState<YoutubeItem | null>(null);
  const [pending, startTransition] = useTransition();

  const [collection, setCollection] = useState<CollectionAnalysis | null>(null);
  const [colLoading, setColLoading] = useState(false);

  const stats = useMemo(() => {
    const total = items.length;
    const videos = items.filter((i) => i.kind === "video").length;
    const playlists = items.filter((i) => i.kind === "playlist").length;
    const channels = new Set(items.map((i) => i.channel).filter(Boolean)).size;
    const byCat = new Map<string, number>();
    for (const i of items) {
      const k = i.category || "Sem categoria";
      byCat.set(k, (byCat.get(k) ?? 0) + 1);
    }
    const categories = [...byCat.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([area, n]) => ({ area, percentage: total ? Math.round((n / total) * 100) : 0 }));
    return { total, videos, playlists, channels, categories };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((i) => {
      if (kind !== "todos" && i.kind !== kind) return false;
      if (q && !`${i.title} ${i.channel ?? ""} ${i.category ?? ""}`.toLowerCase().includes(q))
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

  const runCollection = async () => {
    setColLoading(true);
    const res = await analyzeUdemyCollection({
      courses: items.map((i) => ({ title: i.title, category: i.category, level: i.kind })),
    });
    setCollection(res);
    setColLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar aulas..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={runCollection} disabled={colLoading || !stats.total}>
            {colLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            Analisar trilha com IA
          </Button>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>

      {stats.total > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Aulas" value={stats.total} icon={Youtube} />
            <StatCard label="Vídeos" value={stats.videos} icon={Play} accent="secondary" />
            <StatCard label="Playlists" value={stats.playlists} icon={ListVideo} accent="warning" />
            <StatCard label="Canais" value={stats.channels} icon={Users} />
          </div>

          {stats.categories.length > 0 && (
            <Card className="min-w-0">
              <CardContent className="p-5">
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
                  <Layers className="h-4 w-4 text-primary" /> Stack das suas aulas
                </p>
                <AreaProgressChart data={stats.categories} />
              </CardContent>
            </Card>
          )}

          <div className="flex gap-1.5">
            {([
              ["todos", `Todas (${stats.total})`],
              ["video", `Vídeos (${stats.videos})`],
              ["playlist", `Playlists (${stats.playlists})`],
            ] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setKind(v)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  kind === v ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-text-secondary hover:text-foreground",
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {collection && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-primary/30">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="flex items-center gap-2 font-semibold">
                    <Brain className="h-4 w-4 text-primary-light" /> Análise das suas aulas
                  </p>
                  <button onClick={() => setCollection(null)} className="text-text-secondary hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>
                <CollectionAnalysisPanel analysis={collection} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: (i % 12) * 0.03 }}
            >
              <VideoCard item={item} onOpen={() => setDetail(item)} />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Youtube}
          title="Nenhuma aula ainda"
          description="Cole o link de um vídeo ou playlist do YouTube — o banner e as informações são importados automaticamente."
          action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" /> Adicionar primeira aula</Button>}
        />
      )}

      {detail && (
        <YoutubeDetail
          item={detail}
          onClose={() => setDetail(null)}
          onEdit={() => { setEditing(detail); setDetail(null); setFormOpen(true); }}
          onDelete={() => { setDeleting(detail); setDetail(null); }}
        />
      )}

      <YoutubeForm open={formOpen} onOpenChange={setFormOpen} item={editing} onSaved={() => router.refresh()} />

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover aula?</DialogTitle>
            <DialogDescription>&quot;{deleting?.title}&quot; será removido da sua lista.</DialogDescription>
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

function YoutubeDetail({
  item,
  onClose,
  onEdit,
  onDelete,
}: {
  item: YoutubeItem;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [analysis, setAnalysis] = useState<CourseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    const res = await analyzeUdemyCourse({
      title: item.title,
      instructor: item.channel,
      category: item.category,
      level: item.kind === "playlist" ? "playlist (série)" : "vídeo",
      description: item.description,
    });
    setAnalysis(res);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card sm:rounded-2xl"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/10">
            {item.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.thumbnail_url} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center"><Youtube className="h-14 w-14 text-primary/50" /></div>
            )}
            <button onClick={onClose} className="absolute right-3 top-3 rounded-lg bg-background/80 p-1.5 text-foreground backdrop-blur hover:bg-surface"><X className="h-4 w-4" /></button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2">
              <Badge className="border-danger/30 bg-danger/10 text-danger">
                {item.kind === "playlist" ? "Playlist" : "Vídeo"}
              </Badge>
              {item.category && <Badge className="border-primary/30 bg-primary/10 text-primary">{item.category}</Badge>}
            </div>
            <h2 className="mt-3 text-xl font-bold">{item.title}</h2>
            {item.channel && (
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-text-secondary"><Tv className="h-3.5 w-3.5" /> {item.channel}</p>
            )}
            {item.description && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{item.description}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <Play className="h-4 w-4" /> Assistir no YouTube
                </a>
              </Button>
              <Button size="sm" variant="ghost" onClick={onEdit}><Pencil className="h-4 w-4" /> Editar</Button>
              <Button size="sm" variant="ghost" className="text-danger" onClick={onDelete}><Trash2 className="h-4 w-4" /> Remover</Button>
              <Button size="sm" onClick={analyze} disabled={loading} className="ml-auto">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Analisar com IA
              </Button>
            </div>

            <AnimatePresence>
              {analysis && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-5 overflow-hidden">
                  <div className="rounded-xl border border-primary/30 bg-surface/50 p-5">
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <Brain className="h-4 w-4 text-primary-light" /> Análise da IA
                    </p>
                    <CourseAnalysisPanel analysis={analysis} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
