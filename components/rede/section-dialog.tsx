"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { saveProfileItem, type ProfileSection } from "@/lib/community/profile-actions";

export interface Field {
  name: string;
  label: string;
  type?: "text" | "textarea" | "date" | "checkbox" | "select";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
}

export const SECTION_FIELDS: Record<ProfileSection, { title: string; fields: Field[] }> = {
  experiencia: {
    title: "Experiência",
    fields: [
      { name: "title", label: "Título", required: true, placeholder: "Ex.: Desenvolvedor Python" },
      { name: "employment_type", label: "Tipo de emprego", type: "select", options: ["Tempo integral", "Meio período", "Autônomo", "Freelance", "Estágio", "Temporário", "Voluntário"] },
      { name: "company", label: "Empresa ou organização", required: true },
      { name: "company_logo_url", label: "Ícone da empresa (URL)", hint: "Link de uma imagem (logo)" },
      { name: "is_current", label: "Trabalho atualmente neste cargo", type: "checkbox" },
      { name: "start_date", label: "Data de início", type: "date" },
      { name: "end_date", label: "Data de término", type: "date" },
      { name: "location", label: "Localidade" },
      { name: "location_type", label: "Tipo de localidade", type: "select", options: ["Presencial", "Remoto", "Híbrido"] },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "found_via", label: "Onde você achou a vaga?" },
      { name: "skills", label: "Competências", hint: "Separadas por vírgula" },
    ],
  },
  formacao: {
    title: "Formação acadêmica",
    fields: [
      { name: "school", label: "Instituição de ensino", required: true },
      { name: "degree", label: "Diploma" },
      { name: "field_of_study", label: "Área de estudo" },
      { name: "start_date", label: "Data de início", type: "date" },
      { name: "end_date", label: "Data de término (ou prevista)", type: "date" },
      { name: "grade", label: "Nota" },
      { name: "activities", label: "Atividades e grupos", type: "textarea" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "skills", label: "Competências", hint: "Separadas por vírgula" },
    ],
  },
  certificado: {
    title: "Licença ou certificado",
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "issuer", label: "Organização emissora", required: true },
      { name: "issue_date", label: "Data de emissão", type: "date" },
      { name: "expiry_date", label: "Data de expiração", type: "date" },
      { name: "credential_id", label: "Código da credencial" },
      { name: "credential_url", label: "URL da credencial" },
      { name: "skills", label: "Competências", hint: "Separadas por vírgula" },
    ],
  },
  premio: {
    title: "Reconhecimento ou prêmio",
    fields: [
      { name: "title", label: "Título", required: true },
      { name: "issuer", label: "Emissor" },
      { name: "award_date", label: "Data", type: "date" },
      { name: "image_url", label: "Imagem (URL)", hint: "Link de uma imagem — não consome o banco" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "skills", label: "Competências", hint: "Separadas por vírgula" },
    ],
  },
  idioma: {
    title: "Idioma",
    fields: [
      { name: "language", label: "Idioma", required: true },
      { name: "proficiency", label: "Competência", type: "select", options: ["Básico", "Intermediário", "Avançado", "Fluente", "Nativo ou bilíngue"] },
    ],
  },
  prova: {
    title: "Nota de prova",
    fields: [
      { name: "title", label: "Título", required: true, placeholder: "Ex.: PCEP — Certified Entry-Level Python Programmer" },
      { name: "score", label: "Nota" },
      { name: "test_date", label: "Data", type: "date" },
      { name: "description", label: "Descrição", type: "textarea" },
    ],
  },
};

export function SectionDialog({
  section, open, onClose, initial,
}: {
  section: ProfileSection;
  open: boolean;
  onClose: () => void;
  initial?: Record<string, unknown> & { id?: string };
}) {
  const cfg = SECTION_FIELDS[section];
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true); setError(null);
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    for (const f of cfg.fields) {
      if (f.type === "checkbox") data[f.name] = fd.get(f.name) === "on";
      else {
        const v = fd.get(f.name)?.toString() ?? "";
        data[f.name] = v === "" && f.type === "date" ? null : v;
      }
    }
    const res = await saveProfileItem(section, data, initial?.id);
    setSaving(false);
    if (res.error) setError(res.error);
    else onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{initial?.id ? "Editar" : "Adicionar"} {cfg.title.toLowerCase()}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          {cfg.fields.map((f) => {
            const val = initial?.[f.name];
            const defVal = Array.isArray(val) ? (val as string[]).join(", ") : (val ?? "");
            if (f.type === "checkbox") {
              return (
                <label key={f.name} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name={f.name} defaultChecked={Boolean(val)} className="h-4 w-4 accent-[rgb(var(--primary))]" />
                  {f.label}
                </label>
              );
            }
            return (
              <div key={f.name}>
                <label className="mb-1 block text-xs font-medium text-text-secondary">{f.label}{f.required && " *"}</label>
                {f.type === "textarea" ? (
                  <textarea name={f.name} defaultValue={defVal as string} required={f.required} rows={3} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
                ) : f.type === "select" ? (
                  <select name={f.name} defaultValue={(defVal as string) || ""} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary">
                    <option value="">—</option>
                    {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input name={f.name} type={f.type === "date" ? "date" : "text"} defaultValue={defVal as string} required={f.required} placeholder={f.placeholder} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
                )}
                {f.hint && <p className="mt-0.5 text-[10px] text-text-secondary">{f.hint}</p>}
              </div>
            );
          })}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancelar</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
