// Efeitos do pomodoro: som (Web Audio) e notificação do navegador.

let audioCtx: AudioContext | null = null;

/** Cria/retoma o AudioContext — deve ser chamado a partir de um gesto do usuário. */
export function primeAudio() {
  try {
    if (typeof window === "undefined") return;
    if (!audioCtx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
  } catch {
    /* ignore */
  }
}

/** Toca um pequeno acorde agradável de conclusão. */
export function playChime() {
  try {
    primeAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [880, 1108.73, 1318.51]; // A5 · C#6 · E6
    notes.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = now + i * 0.16;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(gain).connect(audioCtx!.destination);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch {
    /* ignore */
  }
}

/** Pede permissão de notificação (idealmente a partir de um clique). */
export function requestNotify() {
  try {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      void Notification.requestPermission();
    }
  } catch {
    /* ignore */
  }
}

/** Dispara uma notificação do sistema (se permitido). */
export function notify(title: string, body: string) {
  try {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(title, { body, icon: "/logo.png", badge: "/logo.png" });
    }
  } catch {
    /* ignore */
  }
}
