"use client";

// Fundo ambiente futurista, fixo atrás de TODO o site (todas as rotas).
// Aurora animada + grid com máscara + orbe que segue o mouse. Pura CSS/transform
// para performance, e desativa em prefers-reduced-motion.
import { useEffect, useRef } from "react";

export function AmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
        }
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-background" />

      {/* aurora blobs */}
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />

      {/* grid futurista com máscara radial */}
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(130,52,233,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(130,52,233,0.06)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />

      {/* brilho que segue o mouse (desktop) */}
      <div ref={glowRef} className="absolute left-0 top-0 hidden h-[600px] w-[600px] rounded-full opacity-40 blur-[120px] [background:radial-gradient(circle,rgba(153,86,246,0.25),transparent_60%)] md:block" />

      {/* vinheta */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
