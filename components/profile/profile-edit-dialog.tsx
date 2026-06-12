"use client";

import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { updateProfile } from "@/lib/data/actions";
import { uploadToBucket } from "@/lib/storage";
import type { UserProfile } from "@/types";
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

export function ProfileEditDialog({
  open,
  onOpenChange,
  profile,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  profile: UserProfile;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: profile.name ?? "",
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    goal: profile.goal ?? "",
    github_url: profile.github_url ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    website_url: profile.website_url ?? "",
    current_level: profile.current_level ?? "basico",
  });
  const [skills, setSkills] = useState<string[]>(profile.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [coverUrl, setCoverUrl] = useState(profile.cover_url ?? "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s) && skills.length < 20) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  };

  const onCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const up = await uploadToBucket("profile-covers", file, profile.user_id);
    setUploadingCover(false);
    if (up.url) setCoverUrl(up.url);
  };

  const save = async () => {
    setSaving(true);
    await updateProfile({
      ...form,
      skills,
      cover_url: coverUrl || undefined,
      current_level: form.current_level as
        | "basico"
        | "intermediario"
        | "avancado",
    });
    setSaving(false);
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Atualize suas informações públicas e seu objetivo de estudo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* capa */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Foto de capa</label>
            <div
              className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-2 bg-cover bg-center"
              style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
            >
              {!coverUrl && (
                <span className="text-xs text-text-secondary">PNG, JPG, GIF, WebP — até 5 MB</span>
              )}
              <label className="absolute bottom-2 right-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                {uploadingCover ? "Enviando..." : "Trocar capa"}
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" hidden onChange={onCover} />
              </label>
              {coverUrl && (
                <button
                  onClick={() => setCoverUrl("")}
                  className="absolute bottom-2 left-2 rounded-lg bg-black/60 p-1.5 text-white backdrop-blur"
                  title="Remover capa"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nome</label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Título / Headline</label>
            <Input
              value={form.headline}
              onChange={(e) => set("headline", e.target.value)}
              placeholder="Ex.: Estudante de Backend Python | Futuro Dev"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Habilidades</label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Ex.: Python, FastAPI, Pandas…"
              />
              <Button type="button" variant="outline" onClick={addSkill}>Adicionar</Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary-light">
                    {s}
                    <button onClick={() => setSkills(skills.filter((x) => x !== s))} className="hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Conte um pouco sobre você e seus objetivos com Python."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Localização</label>
              <Input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Cidade, País"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nível declarado</label>
              <select
                className={selectCls}
                value={form.current_level}
                onChange={(e) => set("current_level", e.target.value)}
              >
                <option value="basico">Básico</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Objetivo de aprendizado</label>
            <Input
              value={form.goal}
              onChange={(e) => set("goal", e.target.value)}
              placeholder="Ex.: Tornar-me Backend Developer em 6 meses."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">GitHub</label>
              <Input
                value={form.github_url}
                onChange={(e) => set("github_url", e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">LinkedIn</label>
              <Input
                value={form.linkedin_url}
                onChange={(e) => set("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Website</label>
              <Input
                value={form.website_url}
                onChange={(e) => set("website_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
