import * as vscode from "vscode";
import { apiLogin, apiPlan, type PlanInfo } from "./api";
import { buildBaseItems, moduleMembers, knownModules } from "./completions";
import { TEMPLATES, templatesByCategory, type Template } from "./scaffolds";

const TOKEN_KEY = "pytrackAutocomplete.token";
let plan: PlanInfo | null = null;
let status: vscode.StatusBarItem;

/* ─────────── verificação de plano ─────────── */

async function refreshPlan(ctx: vscode.ExtensionContext): Promise<void> {
  const token = await ctx.secrets.get(TOKEN_KEY);
  if (!token) {
    plan = null;
    updateStatus();
    return;
  }
  try {
    plan = await apiPlan(token);
  } catch {
    plan = null; // token expirado/ inválido
  }
  updateStatus();
}

function hasCompleto(): boolean {
  return !!plan?.hasCompleto;
}

function updateStatus(): void {
  if (!status) return;
  if (hasCompleto()) {
    status.text = "$(sparkle) PyTrack Pro";
    status.tooltip = `PyTrack Autocomplete ativo — plano ${plan?.tierLabel}`;
    status.backgroundColor = undefined;
  } else if (plan) {
    status.text = "$(lock) PyTrack: faça upgrade";
    status.tooltip = `Seu plano (${plan.tierLabel}) não inclui o Autocomplete. Requer Completo (R$19).`;
    status.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
  } else {
    status.text = "$(account) PyTrack: entrar";
    status.tooltip = "Entre com sua conta PyTrack (plano Completo) para liberar o Autocomplete.";
    status.backgroundColor = undefined;
  }
  status.show();
}

async function ensureCompleto(): Promise<boolean> {
  if (hasCompleto()) return true;
  const acao = await vscode.window.showWarningMessage(
    plan
      ? `O PyTrack Autocomplete é exclusivo do plano Completo (R$19). Seu plano atual é ${plan.tierLabel}.`
      : "Entre com sua conta PyTrack (plano Completo) para usar o Autocomplete.",
    plan ? "Ver planos" : "Entrar",
    "Cancelar",
  );
  if (acao === "Entrar") {
    await vscode.commands.executeCommand("pytrackAutocomplete.login");
    return hasCompleto();
  }
  if (acao === "Ver planos") {
    vscode.env.openExternal(vscode.Uri.parse("https://www.pytrack.com.br/assinar"));
  }
  return false;
}

/* ─────────── completion provider ─────────── */

const BASE_ITEMS = buildBaseItems();
const MODS = new Set(knownModules());

function makeProvider(): vscode.CompletionItemProvider {
  return {
    provideCompletionItems(document, position) {
      const cfg = vscode.workspace.getConfiguration("pytrackAutocomplete");
      if (!cfg.get<boolean>("enableCompletions", true)) return [];
      if (!hasCompleto()) return [];

      const linePrefix = document.lineAt(position).text.slice(0, position.character);

      // contexto: `modulo.` → membros do módulo
      const dot = linePrefix.match(/([A-Za-z_][\w.]*)\.\s*$/);
      if (dot) {
        const base = dot[1];
        if (MODS.has(base)) return moduleMembers(base);
        // os.path.<membro>
        if (MODS.has(base.split(".").slice(-2).join("."))) {
          return moduleMembers(base.split(".").slice(-2).join("."));
        }
        return [];
      }

      // contexto: `import ` / `from ` → sugere módulos conhecidos
      if (/^\s*(import|from)\s+\w*$/.test(linePrefix)) {
        return knownModules().map((m) => {
          const it = new vscode.CompletionItem(m, vscode.CompletionItemKind.Module);
          it.detail = "PyTrack · módulo";
          return it;
        });
      }

      // padrão: keywords + builtins + módulos + snippets
      return BASE_ITEMS;
    },
  };
}

/* ─────────── scaffolding de projetos ─────────── */

