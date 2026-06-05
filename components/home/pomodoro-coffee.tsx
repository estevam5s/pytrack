"use client";

import { useEffect, useState } from "react";
import { Coffee, Pause, Play, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FOCUS_PRESETS = [15, 25, 50];
const breakFor = (focus: number) => Math.max(5, Math.round(focus / 5));

function loadCups(): number {
  if (typeof window === "undefined") return 0;
  try {
    const o = JSON.parse(localStorage.getItem("pytrack-pomodoros") ?? "null");
    const today = new Date().toISOString().slice(0, 10);
    if (o && o.date === today) return o.count;
  } catch {
    /* ignore */
  }
  return 0;
}
function saveCups(count: number) {
  localStorage.setItem(
    "pytrack-pomodoros",
    JSON.stringify({ date: new Date().toISOString().slice(0, 10), count }),
  );
}

export function PomodoroCoffee() {
  const [focusMin, setFocusMin] = useState(25);
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [cups, setCups] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => setCups(loadCups()), []);

  // troca de duração de foco (somente quando parado e em foco)
  useEffect(() => {
    if (!running && phase === "focus") setSecondsLeft(focusMin * 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMin]);

  // tick (1s) + transição de fase
  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      if (phase === "focus") {
        const n = cups + 1;
        setCups(n);
        saveCups(n);
        setPhase("break");
        setSecondsLeft(breakFor(focusMin) * 60);
        setMsg("Foco concluído! Hora da pausa ☕");
      } else {
        setPhase("focus");
        setSecondsLeft(focusMin * 60);
        setRunning(false);
        setMsg("Pausa encerrada. Pronto para focar? 🐍");
      }
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, secondsLeft, phase, focusMin, cups]);

  const total = (phase === "focus" ? focusMin : breakFor(focusMin)) * 60;
  const frac = total ? secondsLeft / total : 0;
  // foco: a xícara esvazia (você "toma o café"); pausa: enche de novo
  const liquid = Math.max(0, Math.min(1, phase === "focus" ? frac : 1 - frac));

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setSecondsLeft(focusMin * 60);
    setMsg(null);
  };

  const isFocus = phase === "focus";

  return (
    <Card className="card-gradient h-full">
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Foco com café</h2>
          </div>
          <span className="rounded-full bg-surface px-2.5 py-1 text-xs text-text-secondary">
            ☕ {cups} hoje
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-2">
          {/* Caneca */}
          <div className="relative mb-3 h-36 w-32">
            {/* vapor */}
            {running && isFocus && (
              <div className="absolute -top-2 left-0 right-6 flex justify-center gap-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="steam h-6 w-1.5 rounded-full bg-white/40 blur-[2px]"
                    style={{ animationDelay: `${i * 0.7}s` }}
                  />
                ))}
              </div>
            )}

            {/* alça */}
            <div className="absolute right-0 top-7 h-12 w-7 rounded-r-2xl border-4 border-l-0 border-[#d4b483]/40" />

            {/* corpo */}
            <div className="absolute left-1 right-5 top-4 bottom-0 overflow-hidden rounded-b-[2.2rem] rounded-t-lg border-4 border-[#d4b483]/40 bg-[#0d0d10]">
              {/* líquido */}
              <div
                className="absolute inset-x-0 bottom-0 transition-[height] duration-1000 ease-linear"
                style={{
                  height: `${liquid * 100}%`,
                  background:
                    "linear-gradient(180deg, #6f4e37 0%, #4a2f1d 60%, #36210f 100%)",
                }}
              >
                <div className="h-1.5 w-full bg-[#b07a4a]/70" />
              </div>
            </div>
          </div>
          {/* pires */}
          <div className="h-2 w-36 rounded-full bg-border" />
        </div>

        {/* timer */}
        <div className="text-center">
          <p className="font-mono text-4xl font-bold tabular-nums">
            {mm}:{ss}
          </p>
          <p
            className={cn(
              "mt-1 text-xs font-medium uppercase tracking-wide",
              isFocus ? "text-primary" : "text-secondary",
            )}
          >
            {isFocus ? "Tempo de foco" : "Pausa / descanso"}
          </p>
          {msg && <p className="mt-1 text-xs text-text-secondary">{msg}</p>}
        </div>

        {/* presets de foco */}
        <div className="mt-3 flex justify-center gap-1.5">
          {FOCUS_PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => {
                setFocusMin(m);
                if (!running) {
                  setPhase("focus");
                  setSecondsLeft(m * 60);
                }
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                focusMin === m
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-surface text-text-secondary hover:text-foreground",
              )}
            >
              {m}min
            </button>
          ))}
        </div>

        {/* controles */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setMsg(null);
              setRunning((r) => !r);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            {running ? (
              <>
                <Pause className="h-4 w-4" /> Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Iniciar
              </>
            )}
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-border p-2.5 text-text-secondary transition-colors hover:text-foreground"
            aria-label="Reiniciar"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
