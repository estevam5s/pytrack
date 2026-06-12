"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
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
  Palette,
  Code2,
  Files,
  Search,
  ChevronRight,
  ChevronDown,
  FileCode2,
  X,
  Plus,
  Download,
  Settings,
  Palette as PaletteIcon,
  Type as TypeIcon,
  WrapText,
} from "lucide-react";
import { IDE_THEMES, DEFAULT_THEME } from "@/lib/ide-themes";
import { IDE_UI_THEMES, DEFAULT_UI_THEME } from "@/lib/ide-ui-themes";
import { SNIPPETS, SNIPPET_CATEGORIES } from "@/lib/ide-snippets";
import { IDE_EXAMPLES, IDE_EXAMPLE_CATEGORIES } from "@/lib/ide-examples";
import { GithubPushButton } from "@/components/github-push-button";
import { buildReadme, buildLicense, GITIGNORE_PY, PY_CI_WORKFLOW } from "@/lib/github-readme";
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

export function PythonIDE({ fullscreen = false }: { fullscreen?: boolean }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<OutLine[]>([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [light, setLight] = useState(false);
  const [copied, setCopied] = useState(false);
  const [themeId, setThemeId] = useState(DEFAULT_THEME);
  const outRef = useRef<HTMLDivElement>(null);
  // VS Code shell
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [exSearch, setExSearch] = useState("");
  const [openCats, setOpenCats] = useState<Set<string>>(() => new Set([IDE_EXAMPLE_CATEGORIES[0]]));
  const [uiThemeId, setUiThemeId] = useState(DEFAULT_UI_THEME);
  const [panel, setPanel] = useState<"explorer" | "examples" | "search" | "settings">("examples");
  const [files, setFiles] = useState<{ name: string; code: string }[]>([{ name: "main.py", code: DEFAULT_CODE }]);
  const [active, setActive] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [wrap, setWrap] = useState(false);

  // sincroniza o tema do editor com o tema de UI escolhido
  useEffect(() => {
    const t = IDE_UI_THEMES.find((x) => x.id === uiThemeId);
    if (t) setThemeId(t.editorTheme);
  }, [uiThemeId]);

  // carrega código salvo + tema
  useEffect(() => {
    // código vindo de um exercício (?ex=)
    let loadedFromExercise = false;
    try {
      const pending = localStorage.getItem("pytrack-ide-pending");
      if (pending) {
        setCode(pending);
        localStorage.removeItem("pytrack-ide-pending");
        loadedFromExercise = true;
      }
    } catch {
      /* ignore */
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && !loadedFromExercise) setCode(saved);
    const savedTheme = localStorage.getItem("pytrack-ide-theme");
    if (savedTheme && IDE_THEMES.some((t) => t.id === savedTheme)) setThemeId(savedTheme);
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

      // proteção anti-travamento: guard de tempo (10s) + limite de saída.
      // Interrompe loops infinitos / código muito longo sem congelar a IDE.
      const MAX_SECONDS = 10;
      await py.runPythonAsync(`
import sys as __sys, time as __time
__deadline = __time.time() + ${MAX_SECONDS}
__lines = [0]
def __guard(frame, event, arg):
    if __time.time() > __deadline:
        raise TimeoutError(
            "Tempo limite de ${MAX_SECONDS}s excedido — verifique se há um loop infinito (ex.: while True sem break)."
        )
    __lines[0] += 1
    if __lines[0] > 50_000_000:
        raise RuntimeError("Limite de operações excedido — código muito pesado.")
    return __guard
__sys.settrace(__guard)
`);
      // executa o código do usuário com o guard ativo
      const userCode = "__sys.settrace(__guard)\n" + code;
      await py.runPythonAsync(userCode);
      await py.runPythonAsync("__sys.settrace(None)");
      append("\n✓ Execução concluída.", "info");
    } catch (e) {
      // garante que o trace é removido mesmo em erro
      try {
        const py = await getPyodide();
        await py.runPythonAsync("import sys as __s\n__s.settrace(None)");
      } catch {
        /* ignore */
      }
      const msg = e instanceof Error ? e.message : String(e);
      append(msg.includes("TimeoutError") ? "⏱ " + msg : msg, "err");
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
  const editorTheme = useMemo(
    () => (IDE_THEMES.find((t) => t.id === themeId) ?? IDE_THEMES[0]).theme,
    [themeId],
  );
  const pickTheme = (id: string) => {
    setThemeId(id);
    try {
      localStorage.setItem("pytrack-ide-theme", id);
    } catch {
      /* ignore */
    }
  };

  // ───────────────────── Layout VS Code (tela cheia / nova aba) ─────────────────────
  if (fullscreen) {
    const ui = IDE_UI_THEMES.find((t) => t.id === uiThemeId) ?? IDE_UI_THEMES[0];
    const cur = files[active] ?? files[0];
    const setActiveCode = (v: string) => { setCode(v); setFiles((fs) => fs.map((f, i) => (i === active ? { ...f, code: v } : f))); };
    const switchTo = (i: number) => { setActive(i); setCode(files[i].code); };
    const newFile = () => {
      const name = (prompt("Nome do arquivo:", `script${files.length + 1}.py`) || "").trim();
      if (!name) return;
      const safe = name.endsWith(".py") ? name : name + ".py";
      const content = "# " + safe + "\n";
      setFiles((fs) => [...fs, { name: safe, code: content }]);
      setActive(files.length);
      setCode(content);
    };
    const closeFile = (i: number) => {
      if (files.length === 1) return;
      const nf = files.filter((_, k) => k !== i);
      const na = i <= active ? Math.max(0, active - 1) : active;
      setFiles(nf); setActive(na); setCode(nf[na].code);
    };
    const downloadActive = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([cur.code], { type: "text/x-python" }));
      a.download = cur.name; a.click(); URL.revokeObjectURL(a.href);
    };
    const toggleCat = (c: string) => setOpenCats((p) => { const n = new Set(p); if (n.has(c)) n.delete(c); else n.add(c); return n; });
    const q = exSearch.trim().toLowerCase();
    const visibleCats = q ? IDE_EXAMPLE_CATEGORIES.filter((c) => IDE_EXAMPLES.some((e) => e.category === c && (e.label.toLowerCase().includes(q) || c.toLowerCase().includes(q)))) : IDE_EXAMPLE_CATEGORIES;
    const ACT = [{ id: "explorer", icon: Files, title: "Arquivos" }, { id: "examples", icon: BookOpen, title: "Exemplos" }, { id: "search", icon: Search, title: "Buscar" }, { id: "settings", icon: Settings, title: "Configurações" }] as const;

    return (
      <div onKeyDown={onKeyDown} className="flex h-screen w-screen flex-col overflow-hidden" style={{ background: ui.bg, color: ui.text }}>
        <div className="flex h-9 shrink-0 items-center justify-between px-3 text-xs" style={{ background: ui.title, borderBottom: `1px solid ${ui.border}` }}>
          <span className="flex items-center gap-2 font-medium"><FileCode2 className="h-4 w-4" style={{ color: ui.accent }} /> PyTrack IDE</span>
          <div className="flex items-center gap-1.5">
            <button onClick={run} disabled={running || status !== "ready"} className="inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium text-white disabled:opacity-50" style={{ background: ui.accent }}>
              {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} {running ? "Executando…" : "Executar"} <kbd className="rounded bg-white/20 px-1 text-[10px]">⌘↵</kbd>
            </button>
            <button onClick={downloadActive} title="Baixar .py" className="rounded p-1.5 hover:bg-white/10"><Download className="h-4 w-4" /></button>
            <button onClick={() => setCode(DEFAULT_CODE)} title="Resetar" className="rounded p-1.5 hover:bg-white/10"><RotateCcw className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="flex w-12 shrink-0 flex-col items-center gap-1 py-2" style={{ background: ui.activity }}>
            {ACT.map((a) => (
              <button key={a.id} onClick={() => { setPanel(a.id); setExplorerOpen(true); }} title={a.title} className="flex h-10 w-10 items-center justify-center border-l-2" style={{ borderColor: panel === a.id && explorerOpen ? ui.text : "transparent", color: panel === a.id && explorerOpen ? ui.text : ui.textDim }}>
                <a.icon className="h-6 w-6" />
              </button>
            ))}
            <div className="mt-auto text-lg" style={{ color: ui.accent }}>🐍</div>
          </div>

          {explorerOpen && (
            <div className="flex w-64 shrink-0 flex-col overflow-hidden text-[13px]" style={{ background: ui.panel, borderRight: `1px solid ${ui.border}` }}>
              <div className="flex items-center justify-between px-4 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: ui.textDim }}>
                {panel === "explorer" ? "Arquivos" : panel === "examples" ? `Exemplos (${IDE_EXAMPLES.length})` : panel === "search" ? "Buscar" : "Configurações"}
                <button onClick={() => setExplorerOpen(false)} style={{ color: ui.textDim }}><X className="h-3.5 w-3.5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {panel === "explorer" && (<>
                  <div className="flex items-center justify-between px-3 py-1" style={{ color: ui.textDim }}>
                    <span className="text-[11px] font-semibold uppercase">PyTrack-IDE</span>
                    <button onClick={newFile} title="Novo arquivo" style={{ color: ui.textDim }}><Plus className="h-4 w-4" /></button>
                  </div>
                  {files.map((f, i) => (
                    <div key={i} className="group flex items-center gap-1.5 px-4 py-1" style={{ background: i === active ? ui.hover : "transparent" }}>
                      <button onClick={() => switchTo(i)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left"><FileCode2 className="h-4 w-4 shrink-0" style={{ color: ui.accent }} /> <span className="truncate">{f.name}</span></button>
                      {files.length > 1 && <button onClick={() => closeFile(i)} className="opacity-0 group-hover:opacity-100" style={{ color: ui.textDim }}><X className="h-3.5 w-3.5" /></button>}
                    </div>
                  ))}
                </>)}

                {(panel === "examples" || panel === "search") && (<>
                  {panel === "search" && (
                    <div className="px-2 py-2">
                      <div className="flex items-center gap-1.5 rounded px-2 py-1" style={{ background: ui.hover }}>
                        <Search className="h-3.5 w-3.5" style={{ color: ui.textDim }} />
                        <input value={exSearch} onChange={(e) => setExSearch(e.target.value)} placeholder="Buscar exemplos…" className="w-full bg-transparent text-xs outline-none" style={{ color: ui.text }} />
                      </div>
                    </div>
                  )}
                  {visibleCats.map((catg) => {
                    const items = IDE_EXAMPLES.filter((e) => e.category === catg && (!q || e.label.toLowerCase().includes(q) || catg.toLowerCase().includes(q)));
                    const open = openCats.has(catg) || !!q;
                    return (<div key={catg}>
                      <button onClick={() => toggleCat(catg)} className="flex w-full items-center gap-1 px-3 py-1 text-left hover:opacity-80">
                        {open ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
                        <span className="truncate font-medium">{catg}</span><span className="ml-auto text-[10px]" style={{ color: ui.textDim }}>{items.length}</span>
                      </button>
                      {open && items.map((ex) => (
                        <button key={ex.label} onClick={() => setActiveCode(ex.code)} className="flex w-full items-center gap-1.5 py-0.5 pl-9 pr-2 text-left" title={ex.label} onMouseEnter={(e) => (e.currentTarget.style.background = ui.hover)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                          <FileCode2 className="h-3.5 w-3.5 shrink-0" style={{ color: ui.accent }} /> <span className="truncate">{ex.label}</span>
                        </button>
                      ))}
                    </div>);
                  })}
                </>)}

                {panel === "settings" && (
                  <div className="space-y-4 p-3">
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold"><PaletteIcon className="h-3.5 w-3.5" /> Tema de cores</p>
                      <div className="grid gap-1">
                        {IDE_UI_THEMES.map((t) => (
                          <button key={t.id} onClick={() => setUiThemeId(t.id)} className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs" style={{ background: t.id === uiThemeId ? ui.hover : "transparent" }}>
                            <span className="flex gap-0.5"><span className="h-3 w-3 rounded-sm" style={{ background: t.bg }} /><span className="h-3 w-3 rounded-sm" style={{ background: t.accent }} /><span className="h-3 w-3 rounded-sm" style={{ background: t.status }} /></span>
                            {t.name}{t.id === uiThemeId && <Check className="ml-auto h-3.5 w-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold"><TypeIcon className="h-3.5 w-3.5" /> Fonte: {fontSize}px</p>
                      <div className="flex gap-1">
                        <button onClick={() => setFontSize((s) => Math.max(10, s - 1))} className="flex-1 rounded py-1 text-xs" style={{ background: ui.hover }}>A−</button>
                        <button onClick={() => setFontSize((s) => Math.min(28, s + 1))} className="flex-1 rounded py-1 text-xs" style={{ background: ui.hover }}>A+</button>
                      </div>
                    </div>
                    <button onClick={() => setWrap((w) => !w)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs" style={{ background: ui.hover }}>
                      <WrapText className="h-3.5 w-3.5" /> Quebra de linha: {wrap ? "ligada" : "desligada"}
                    </button>
                  </div>
                )}
              </div>
              <div className="p-2" style={{ borderTop: `1px solid ${ui.border}` }}>
                <GithubPushButton defaultName={cur.name.replace(".py", "")} description="Código da IDE Python do PyTrack." files={[{ path: cur.name, content: cur.code }, { path: "README.md", content: buildReadme({ title: "Código Python — PyTrack", kind: "codigo", description: "Código da IDE Python do PyTrack.", files: [{ path: cur.name }, { path: "README.md" }, { path: "LICENSE" }, { path: ".gitignore" }, { path: ".github/workflows/ci.yml" }], mainFile: cur.name }) }, { path: ".gitignore", content: GITIGNORE_PY }, { path: "LICENSE", content: buildLicense() }, { path: ".github/workflows/ci.yml", content: PY_CI_WORKFLOW }]} label="Salvar no GitHub" />
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-9 shrink-0 items-center overflow-x-auto text-xs" style={{ background: ui.tabbar, borderBottom: `1px solid ${ui.border}` }}>
              {files.map((f, i) => (
                <div key={i} onClick={() => switchTo(i)} className="group flex h-full cursor-pointer items-center gap-1.5 px-3" style={{ background: i === active ? ui.bg : "transparent", borderTop: i === active ? `2px solid ${ui.accent}` : "2px solid transparent", color: i === active ? ui.text : ui.textDim }}>
                  <FileCode2 className="h-4 w-4" style={{ color: ui.accent }} /> {f.name}
                  {files.length > 1 && <button onClick={(e) => { e.stopPropagation(); closeFile(i); }} className="opacity-0 group-hover:opacity-100"><X className="h-3.5 w-3.5" /></button>}
                </div>
              ))}
              <button onClick={newFile} title="Novo arquivo" className="px-2" style={{ color: ui.textDim }}><Plus className="h-4 w-4" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <CodeMirror value={cur.code} onChange={setActiveCode} extensions={wrap ? [...extensions, EditorView.lineWrapping] : extensions} theme={editorTheme} height="100%" style={{ height: "100%", fontSize }} basicSetup={{ lineNumbers: true, highlightActiveLine: true, autocompletion: true, tabSize: 4, indentOnInput: true }} />
            </div>
            <div className="flex h-[34%] min-h-[140px] shrink-0 flex-col" style={{ background: ui.terminal, borderTop: `1px solid ${ui.border}` }}>
              <div className="flex items-center justify-between px-3 py-1.5 text-[11px] uppercase tracking-wide" style={{ color: ui.textDim }}>
                <span className="flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5" /> Terminal · Saída</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setOutput([])}><Trash2 className="h-3.5 w-3.5" /></button>
                  {output.length > 0 && <button onClick={copyOutput}>{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button>}
                </div>
              </div>
              <div ref={outRef} className="flex-1 overflow-auto p-3 font-mono text-[13px] leading-relaxed">
                {output.length === 0 ? (
                  <p style={{ color: ui.textDim }}>{status === "loading" ? "Inicializando o Python (Pyodide)…" : status === "error" ? "Falha ao carregar o Python. Recarregue." : "A saída aparece aqui. Clique em Executar ▶ (⌘↵)"}</p>
                ) : output.map((o, i) => (<pre key={i} className="whitespace-pre-wrap break-words" style={{ color: o.type === "err" ? "#f48771" : o.type === "info" ? ui.accent : ui.text }}>{o.text}</pre>))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-6 shrink-0 items-center gap-3 px-3 text-[11px]" style={{ background: ui.status, color: ui.statusText }}>
          <span>🐍 PyTrack IDE</span>
          <span>{status === "ready" ? "● Pronto" : status === "loading" ? "◐ Carregando…" : "○ Erro"}</span>
          <span className="ml-auto">Ln {cur.code.split("\n").length}</span>
          <span>{cur.name}</span>
          <span>{wrap ? "Wrap" : "No Wrap"}</span>
          <span>{fontSize}px</span>
          <span>UTF-8</span>
          <span>Python 3.12</span>
          <span>{ui.name}</span>
        </div>
      </div>
    );
  }

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

        <GithubPushButton
          defaultName="pytrack-codigo"
          description="Código criado na IDE Python do PyTrack."
          files={[
            { path: "main.py", content: code },
            { path: "README.md", content: buildReadme({ title: "Código Python — PyTrack", kind: "codigo", description: "Código desenvolvido na IDE Python do PyTrack, que roda direto no navegador.", files: [{ path: "main.py" }, { path: "README.md" }, { path: "LICENSE" }, { path: ".gitignore" }, { path: ".github/workflows/ci.yml" }], mainFile: "main.py" }) },
            { path: ".gitignore", content: GITIGNORE_PY },
            { path: "LICENSE", content: buildLicense() },
            { path: ".github/workflows/ci.yml", content: PY_CI_WORKFLOW },
          ]}
        />

        {/* snippets Python */}
        <div className="relative ml-auto">
          <select
            onChange={(e) => {
              const s = SNIPPETS.find((x) => `${x.category}::${x.title}` === e.target.value);
              if (s) setCode(s.code);
              e.target.selectedIndex = 0;
            }}
            className="cursor-pointer appearance-none rounded-lg border border-border bg-surface py-2 pl-9 pr-8 text-sm text-text-secondary outline-none transition-colors hover:text-foreground focus:border-primary/40"
            defaultValue=""
            title="Snippets Python"
          >
            <option value="" disabled>Snippets</option>
            {SNIPPET_CATEGORIES.map((cat) => (
              <optgroup key={cat} label={cat}>
                {SNIPPETS.filter((s) => s.category === cat).map((s) => (
                  <option key={`${s.category}::${s.title}`} value={`${s.category}::${s.title}`}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <Code2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        </div>

        {/* exemplos (biblioteca completa, agrupada por categoria) */}
        <div className="relative">
          <select
            onChange={(e) => {
              const ex = IDE_EXAMPLES.find((x) => `${x.category}::${x.label}` === e.target.value);
              if (ex) setCode(ex.code);
              e.target.selectedIndex = 0;
            }}
            className="cursor-pointer appearance-none rounded-lg border border-border bg-surface py-2 pl-9 pr-8 text-sm text-text-secondary outline-none transition-colors hover:text-foreground focus:border-primary/40"
            defaultValue=""
            title={`${IDE_EXAMPLES.length} exemplos`}
          >
            <option value="" disabled>Exemplos ({IDE_EXAMPLES.length})</option>
            {IDE_EXAMPLE_CATEGORIES.map((cat) => (
              <optgroup key={cat} label={cat}>
                {IDE_EXAMPLES.filter((ex) => ex.category === cat).map((ex) => (
                  <option key={`${cat}::${ex.label}`} value={`${cat}::${ex.label}`}>{ex.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        </div>

        {/* tema do editor */}
        <div className="relative">
          <select
            value={themeId}
            onChange={(e) => pickTheme(e.target.value)}
            className="cursor-pointer appearance-none rounded-lg border border-border bg-surface py-2 pl-9 pr-8 text-sm text-text-secondary outline-none transition-colors hover:text-foreground focus:border-primary/40"
            title="Tema do editor"
          >
            <optgroup label="Escuros">
              {IDE_THEMES.filter((t) => t.dark).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </optgroup>
            <optgroup label="Claros">
              {IDE_THEMES.filter((t) => !t.dark).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </optgroup>
          </select>
          <Palette className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
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
            theme={editorTheme}
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

      {/* status bar estilo VS Code */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-gradient-to-r from-[#5F75F2] to-[#8234E9] px-3 py-1.5 text-[11px] font-medium text-white/90">
        <span className="inline-flex items-center gap-1">🐍 PyTrack IDE</span>
        <span className="inline-flex items-center gap-1">{status === "ready" ? "● Pronto" : status === "loading" ? "◐ Carregando…" : "○ Erro"}</span>
        <span className="ml-auto inline-flex items-center gap-1">Ln {code.split("\n").length}</span>
        <span className="inline-flex items-center gap-1">Espaços: 4</span>
        <span className="inline-flex items-center gap-1">UTF-8</span>
        <span className="inline-flex items-center gap-1">Python 3.12</span>
        <span className="inline-flex items-center gap-1">Pyodide</span>
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
