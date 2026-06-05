"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/data/actions";
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
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    goal: profile.goal ?? "",
    github_url: profile.github_url ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    website_url: profile.website_url ?? "",
    current_level: profile.current_level ?? "basico",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    await updateProfile({
      ...form,
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
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nome</label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
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
