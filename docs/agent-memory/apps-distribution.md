---
name: apps-distribution
description: "Distribuição apps PyTrack: CLI/curl/Docker, contadores de download, stats do banco no site, /apps gating Suprema"
metadata: 
  node_type: memory
  type: project
  originSessionId: e80488b4-200b-45f2-a1a1-9c9739d237ee
---

**Distribuição avançada dos apps + stats dinâmicos (jun/2026).**

**Stats do site vêm do BANCO** (antes hardcoded): `lib/data/platform-stats.ts` (getPlatformStats unstable_cache 1h: conta contents/practice_exercises/projects + TRILHAS.length; fmtStat 5269→"5.3k+"). Home `app/(site)/page.tsx` virou async, passa stats p/ HeroSection (prop `stats`, fallback). Verificado: home mostra 5.3k+ exercícios, 1.4k+ projetos.

**Ícones stack corrigidos** (tech-stack-section.tsx): Pyodide usava slug simpleicons `pyodide` (404) → `webassembly/654FF0`; OpenAI `openai` (404, removido por trademark) → `/tech/openai.svg` (SVG local criado em public/tech/openai.svg).

**Contadores de download**: coluna `app_releases.download_count` bigint + fn pg `increment_download(p_platform)` (security definer, incrementa + retorna download_url). Rota `app/api/download/route.ts?platform=android|windows|macos|linux` → rpc increment + redirect 302. `/apps` usa `/api/download?platform=X` (botões) e mostra totais via `lib/data/download-stats.ts` (getDownloadStats cache 5min: android, desktop=soma win+mac+linux, extension=instalações VS Code Marketplace via extensionquery API flags 256). Admin /aplicativo pode ver (download_count na tabela).

**Instalação CLI/curl**: `public/install.sh` (Linux/macOS: detecta SO/apt/dnf, baixa .deb/.rpm/.AppImage/.dmg da GitHub release) + `public/install.ps1` (Windows: baixa .exe). Servidos em www.pytrack.com.br/install.sh|.ps1.

**Docker (GHCR)**: `aplicativos/desktop/Dockerfile` (ubuntu 22.04 + webkit2gtk + Xvfb+fluxbox+x11vnc+novnc+websockify; baixa .deb da release ARG VERSION; ENTRYPOINT docker/entrypoint.sh roda Xvfb:0 + app --no-sandbox + noVNC porta 6080). `docker run -p 6080:6080 ghcr.io/estevam5s/pytrack-desktop:latest` → http://localhost:6080. Workflow `.github/workflows/docker.yml` (build-push-action → ghcr.io, tags latest+versão, dispara em tag desktop-v* ou workflow_dispatch). ⚠️ Docker local não roda nesta máquina ("Docker is not running") — build só via CI. ✅ **PUBLICADA** ghcr.io/estevam5s/pytrack-desktop:latest (e :1.0.1), ~253MB, **pública** (pull anônimo OK 200). ⚠️ versão no workflow_dispatch: extrai de GITHUB_REF_NAME se desktop-v*, senão busca última release (bug: manual disparou version=main→404 .deb; corrigido). Imagem GHCR nasce pública pq o user já tinha outros pacotes públicos.

**/apps gating**: extensão E apps = Suprema R$46; força force-dynamic + checa tier. Seção "Instalação avançada — CLI/curl/Docker" com CodeBox + ícone Container (lucide). Plataformas row += Docker.

⚠️ tsconfig site exclui `supabase/functions` (Edge Function Deno quebra tsc do Next).

**Footer snake + mobile v2 (jun/2026).** **Cobrinha auto-play no footer** `components/site/footer-snake.tsx` (canvas, snake joga sozinha via BFS pathfinding até comida + fallback safeDir, gradiente roxo→verde, olhinhos, come "pacotes" verdes, score+contador, pausa em visibilitychange, **só desktop `hidden lg:block`**). Montada em footer.tsx após colunas (espaço vazio). **Mobile rebuild**: EAS build finished → APK 76MB (com correção exercícios IA via lib/ai.ts+modal) → substituiu asset pytrack.apk na GitHub release estevam5s/pytrack v1.0.0 (delete asset antigo + upload novo via uploads.github.com). Broadcast "📱 App Android atualizado!" enviado (5 users).

**Brew/Choco/Arch + docs + footer + email fix (jun/2026).**
- **Homebrew tap REAL**: repo público `estevam5s/homebrew-tap` (Casks/pytrack.rb, sha256 do universal.dmg, app PyTrack.app). `brew install --cask estevam5s/tap/pytrack` FUNCIONA. Cask 200.
- **Arch**: install.sh detecta pacman → baixa AppImage. PKGBUILD em aplicativos/desktop/packaging/arch/ (pytrack-desktop-bin, source AppImage). ⚠️ AUR submission precisa conta do user. Site mostra Arch Linux na linha de plataformas + `yay -S pytrack-desktop-bin`.
- **Chocolatey**: packaging/chocolatey/ (nuspec + chocolateyinstall.ps1 baixa .exe). ⚠️ choco.org submission precisa API key/moderação.
- /apps install: 6 CodeBox (Brew/Choco/AUR/curl/PowerShell/Docker).
- **/docs**: documentação completa nível Node.js (app/(site)/docs/page.tsx — 14 seções: sobre/como funciona/trilhas/exercícios/IDE/projetos/carreira/comunidade/apps/API/planos/tecnologia/segurança/FAQ, índice lateral sticky). Nav +Docs, footer Desenvolvedores +Documentação, sitemap.
- **Footer melhorado**: REMOVIDO widget TrustMRR ($3 exposto); ADD badges apps (Android/Desktop/VSCode→/apps) + status "Todos os sistemas operacionais" (verde pulsante→/status).
- **EMAIL CONFIRMAÇÃO CORRIGIDO**: senha SMTP no Supabase estava STALE (login Gmail funcionava com .env mas Supabase tinha senha velha). Re-aplicada via config/auth PATCH (smtp_pass + template juntos — Supabase exige SMTP+template no mesmo PATCH senão 400 "free tier default provider"). Template confirmação profissional novo (gradiente, logo, lista de benefícios, link fallback). signup teste OK confirmation_sent_at preenchido. GMAIL_APP_PASSWORD no .env é válido (porta 465 SSL).