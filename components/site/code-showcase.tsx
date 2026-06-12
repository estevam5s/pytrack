"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

interface Snippet { label: string; file: string; code: string }

const SNIPPETS: Snippet[] = [
  {
    label: "API com FastAPI",
    file: "main.py",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="PyTrack API")

class Curso(BaseModel):
    nome: str
    horas: int

@app.post("/cursos")
async def criar(curso: Curso):
    return {"ok": True, "curso": curso}

# uvicorn main:app --reload`,
  },
  {
    label: "Análise de Dados",
    file: "analise.py",
    code: `import pandas as pd

df = pd.read_csv("vendas.csv")

por_mes = (
    df.groupby("mes")["valor"]
      .sum()
      .sort_values(ascending=False)
)

print(por_mes.head())
# top meses por faturamento`,
  },
  {
    label: "Machine Learning",
    file: "modelo.py",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X_tr, X_te, y_tr, y_te = train_test_split(X, y)

modelo = RandomForestClassifier(n_estimators=200)
modelo.fit(X_tr, y_tr)

print(f"acurácia: {modelo.score(X_te, y_te):.2%}")`,
  },
  {
    label: "Async",
    file: "async.py",
    code: `import asyncio, httpx

async def buscar(url):
    async with httpx.AsyncClient() as cli:
        r = await cli.get(url)
        return r.status_code

async def main():
    urls = ["https://pytrack.com.br"] * 5
    print(await asyncio.gather(*(buscar(u) for u in urls)))

asyncio.run(main())`,
  },
];

// realça tokens de Python de forma simples
function highlight(line: string) {
  if (line.trimStart().startsWith("#")) {
    return <span className="text-zinc-500">{line}</span>;
  }
  const KW = /\b(from|import|async|await|def|class|return|with|as|for|in|if|else|print|True|False|None)\b/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  // strings
  const strRe = /("[^"]*"|'[^']*'|f"[^"]*")/g;
  let m: RegExpExecArray | null;
  const tokens: { start: number; end: number; node: React.ReactNode }[] = [];
  while ((m = strRe.exec(line))) tokens.push({ start: m.index, end: m.index + m[0].length, node: <span className="text-green">{m[0]}</span> });
  while ((m = KW.exec(line))) {
    if (tokens.some((t) => m!.index >= t.start && m!.index < t.end)) continue;
    tokens.push({ start: m.index, end: m.index + m[0].length, node: <span className="text-primary-light">{m[0]}</span> });
  }
  tokens.sort((a, b) => a.start - b.start);
  for (const t of tokens) {
    if (t.start > last) parts.push(<span key={last} className="text-zinc-300">{line.slice(last, t.start)}</span>);
    parts.push(<span key={t.start + "k"}>{t.node}</span>);
    last = t.end;
  }
  if (last < line.length) parts.push(<span key={last + "e"} className="text-zinc-300">{line.slice(last)}</span>);
  return parts.length ? parts : <span className="text-zinc-300">{line}</span>;
}

export function CodeShowcase() {
  const [tab, setTab] = useState(0);
  const [typed, setTyped] = useState("");
  const [copied, setCopied] = useState(false);
  const snippet = SNIPPETS[tab];

  // animação de digitação ao trocar de aba
  useEffect(() => {
    setTyped("");
    const full = snippet.code;
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 12);
    return () => clearInterval(id);
  }, [tab, snippet.code]);

  function copy() {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#0c0c12] shadow-2xl shadow-primary/10">
      {/* barra do editor */}
      <div className="flex items-center gap-2 border-b border-border bg-[#15151c] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-warning/70" />
        <span className="h-3 w-3 rounded-full bg-green/70" />
        <span className="ml-3 text-xs text-text-secondary">{snippet.file}</span>
        <button onClick={copy} className="ml-auto inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-text-secondary hover:text-foreground">
          {copied ? <Check className="h-3 w-3 text-green" /> : <Copy className="h-3 w-3" />} {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      {/* abas */}
      <div className="flex gap-1 overflow-x-auto border-b border-border bg-[#101017] px-2 py-1.5">
        {SNIPPETS.map((s, i) => (
          <button key={s.label} onClick={() => setTab(i)} className={`shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-colors ${i === tab ? "bg-primary/15 text-primary-light" : "text-text-secondary hover:text-foreground"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* código */}
      <pre className="min-h-[280px] overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code>
          {typed.split("\n").map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-4 w-5 shrink-0 select-none text-right text-zinc-600">{i + 1}</span>
              <span className="whitespace-pre">{highlight(line)}</span>
            </div>
          ))}
          <span className="inline-block h-4 w-2 animate-pulse bg-primary-light/70 align-middle" />
        </code>
      </pre>
    </div>
  );
}
