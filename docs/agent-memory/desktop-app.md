---
name: desktop-app
description: App desktop PyTrack (Tauri 2 + React + Vite) em aplicativos/desktop; Win/Mac/Linux; prompt em prompts/app-desktop.md; mesmo backend Supabase
metadata: 
  node_type: memory
  type: project
  originSessionId: e80488b4-200b-45f2-a1a1-9c9739d237ee
---

App desktop oficial da PyTrack — **Tauri 2 (Rust) + React 18 + Vite + TS + Tailwind**, em `aplicativos/desktop/`. Construído de `prompts/app-desktop.md` (jun/2026). Mesmo backend Supabase (anon key pública + RLS). **Win/Mac/Linux**. Só login (cadastro no site).

**Frontend** `src/`: lib (supabase.ts c/ openExternal via @tauri-apps/plugin-shell + fallback window.open; billing.ts e trilhas.ts COPIADOS do mobile; FALLBACK_URL/ANON), hooks/useAuth.tsx (igual mobile, web), components/Sidebar.tsx (grupos Estudar/Carreira/Conta/Admin, badge notif vermelho) + ui.tsx, screens (Login email+senha+GitHub OAuth, Mfa TOTP, Inicio, Trilhas+TrilhaDetalhe, Exercicios busca real, Comunidade feed Markdown gating completo+, Notificacoes, Perfil, Plano, Ia BYOK, Conteudos, **Ide Pyodide** CDN jsdelivr roda Python local Ctrl+Enter, Placeholder p/ rotas premium → abre web). react-router (BrowserRouter), @tanstack/react-query.

