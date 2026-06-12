"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus, Pencil, Trash2, Loader2, Clock } from "lucide-react";
import { createResume, deleteResume } from "@/app/(dashboard)/curriculo/actions";
import { TEMPLATES } from "@/lib/resume/types";
import { ResumeEditor } from "./resume-editor";

interface ResumeRow {
  id: string;
  title: string;
  template: string;
  updated_at: string;
}

export function ResumeList({ resumes, isSuprema }: { resumes: ResumeRow[]; isSuprema: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (editing) {
    return <ResumeEditor resumeId={editing} isSuprema={isSuprema} onClose={() => { setEditing(null); router.refresh(); }} />;
  }

  function create() {
    setError(null);
    start(async () => {
      const res = await createResume();
      if (res.error) setError(res.error);
      else if (res.id) setEditing(res.id);
    });
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button onClick={create} disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Novo currículo
      </button>

      {resumes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-text-secondary">
          <FileText className="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p>Você ainda não tem currículos. Crie o primeiro — já vem pré-preenchido com seu perfil!</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => {
            const tpl = TEMPLATES.find((t) => t.id === r.template);
            return (
              <div key={r.id} className="card flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: (tpl?.accent ?? "#5F75F2") + "22", color: tpl?.accent ?? "#5F75F2" }}>
                    <FileText className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-secondary">{tpl?.name ?? r.template}</span>
                </div>
                <p className="mt-3 font-semibold">{r.title}</p>
                <p className="flex items-center gap-1 text-xs text-text-secondary"><Clock className="h-3 w-3" /> {new Date(r.updated_at).toLocaleDateString("pt-BR")}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setEditing(r.id)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary-light hover:bg-primary/20">
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                  <button onClick={() => { if (confirm("Excluir este currículo?")) start(async () => { await deleteResume(r.id); router.refresh(); }); }} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
