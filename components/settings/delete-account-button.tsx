"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteMyAccount } from "@/app/(dashboard)/configuracoes/dados/actions";

export function DeleteAccountButton() {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function onClick() {
    if (
      !confirm(
        "Excluir sua conta? Todos os seus dados serão removidos permanentemente. Esta ação é irreversível.",
      )
    )
      return;
    setErr(null);
    start(async () => {
      const res = await deleteMyAccount();
      if (res?.error) setErr(res.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        Excluir minha conta
      </button>
      {err && <span className="text-xs text-red-400">{err}</span>}
    </div>
  );
}
