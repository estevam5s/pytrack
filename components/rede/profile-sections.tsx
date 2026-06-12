"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Briefcase, GraduationCap, Award, BadgeCheck,
  Languages, FileText, Star, FolderGit2, Sparkles, Building2, ThumbsUp, Loader2,
} from "lucide-react";
import { SectionDialog } from "./section-dialog";
import { deleteProfileItem, saveRecommendation, type ProfileSection } from "@/lib/community/profile-actions";
import type { ProfileSections as Sections } from "@/lib/community/profile-queries";

interface Props {
  sections: Sections;
  skills: string[];
  isSelf: boolean;
  targetId: string;
  viewerId: string | null;
}

function fmtDate(d?: unknown) {
  if (!d) return "";
  const dt = new Date(d as string);
  return dt.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}
function period(a?: unknown, b?: unknown, current?: unknown) {
  const s = fmtDate(a); const e = current ? "Atual" : fmtDate(b);
  return [s, e].filter(Boolean).join(" – ");
}

export function ProfileSections({ sections, skills, isSelf, targetId, viewerId }: Props) {
  const router = useRouter();
  const [dialog, setDialog] = useState<{ section: ProfileSection; item?: Record<string, unknown> } | null>(null);

  async function onDelete(section: ProfileSection, id: string) {
    if (!confirm("Remover este item?")) return;
    await deleteProfileItem(section, id);
    router.refresh();
  }

  const Card = ({ icon: Icon, title, section, add, children }: { icon: typeof Briefcase; title: string; section?: ProfileSection; add?: boolean; children: React.ReactNode }) => (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold"><Icon className="h-5 w-5 text-primary-light" /> {title}</h2>
        {isSelf && add && section && (
          <button onClick={() => setDialog({ section })} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs hover:border-primary/40"><Plus className="h-3.5 w-3.5" /> Adicionar</button>
        )}
      </div>
      {children}
    </div>
  );

  const ItemActions = ({ section, item }: { section: ProfileSection; item: Record<string, unknown> }) =>
    isSelf ? (
      <div className="flex shrink-0 gap-1">
        <button onClick={() => setDialog({ section, item })} className="rounded p-1 text-text-secondary hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
        <button onClick={() => onDelete(section, item.id as string)} className="rounded p-1 text-text-secondary hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    ) : null;

  const SkillChips = ({ list }: { list?: unknown }) =>
    Array.isArray(list) && list.length ? (
      <div className="mt-1.5 flex flex-wrap gap-1">{(list as string[]).map((s) => <span key={s} className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-secondary">{s}</span>)}</div>
    ) : null;

  const empty = (txt: string) => <p className="text-sm text-text-secondary">{txt}</p>;

  return (
    <div className="space-y-3">
      {/* Serviços */}
      {(isSelf || sections.services) && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><Building2 className="h-5 w-5" /></span>
            <div>
              <p className="font-bold">Serviços</p>
              <p className="text-xs text-text-secondary">{sections.services?.is_open ? "Aberto a propostas" : "Mostre os serviços que você presta"}</p>
            </div>
          </div>
          <Link href={`/comunidade/perfil/${targetId}/servicos`} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary/40">Ver página</Link>
        </div>
      )}

      {/* Experiência */}
      <Card icon={Briefcase} title="Experiência" section="experiencia" add>
        {sections.experiences.length === 0 ? empty("Nenhuma experiência adicionada.") : (
          <div className="space-y-4">
            {sections.experiences.map((x) => (
              <div key={x.id as string} className="flex gap-3">
                {x.company_logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={x.company_logo_url as string} alt="" className="h-12 w-12 rounded-lg border border-border object-contain" />
                ) : <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2"><Briefcase className="h-5 w-5 text-text-secondary" /></span>}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{x.title as string}</p>
                      <p className="text-sm">{x.company as string}{x.employment_type ? ` · ${x.employment_type}` : ""}</p>
                      <p className="text-xs text-text-secondary">{period(x.start_date, x.end_date, x.is_current)}{x.location ? ` · ${x.location}` : ""}{x.location_type ? ` · ${x.location_type}` : ""}</p>
                    </div>
                    <ItemActions section="experiencia" item={x} />
                  </div>
                  {x.description ? <p className="mt-1 whitespace-pre-line text-sm text-text-secondary">{x.description as string}</p> : null}
                  <SkillChips list={x.skills} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Formação */}
      <Card icon={GraduationCap} title="Formação acadêmica" section="formacao" add>
        {sections.education.length === 0 ? empty("Nenhuma formação adicionada.") : (
          <div className="space-y-4">
            {sections.education.map((x) => (
              <div key={x.id as string} className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{x.school as string}</p>
                  <p className="text-sm">{[x.degree, x.field_of_study].filter(Boolean).join(", ")}</p>
                  <p className="text-xs text-text-secondary">{period(x.start_date, x.end_date)}{x.grade ? ` · Nota: ${x.grade}` : ""}</p>
                  {x.description ? <p className="mt-1 text-sm text-text-secondary">{x.description as string}</p> : null}
                  <SkillChips list={x.skills} />
                </div>
                <ItemActions section="formacao" item={x} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Licenças e certificados */}
      <Card icon={BadgeCheck} title="Licenças e certificados" section="certificado" add>
        {sections.certificates.length === 0 ? empty("Nenhum certificado adicionado.") : (
          <div className="space-y-4">
            {sections.certificates.map((x) => (
              <div key={x.id as string} className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{x.name as string}</p>
                  <p className="text-sm">{x.issuer as string}</p>
                  <p className="text-xs text-text-secondary">{x.issue_date ? `Emitido em ${fmtDate(x.issue_date)}` : ""}{x.credential_id ? ` · ID ${x.credential_id}` : ""}</p>
                  {x.credential_url ? <a href={x.credential_url as string} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-light hover:underline">Ver credencial</a> : null}
                  <SkillChips list={x.skills} />
                </div>
                <ItemActions section="certificado" item={x} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Projetos (da plataforma) */}
      <Card icon={FolderGit2} title="Projetos concluídos na plataforma">
        {sections.projects.length === 0 ? empty("Conclua projetos na plataforma para exibir aqui.") : (
          <div className="grid gap-3 sm:grid-cols-2">
            {sections.projects.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-surface-2 p-3">
                <p className="text-sm font-semibold">{p.title}</p>
                {p.area ? <p className="text-[11px] text-primary-light">{p.area}</p> : null}
                {p.description ? <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{p.description}</p> : null}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Competências */}
      <Card icon={Sparkles} title="Competências">
        {skills.length === 0 ? empty("Nenhuma competência. Edite seu perfil para adicionar.") : (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-light">
                {s}{sections.endorsements[s] ? <span className="rounded-full bg-primary/20 px-1 text-[9px]">+{sections.endorsements[s]}</span> : null}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Recomendações */}
      <Card icon={ThumbsUp} title="Recomendações">
        {!isSelf && viewerId && <RecommendButton targetId={targetId} />}
        {sections.recommendations.length === 0 ? empty("Nenhuma recomendação ainda.") : (
          <div className="space-y-4">
            {sections.recommendations.map((r) => (
              <div key={r.id} className="flex gap-3">
                {r.author?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.author.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary-light">{(r.author?.name ?? "?").charAt(0)}</span>}
                <div>
                  <Link href={`/comunidade/perfil/${r.author_id}`} className="text-sm font-semibold hover:underline">{r.author?.name ?? "Membro"}</Link>
                  {r.relationship ? <p className="text-[11px] text-text-secondary">{r.relationship}</p> : null}
                  <p className="mt-1 text-sm text-text-secondary">“{r.body}”</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Prêmios */}
      <Card icon={Award} title="Reconhecimentos e prêmios" section="premio" add>
        {sections.awards.length === 0 ? empty("Nenhum prêmio adicionado.") : (
          <div className="space-y-4">
            {sections.awards.map((x) => (
              <div key={x.id as string} className="flex items-start justify-between gap-2">
                <div className="flex gap-3">
                  {x.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={x.image_url as string} alt="" className="h-14 w-14 rounded-lg border border-border object-cover" />
                  ) : null}
                  <div>
                    <p className="font-semibold">{x.title as string}</p>
                    <p className="text-sm">{[x.issuer, fmtDate(x.award_date)].filter(Boolean).join(" · ")}</p>
                    {x.description ? <p className="mt-1 text-sm text-text-secondary">{x.description as string}</p> : null}
                    <SkillChips list={x.skills} />
                  </div>
                </div>
                <ItemActions section="premio" item={x} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Notas de provas */}
      <Card icon={FileText} title="Notas de provas" section="prova" add>
        {sections.testScores.length === 0 ? empty("Nenhuma nota adicionada.") : (
          <div className="space-y-3">
            {sections.testScores.map((x) => (
              <div key={x.id as string} className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{x.title as string}</p>
                  <p className="text-sm text-text-secondary">{[x.score ? `Nota: ${x.score}` : "", fmtDate(x.test_date)].filter(Boolean).join(" · ")}</p>
                  {x.description ? <p className="text-sm text-text-secondary">{x.description as string}</p> : null}
                </div>
                <ItemActions section="prova" item={x} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Idiomas */}
      <Card icon={Languages} title="Idiomas" section="idioma" add>
        {sections.languages.length === 0 ? empty("Nenhum idioma adicionado.") : (
          <div className="space-y-2">
            {sections.languages.map((x) => (
              <div key={x.id as string} className="flex items-center justify-between">
                <div><span className="font-semibold">{x.language as string}</span>{x.proficiency ? <span className="ml-2 text-sm text-text-secondary">{x.proficiency as string}</span> : null}</div>
                <ItemActions section="idioma" item={x} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {dialog && (
        <SectionDialog section={dialog.section} open initial={dialog.item} onClose={() => { setDialog(null); router.refresh(); }} />
      )}
    </div>
  );
}

function RecommendButton({ targetId }: { targetId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rel, setRel] = useState("");
  const [body, setBody] = useState("");

  async function submit() {
    setSaving(true);
    const res = await saveRecommendation(targetId, rel, body);
    setSaving(false);
    if (!res.error) { setOpen(false); setBody(""); router.refresh(); }
  }

  if (!open) return <button onClick={() => setOpen(true)} className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-primary/40 px-3 py-1.5 text-sm text-primary-light hover:bg-primary/10"><Star className="h-3.5 w-3.5" /> Recomendar</button>;
  return (
    <div className="mb-3 rounded-lg border border-border bg-surface-2 p-3">
      <input value={rel} onChange={(e) => setRel(e.target.value)} placeholder="Sua relação (ex.: Colega de equipe)" className="mb-2 w-full rounded border border-border bg-card px-2 py-1.5 text-sm outline-none" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Escreva uma recomendação…" className="w-full rounded border border-border bg-card px-2 py-1.5 text-sm outline-none" />
      <div className="mt-2 flex justify-end gap-2">
        <button onClick={() => setOpen(false)} className="rounded border border-border px-3 py-1 text-xs">Cancelar</button>
        <button onClick={submit} disabled={saving || !body.trim()} className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1 text-xs font-semibold text-white disabled:opacity-60">{saving && <Loader2 className="h-3 w-3 animate-spin" />} Publicar</button>
      </div>
    </div>
  );
}
