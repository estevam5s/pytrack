"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { python } from "@codemirror/lang-python";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import {
  Play,
  Loader2,
  Trash2,
  RotateCcw,
  Terminal,
  Copy,
  Check,
  CircleDot,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-text-secondary">
      Carregando editor…
    </div>
  ),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>;
  }
}

const PYODIDE_VERSION = "0.27.2";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise: Promise<any> | null = null;
function getPyodide() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    if (!window.loadPyodide) {
      await new Promise<void>((res, rej) => {
        const s = document.createElement("script");
        s.src = `${CDN}pyodide.js`;
        s.onload = () => res();
        s.onerror = () => rej(new Error("Falha ao carregar o Pyodide (CDN)."));
        document.head.appendChild(s);
      });
    }
    return window.loadPyodide!({ indexURL: CDN });
  })();
  return pyodidePromise;
}

const STORAGE_KEY = "pytrack-ide-code";

const DEFAULT_CODE = `# Bem-vindo à IDE Python do PyTrack! 🐍
# Escreva seu código e clique em "Executar" (ou Ctrl+Enter).

def saudacao(nome):
    return f"Olá, {nome}! Bora dominar Python?"

print(saudacao("dev"))

# Experimente: loops, funções, classes, e até numpy/pandas.
for i in range(1, 6):
    print(f"{i}² = {i**2}")
`;

const EXAMPLES: { label: string; code: string }[] = [
  {
    label: "Olá, mundo",
    code: `print("Olá, mundo!")\nprint("Bem-vindo ao Python 🐍")`,
  },
  {
    label: "Entrada do usuário",
    code: `nome = input("Qual é o seu nome? ")\nidade = int(input("Quantos anos você tem? "))\nprint(f"Olá, {nome}! Em 10 anos você terá {idade + 10} anos.")`,
  },
  {
    label: "Funções e recursão",
    code: `def fatorial(n):\n    return 1 if n <= 1 else n * fatorial(n - 1)\n\nfor n in range(1, 8):\n    print(f"{n}! = {fatorial(n)}")`,
  },
  {
    label: "Classes (POO)",
    code: `class Conta:\n    def __init__(self, dono, saldo=0):\n        self.dono = dono\n        self.saldo = saldo\n\n    def depositar(self, valor):\n        self.saldo += valor\n        return self.saldo\n\nc = Conta("Ana")\nc.depositar(100)\nc.depositar(50)\nprint(f"Saldo de {c.dono}: R$ {c.saldo}")`,
  },
  {
    label: "List comprehension",
    code: `nums = list(range(1, 21))\npares = [n for n in nums if n % 2 == 0]\nquadrados = {n: n**2 for n in pares}\nprint("Pares:", pares)\nprint("Quadrados:", quadrados)`,
  },
  {
    label: "NumPy",
    code: `import numpy as np\n\na = np.arange(1, 10).reshape(3, 3)\nprint("Matriz:\\n", a)\nprint("Soma:", a.sum())\nprint("Média por coluna:", a.mean(axis=0))`,
  },
];

interface OutLine {
  text: string;
  type: "out" | "err" | "info";
}

