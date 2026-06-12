"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ArrowLeft, Save, FileDown, Printer, FileText, Plus, Trash2, Loader2,
  CheckCircle2, AlertCircle, Lock, Eye, Pencil, Linkedin, Link as LinkIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveResume, publishResume } from "@/app/(dashboard)/curriculo/actions";
import { TEMPLATES, EMPTY_RESUME, type ResumeData } from "@/lib/resume/types";
import { renderResume, renderResumeText } from "@/lib/resume/render";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const inp = "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

export function ResumeEditor({ resumeId, isSuprema, onClose }: { resumeId: string; isSuprema: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("Meu currículo");
  const [template, setTemplate] = useState("classic");
  const [d, setD] = useState<ResumeData>(EMPTY_RESUME);
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("resumes").select("*").eq("id", resumeId).maybeSingle();
      if (data) {
        setTitle(data.title);
        setTemplate(data.template);
        setD({ ...EMPTY_RESUME, ...(data.data as ResumeData) });
      }
      setLoaded(true);
    })();
  }, [resumeId]);

  const set = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) => setD((p) => ({ ...p, [k]: v }));

  function save() {
    setMsg({});
    start(async () => {
      const res = await saveResume({ id: resumeId, title, template, data: d });
      if (res.error) setMsg({ err: res.error });
      else setMsg({ ok: "Currículo salvo!" });
    });
  }

  function exportPdf() {
    const html = renderResume(d, template);
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html + "<script>window.onload=()=>{window.print()}<\/script>");
    w.document.close();
  }
  const fname = (ext: string) => `${(d.fullName || "curriculo").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${ext}`;
  function exportDoc() {
    // .doc compatível com Word (HTML)
    download(fname("doc"), renderResume(d, template), "application/msword");
  }
  async function exportDocx() {
    // .docx NATIVO do Word (lib docx — formatação real)
    setMsg({});
    try {
      const { generateDocx } = await import("@/lib/resume/docx");
      const blob = await generateDocx(d, template);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fname("docx");
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMsg({ err: "Falha ao gerar o DOCX. Tente o PDF ou DOC." });
    }
  }
  function exportTxt() {
    download(fname("txt"), renderResumeText(d), "text/plain;charset=utf-8");
  }
  async function share() {
    const text = renderResumeText(d);
    if (navigator.share) {
      try { await navigator.share({ title: title, text }); return; } catch { /* cancelado */ }
    }
    await navigator.clipboard.writeText(text);
    setMsg({ ok: "Currículo copiado para a área de transferência!" });
  }

  // publica (link público) e abre o compartilhamento no LinkedIn
  async function publishAndShare(network: "linkedin" | "copy") {
    setMsg({});
    await saveResume({ id: resumeId, title, template, data: d }); // garante salvo
    const res = await publishResume(resumeId, true);
    if (res.error || !res.url) { setMsg({ err: res.error ?? "Falha ao publicar." }); return; }
    setPublicUrl(res.url);
    if (network === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(res.url)}`, "_blank", "noopener");
      setMsg({ ok: "Currículo publicado! Abrindo o LinkedIn…" });
    } else {
      await navigator.clipboard.writeText(res.url);
      setMsg({ ok: "Link público copiado!" });
    }
  }

  if (!loaded) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-text-secondary" /></div>;

  return (
    <div>
      {/* topo */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Meus currículos
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={save} disabled={pending} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
          </button>
          <button onClick={exportPdf} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:text-foreground"><Printer className="h-4 w-4" /> PDF</button>
          <button onClick={exportDocx} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:text-foreground"><FileDown className="h-4 w-4" /> DOCX</button>
          <button onClick={exportDoc} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:text-foreground"><FileDown className="h-4 w-4" /> DOC</button>
          <button onClick={exportTxt} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:text-foreground"><FileText className="h-4 w-4" /> TXT</button>
          <button onClick={share} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:text-foreground">Compartilhar</button>
          <button onClick={() => publishAndShare("linkedin")} className="inline-flex items-center gap-1.5 rounded-lg border border-[#0a66c2]/40 bg-[#0a66c2]/10 px-3 py-2 text-sm text-[#0a66c2] hover:bg-[#0a66c2]/20"><Linkedin className="h-4 w-4" /> LinkedIn</button>
          <button onClick={() => publishAndShare("copy")} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:text-foreground"><LinkIcon className="h-4 w-4" /> Link público</button>
        </div>
      </div>
      {publicUrl && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
          <span className="text-text-secondary">Link público:</span>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="truncate font-mono text-primary-light hover:underline">{publicUrl}</a>
        </div>
      )}

      {msg.err && <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"><AlertCircle className="h-4 w-4" /> {msg.err}</div>}
      {msg.ok && <div className="mb-3 flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green"><CheckCircle2 className="h-4 w-4" /> {msg.ok}</div>}

      {/* alternância mobile */}
      <div className="mb-3 flex gap-2 lg:hidden">
        <button onClick={() => setTab("edit")} className={`flex-1 rounded-lg py-2 text-sm font-medium ${tab === "edit" ? "bg-primary/10 text-primary-light" : "bg-surface-2 text-text-secondary"}`}><Pencil className="mr-1 inline h-4 w-4" /> Editar</button>
        <button onClick={() => setTab("preview")} className={`flex-1 rounded-lg py-2 text-sm font-medium ${tab === "preview" ? "bg-primary/10 text-primary-light" : "bg-surface-2 text-text-secondary"}`}><Eye className="mr-1 inline h-4 w-4" /> Preview</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* FORM */}
        <div className={`space-y-5 ${tab === "preview" ? "hidden lg:block" : ""}`}>
          {/* título + template */}
          <div className="card space-y-3 p-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inp} placeholder="Título do currículo (uso interno)" />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Modelo</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TEMPLATES.map((t) => {
                  const locked = t.suprema && !isSuprema;
                  return (
                    <button key={t.id} onClick={() => !locked && setTemplate(t.id)} disabled={locked}
                      className={`relative rounded-lg border p-2 text-left text-xs ${template === t.id ? "border-primary" : "border-border"} ${locked ? "opacity-50" : "hover:border-primary/50"}`}>
                      <span className="block h-1.5 w-8 rounded-full" style={{ background: t.accent }} />
                      <span className="mt-1.5 block font-semibold">{t.name}</span>
                      {locked && <Lock className="absolute right-2 top-2 h-3 w-3 text-text-secondary" />}
                      {t.suprema && <span className="text-[9px] text-primary-light">Suprema</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* dados pessoais */}
          <Group title="Dados pessoais">
            <input value={d.fullName} onChange={(e) => set("fullName", e.target.value)} className={inp} placeholder="Nome completo" />
            <input value={d.headline} onChange={(e) => set("headline", e.target.value)} className={inp} placeholder="Título profissional (ex.: Desenvolvedor Backend Python)" />
            <div className="grid grid-cols-2 gap-2">
              <input value={d.email} onChange={(e) => set("email", e.target.value)} className={inp} placeholder="E-mail" />
              <input value={d.phone} onChange={(e) => set("phone", e.target.value)} className={inp} placeholder="Telefone" />
            </div>
            <input value={d.location} onChange={(e) => set("location", e.target.value)} className={inp} placeholder="Cidade, Estado" />
            <div className="grid grid-cols-2 gap-2">
              <input value={d.github} onChange={(e) => set("github", e.target.value)} className={inp} placeholder="GitHub" />
              <input value={d.linkedin} onChange={(e) => set("linkedin", e.target.value)} className={inp} placeholder="LinkedIn" />
            </div>
            <input value={d.website} onChange={(e) => set("website", e.target.value)} className={inp} placeholder="Website / Portfólio" />
            <div>
              <input value={d.photo ?? ""} onChange={(e) => set("photo", e.target.value)} className={inp} placeholder="Foto de perfil (URL da imagem) — opcional" />
              <p className="mt-1 text-[11px] text-text-secondary">Cole a URL de uma foto (ex.: seu avatar do GitHub/LinkedIn). Aparece nos modelos com cabeçalho/sidebar.</p>
              {d.photo ? <img src={d.photo} alt="prévia" className="mt-2 h-16 w-16 rounded-full object-cover ring-2 ring-border" /> : null}
            </div>
          </Group>

          <Group title="Resumo profissional">
            <textarea value={d.summary} onChange={(e) => set("summary", e.target.value)} rows={4} className={inp} placeholder="Um parágrafo sobre você, seus objetivos e o que oferece." />
          </Group>

          {/* skills */}
          <Group title="Habilidades">
            <div className="flex gap-2">
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (skillInput.trim()) { set("skills", [...d.skills, skillInput.trim()]); setSkillInput(""); } } }} className={inp} placeholder="Digite e Enter (ex.: Python, FastAPI…)" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {d.skills.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary-light">
                  {s}<button onClick={() => set("skills", d.skills.filter((_, j) => j !== i))}>×</button>
                </span>
              ))}
            </div>
          </Group>

          {/* experiências */}
          <Repeatable title="Experiência" items={d.experiences}
            onAdd={() => set("experiences", [...d.experiences, { role: "", company: "", period: "", description: "" }])}
            onRemove={(i) => set("experiences", d.experiences.filter((_, j) => j !== i))}
            render={(e, i) => (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <input value={e.role} onChange={(ev) => set("experiences", d.experiences.map((x, j) => j === i ? { ...x, role: ev.target.value } : x))} className={inp} placeholder="Cargo" />
                  <input value={e.period} onChange={(ev) => set("experiences", d.experiences.map((x, j) => j === i ? { ...x, period: ev.target.value } : x))} className={inp} placeholder="Período (ex.: 2023–atual)" />
                </div>
                <input value={e.company} onChange={(ev) => set("experiences", d.experiences.map((x, j) => j === i ? { ...x, company: ev.target.value } : x))} className={inp} placeholder="Empresa" />
                <textarea value={e.description} onChange={(ev) => set("experiences", d.experiences.map((x, j) => j === i ? { ...x, description: ev.target.value } : x))} rows={2} className={inp} placeholder="O que você fez e conquistou" />
              </>
            )}
          />

          {/* formação */}
          <Repeatable title="Formação" items={d.education}
            onAdd={() => set("education", [...d.education, { course: "", institution: "", period: "" }])}
            onRemove={(i) => set("education", d.education.filter((_, j) => j !== i))}
            render={(e, i) => (
              <>
                <input value={e.course} onChange={(ev) => set("education", d.education.map((x, j) => j === i ? { ...x, course: ev.target.value } : x))} className={inp} placeholder="Curso / Grau" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={e.institution} onChange={(ev) => set("education", d.education.map((x, j) => j === i ? { ...x, institution: ev.target.value } : x))} className={inp} placeholder="Instituição" />
                  <input value={e.period} onChange={(ev) => set("education", d.education.map((x, j) => j === i ? { ...x, period: ev.target.value } : x))} className={inp} placeholder="Período" />
                </div>
              </>
            )}
          />

          {/* projetos */}
          <Repeatable title="Projetos" items={d.projects}
            onAdd={() => set("projects", [...d.projects, { name: "", description: "", url: "" }])}
            onRemove={(i) => set("projects", d.projects.filter((_, j) => j !== i))}
            render={(p, i) => (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <input value={p.name} onChange={(ev) => set("projects", d.projects.map((x, j) => j === i ? { ...x, name: ev.target.value } : x))} className={inp} placeholder="Nome do projeto" />
                  <input value={p.url ?? ""} onChange={(ev) => set("projects", d.projects.map((x, j) => j === i ? { ...x, url: ev.target.value } : x))} className={inp} placeholder="URL (opcional)" />
                </div>
                <textarea value={p.description} onChange={(ev) => set("projects", d.projects.map((x, j) => j === i ? { ...x, description: ev.target.value } : x))} rows={2} className={inp} placeholder="Descrição" />
              </>
            )}
          />

          {/* idiomas */}
          <Group title="Idiomas">
            <input value={langInput} onChange={(e) => setLangInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (langInput.trim()) { set("languages", [...d.languages, langInput.trim()]); setLangInput(""); } } }} className={inp} placeholder="Ex.: Inglês (avançado) e Enter" />
            <div className="flex flex-wrap gap-1.5">
              {d.languages.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs">
                  {s}<button onClick={() => set("languages", d.languages.filter((_, j) => j !== i))}>×</button>
                </span>
              ))}
            </div>
          </Group>
        </div>

        {/* PREVIEW */}
        <div className={`lg:sticky lg:top-20 lg:self-start ${tab === "edit" ? "hidden lg:block" : ""}`}>
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <iframe title="preview" className="h-[80vh] w-full" srcDoc={renderResume(d, template)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card space-y-2.5 p-4">
      <p className="text-sm font-semibold">{title}</p>
      {children}
    </div>
  );
}

function Repeatable<T>({ title, items, onAdd, onRemove, render }: {
  title: string; items: T[]; onAdd: () => void; onRemove: (i: number) => void; render: (item: T, i: number) => React.ReactNode;
}) {
  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{title}</p>
        <button onClick={onAdd} className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-light"><Plus className="h-3.5 w-3.5" /> Adicionar</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-border bg-surface p-3">
          {render(item, i)}
          <button onClick={() => onRemove(i)} className="inline-flex items-center gap-1 text-xs text-red-400"><Trash2 className="h-3 w-3" /> Remover</button>
        </div>
      ))}
    </div>
  );
}
