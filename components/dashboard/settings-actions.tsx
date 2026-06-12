"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Download, Eraser, Loader2, Moon, RotateCcw, Sun } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { resetProgress } from "@/lib/data/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("light") ? "light" : "dark",
    );
  }, []);

  const change = (next: "dark" | "light") => {
    setTheme(next);
    localStorage.setItem("pytrack-theme", next);
    const el = document.documentElement;
    el.classList.toggle("light", next === "light");
    el.classList.toggle("dark", next === "dark");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => change("dark")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors ${
          theme === "dark"
            ? "border-primary bg-primary/15 text-primary"
            : "border-border bg-surface text-text-secondary"
        }`}
      >
        <Moon className="h-4 w-4" /> Escuro
      </button>
      <button
        onClick={() => change("light")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors ${
          theme === "light"
            ? "border-primary bg-primary/15 text-primary"
            : "border-border bg-surface text-text-secondary"
        }`}
      >
        <Sun className="h-4 w-4" /> Claro
      </button>
    </div>
  );
}

export function ExportDataButton() {
  const [loading, setLoading] = useState(false);

  const exportData = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: progress } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user?.id ?? "");
    const { data: profile } = await supabase
      .from("users_profile")
      .select("*")
      .eq("user_id", user?.id ?? "")
      .single();

    const blob = new Blob(
      [JSON.stringify({ profile, progress, exportedAt: new Date() }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pytrack-dados.json";
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <Button variant="outline" onClick={exportData} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Exportar meus dados
    </Button>
  );
}

export function ClearLocalButton() {
  const [cleared, setCleared] = useState(false);

  const clear = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.startsWith("pytrack-lessons-") ||
          k.startsWith("pytrack-chk-") ||
          k === "pytrack-exercises-done" ||
          k === "pytrack-questions-studied" ||
          k === "pytrack-pomodoros")
      )
        keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    window.dispatchEvent(new Event("pytrack-progress"));
    setCleared(true);
    setTimeout(() => setCleared(false), 2500);
  };

  return (
    <Button variant="outline" onClick={clear}>
      {cleared ? <Check className="h-4 w-4" /> : <Eraser className="h-4 w-4" />}
      {cleared ? "Limpo!" : "Limpar progresso local"}
    </Button>
  );
}

function clearLocalProgress() {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (
      k &&
      (k.startsWith("pytrack-lessons-") ||
        k.startsWith("pytrack-chk-") ||
        k === "pytrack-exercises-done" ||
        k === "pytrack-questions-studied" ||
        k === "pytrack-pomodoros")
    )
      keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}

export function ResetProgressButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const doReset = () =>
    startTransition(async () => {
      // 1) apaga progresso de módulos no Supabase
      await resetProgress();
      // 2) apaga progresso local (lições, exercícios, perguntas, pomodoros)
      clearLocalProgress();
      // 3) atualiza nível/XP na barra e recarrega os dados do servidor
      window.dispatchEvent(new Event("pytrack-progress"));
      setOpen(false);
      router.refresh();
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="danger">
          <RotateCcw className="h-4 w-4" /> Resetar progresso
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resetar todo o progresso?</DialogTitle>
          <DialogDescription>
            Remove o progresso de módulos (Supabase) e de lições, exercícios e
            perguntas (neste navegador), zerando seu nível e XP. Não é possível
            desfazer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" disabled={pending} onClick={doReset}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Sim, resetar tudo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
