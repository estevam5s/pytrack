"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { APP_NAME, isAdminEmail, requestOtp, verifyOtp, saveProof, hasValidProof } from "@/lib/tfa"

// Página dedicada de 2FA (Telegram) para o admin. Autocontida e reutilizável.
export default function TwoFactorPage() {
  const [phase, setPhase] = useState<"loading" | "code" | "error">("loading")
  const [challenge, setChallenge] = useState("")
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState("")

  const redirect = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect") || "/inicio" : "/dashboard"

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const email = data.user?.email
      // Não-admin ou prova válida → segue direto (não trava ninguém)
      if (!isAdminEmail(email) || hasValidProof()) { window.location.href = redirect; return }
      const res = await requestOtp(email!)
      if (res?.ok && res.challenge) { setChallenge(res.challenge); setPhase("code") }
      else { setMsg("2FA indisponível; entrando direto."); window.location.href = redirect }
    })()
  }, [redirect])

  const verify = async () => {
    if (code.length !== 6) return
    setBusy(true)
    const r = await verifyOtp(challenge, code)
    setBusy(false)
    if (r?.ok && r.proof) { saveProof(r.proof); window.location.href = redirect }
    else setMsg("Código inválido ou expirado.")
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f17", color: "#e5e7eb", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 380, background: "#111827", border: "1px solid #1f2937", borderRadius: 16, padding: 28 }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>🔐 Verificação em duas etapas</h1>
        <p style={{ color: "#9ca3af", fontSize: 14 }}>
          {phase === "loading" ? "Enviando código no seu Telegram…" : `Digite o código de 6 dígitos enviado no Telegram (@SecSaaS_Bot) — ${APP_NAME}.`}
        </p>
        {phase === "code" && (
          <>
            <input autoFocus inputMode="numeric" maxLength={6} value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              placeholder="••••••"
              style={{ width: "100%", marginTop: 12, padding: "12px", textAlign: "center", fontSize: 24, letterSpacing: "0.5em", background: "#0b0f17", border: "1px solid #374151", borderRadius: 10, color: "#fff" }} />
            <button onClick={verify} disabled={busy || code.length !== 6}
              style={{ width: "100%", marginTop: 14, padding: "12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer", opacity: busy || code.length !== 6 ? 0.5 : 1 }}>
              {busy ? "Validando…" : "Entrar com segurança"}
            </button>
          </>
        )}
        {msg && <p style={{ color: "#f87171", fontSize: 13, marginTop: 10 }}>{msg}</p>}
      </div>
    </div>
  )
}
