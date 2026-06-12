---
name: mobile-app
description: App mobile PyTrack (Expo + React Native) em aplicativos/mobile; prompt em prompts/app-mobile.md; mesmo backend Supabase
metadata: 
  node_type: memory
  type: project
  originSessionId: e80488b4-200b-45f2-a1a1-9c9739d237ee
---

App mobile oficial da PyTrack — **Expo SDK 51 + expo-router + TypeScript + NativeWind**, em `aplicativos/mobile/`. Construído a partir de `prompts/app-mobile.md` (jun/2026). Consome o **mesmo backend Supabase** (anon key pública + RLS). **Só login** (sem cadastro — registro no site).

**Stack**: expo-router (file-based), @supabase/supabase-js, expo-secure-store (sessão no keychain — adapter SecureStore<2KB com fallback AsyncStorage), @tanstack/react-query, expo-web-browser (OAuth GitHub + checkout Stripe), expo-notifications, lucide-react-native.

**lib/**: `supabase.ts` (client + SecureStore storage + SITE_URL), `billing.ts` (Tier/TIER_RANK/tierAtLeast/tierFromSubscription/isAdminEmail/PLANS), `trilhas.ts` (17 trilhas). **hooks/**: `useAuth.tsx` (AuthProvider: session/profile/tier/isAdmin/needsMfa/unreadCount/refresh/signOut; checa mfa.getAuthenticatorAssuranceLevel p/ aal2). **components/ui.tsx** (Card/Button/Input/Badge/colors marca).

**Rotas** (17 telas): index (redirect loading→login/mfa/tabs), (auth)/login (email+senha+GitHub OAuth deep link pytrack://auth/callback) + mfa (TOTP challenge/verify), (tabs): inicio (XP/nível/atalhos/badge notif), trilhas (17 c/ cadeado tier), exercicios (busca real practice_exercises), comunidade (feed community_posts, gating completo+), perfil; trilhas/[id], conteudos/[modulo] (contents), notificacoes (badge não-lidas, marca lidas), configuracoes/index+plano+ia (BYOK user_ai_settings).

**Pagamentos**: abrem o site (WebBrowser /assinar e /configuracoes/plano) — sem cartão no app. **Gating** espelha o site (free<essencial<completo<suprema<vitalicio). Admin emails escondem grupo Admin.

**Setup**: `cd aplicativos/mobile && npm install && npm start`. .env tem EXPO_PUBLIC_SUPABASE_URL/ANON_KEY/SITE_URL. Build: `eas build -p android` (APK/AAB). ⚠️ adicionar `pytrack://auth/callback` na allowlist Redirect URLs do Supabase p/ GitHub OAuth.

**tsc passa limpo** (exit 0). EAS: já logado como estevam5s, projectId a0ebcac9-3a8b-4545-8e49-5807a47eb1fb (em app.config extra.eas + owner estevam5s). Build APK: `EAS_NO_VCS=1 npx eas-cli build -p android --profile preview --non-interactive --no-wait`. ⚠️ root tsconfig + .vercelignore excluem `aplicativos` (senão build do SITE tenta compilar RN e falha, igual extension-vscode).

⚠️ **BUGS de build resolvidos**: (1) **worklets**: `nativewind ^4.0.1` puxou 4.2.5 cujo react-native-css-interop/babel exige `react-native-worklets/plugin` (Reanimated 4) — incompatível SDK 51. FIX: pinar `nativewind@4.1.23` + `react-native-css-interop@0.1.22`. (2) **app crashava no launch (fecha sozinho)**: EAS build não recebia `EXPO_PUBLIC_*` (.env gitignored + sem env vars no EAS) → createClient("","") lançava erro. FIX: env no `eas.json` (build.preview.env + production.env — URL/anon PÚBLICAS) + fallback hardcoded em app.config.ts extra + lib/supabase.ts (FALLBACK_URL/ANON). Lição: EXPO_PUBLIC vars precisam estar no eas.json p/ EAS build (não basta .env local). Validar bundle local antes: `npx expo export -p android`.

**APK distribuído via /aplicativo (jun/2026)**: APK 76MB hospedado em **GitHub Release** `estevam5s/pytrack` v1.0.0 (repo público, asset pytrack.apk) — pq Supabase free limita storage a 50MB/arquivo (config/storage fileSizeLimit 52428800, não dá p/ aumentar sem plano pago). Registro em `app_releases` (platform=android, version 1.0.0, download_url=github releases url, is_published=true). Rota `/aplicativo` (já existia: page.tsx+actions.ts, bucket app-releases, tabela app_releases sem updated_at) lê download_url → botão "Baixar APK". Sistema já suporta desktop (windows/macos/linux) p/ depois. Upload via GitHub API (criar release POST /repos/.../releases + asset). Download público OK (302→200, content-disposition attachment).

⚠️ Pendente (mesmo backend): IDE Pyodide WebView, correção exercícios IA (Edge Function), push streak, i18n, tutorial+cookies 1ª abertura. Ver prompts/app-mobile.md (ampliado com features novas: notificações, currículo, entrevista-ia, extensão, API, conexões, +5000 exercícios, trial 7d).
