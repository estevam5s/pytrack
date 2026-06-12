/** Toca um som curto e agradável de notificação (Web Audio API, sem arquivo). */
export function playNotificationSound() {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    // dois tons (ding-dong) suaves
    const notes = [
      { freq: 880, start: 0, dur: 0.12 },
      { freq: 1174.66, start: 0.1, dur: 0.18 },
    ];
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = n.freq;
      gain.gain.setValueAtTime(0, now + n.start);
      gain.gain.linearRampToValueAtTime(0.12, now + n.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur);
    }
    setTimeout(() => ctx.close(), 600);
  } catch {
    /* navegador bloqueou áudio */
  }
}