async function scaffold(): Promise<void> {
  if (!(await ensureCompleto())) return;

  const byCat = templatesByCategory();
  const picks: (vscode.QuickPickItem & { tpl?: Template })[] = [];
  for (const [cat, tpls] of byCat) {
    picks.push({ label: cat, kind: vscode.QuickPickItemKind.Separator });
    for (const t of tpls) {
      picks.push({ label: t.label, description: t.id, detail: t.description, tpl: t });
    }
  }
  const escolha = await vscode.window.showQuickPick(picks, {
    title: `PyTrack — escolha um tipo de projeto (${TEMPLATES.length} disponíveis)`,
    placeHolder: "Ex.: API REST, POO, Data Science, Bot, Microsserviço…",
    matchOnDetail: true,
  });
  if (!escolha?.tpl) return;
  const tpl = escolha.tpl;

  const nome = await vscode.window.showInputBox({
    title: "Nome da pasta do projeto",
    value: tpl.id,
    validateInput: (v) => (/^[\w.-]+$/.test(v) ? null : "Use letras, números, ., _ ou -"),
  });
  if (!nome) return;

  const ws = vscode.workspace.workspaceFolders?.[0];
  if (!ws) {
    vscode.window.showErrorMessage("Abra uma pasta no VS Code antes de criar o projeto.");
    return;
  }
  const root = vscode.Uri.joinPath(ws.uri, nome);

  try {
    await vscode.workspace.fs.stat(root);
    const ow = await vscode.window.showWarningMessage(
      `A pasta "${nome}" já existe. Sobrescrever arquivos do template?`,
      "Sobrescrever", "Cancelar",
    );
    if (ow !== "Sobrescrever") return;
  } catch {
    /* não existe — ok */
  }

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: `Criando projeto "${tpl.label}"…` },
    async () => {
      const enc = new TextEncoder();
      for (const [rel, content] of Object.entries(tpl.files)) {
        const fileUri = vscode.Uri.joinPath(root, ...rel.split("/"));
        const dir = vscode.Uri.joinPath(fileUri, "..");
        await vscode.workspace.fs.createDirectory(dir);
        await vscode.workspace.fs.writeFile(fileUri, enc.encode(content));
      }
    },
  );

  // abre o arquivo "principal" do template
  const main =
    Object.keys(tpl.files).find((f) => /(^|\/)(main|app|cli|bot|server)\.py$/.test(f)) ??
    Object.keys(tpl.files).find((f) => f.endsWith(".py")) ??
    Object.keys(tpl.files)[0];
  if (main) {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.joinPath(root, ...main.split("/")));
    await vscode.window.showTextDocument(doc);
  }
  vscode.window.showInformationMessage(
    `Projeto "${tpl.label}" criado em ${nome}/ — ${Object.keys(tpl.files).length} arquivos.`,
  );
}

/* ─────────── comandos ─────────── */

async function login(ctx: vscode.ExtensionContext): Promise<void> {
  const email = await vscode.window.showInputBox({ title: "PyTrack — e-mail", placeHolder: "voce@email.com" });
  if (!email) return;
  const password = await vscode.window.showInputBox({ title: "PyTrack — senha", password: true });
  if (!password) return;

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "Entrando na PyTrack…" },
    async () => {
      try {
        const token = await apiLogin(email, password);
        await ctx.secrets.store(TOKEN_KEY, token);
        await refreshPlan(ctx);
        if (hasCompleto()) {
          vscode.window.showInformationMessage(
            `Conectado como ${plan?.name ?? plan?.email} — plano ${plan?.tierLabel}. Autocomplete liberado! ⚡`,
          );
        } else {
          const a = await vscode.window.showWarningMessage(
            `Login ok, mas seu plano (${plan?.tierLabel}) não inclui o Autocomplete. Requer Completo (R$19).`,
            "Ver planos",
          );
          if (a === "Ver planos") vscode.env.openExternal(vscode.Uri.parse("https://www.pytrack.com.br/assinar"));
        }
      } catch (e) {
        vscode.window.showErrorMessage((e as Error).message);
      }
    },
  );
}

export function activate(ctx: vscode.ExtensionContext): void {
  status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  status.command = "pytrackAutocomplete.status";
  ctx.subscriptions.push(status);

  ctx.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: "python" },
      makeProvider(),
      ".", // dispara também ao digitar ponto (membros de módulo)
    ),
    vscode.commands.registerCommand("pytrackAutocomplete.login", () => login(ctx)),
    vscode.commands.registerCommand("pytrackAutocomplete.logout", async () => {
      await ctx.secrets.delete(TOKEN_KEY);
      plan = null;
      updateStatus();
      vscode.window.showInformationMessage("Você saiu da PyTrack. Autocomplete desativado.");
    }),
    vscode.commands.registerCommand("pytrackAutocomplete.status", async () => {
      await refreshPlan(ctx);
      if (hasCompleto()) {
        vscode.window.showInformationMessage(
          `PyTrack Autocomplete ATIVO ⚡ — ${plan?.name ?? plan?.email} · plano ${plan?.tierLabel}. ${TEMPLATES.length} tipos de projeto disponíveis.`,
        );
      } else {
        await ensureCompleto();
      }
    }),
    vscode.commands.registerCommand("pytrackAutocomplete.newProject", () => scaffold()),
  );

  void refreshPlan(ctx);
}

export function deactivate(): void {
  /* nada a limpar */
}