export function PythonIDE() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<OutLine[]>([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [light, setLight] = useState(false);
  const [copied, setCopied] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);

  // carrega código salvo + tema
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCode(saved);
    setLight(document.documentElement.classList.contains("light"));
    const obs = new MutationObserver(() =>
      setLight(document.documentElement.classList.contains("light")),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // inicializa o Pyodide
  useEffect(() => {
    let alive = true;
    getPyodide()
      .then(() => alive && setStatus("ready"))
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, []);

  // salva o código
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(id);
  }, [code]);

  // auto-scroll do console
  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [output]);

  const append = useCallback((text: string, type: OutLine["type"] = "out") => {
    setOutput((o) => [...o, { text, type }]);
  }, []);

  const run = useCallback(async () => {
    if (running || status === "error") return;
    setRunning(true);
    setOutput([]);
    try {
      const py = await getPyodide();
      py.setStdout({ batched: (s: string) => append(s, "out") });
      py.setStderr({ batched: (s: string) => append(s, "err") });
      py.globals.set(
        "__js_input",
        (p: string) => window.prompt(p || "") ?? "",
      );
      // shim de input() usando prompt do navegador
      await py.runPythonAsync(`
import builtins as __b, sys as __sys
def __input(prompt=""):
    __sys.stdout.write(str(prompt))
    r = __js_input(prompt)
    __sys.stdout.write(str(r) + "\\n")
    return str(r)
__b.input = __input
`);
      // carrega pacotes importados (numpy, pandas, etc.)
      try {
        await py.loadPackagesFromImports(code);
      } catch {
        /* pacote não disponível — segue e deixa o erro do import aparecer */
      }
      await py.runPythonAsync(code);
      append("\n✓ Execução concluída.", "info");
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : String(e);
      append(msg, "err");
    } finally {
      setRunning(false);
    }
  }, [code, running, status, append]);

  // Ctrl/Cmd + Enter para executar
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        run();
      }
    },
    [run],
  );

  const copyOutput = useCallback(() => {
    navigator.clipboard
      .writeText(output.map((o) => o.text).join(""))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
  }, [output]);

  const extensions = useMemo(() => [python()], []);

  return (
    <div onKeyDown={onKeyDown}>
      {/* barra de ferramentas */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          onClick={run}
          disabled={running || status !== "ready"}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {running ? "Executando…" : "Executar"}
          <kbd className="ml-1 hidden rounded bg-white/20 px-1.5 text-[10px] sm:inline">
            ⌘↵
          </kbd>
        </button>

        <button
          onClick={() => setOutput([])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary transition-colors hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" /> Limpar saída
        </button>
        <button
          onClick={() => setCode(DEFAULT_CODE)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" /> Resetar
        </button>

        {/* exemplos */}
        <div className="relative ml-auto">
          <select
            onChange={(e) => {
              const ex = EXAMPLES.find((x) => x.label === e.target.value);
              if (ex) setCode(ex.code);
              e.target.selectedIndex = 0;
            }}
            className="cursor-pointer appearance-none rounded-lg border border-border bg-surface py-2 pl-9 pr-8 text-sm text-text-secondary outline-none transition-colors hover:text-foreground focus:border-primary/40"
            defaultValue=""
          >
            <option value="" disabled>
              Exemplos
            </option>
            {EXAMPLES.map((ex) => (
              <option key={ex.label} value={ex.label}>
                {ex.label}
              </option>
            ))}
          </select>
          <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        </div>

        {/* status do runtime */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
            status === "ready" &&
              "border-secondary/30 bg-secondary/10 text-secondary",
            status === "loading" &&
              "border-warning/30 bg-warning/10 text-warning",
            status === "error" && "border-danger/30 bg-danger/10 text-danger",
          )}
        >
          <CircleDot className="h-3 w-3" />
          {status === "ready"
            ? "Python pronto"
            : status === "loading"
              ? "Carregando Python…"
              : "Erro ao carregar"}
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* editor */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-magenta/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-secondary/70" />
              <span className="ml-2">main.py</span>
            </span>
            <span className="font-mono">Python 3.12 (Pyodide)</span>
          </div>
          <CodeMirror
            value={code}
            onChange={setCode}
            extensions={extensions}
            theme={light ? githubLight : githubDark}
            height="460px"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              autocompletion: true,
              tabSize: 4,
              indentOnInput: true,
            }}
          />
        </div>

        {/* console */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-[#0d0d10]">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Terminal className="h-3.5 w-3.5" /> Console
            </span>
            {output.length > 0 && (
              <button
                onClick={copyOutput}
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:text-white"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copiado" : "Copiar"}
              </button>
            )}
          </div>
          <div
            ref={outRef}
            className="h-[460px] overflow-auto p-4 font-mono text-[13px] leading-relaxed"
          >
            {output.length === 0 ? (
              <p className="text-zinc-500">
                {status === "loading"
                  ? "Inicializando o interpretador Python no navegador…"
                  : status === "error"
                    ? "Não foi possível carregar o Python. Verifique sua conexão e recarregue."
                    : "A saída do seu programa aparecerá aqui. Clique em Executar ▶"}
              </p>
            ) : (
              output.map((o, i) => (
                <pre
                  key={i}
                  className={cn(
                    "whitespace-pre-wrap break-words",
                    o.type === "err" && "text-danger",
                    o.type === "out" && "text-zinc-100",
                    o.type === "info" && "text-secondary",
                  )}
                >
                  {o.text}
                </pre>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-text-secondary">
        💡 Roda 100% no seu navegador via Pyodide (WebAssembly). Suporta{" "}
        <code className="rounded bg-surface-2 px-1">input()</code>, e bibliotecas
        como <code className="rounded bg-surface-2 px-1">numpy</code>,{" "}
        <code className="rounded bg-surface-2 px-1">pandas</code> e{" "}
        <code className="rounded bg-surface-2 px-1">matplotlib</code> são
        baixadas sob demanda no primeiro import.
      </p>
    </div>
  );
}
