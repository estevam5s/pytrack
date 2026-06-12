import * as vscode from "vscode";
import { apiLogin, baseUrl, type Project, type Lesson, type Exercise } from "./api";
import { saveToken, clearToken, refresh, getCached } from "./state";
import {
  accountProvider, projectsProvider, lessonsProvider, exercisesProvider, toolsProvider,
} from "./views/trees";
import { aiAssistant, configureAI, aiQuickAction } from "./commands/ai";
import { installPackage, insertSyntax, runFile, createVenv, freeze, formatRuff } from "./commands/tools";
import { searchExercises, dailyChallenge } from "./commands/exercises";
import { openDashboard } from "./dashboard";

export function activate(ctx: vscode.ExtensionContext) {
  const account = accountProvider();
  const projects = projectsProvider();
  const lessons = lessonsProvider();
  const exercises = exercisesProvider();
  const tools = toolsProvider();

  vscode.window.registerTreeDataProvider("pytrack.account", account);
  vscode.window.registerTreeDataProvider("pytrack.projects", projects);
  vscode.window.registerTreeDataProvider("pytrack.lessons", lessons);
  vscode.window.registerTreeDataProvider("pytrack.exercises", exercises);
  vscode.window.registerTreeDataProvider("pytrack.tools", tools);

  const refreshAll = () => [account, projects, lessons, exercises].forEach((p) => p.refresh());

  async function doSync(silent = false) {
    try {
      const d = await refresh(ctx);
      refreshAll();
      if (!silent && d) {
        vscode.window.showInformationMessage(
          d.locked
            ? "PyTrack: conectado. Conteúdo completo é exclusivo do plano Suprema (R$46)."
            : `PyTrack sincronizado: ${d.counts?.projects} projetos, ${d.counts?.lessons} aulas, ${d.counts?.exercises} exercícios.`,
        );
      }
    } catch (e) {
      if (!silent) vscode.window.showErrorMessage(`PyTrack: ${(e as Error).message}`);
    }
  }

  // status bar (declarado antes dos comandos para uso no logout)
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  status.text = "$(rocket) PyTrack";
  status.tooltip = "PyTrack — clique para abrir o dashboard";
  status.command = "pytrack.dashboard";
  status.show();
  ctx.subscriptions.push(status);

  const reg = (id: string, fn: (...a: never[]) => unknown) => ctx.subscriptions.push(vscode.commands.registerCommand(id, fn as never));

  reg("pytrack.login", async () => {
    const email = await vscode.window.showInputBox({ title: "PyTrack — Entrar", prompt: "Seu e-mail", placeHolder: "voce@email.com", ignoreFocusOut: true });
    if (!email) return;
    const password = await vscode.window.showInputBox({ title: "PyTrack — Entrar", prompt: "Sua senha", password: true, ignoreFocusOut: true });
    if (!password) return;
    try {
      const res = await apiLogin(email, password);
      await saveToken(ctx, res.access_token);
      const d = await refresh(ctx);
      // a extensão é exclusiva do plano Suprema (R$46)
      if (d && !d.isSuprema) {
        await clearToken(ctx);
        refreshAll();
        const go = await vscode.window.showWarningMessage(
          `⚠️ A extensão PyTrack é exclusiva do plano Suprema (R$46). Seu plano atual é "${d.tierLabel}". Faça upgrade para usar a extensão.`,
          "Fazer upgrade",
        );
        if (go) vscode.env.openExternal(vscode.Uri.parse(`${baseUrl()}/assinar`));
        return;
      }
      refreshAll();
      vscode.window.showInformationMessage(`Bem-vindo(a)${res.user.name ? `, ${res.user.name}` : ""}! 🐍`);
      openDashboard(ctx);
    } catch (e) {
      vscode.window.showErrorMessage(`Login: ${(e as Error).message}`);
    }
  });

  reg("pytrack.logout", async () => {
    const ok = await vscode.window.showWarningMessage("Deseja sair da sua conta PyTrack?", "Sair", "Cancelar");
    if (ok !== "Sair") return;
    await clearToken(ctx);
    refreshAll();
    status.text = "$(rocket) PyTrack";
    vscode.window.showInformationMessage("PyTrack: você saiu da conta.");
  });

  reg("pytrack.sync", () => doSync(false));
  reg("pytrack.dashboard", () => openDashboard(ctx));
  reg("pytrack.openDashboard", () => vscode.env.openExternal(vscode.Uri.parse(`${baseUrl()}/inicio`)));
  reg("pytrack.openSite", () => vscode.env.openExternal(vscode.Uri.parse(baseUrl())));
  reg("pytrack.manageSubscription", () => vscode.env.openExternal(vscode.Uri.parse(`${baseUrl()}/configuracoes/plano`)));

  reg("pytrack.importProject", async (p?: Project) => {
    if (!p) return;
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) { vscode.window.showWarningMessage("Abra uma pasta para importar o projeto."); return; }
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const dir = vscode.Uri.joinPath(folders[0].uri, slug);
    const readme = `# ${p.title}\n\n${p.description}\n\n- Nível: ${p.level}\n- Área: ${p.area}\n- Estimativa: ${p.estimated_hours}h\n\nProjeto da PyTrack — ${baseUrl()}/meus-projetos\n`;
    await vscode.workspace.fs.createDirectory(dir);
    await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(dir, "README.md"), Buffer.from(readme, "utf8"));
    await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(dir, "main.py"), Buffer.from(`"""${p.title} — PyTrack"""\n\n\ndef main() -> None:\n    ...\n\n\nif __name__ == "__main__":\n    main()\n`, "utf8"));
    vscode.window.showInformationMessage(`Projeto "${p.title}" importado em ${slug}/`);
    vscode.commands.executeCommand("vscode.openFolder", dir, false);
  });

  reg("pytrack.openLesson", (l?: Lesson) => {
    if (l) vscode.env.openExternal(vscode.Uri.parse(`${baseUrl()}/conteudos/${l.slug}`));
  });
  reg("pytrack.openExercise", (e?: Exercise) => {
    if (e) vscode.env.openExternal(vscode.Uri.parse(`${baseUrl()}/exercicios`));
  });

  reg("pytrack.aiAssistant", () => aiAssistant(ctx));
  reg("pytrack.aiExplain", () => aiQuickAction(ctx, "explain"));
  reg("pytrack.aiRefactor", () => aiQuickAction(ctx, "refactor"));
  reg("pytrack.aiTests", () => aiQuickAction(ctx, "tests"));
  reg("pytrack.aiDocstring", () => aiQuickAction(ctx, "docstring"));
  reg("pytrack.configureAI", () => configureAI(ctx));
  reg("pytrack.installPackage", () => installPackage());
  reg("pytrack.insertSyntax", () => insertSyntax());
  reg("pytrack.runFile", () => runFile());
  reg("pytrack.createVenv", () => createVenv());
  reg("pytrack.freeze", () => freeze());
  reg("pytrack.formatRuff", () => formatRuff());
  reg("pytrack.searchExercises", () => searchExercises());
  reg("pytrack.dailyChallenge", () => dailyChallenge());

  // sincroniza ao iniciar (se já logado)
  doSync(true).then(() => {
    const d = getCached();
    if (d) status.text = `$(rocket) PyTrack: ${d.tierLabel}`;
  });
}

export function deactivate() {}
