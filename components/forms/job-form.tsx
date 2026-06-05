"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Sparkles, Wand2 } from "lucide-react";
import { analyzeJob, createJob, updateJob } from "@/lib/data/jobs-actions";
import type { Job } from "@/types";
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
  company: "",
  type: "",
  seniority: "",
  salary: "",
  modality: "",
  location: "",
  description: "",
  skills: "",
  stack: "",
  url: "",
};

export function JobForm({
  open,
  onOpenChange,
  job,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  job?: Job | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [rawText, setRawText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof EMPTY, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (open) {
      setMsg(null);
      setError(null);
      setRawText("");
      setForm(
        job
          ? {
              title: job.title,
              company: job.company ?? "",
              type: job.type ?? "",
              seniority: job.seniority ?? "",
              salary: job.salary ?? "",
              modality: job.modality ?? "",
              location: job.location ?? "",
              description: job.description ?? "",
              skills: job.skills.join(", "),
              stack: job.stack.join(", "),
              url: job.url ?? "",
            }
          : EMPTY,
      );
    }
  }, [open, job]);

  const analyze = async () => {
    if (!form.url && !rawText.trim()) {
      setMsg("Cole o link da vaga e/ou a descrição para a IA analisar.");
      return;
    }
    setAnalyzing(true);
    setMsg(null);
    const res = await analyzeJob({ url: form.url || undefined, text: rawText });
    setAnalyzing(false);
    if (res.error) {
      setMsg(res.error);
      return;
    }
    setForm((f) => ({
      ...f,
      title: res.title || f.title,
      company: res.company ?? f.company,
      type: res.type ?? f.type,
      seniority: res.seniority ?? f.seniority,
      salary: res.salary ?? f.salary,
      modality: res.modality ?? f.modality,
      location: res.location ?? f.location,
      description: res.description ?? f.description,
      skills: (res.skills ?? []).join(", ") || f.skills,
      stack: (res.stack ?? []).join(", ") || f.stack,
    }));
    setMsg("Vaga analisada pela IA! Revise e salve.");
  };

  const save = async () => {
    if (!form.title.trim()) {
      setError("Informe ao menos o nome da vaga.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      stack: form.stack.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const res = job ? await updateJob(job.id, payload) : await createJob(payload);
    setSaving(false);
    if (res?.error) return setError(res.error);
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? "Editar vaga" : "Adicionar vaga de TI"}</DialogTitle>
          <DialogDescription>
            Cole o link (LinkedIn, etc.) e/ou a descrição da vaga. A IA extrai
            cargo, salário, modalidade, stack e habilidades automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Link da vaga</label>
            <Input
              placeholder="https://www.linkedin.com/jobs/view/..."
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Descrição da vaga (cole aqui o texto)
            </label>
            <Textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Cole a descrição completa da vaga para a IA analisar (recomendado para LinkedIn)."
              rows={4}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" onClick={analyze} disabled={analyzing}>
              {analyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {analyzing ? "Analisando com IA..." : "Analisar com IA"}
            </Button>
            {msg && <p className="text-xs text-text-secondary">{msg}</p>}
          </div>

          <div className="h-px bg-border" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Nome da vaga *</label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Empresa</label>
              <Input value={form.company} onChange={(e) => set("company", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Localização</label>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tipo</label>
              <select className={selectCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="">—</option>
                {["CLT", "PJ", "Estágio", "Freelance", "Temporário"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Senioridade</label>
              <select className={selectCls} value={form.seniority} onChange={(e) => set("seniority", e.target.value)}>
                <option value="">—</option>
                {["Estágio", "Júnior", "Pleno", "Sênior", "Especialista"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Modalidade</label>
              <select className={selectCls} value={form.modality} onChange={(e) => set("modality", e.target.value)}>
                <option value="">—</option>
                {["Remoto", "Presencial", "Híbrido"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Salário</label>
              <Input value={form.salary} onChange={(e) => set("salary", e.target.value)} placeholder="R$ ..." />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Stack (separe por vírgula)</label>
            <Input value={form.stack} onChange={(e) => set("stack", e.target.value)} placeholder="Python, FastAPI, PostgreSQL" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Habilidades (separe por vírgula)</label>
            <Input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Comunicação, Testes, Git" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {job ? "Salvar" : "Adicionar vaga"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
