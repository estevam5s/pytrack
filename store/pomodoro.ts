import { create } from "zustand";
import { persist } from "zustand/middleware";

export const FOCUS_PRESETS = [15, 25, 50];
export const breakFor = (focus: number) => Math.max(5, Math.round(focus / 5));
const today = () => new Date().toISOString().slice(0, 10);

interface PomodoroState {
  focusMin: number;
  phase: "focus" | "break";
  running: boolean;
  secondsLeft: number;
  endsAt: number | null; // epoch ms quando a fase atual termina
  cups: number;
  cupsDate: string;
  // sinal de conclusão p/ o provider tocar som/notificar (não persistido)
  eventId: number;
  eventType: "focus" | "break" | null;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  setFocus: (min: number) => void;
  tick: () => void;
}

export const usePomodoro = create<PomodoroState>()(
  persist(
    (set, get) => ({
      focusMin: 25,
      phase: "focus",
      running: false,
      secondsLeft: 25 * 60,
      endsAt: null,
      cups: 0,
      cupsDate: today(),
      eventId: 0,
      eventType: null,

      start: () =>
        set((s) =>
          s.running
            ? {}
            : { running: true, endsAt: Date.now() + s.secondsLeft * 1000 },
        ),
      pause: () =>
        set((s) => ({
          running: false,
          endsAt: null,
          secondsLeft: s.secondsLeft,
        })),
      toggle: () => (get().running ? get().pause() : get().start()),
      reset: () =>
        set((s) => ({
          running: false,
          phase: "focus",
          secondsLeft: s.focusMin * 60,
          endsAt: null,
        })),
      setFocus: (min) =>
        set((s) =>
          s.running && s.phase === "focus"
            ? { focusMin: min }
            : {
                focusMin: min,
                phase: "focus",
                secondsLeft: min * 60,
                endsAt: null,
              },
        ),

      tick: () =>
        set((s) => {
          const dailyReset =
            s.cupsDate !== today() ? { cups: 0, cupsDate: today() } : {};
          if (!s.running || s.endsAt == null)
            return Object.keys(dailyReset).length ? dailyReset : {};

          const remaining = Math.round((s.endsAt - Date.now()) / 1000);
          if (remaining > 0) return { ...dailyReset, secondsLeft: remaining };

          // fase atual terminou
          if (s.phase === "focus") {
            const breakSecs = breakFor(s.focusMin) * 60;
            const baseCups = (dailyReset as { cups?: number }).cups ?? s.cups;
            return {
              ...dailyReset,
              phase: "break",
              secondsLeft: breakSecs,
              endsAt: Date.now() + breakSecs * 1000, // continua direto na pausa
              running: true,
              cups: baseCups + 1,
              cupsDate: today(),
              eventId: s.eventId + 1,
              eventType: "focus",
            };
          }
          // pausa terminou
          return {
            ...dailyReset,
            phase: "focus",
            secondsLeft: s.focusMin * 60,
            endsAt: null,
            running: false,
            eventId: s.eventId + 1,
            eventType: "break",
          };
        }),
    }),
    {
      name: "pytrack-pomodoro",
      partialize: (s) => ({
        focusMin: s.focusMin,
        phase: s.phase,
        running: s.running,
        secondsLeft: s.secondsLeft,
        endsAt: s.endsAt,
        cups: s.cups,
        cupsDate: s.cupsDate,
      }),
    },
  ),
);
