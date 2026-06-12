"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Github, Loader2 } from "lucide-react";
import { saveGithubToken } from "@/lib/github";
import { Input } from "@/components/ui/input";

export function GithubConnect({ username }: { username: string | null }) {
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});
  const [connected, setConnected] = useState(Boolean(username));

  async function save() {
    setBusy(true);
    setMsg({});
    const res = await saveGithubToken(token);
    setBusy(false);
    if (res.error) setMsg({ err: res.error });
    else {
      setMsg({ ok: res.success });
      setConnected(Boolean(token.trim()));
      setToken("");
    }
  }

  return (
    <div className="space-y-3">
      {msg.err && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {msg.err}
        </div>
      )}
      {msg.ok && (
        <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">
          <CheckCircle2 className="h-4 w-4" /> {msg.ok}
        </div>
      )}

      {connected ? (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3">
          <span className="flex items-center gap-2 text-sm">
            <Github className="h-4 w-4" /> Conectado{username ? ` como @${username}` : ""}
          </span>
          <button onClick={() => { setToken(""); setConnected(false); }} className="text-xs text-text-secondary hover:text-foreground">
            Trocar token
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary">
            Crie um <strong>Personal Access Token</strong> em{" "}
            <a href="https://github.com/settings/tokens/new?scopes=repo&description=PyTrack" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
              github.com/settings/tokens
            </a>{" "}
            com a permissão <code>repo</code> e cole abaixo. Assim você cria repositórios dos seus exercícios e projetos direto na plataforma.
          </p>
          <div className="flex gap-2">
            <Input value={token} onChange={(e) => setToken(e.target.value)} type="password" placeholder="ghp_..." />
            <button onClick={save} disabled={busy || !token.trim()} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#24292e] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />} Conectar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
