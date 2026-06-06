"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityAvatar } from "./badges";
import { CATEGORIES } from "@/lib/community/levels";
import { createPost } from "@/lib/community/actions";
import { uploadCommunityImage } from "@/lib/community/storage";
import { cn } from "@/lib/utils";
import type { CommunityPostCategory, CommunityProfile } from "@/types/community";

export function CreatePostCard({ profile }: { profile: CommunityProfile | null }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CommunityPostCategory>("discussao");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files).slice(0, 4 - images.length)) {
        urls.push(await uploadCommunityImage(f));
      }
      setImages((prev) => [...prev, ...urls].slice(0, 4));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = () => {
    if (!content.trim()) return;
    const tags = tagsInput
      .split(/[,\s]+/)
      .map((t) => t.trim().replace(/^#/, "").toLowerCase())
      .filter(Boolean)
      .slice(0, 8);
    start(async () => {
      const res = await createPost({
        category,
        content,
        imageUrls: images,
        tags,
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      setContent("");
      setTagsInput("");
      setImages([]);
      setCategory("discussao");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <CommunityAvatar profile={profile} size={40} />
          <div className="min-w-0 flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe uma dúvida, projeto, conquista ou ajude alguém..."
              rows={3}
              maxLength={5000}
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-text-secondary focus:border-primary/40"
            />

            {images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {images.map((url) => (
                  <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() => setImages((p) => p.filter((u) => u !== url))}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && <p className="mt-2 text-xs text-danger">{error}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunityPostCategory)}
                className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-secondary outline-none focus:border-primary/40"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="tags: python, fastapi..."
                className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs outline-none placeholder:text-text-secondary focus:border-primary/40"
              />

              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                hidden
                onChange={(e) => onPickFiles(e.target.files)}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading || images.length >= 4}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:text-foreground disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="h-3.5 w-3.5" />
                )}
                Imagem
              </button>

              <button
                onClick={submit}
                disabled={pending || uploading || !content.trim()}
                className={cn(
                  "ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50",
                )}
              >
                {pending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Publicar
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
