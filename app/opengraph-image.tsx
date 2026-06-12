import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PyTrack — Domine Python do básico à carreira profissional";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#09090B",
          backgroundImage:
            "radial-gradient(70% 70% at 15% -10%, rgba(130,52,233,0.45), transparent 55%), radial-gradient(60% 60% at 95% 110%, rgba(41,224,169,0.28), transparent 55%)",
          color: "#F4F4F5",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* grid sutil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        {/* topo: logo + badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: "linear-gradient(135deg,#29E0A9,#5F75F2,#9956F6,#E254FF)",
                display: "flex",
              }}
            />
            <div style={{ fontSize: 38, fontWeight: 800 }}>PyTrack</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(153,86,246,0.5)",
              background: "rgba(153,86,246,0.12)",
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 24,
              color: "#C9A8FF",
              fontWeight: 600,
            }}
          >
            🐍 Plataforma 100% Python
          </div>
        </div>

        {/* centro: título + subtítulo */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              maxWidth: 1000,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ marginRight: 18 }}>Domine Python do básico à</span>
            <span
              style={{
                background: "linear-gradient(90deg,#29E0A9,#9956F6,#E254FF)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              carreira profissional
            </span>
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#A1A1AA", maxWidth: 920 }}>
            16 trilhas guiadas · 2.400+ exercícios com IA · IDE no navegador ·
            projetos reais · comunidade
          </div>
        </div>

        {/* rodapé: métricas + url */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 40 }}>
            {[
              ["80+", "módulos"],
              ["1.3k+", "projetos"],
              ["7 dias", "grátis"],
            ].map(([n, l]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#29E0A9" }}>{n}</div>
                <div style={{ fontSize: 22, color: "#A1A1AA" }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 28, color: "#9956F6", fontWeight: 700 }}>
            www.pytrack.com.br
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
