"use client";

import { useEffect, useRef } from "react";

// Vídeo que inicia automaticamente quando entra na viewport (sem clique) e
// pausa ao sair — comporta-se como um GIF, mas muito mais leve.
export function ScrollVideo({ poster, className }: { poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Demonstração do painel de aprendizado da PyTrack"
    >
      <source src="/dashboard-preview.webm" type="video/webm" />
      <source src="/dashboard-preview.mp4" type="video/mp4" />
    </video>
  );
}
