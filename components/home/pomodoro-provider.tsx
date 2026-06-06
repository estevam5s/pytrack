"use client";

import { useEffect, useRef } from "react";
import { usePomodoro } from "@/store/pomodoro";
import { notify, playChime } from "@/lib/pomodoro-fx";

/**
 * Mantém o pomodoro rodando globalmente (independente da rota), pois fica
 * montado no layout do dashboard. Toca som + dispara notificação ao concluir.
 */
export function PomodoroProvider() {
  const tick = usePomodoro((s) => s.tick);
  const eventId = usePomodoro((s) => s.eventId);
  const eventType = usePomodoro((s) => s.eventType);
  const lastSeen = useRef(eventId);

  // ticker global de 1s
  useEffect(() => {
    const id = setInterval(() => tick(), 1000);
    const onFocus = () => tick(); // recupera o tempo ao voltar para a aba
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [tick]);

  // efeitos ao concluir uma fase
  useEffect(() => {
    if (eventId === lastSeen.current) return;
    lastSeen.current = eventId;
    if (eventType === "focus") {
      playChime();
      notify(
        "☕ Foco concluído!",
        "Hora da pausa. Levante, respire e tome um café.",
      );
    } else if (eventType === "break") {
      playChime();
      notify("🐍 Pausa encerrada", "Pronto para o próximo ciclo de foco?");
    }
  }, [eventId, eventType]);

  return null;
}
