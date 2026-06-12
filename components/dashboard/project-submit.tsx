"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { analyzeProject, type ProjectAnalysis } from "@/lib/ai/actions";
import { CodeEditor } from "@/components/ui/code-editor";
import { GithubPushButton } from "@/components/github-push-button";
import { buildReadme, buildLicense, GITIGNORE_PY, PY_CI_WORKFLOW } from "@/lib/github-readme";
import { cn } from "@/lib/utils";

function scoreColor(s: number) {
  if (s >= 8) return "bg-secondary/15 text-secondary border-secondary/30";
  if (s >= 5) return "bg-warning/15 text-warning border-warning/30";
  return "bg-danger/15 text-danger border-danger/30";
}

export function ProjectSubmit({
  title,
  description,
  requirements,
}: {
  title: string;
  description: string;
  requirements: string[];
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProjectAnalysis | null>(null);

  async function analyze() {
    setLoading(true);
    setResult(null);
    const res = await analyzeProject({ title, description, requirements, code });
    setResult(res);
    setLoading(false);
  }

  return (
    <div className="mt-4 rounded-lg border border-primary/25 bg-primary/[0.04] p-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-primary" /> Envie sua solução do projeto
      </p>
      <p className="mb-3 text-xs text-text-secondary">
        Cole o código principal do seu projeto. A IA avalia se atende aos requisitos e dá feedback.
      </p>

      <CodeEditor value={code} onChange={setCode} placeholder={`# Código do projeto: ${title}`} minRows={8} />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={analyze}
          disabled={loading || !code.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {loading ? "Avaliando..." : "Avaliar com IA"}
        </button>
        {code.trim() && (
          <GithubPushButton
            defaultName={`projeto-${title}`}
            description={`Projeto "${title}" — PyTrack.`}
            files={[
              { path: "main.py", content: code },
              { path: "README.md", content: buildReadme({ title, kind: "projeto", description, requirements, files: [{ path: "main.py" }, { path: "README.md" }, { path: "LICENSE" }, { path: ".gitignore" }, { path: "requirements.txt" }, { path: ".github/workflows/ci.yml" }], mainFile: "main.py" }) },
              { path: ".gitignore", content: GITIGNORE_PY },
              { path: "requirements.txt", content: "# Adicione aqui as dependências do projeto, uma por linha.\n# Ex.: requests==2.32.3\n" },
              { path: "LICENSE", content: buildLicense() },
              { path: ".github/workflows/ci.yml", content: PY_CI_WORKFLOW },
            ]}
            label="Criar repositório"
          />
        )}
      </div>

      {result?.error && (
        <p className="mt-3 flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {result.error}
        </p>
      )}

      {result && !result.error && (
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-bold", scoreColor(result.score))}>
              Nota {result.score}/10
            </span>
            <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", result.meets_requirements ? "border-secondary/30 bg-secondary/10 text-secondary" : "border-warning/30 bg-warning/10 text-warning")}>
              {result.meets_requirements ? "Atende aos requisitos" : "Requisitos parcialmente atendidos"}
            </span>
          </div>
          {result.summary && <p className="text-foreground">{result.summary}</p>}
          {result.strengths.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-secondary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Pontos fortes
              </p>
              <ul className="space-y-1 text-text-secondary">
                {result.strengths.map((s, i) => <li key={i} className="flex gap-1.5"><span className="text-secondary">+</span> {s}</li>)}
              </ul>
            </div>
          )}
          {result.improvements.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-primary">
                <Lightbulb className="h-3.5 w-3.5" /> Melhorias
              </p>
              <ul className="space-y-1 text-text-secondary">
                {result.improvements.map((s, i) => <li key={i} className="flex gap-1.5"><span className="text-primary">→</span> {s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
