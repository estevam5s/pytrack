---
name: admin-tools
description: "Ferramentas admin: avisos/broadcast, site settings (banner/manutenção), SEO editável, painel downloads; currículo templates; rota /apps gating"
metadata: 
  node_type: memory
  type: project
  originSessionId: e80488b4-200b-45f2-a1a1-9c9739d237ee
---

**Ferramentas admin + currículo + SEO (jun/2026).**

**Currículo templates REAIS** (`/curriculo`): antes `lib/resume/render.ts` usava 1 layout só mudando cor. Reescrito com **7 famílias de layout** (classic, sidebar-left, sidebar-right, header-band, minimal, timeline, two-column) + font (sans/serif/mono) em `lib/resume/types.ts` (campos layout+font). **12 templates** (era 8): +timeline(free), corporate/designer/academic(suprema). docx.ts usa só accent (ok).

**/admin/site FUNCIONA agora**: salvava mas nada consumia. `lib/data/site-settings.ts` (getSiteSettings unstable_cache 30s tag site-settings). Banner: `components/site/announcement-banner.tsx` (lê announcement/type/link, gradient por tipo info/success/warning) montado em (site)/layout.tsx. **Manutenção**: (site)/layout checa settings.maintenance && !isAdmin → tela de manutenção. Colunas add: announcement_type, announcement_link. actions revalidateTag("site-settings"). ⚠️ atualizar via SQL cru NÃO busta cache — só via form admin (revalidateTag+revalidatePath).

**/admin/seo EDITÁVEL** (era só análise read-only): tabela `seo_settings` (id=1: title/description/keywords/og_image, default og /opengraph-image). `lib/data/seo-settings.ts` (getSeoSettings cache 120s). Form `components/admin/seo-editor.tsx` (contadores + preview Google) + `actions.ts saveSeoSettings`. **Aplicado**: app/layout.tsx virou `generateMetadata` async lendo getSeoSettings (title/desc/keywords/OG/twitter dinâmicos).

**Painel downloads admin** (/aplicativo): seção só-admin com totais por plataforma (lê app_releases.download_count) — total + android/windows/macos/linux.

**Broadcast/avisos** (`/admin/avisos` nav Admin): `actions.ts broadcast` (insere notification p/ todos users via auth.admin.listUsers OU só assinantes via subscriptions; lotes 500; is_broadcast=true). Form `components/admin/broadcast-form.tsx` (templates rápidos, tipo, público). **Popup** `components/dashboard/broadcast-popup.tsx` (busca notification is_broadcast+popup_seen=false, modal gradiente, marca popup_seen ao fechar) montado em (dashboard)/layout. Colunas add notifications: is_broadcast, popup_seen.

**API docs**: /docs/api já existia; add link footer seção "Desenvolvedores" + alias `/api-docs`→redirect /docs/api. Footer Plataforma += "Apps & Extensão".

⚠️ tsconfig site já exclui supabase/functions; eslint ignora aplicativos/extension-vscode/mini-projetos.

**Auto-broadcast nova versão app + geo-IP idioma + /stack rica (jun/2026).**
- **Broadcast helper** `lib/notifications/broadcast.ts` (broadcastToUsers: all|paid, lotes 500, is_broadcast popup). admin/avisos/actions refatorado p/ usá-lo. **Auto-broadcast**: recordRelease (aplicativo/actions) aceita formData notify → broadcastToUsers "📱 Novo app vX disponível". Checkbox "Avisar usuários" em app-uploader.tsx (default true).
- **Geo-IP idioma**: `lib/geo-lang.ts` (langFromCountry: PT/ES/KO/ZH sets, resto→en). `middleware.ts` (raiz) lê `x-vercel-ip-country` → se sem cookie pytrack-geo nem googtrans, seta pytrack-geo=<lang> (marcador 1ano) + googtrans=/pt/<lang> se !pt. Language-provider lê googtrans no mount → Google Translate aplica. ⚠️ Vercel sobrescreve x-vercel-ip-country com IP real (não dá simular via curl header). Respeita escolha manual (não mexe se googtrans existe).
- **/stack reescrita**: `components/dashboard/stack-explorer.tsx` (substitui stack-view) — agrupa por categoria, expansível (grid-rows anim), cada cat mostra: tagline, métricas (horas p/ dominar, cargos, techs, % domínio user), techs com logos+nível, tipos de projeto, pré-requisitos, tecnologias relacionadas, ferramentas, cargos, link trilha relacionada + docs. `lib/stack-meta.ts` (STACK_META por categoria: projectTypes/prerequisites/technologies/tools/hoursToMaster/careers/relatedTrack). Page puxa progresso REAL do user (xp/level + progress por area via CAT_TO_AREA map → barra "seu domínio %"). stack_items: 60 itens 11 cats.