**src-tauri/**: Cargo.toml (tauri 2 + tauri-plugin-shell, lib name pytrack_lib), tauri.conf.json (identifier com.pytrack.app, CSP libera cdn.jsdelivr+wasm-unsafe-eval p/ Pyodide, *.supabase.co+wss, api.stripe.com, pytrack.com.br; bundle targets all; nsis currentUser; macOS minSystem 10.15), src/main.rs+lib.rs, capabilities/default.json (core:default + shell:allow-open), icons gerados via `npx @tauri-apps/cli icon` (icns/ico/png). build.rs.

**.github/workflows/build.yml**: matriz macos/ubuntu-22.04/windows, tauri-action, dispara em tag `desktop-v*`, anexa instaladores em GitHub Release. Linux precisa libwebkit2gtk-4.1-dev. Secrets: VITE_SUPABASE_URL/ANON_KEY.

⚠️ **Configs críticas**: vite.config.ts precisa `resolve.alias @→./src` (senão Rollup falha no build prod — tsconfig paths não bastam). `src/vite-env.d.ts` com ImportMetaEnv (senão tsc erro import.meta.env). tsc limpo + vite build OK (1893 módulos). Build macOS local: `npm run tauri:build` (compila Rust ~5-10min 1ª vez). Para Win/Linux usar GitHub Actions (precisa do OS).

**Distribuição**: instaladores → rota `/aplicativo` (app_releases platform=windows/macos/linux). Supabase free limita 50MB → hospedar em GitHub Releases estevam5s/pytrack (igual APK). Setup: `cd aplicativos/desktop && npm install && npm run tauri:dev`.

⚠️ Rust/cargo 1.93.1 instalado na máquina (build mac local funciona). aplicativos/ já excluído do tsconfig+.vercelignore do site.

**BUILDADO + DISTRIBUÍDO (jun/2026)**: macOS `.dmg`/.app (7MB, aarch64) buildado local OK, smoke test launch OK (creds embutidas pelo Vite no build + fallback). DMG (7MB cabe nos 50MB Supabase) upado no bucket app-releases + registrado em app_releases (platform=macos). Código no repo público **estevam5s/pytrack-desktop** (separado do estevam5s/pytrack que tem o APK). Secrets VITE_SUPABASE_URL/ANON_KEY setados (via pynacl sealed box + actions/secrets API). Tag `desktop-v1.0.0` dispara workflow → gera Win(.msi/.exe)/Mac(.dmg)/Linux(.AppImage/.deb) e anexa em GitHub Release. ⚠️ app macOS NÃO assinado (Gatekeeper: botão direito→Abrir). Quando CI terminar: registrar windows/linux em app_releases apontando p/ GitHub Release assets.

⚠️ **CI FALHOU 1ª vez** "Resource not accessible by integration" (criar release): faltava `permissions: contents: write` no workflow + repo default_workflow_permissions=write (setado via API actions/permissions/workflow). Rust compilou OK; só a etapa de release falhava. Corrigido + re-tag (deletar tag remota+local, re-criar). run 27279228072.

✅ **CI SUCESSO**: release desktop-v1.0.0 c/ assets: .exe(3.3MB)+.msi(4MB) Windows, .dmg universal(10.7MB) macOS, .AppImage(78MB)+.deb(3.8MB)+.rpm(3.8MB) Linux. **app_releases registrado p/ windows/linux/macos** (download_url=github release assets, downloads HTTP 206 OK). `/aplicativo` agora tem android+windows+macos+linux todos publicados.

**CHANGELOG.md** profissional (Keep a Changelog) cobrindo Plataforma/Extensão VSCode/Mobile/Desktop + roadmap, em ambos repos (pytrack + pytrack-desktop). **Rota pública `/apps`** (app/(site)/apps/page.tsx — cards Extensão VSCode/Android/Desktop + downloads) + seção `AppsShowcase` na home + link "Apps" no NAV_LINKS + sitemap. ⚠️ eslint.config.mjs ignora aplicativos/extension-vscode/mini-projetos (senão linta bundle minificado e falha).

**UPDATER automático Tauri (v1.0.1)**: keypair gerado `~/.tauri/pytrack-updater.key`(.pub); tauri.conf.json plugins.updater (endpoints github releases latest.json + pubkey) + bundle.createUpdaterArtifacts=true; Cargo tauri-plugin-updater+process (target not android/ios); lib.rs builder #[cfg(desktop)] plugins updater+process; capabilities += updater:default/process:default/allow-restart; `src/components/UpdateChecker.tsx` (check() ao abrir, downloadAndInstall+relaunch, só dentro Tauri via __TAURI_INTERNALS__) montado no Shell. CI: secrets TAURI_SIGNING_PRIVATE_KEY (=conteúdo da chave priv) + _PASSWORD (vazia) → gera latest.json assinado. Tag desktop-v1.0.1 (run 27281701424). ⚠️ guardar chave privada — sem ela updates futuros não assinam.

**GATING /apps por plano (Suprema)**: app/(site)/apps/page.tsx agora force-dynamic, checa user+getUserTier, canDownload=tierAtLeast suprema; botões viram "Disponível no Suprema"→/assinar se não-suprema + banner upgrade. **Extensão E apps = Suprema R$46**.

**Tradução no dashboard**: extraído `components/site/lang-toggle.tsx` (do navbar) reutilizável; LanguageProvider montado em app/(dashboard)/layout.tsx; `<LangToggle/>` add no header.tsx ao lado do ThemeToggle (canto sup. direito).

**Edge Function `correct-exercise`** (correção exercícios IA, tarefa 3): supabase/functions/correct-exercise/index.ts (Deno, valida JWT, lê user_ai_settings BYOK ou fallback NVIDIA secret, retorna score/feedback/strengths/improvements/bestSolution + xp). Deploy via `supabase functions deploy correct-exercise --no-verify-jwt` (CLI 2.75, SUPABASE_ACCESS_TOKEN=mgmt token). Secret NVIDIA_API_KEY setado. Testado OPTIONS 200 + auth 401. Integrado no mobile: aplicativos/mobile/lib/ai.ts + modal correção em exercicios.tsx (precisa rebuild app p/ shipar).
