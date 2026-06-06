import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PyTrack — Domine Python do básico à carreira";
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
          justifyContent: "center",
          padding: "80px",
          background: "#09090B",
          backgroundImage:
            "radial-gradient(60% 60% at 20% 0%, rgba(130,52,233,0.35), transparent 60%)",
          color: "#F4F4F5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background:
                "linear-gradient(97deg,#29E0A9,#5F75F2,#9956F6,#E254FF)",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 700 }}>PyTrack</div>
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 900,
            letterSpacing: "-0.02em",
          }}
        >
          Domine Python do básico à carreira profissional
        </div>

        <div style={{ marginTop: 28, fontSize: 34, color: "#A1A1AA" }}>
          Trilhas · Exercícios com IA · IDE · Projetos · Comunidade
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            color: "#9956F6",
            fontWeight: 700,
          }}
        >
          plataforma-python.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
