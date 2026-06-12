"use client";

import { useState } from "react";
import { Play, Loader2, Terminal } from "lucide-react";

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/me", label: "Meu perfil de aprendizado" },
  { method: "GET", path: "/api/v1/progress", label: "Meu progresso" },
  { method: "GET", path: "/api/v1/tracks", label: "Trilhas/cursos disponíveis" },
  { method: "GET", path: "/api/v1/ranking?limit=10", label: "Ranking da comunidade" },
];

export function ApiPlayground() {
  const [key, setKey] = useState("");
  const [endpoint, setEndpoint] = useState(ENDPOINTS[0].path);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");

  async function run() {
    if (!key.trim()) {
      setResult("Cole sua chave de API (pytk_live_...) primeiro.");
      return;
    }
    setLoading(true);
    setResult("");
    setStatus(null);
    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${key.trim()}` },
      });
      setStatus(res.status);
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (e) {
      setResult(String(e));
    } finally {
      setLoading(false);
    }
  }

  const curl = `curl ${typeof window !== "undefined" ? window.location.origin : "https://www.pytrack.com.br"}${endpoint} \\
  -H "Authorization: Bearer ${key || "pytk_live_..."}"`;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Terminal className="h-4 w-4 text-primary" /> Playground da API
      </p>
      <p className="text-xs text-text-secondary">
        Teste a API ao vivo com a sua chave. A chave fica só no seu navegador — não é enviada a lugar nenhum além da própria API.
      </p>

      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        type="password"
        placeholder="Sua chave (pytk_live_...)"
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-sm outline-none focus:border-primary"
      />

      <div className="flex gap-2">
        <select
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          {ENDPOINTS.map((e) => (
            <option key={e.path} value={e.path}>
              {e.method} {e.path} — {e.label}
            </option>
          ))}
        </select>
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Enviar
        </button>
      </div>

      {/* curl equivalente */}
      <div>
        <p className="mb-1 text-xs font-medium text-text-secondary">Equivalente em cURL:</p>
        <pre className="overflow-x-auto rounded-lg bg-[#0d0d10] p-3 text-xs text-zinc-300"><code>{curl}</code></pre>
      </div>

      {/* resposta */}
      {(result || status !== null) && (
        <div>
          <p className="mb-1 flex items-center gap-2 text-xs font-medium">
            Resposta
            {status !== null && (
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${status < 300 ? "bg-green/15 text-green" : "bg-red-500/15 text-red-400"}`}>
                {status}
              </span>
            )}
          </p>
          <pre className="max-h-64 overflow-auto rounded-lg bg-[#0d0d10] p-3 text-xs text-zinc-200"><code>{result}</code></pre>
        </div>
      )}
    </div>
  );
}
