"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // reporta o erro para o monitoramento (server → console/webhook)
    try {
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          digest: error.digest,
          stack: error.stack,
          url: typeof window !== "undefined" ? window.location.href : "",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* ignore */
    }
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090B",
          color: "#F4F4F5",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <p style={{ fontSize: 56, fontWeight: 800, margin: 0, color: "#9956F6" }}>
            Ops!
          </p>
          <h1 style={{ fontSize: 22, marginTop: 8 }}>Algo deu errado</h1>
          <p style={{ color: "#A1A1AA", fontSize: 14, marginTop: 8 }}>
            Tivemos um problema inesperado e nossa equipe foi notificada.
            Tente novamente em instantes.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                background: "linear-gradient(90deg,#8234E9,#9956F6)",
                color: "#fff",
                border: 0,
                borderRadius: 10,
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Tentar novamente
            </button>
            <a
              href="/"
              style={{
                border: "1px solid #27272A",
                color: "#F4F4F5",
                borderRadius: 10,
                padding: "10px 20px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Ir para o início
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
