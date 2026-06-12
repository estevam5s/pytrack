---
name: vscode-extension
description: "Extensão VS Code PyTrack (Suprema): código em extension-vscode/, API /api/extension/*, rota /extensao, admin /admin/extensao, .vsix em Supabase Storage"
metadata: 
  node_type: memory
  type: project
  originSessionId: e80488b4-200b-45f2-a1a1-9c9739d237ee
---

Extensão oficial do VS Code da PyTrack — **exclusiva do plano Suprema (R$46)**. Criada em jun/2026.

**Código** (`extension-vscode/`): publisher `EstevamSouza`, name `pytrack`, displayName "PyTrack — Python na sua IDE". Stack: TypeScript + esbuild (bundle dist/extension.js). Ícone media/icon.png (new-logo.png redimensionado 128x128 via `sips`), media/sidebar.svg.
- `src/extension.ts` (activate: 5 tree views + comandos + status bar), `src/api.ts` (apiLogin/apiSync), `src/state.ts` (SecretStorage token+chave IA), `src/views/trees.ts` (account/projects/lessons/exercises/tools), `src/commands/ai.ts` (IA com chave do USUÁRIO: openai/openrouter/anthropic/nvidia/custom), `src/commands/tools.ts` (pip install, sintaxe por versão Python 3.0→3.13).
- `snippets/python.json` (~30 snippets ecossistema). README/CHANGELOG/LICENSE/.vscodeignore/.gitignore.
- `.github/workflows/publish.yml` (publica no tag v* via secret VSCE_PAT).
- Build: `npm install && npm run compile && vsce package` → **pytrack-1.0.0.vsix** (36KB) gerado OK.

**API plataforma** (`app/api/extension/`):
- `login/route.ts` POST {email,password} → GoTrue token (só login, sem registro), rate limit 10/min/IP.
- `sync/route.ts` GET Bearer token → assinatura + projetos + aulas(contents) + exercícios; **gating Suprema** (locked=true se não-Suprema).
- `download/route.ts` GET → signed URL do .vsix (só Suprema).

**Plataforma**: rota `/extensao` (dashboard, apresentação + 2 formas instalar [Marketplace + .vsix] + recursos + IA com chave própria; download .vsix se Suprema). Admin `/admin/extensao` (`ExtensionManager` + actions uploadVsix/updateExtensionMeta — upload .vsix ao bucket, versão/url marketplace/changelog). Nav Carreira "Extensão VS Code" + Admin. Free path + middleware. **Preços**: Suprema ganhou "🧩 Extensão oficial para VS Code" (PlanSelector + /precos + tabela comparação).

**Supabase**: bucket privado `extension` (.vsix upado), tabela `extension_meta` (id=1 single row: version/vsix_path/marketplace_url/changelog, RLS read authenticated).

✅ **PUBLICADO no Marketplace** (jun/2026): `EstevamSouza.pytrack v1.0.0` via novo PAT `2yGqeQaK2DN...` (o 1º PAT `9XLdHEOvJi1w...` tinha expirado). URL: https://marketplace.visualstudio.com/items?itemName=EstevamSouza.pytrack. Para novas versões: bump version no package.json + `vsce publish --pat <PAT>` OU push tag v* (CI). marketplace_url salvo em extension_meta.

⚠️ **Bug login "Unexpected token '<'" CORRIGIDO**: extensão recebia HTML (página 404) pq o user testou antes do deploy do endpoint propagar (build falhou no 1º deploy por tsconfig). Endpoint OK agora (retorna JSON). Hardening em src/api.ts: `readJson()` detecta resposta HTML → mensagem clara; try/catch no fetch p/ erro de rede.

**v1.0.1 (jun/2026)** publicada: **Dashboard webview completo** (src/dashboard.ts — plano/XP/nível/projetos/aulas/exercícios, postMessage→comandos). **Logout** com confirmação (no menu do view + tools + account). **Login SÓ-Suprema**: após auth, se !isSuprema → clearToken + warning "exclusiva do Suprema" + botão upgrade. **Ícone Python** monocromático no sidebar (media/sidebar.svg, currentColor p/ tema). **58 snippets** (era ~30). **Ações IA** (src/commands/ai.ts aiQuickAction): explain/refactor/tests/docstring no menu de contexto do editor python. **Novas ferramentas** (tools.ts): runFile/createVenv/freeze/formatRuff; (exercises.ts): searchExercises (abre exercício como arquivo scaffold), dailyChallenge. **"Conheça a PyTrack"** → openSite (baseUrl raiz, não /inicio). **README ícone** agora URL absoluta `https://www.pytrack.com.br/new-logo.png` (relativo não aparecia na Marketplace). .vsix pytrack-1.0.1.vsix no Storage + extension_meta version=1.0.1. /extensao lê version dinâmico (sem redeploy).

⚠️ **tsconfig raiz** exclui `extension-vscode` (senão Vercel type-checa `vscode` import e falha) + `.vercelignore` (extension-vscode, mini-projetos; NÃO ignorar `doc/` — lido em runtime pelo content system).
