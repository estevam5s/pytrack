import type { CertificateData } from "@/components/certificate/certificate-view";

// Elemento (JSX) do certificado para o next/og ImageResponse — usado tanto
// na imagem OG (preview social) quanto no download em PNG.
export function certImageElement(cert: CertificateData | null, code: string) {
  const date = cert ? new Date(cert.issued_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "";
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0b1020", color: "#fff", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", border: "4px solid #d4af37", borderRadius: 18, padding: "40px 56px", background: "#0d1430" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ border: "1px solid #d4af37", borderRadius: 8, padding: "6px 14px", color: "#d4af37", fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>{cert?.credential_code ?? code}</div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800 }}>🐍 PyTrack</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: 4 }}>CERTIFICADO</div>
          <div style={{ display: "flex", color: "#d4af37", fontSize: 20, fontWeight: 700, letterSpacing: 4, marginTop: 4 }}>DE CONCLUSÃO DE TRILHA</div>
          {cert ? (
            <>
              <div style={{ color: "#9fb0d8", fontSize: 22, marginTop: 26 }}>A PyTrack certifica que</div>
              <div style={{ color: "#d4af37", fontSize: 52, fontWeight: 800, marginTop: 8 }}>{cert.recipient_name}</div>
              <div style={{ color: "#c7d2f0", fontSize: 24, marginTop: 14, textAlign: "center", display: "flex" }}>concluiu a trilha {cert.trilha_title}</div>
            </>
          ) : (
            <div style={{ color: "#9fb0d8", fontSize: 26, marginTop: 26 }}>Certificado não encontrado</div>
          )}
        </div>
        {cert && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#9fb0d8", fontSize: 20 }}>
            <div style={{ display: "flex", flexDirection: "column" }}><span style={{ color: "#fff", fontWeight: 700 }}>{date}</span><span style={{ fontSize: 14 }}>Conclusão</span></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><span style={{ color: "#fff", fontWeight: 700 }}>{cert.hours ? `${cert.hours}h` : "—"} · {cert.level}</span><span style={{ fontSize: 14 }}>Carga · Nível</span></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}><span style={{ color: "#29E0A9", fontWeight: 700 }}>100% ✓</span><span style={{ fontSize: 14 }}>Verificação</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
