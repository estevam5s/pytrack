"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  Loader2,
  Settings2,
  Sparkles,
  SquareTerminal,
  Wand2,
} from "lucide-react";
import type { PracticeExercise } from "@/types";
import { analyzeExercise, type ExerciseAnalysis } from "@/lib/ai/actions";
import { buildReadme, buildLicense, GITIGNORE_PY, PY_CI_WORKFLOW } from "@/lib/github-readme";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { CodeBlock } from "@/components/content/code-block";
import { GithubPushButton } from "@/components/github-push-button";
import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score >= 8) return "bg-secondary/15 text-secondary border-secondary/30";
  if (score >= 5) return "bg-warning/15 text-warning border-warning/30";
  return "bg-danger/15 text-danger border-danger/30";
}

export function AiExerciseReview({ exercise }: { exercise: PracticeExercise }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExerciseAnalysis | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    setShowSolution(false);
    const res = await analyzeExercise({
      title: exercise.title,
      objective: exercise.objective ?? exercise.title,
      requirements: exercise.requirements ?? [],
      userCode: code,
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="rounded-lg border border-primary/25 bg-primary/[0.04] p-4">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">Resolva e receba análise da IA</p>
      </div>
      <p className="mb-3 text-xs text-text-secondary">
        Escreva sua solução em Python. A IA avalia, dá nota, feedback e mostra
        uma solução melhor.
      </p>

      <CodeEditor
        value={code}
        onChange={setCode}
        placeholder={`# Sua solução para: ${exercise.title}\n# Tab = indenta · Enter = mantém a indentação`}
        minRows={6}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={analyze} disabled={loading || !code.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          {loading ? "Analisando..." : "Analisar com IA"}
        </Button>
        <button
          onClick={() => {
            try {
              localStorage.setItem(
                "pytrack-ide-pending",
                `# ${exercise.title}\n# ${exercise.objective ?? ""}\n\n${code || "# escreva sua solução aqui"}`,
              );
            } catch {
              /* ignore */
            }
            window.open("/ide", "_blank");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
        >
          <SquareTerminal className="h-3.5 w-3.5" /> Abrir na IDE
        </button>
        {code.trim() && (
          <GithubPushButton
            defaultName={`exercicio-${exercise.title}`}
            description={`Solução do exercício "${exercise.title}" — PyTrack.`}
            files={[
              { path: "solucao.py", content: code },
              { path: "README.md", content: buildReadme({ title: exercise.title, kind: "exercicio", objective: exercise.objective ?? undefined, files: [{ path: "solucao.py" }, { path: "README.md" }, { path: "LICENSE" }, { path: ".gitignore" }, { path: ".github/workflows/ci.yml" }], mainFile: "solucao.py" }) },
              { path: ".gitignore", content: GITIGNORE_PY },
              { path: "LICENSE", content: buildLicense() },
              { path: ".github/workflows/ci.yml", content: PY_CI_WORKFLOW },
            ]}
            label="Salvar no GitHub"
          />
        )}
        {result?.model && !result.error && (
          <span className="text-[10px] text-text-secondary">
            via {result.model.split("/").pop()?.replace(":free", "")}
          </span>
        )}
      </div>

      {result?.error && (
        <div className="mt-3 space-y-1.5 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          <p className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {result.error}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Settings2 className="h-3.5 w-3.5" />
            A IA padrão pode estar instável. Você pode usar a sua própria IA em{" "}
            <Link href="/configuracoes/ia" className="font-semibold text-primary-light hover:underline">
              Configurações → IA & Modelos
            </Link>
            .
          </p>
        </div>
      )}

      {result && !result.error && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-bold",
                scoreColor(result.score),
              )}
            >
              Nota {result.score}/10
            </span>
            {result.complexity && (
              <span className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-text-secondary">
                {result.complexity}
              </span>
            )}
          </div>

          {result.summary && (
            <p className="text-sm text-foreground">{result.summary}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {result.strengths.length > 0 && (
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Pontos fortes
                </p>
                <ul className="space-y-1 text-sm text-text-secondary">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span className="text-secondary">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.issues.length > 0 && (
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-warning">
                  <AlertTriangle className="h-3.5 w-3.5" /> Problemas
                </p>
                <ul className="space-y-1 text-sm text-text-secondary">
                  {result.issues.map((s, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span className="text-warning">!</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.suggestions.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-primary">
                <Lightbulb className="h-3.5 w-3.5" /> Sugestões de melhoria
              </p>
              <ul className="space-y-1 text-sm text-text-secondary">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-primary">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.better_solution && (
            <div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSolution((s) => !s)}
              >
                {showSolution ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Ocultar melhor solução
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Ver melhor solução
                  </>
                )}
              </Button>
              {showSolution && (
                <div className="mt-2">
                  <CodeBlock code={result.better_solution} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
