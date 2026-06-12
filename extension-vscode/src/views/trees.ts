import * as vscode from "vscode";
import { getCached } from "../state";

class Item extends vscode.TreeItem {
  constructor(
    label: string,
    desc?: string,
    icon?: string,
    command?: vscode.Command,
    tooltip?: string,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = desc;
    if (icon) this.iconPath = new vscode.ThemeIcon(icon);
    if (command) this.command = command;
    this.tooltip = tooltip ?? label;
  }
}

type Provider = vscode.TreeDataProvider<vscode.TreeItem> & { refresh: () => void };

function makeProvider(build: () => vscode.TreeItem[]): Provider {
  const emitter = new vscode.EventEmitter<void>();
  return {
    onDidChangeTreeData: emitter.event,
    getTreeItem: (e) => e,
    getChildren: () => build(),
    refresh: () => emitter.fire(),
  };
}

const locked = (msg: string) => [new Item(msg, "", "lock", { command: "pytrack.manageSubscription", title: "" })];

export function accountProvider(): Provider {
  return makeProvider(() => {
    const d = getCached();
    if (!d) return [new Item("Faça login", "", "sign-in", { command: "pytrack.login", title: "" })];
    const items = [
      new Item(d.user.name ?? d.user.email, d.user.email, "account"),
      new Item(`Plano: ${d.tierLabel}`, d.isSuprema ? "✓ Suprema" : "limitado", "star-full"),
      new Item(`Assinatura: ${d.subscription.status}`, d.subscription.renewsAt ? `renova ${new Date(d.subscription.renewsAt).toLocaleDateString("pt-BR")}` : "", "credit-card", { command: "pytrack.manageSubscription", title: "" }),
      new Item(`Nível: ${d.level}`, `${d.xp} XP`, "graph"),
      new Item("Abrir Dashboard", "visão completa do plano", "dashboard", { command: "pytrack.dashboard", title: "" }),
      new Item("Abrir painel na web", "", "globe", { command: "pytrack.openDashboard", title: "" }),
      new Item("Sair da conta", "", "sign-out", { command: "pytrack.logout", title: "" }),
    ];
    return items;
  });
}

export function projectsProvider(): Provider {
  return makeProvider(() => {
    const d = getCached();
    if (!d) return [new Item("Faça login para ver", "", "sign-in", { command: "pytrack.login", title: "" })];
    if (d.locked) return locked("Projetos — exclusivo Suprema");
    if (!d.projects.length) return [new Item("Nenhum projeto", "", "info")];
    return d.projects.map((p) => new Item(p.title, `${p.level} · ${p.area}`, "project",
      { command: "pytrack.importProject", title: "", arguments: [p] }, p.description));
  });
}

export function lessonsProvider(): Provider {
  return makeProvider(() => {
    const d = getCached();
    if (!d) return [new Item("Faça login para ver", "", "sign-in", { command: "pytrack.login", title: "" })];
    if (d.locked) return locked("Aulas — exclusivo Suprema");
    if (!d.lessons.length) return [new Item("Nenhuma aula", "", "info")];
    return d.lessons.map((l) => new Item(l.title, `${l.area} · ${l.lessons_count} lições`, "book",
      { command: "pytrack.openLesson", title: "", arguments: [l] }, l.description));
  });
}

export function exercisesProvider(): Provider {
  return makeProvider(() => {
    const d = getCached();
    if (!d) return [new Item("Faça login para ver", "", "sign-in", { command: "pytrack.login", title: "" })];
    if (d.locked) return locked("Exercícios — exclusivo Suprema");
    if (!d.exercises.length) return [new Item("Nenhum exercício", "", "info")];
    return d.exercises.slice(0, 300).map((e) => new Item(e.title, `${e.level} · ${e.category}`, "checklist",
      { command: "pytrack.openExercise", title: "", arguments: [e] }, e.objective));
  });
}

export function toolsProvider(): Provider {
  return makeProvider(() => [
    new Item("Assistente de IA", "use sua chave", "sparkle", { command: "pytrack.aiAssistant", title: "" }),
    new Item("IA — Explicar seleção", "", "comment-discussion", { command: "pytrack.aiExplain", title: "" }),
    new Item("IA — Refatorar seleção", "", "wand", { command: "pytrack.aiRefactor", title: "" }),
    new Item("IA — Gerar testes", "pytest", "beaker", { command: "pytrack.aiTests", title: "" }),
    new Item("IA — Gerar docstring", "", "book", { command: "pytrack.aiDocstring", title: "" }),
    new Item("Configurar IA", "provedor, modelo, chave", "key", { command: "pytrack.configureAI", title: "" }),
    new Item("Rodar arquivo Python", "", "play", { command: "pytrack.runFile", title: "" }),
    new Item("Instalar pacote (pip)", "", "package", { command: "pytrack.installPackage", title: "" }),
    new Item("Criar ambiente virtual", ".venv", "server-environment", { command: "pytrack.createVenv", title: "" }),
    new Item("Gerar requirements.txt", "", "list-unordered", { command: "pytrack.freeze", title: "" }),
    new Item("Formatar com Ruff", "", "symbol-color", { command: "pytrack.formatRuff", title: "" }),
    new Item("Inserir sintaxe por versão", "Python 3.0 → 3.13", "symbol-keyword", { command: "pytrack.insertSyntax", title: "" }),
    new Item("Buscar exercício", "", "search", { command: "pytrack.searchExercises", title: "" }),
    new Item("Desafio do dia", "", "star", { command: "pytrack.dailyChallenge", title: "" }),
    new Item("Sincronizar", "", "sync", { command: "pytrack.sync", title: "" }),
    new Item("Conheça a PyTrack", "www.pytrack.com.br", "globe", { command: "pytrack.openSite", title: "" }),
  ]);
}
