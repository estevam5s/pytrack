"use client";

import { useEffect, useState } from "react";
import { FileUp, Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadToBucket } from "@/lib/storage";
import {
  createMaterial,
  updateMaterial,
  fetchMaterialMeta,
} from "@/lib/data/material-actions";
import type { Material } from "@/types";

export const MATERIAL_TYPES = [
  "Documentação",
  "Artigos",
  "Vídeos",
  "Cheatsheets",
  "Repositórios",
  "Guias",
  "PDFs",
  "Links úteis",
];

const EMPTY = {
  title: "",
  type: "Documentação",
  category: "",
  level: "basico",
  url: "",
  file_url: "",
  description: "",
};

export function MaterialForm({
  open,
  onOpenChange,
  material,
  userId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  material: Material | null;
  userId: string;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!open) return;
    setError(null);
    setMsg(null);
    setForm(
      material
        ? {
            title: material.title,
            type: material.type,
            category: material.category ?? "",
            level: material.level,
            url: material.url ?? "",
            file_url: material.file_url ?? "",
            description: material.description ?? "",
          }
        : EMPTY,
    );
  }, [open, material]);

  const identify = async () => {
    if (!form.url) return setMsg("Cole uma URL primeiro.");
    setFetching(true);
    setMsg(null);
    const meta = await fetchMaterialMeta(form.url);
    setFetching(false);
    if (meta.error) return setMsg(meta.error);
    setForm((f) => ({
      ...f,
      title: meta.title || f.title,
      description: meta.description || f.description,
    }));
    setMsg("Dados identificados! Revise e salve.");
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) return setError("Arquivo muito grande (máx. 50 MB).");
    setUploading(true);
    setError(null);
    const up = await uploadToBucket("material-files", file, userId);
    setUploading(false);
    if (up.error || !up.url) return setError(up.error ?? "Falha no upload.");
    set("file_url", up.url);
    setMsg("Arquivo enviado.");
  };

  const save = async () => {
    if (!form.title.trim()) return setError("Informe o título.");
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      level: form.level as "basico" | "intermediario" | "avancado",
    };
    const res = material
      ? await updateMaterial(material.id, payload)
      : await createMaterial(payload);
    setSaving(false);
    if (res?.error) return setError(res.error);
    onSaved();
    onOpenChange(false);
  };

  const inp = "w-full";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{material ? "Editar material" : "Adicionar material"}</DialogTitle>
          <DialogDescription>
            Cadastre um link ou faça upload de um arquivo (PDF, cheatsheet, etc.).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              className={inp}
              placeholder="URL (opcional) — para importar título/descrição"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
            />
            <Button type="button" variant="outline" onClick={identify} disabled={fetching}>
              {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Identificar
            </Button>
          </div>

          <Input placeholder="Título *" value={form.title} onChange={(e) => set("title", e.target.value)} />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/40"
            >
              {MATERIAL_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={form.level}
              onChange={(e) => set("level", e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/40"
            >
              <option value="basico">Básico</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>

          <Input placeholder="Categoria (ex.: Backend, Dados...)" value={form.category} onChange={(e) => set("category", e.target.value)} />

          <textarea
            placeholder="Descrição"
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/40"
          />

          {/* upload */}
          <div className="rounded-lg border border-dashed border-border p-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 text-sm text-text-secondary hover:text-foreground">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
              {form.file_url ? "Trocar arquivo enviado" : "Enviar arquivo (PDF, zip... até 50MB)"}
              <input type="file" hidden onChange={onFile} accept=".pdf,.zip,.txt,.md,.csv,.ipynb,image/*" />
            </label>
            {form.file_url && (
              <p className="mt-2 truncate text-center text-xs text-secondary">✓ arquivo anexado</p>
            )}
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
          {msg && <p className="text-sm text-secondary">{msg}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || uploading}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {material ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
