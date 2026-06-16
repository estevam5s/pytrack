import * as vscode from "vscode";
import { getCached } from "./state";
import { baseUrl } from "./api";

let panel: vscode.WebviewPanel | undefined;

export function openDashboard(ctx: vscode.ExtensionContext) {
  const d = getCached();
  if (!d) {
    vscode.commands.executeCommand("pytrack.login");
    return;
  }
  if (panel) {
    panel.reveal(vscode.ViewColumn.One);
    panel.webview.html = render(d);
    return;
  }
  panel = vscode.window.createWebviewPanel("pytrackDashboard", "PyTrack — Dashboard", vscode.ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: true,
  });
  panel.iconPath = vscode.Uri.joinPath(ctx.extensionUri, "media", "icon.png");
  panel.webview.html = render(d);
  panel.webview.onDidReceiveMessage((msg) => {
    if (msg.cmd) vscode.commands.executeCommand(msg.cmd, msg.arg);
  });
  panel.onDidDispose(() => (panel = undefined));
}

function esc(s: string) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function render(d: ReturnType<typeof getCached>): string {
  if (!d) return "<h1>Faça login</h1>";
  const site = baseUrl();
  const card = (icon: string, value: string | number, label: string) =>
    `<div class="card"><div class="ic">${icon}</div><div class="val">${value}</div><div class="lbl">${label}</div></div>`;

  const lockedBanner = d.locked
    ? `<div class="lock">🔒 Conteúdo completo é exclusivo do plano <b>Suprema (R$46)</b>. <a href="${site}/assinar">Fazer upgrade →</a></div>`
    : "";

  const list = (title: string, items: string[], emptyMsg: string) =>
    `<section><h2>${title}</h2>${items.length ? `<ul>${items.join("")}</ul>` : `<p class="muted">${emptyMsg}</p>`}</section>`;

  const projects = d.projects.slice(0, 30).map((p) =>
    `<li><b>${esc(p.title)}</b> <span class="tag">${esc(p.level)} · ${esc(p.area)}</span><br><span class="muted">${esc(p.description ?? "")}</span> <a href="#" onclick="send('pytrack.importProject', ${JSON.stringify(JSON.stringify(p))})">importar</a></li>`,
  );
  const lessons = d.lessons.slice(0, 40).map((l) =>
    `<li><b>${esc(l.title)}</b> <span class="tag">${esc(l.area)} · ${l.lessons_count} lições</span> <a href="${site}/conteudos/${esc(l.slug)}">abrir</a></li>`,
  );
  const exercises = d.exercises.slice(0, 60).map((e) =>
    `<li><b>${esc(e.title)}</b> <span class="tag">${esc(e.level)} · ${esc(e.category)}</span></li>`,
  );

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>
  :root { color-scheme: dark light; }
  body { font-family: -apple-system, Segoe UI, sans-serif; padding: 0; margin: 0; }
  .hero { background: linear-gradient(135deg, #5F75F2 0%, #9956F6 100%); color: #fff; padding: 24px 28px; }
  .hero h1 { margin: 0; font-size: 22px; }
  .hero p { margin: 4px 0 0; opacity: .9; }
  .wrap { padding: 20px 28px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 8px; }
  .card { border: 1px solid var(--vscode-panel-border); border-radius: 12px; padding: 14px; }
  .card .ic { font-size: 20px; }
  .card .val { font-size: 22px; font-weight: 700; margin-top: 4px; }
  .card .lbl { font-size: 12px; opacity: .7; }
  section { margin-top: 22px; }
  h2 { font-size: 15px; border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 6px; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { padding: 8px 0; border-bottom: 1px solid var(--vscode-panel-border); font-size: 13px; }
  .tag { font-size: 11px; opacity: .65; }
  .muted { opacity: .6; font-size: 12px; }
  a { color: #9aa9ff; }
  .lock { background: rgba(153,86,246,.12); border: 1px solid rgba(153,86,246,.4); border-radius: 10px; padding: 12px; margin-top: 14px; }
  .btns { margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap; }
  .btn { background: #5F75F2; color: #fff; border: none; border-radius: 8px; padding: 8px 14px; cursor: pointer; font-size: 13px; }
  .btn.sec { background: transparent; border: 1px solid var(--vscode-panel-border); color: inherit; }
</style></head>
<body>
  <div class="hero">
    <h1>🐍 Olá${d.user.name ? `, ${esc(d.user.name)}` : ""}!</h1>
    <p>Plano <b>${esc(d.tierLabel)}</b> · ${esc(d.subscription.status)} · ${d.subscription.renewsAt ? "renova " + new Date(d.subscription.renewsAt).toLocaleDateString("pt-BR") : "—"}</p>
  </div>
  <div class="wrap">
    <div class="grid">
      ${card("⭐", d.xp, "XP")}
      ${card("📈", esc(d.level), "Nível")}
      ${card("📦", d.counts?.projects ?? d.projects.length, "Projetos")}
      ${card("📚", d.counts?.lessons ?? d.lessons.length, "Aulas")}
      ${card("✅", d.counts?.exercises ?? d.exercises.length, "Exercícios")}
    </div>
    ${lockedBanner}
    <div class="btns">
      <button class="btn" onclick="send('pytrack.sync')">↻ Sincronizar</button>
      <button class="btn sec" onclick="send('pytrack.aiAssistant')">✨ Assistente de IA</button>
      <button class="btn sec" onclick="send('pytrack.manageSubscription')">💳 Gerenciar assinatura</button>
      <button class="btn sec" onclick="send('pytrack.dailyChallenge')">🎯 Desafio do dia</button>
    </div>
    ${list("📦 Projetos do seu plano", projects, "Nenhum projeto disponível.")}
    ${list("📚 Aulas para estudar/importar", lessons, "Nenhuma aula disponível.")}
    ${list("✅ Exercícios", exercises, "Nenhum exercício disponível.")}
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    function send(cmd, arg) { vscode.postMessage({ cmd, arg: arg ? JSON.parse(arg) : undefined }); }
  </script>
</body></html>`;
}
