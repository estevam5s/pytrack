"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Loader2, X } from "lucide-react";
import { createJob } from "@/lib/community/actions";

export function CreateJobDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({
    title: "",
    company: "",
    location: "",
    remote: false,
    seniority: "",
    contract_type: "",
    salary_range: "",
    apply_url: "",
    tags: "",
    description: "",
  });
  const up = (k: string, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));

  const submit = () => {
    setError(null);
    start(async () => {
      const res = await createJob({
        title: f.title,
        company: f.company,
        location: f.location || undefined,
        remote: f.remote,
        seniority: f.seniority || undefined,
        contract_type: f.contract_type || undefined,
        salary_range: f.salary_range || undefined,
        apply_url: f.apply_url || undefined,
        description: f.description || undefined,
        tags: f.tags
          ? f.tags.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean)
          : [],
      });
      if (res?.error) return setError(res.error);
      setOpen(false);
      setF({ title: "", company: "", location: "", remote: false, seniority: "", contract_type: "", salary_range: "", apply_url: "", tags: "", description: "" });
      router.refresh();
    });
  };

  const inp =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-text-secondary focus:border-primary/40";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-secondary/40 bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary/20"
      >
        <Briefcase className="h-4 w-4" /> Publicar vaga
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-6 sm:rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Briefcase className="h-4 w-4 text-secondary" /> Publicar vaga
                </h3>
                <button onClick={() => setOpen(false)} className="text-text-secondary hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                <input className={inp} placeholder="Título da vaga *" value={f.title} onChange={(e) => up("title", e.target.value)} />
                <input className={inp} placeholder="Empresa *" value={f.company} onChange={(e) => up("company", e.target.value)} />
                <div className="grid grid-cols-2 gap-2.5">
                  <input className={inp} placeholder="Local" value={f.location} onChange={(e) => up("location", e.target.value)} />
                  <input className={inp} placeholder="Senioridade" value={f.seniority} onChange={(e) => up("seniority", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <input className={inp} placeholder="Contrato (CLT/PJ)" value={f.contract_type} onChange={(e) => up("contract_type", e.target.value)} />
                  <input className={inp} placeholder="Faixa salarial" value={f.salary_range} onChange={(e) => up("salary_range", e.target.value)} />
                </div>
                <input className={inp} placeholder="Link para candidatura (URL)" value={f.apply_url} onChange={(e) => up("apply_url", e.target.value)} />
                <input className={inp} placeholder="Tags: python, backend..." value={f.tags} onChange={(e) => up("tags", e.target.value)} />
                <textarea className={inp} rows={3} placeholder="Descrição" value={f.description} onChange={(e) => up("description", e.target.value)} />
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input type="checkbox" checked={f.remote} onChange={(e) => up("remote", e.target.checked)} className="accent-primary" />
                  Vaga remota
                </label>
                {error && <p className="text-xs text-danger">{error}</p>}
                <button
                  onClick={submit}
                  disabled={pending || !f.title.trim() || !f.company.trim()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-[#04261a] hover:bg-secondary/90 disabled:opacity-50"
                >
                  {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Publicar vaga
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
