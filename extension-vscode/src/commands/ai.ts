import * as vscode from "vscode";
import { getAIKey, saveAIKey } from "../state";

const ENDPOINTS: Record<string, string> = {
  openai: "https://api.openai.com/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/messages",
  nvidia: "https://integrate.api.nvidia.com/v1/chat/completions",
};

export async function configureAI(ctx: vscode.ExtensionContext) {
  const cfg = vscode.workspace.getConfiguration("pytrack");
  const provider = await vscode.window.showQuickPick(
    ["openai", "openrouter", "anthropic", "nvidia", "custom"],
    { title: "Provedor de IA (você usa a sua própria chave)" },
  );
  if (!provider) return;
  await cfg.update("ai.provider", provider, vscode.ConfigurationTarget.Global);

  const model = await vscode.window.showInputBox({
    title: "Modelo de IA",
    value: cfg.get("ai.model") || "gpt-4o-mini",
    prompt: "Ex.: gpt-4o-mini, claude-3-5-sonnet-latest, meta/llama-3.3-70b-instruct",
  });
  if (model) await cfg.update("ai.model", model, vscode.ConfigurationTarget.Global);

  if (provider === "custom") {
    const url = await vscode.window.showInputBox({ title: "URL base da API (compatível com OpenAI)", value: cfg.get("ai.baseUrl") || "" });
    if (url) await cfg.update("ai.baseUrl", url, vscode.ConfigurationTarget.Global);
  }

  const key = await vscode.window.showInputBox({
    title: "Sua chave de API de IA",
    password: true,
    prompt: "A chave fica guardada com segurança apenas no seu computador (SecretStorage).",
  });
  if (key) {
    await saveAIKey(ctx, key);
    vscode.window.showInformationMessage("PyTrack: IA configurada com a sua chave ✓");
  }
}

export async function aiAssistant(ctx: vscode.ExtensionContext) {
  const key = await getAIKey(ctx);
  if (!key) {
    const go = await vscode.window.showWarningMessage("Configure sua chave de IA primeiro.", "Configurar");
    if (go) await configureAI(ctx);
    return;
  }
  const cfg = vscode.workspace.getConfiguration("pytrack");
  const provider = cfg.get<string>("ai.provider") || "openai";
  const model = cfg.get<string>("ai.model") || "gpt-4o-mini";

  const editor = vscode.window.activeTextEditor;
  const selection = editor?.document.getText(editor.selection) ?? "";

  const prompt = await vscode.window.showInputBox({
    title: "Assistente de IA Python",
    prompt: selection ? "Pergunte algo sobre o código selecionado" : "O que você quer que a IA faça em Python?",
    placeHolder: "Ex.: explique este código / gere uma função que...",
  });
  if (!prompt) return;

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "PyTrack IA pensando..." },
    async () => {
      try {
        const reply = await callAI(provider, model, key, cfg.get<string>("ai.baseUrl") || "", prompt, selection);
        const doc = await vscode.workspace.openTextDocument({ content: reply, language: "markdown" });
        await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside });
      } catch (e) {
        vscode.window.showErrorMessage(`PyTrack IA: ${(e as Error).message}`);
      }
    },
  );
}

// Ações rápidas de IA sobre o código selecionado.
export async function aiQuickAction(ctx: vscode.ExtensionContext, kind: "explain" | "refactor" | "tests" | "docstring") {
  const key = await getAIKey(ctx);
  if (!key) {
    const go = await vscode.window.showWarningMessage("Configure sua chave de IA primeiro.", "Configurar");
    if (go) await configureAI(ctx);
    return;
  }
  const editor = vscode.window.activeTextEditor;
  const code = editor?.document.getText(editor.selection) || editor?.document.getText() || "";
  if (!code.trim()) { vscode.window.showWarningMessage("Selecione (ou abra) um código Python."); return; }

  const prompts: Record<string, string> = {
    explain: "Explique de forma didática, passo a passo, o que este código Python faz.",
    refactor: "Refatore este código Python aplicando boas práticas, type hints e clareza. Mostre o código final e explique as mudanças.",
    tests: "Gere testes pytest completos (casos normais, de borda e de erro) para este código Python.",
    docstring: "Adicione docstrings (estilo Google) e type hints a este código Python. Mostre o código completo.",
  };
  const cfg = vscode.workspace.getConfiguration("pytrack");
  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "PyTrack IA trabalhando..." },
    async () => {
      try {
        const reply = await callAI(
          cfg.get<string>("ai.provider") || "openai",
          cfg.get<string>("ai.model") || "gpt-4o-mini",
          key,
          cfg.get<string>("ai.baseUrl") || "",
          prompts[kind],
          code,
        );
        const doc = await vscode.workspace.openTextDocument({ content: reply, language: "markdown" });
        await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside });
      } catch (e) {
        vscode.window.showErrorMessage(`PyTrack IA: ${(e as Error).message}`);
      }
    },
  );
}

async function callAI(provider: string, model: string, key: string, customUrl: string, prompt: string, code: string): Promise<string> {
  const system = "Você é um assistente especialista em Python. Responda em pt-BR, com exemplos de código claros e boas práticas.";
  const userMsg = code ? `${prompt}\n\nCódigo:\n\`\`\`python\n${code}\n\`\`\`` : prompt;

  if (provider === "anthropic") {
    const res = await fetch(ENDPOINTS.anthropic, {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 1500, system, messages: [{ role: "user", content: userMsg }] }),
    });
    const data = (await res.json()) as Record<string, unknown>;
    if (!res.ok) throw new Error((((data.error as Record<string, unknown>) || {}).message as string) || "erro");
    return ((data.content as { text: string }[])?.[0]?.text) ?? "(sem resposta)";
  }

  const url = provider === "custom" ? customUrl : ENDPOINTS[provider];
  if (!url) throw new Error("Configure a URL base da IA.");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages: [{ role: "system", content: system }, { role: "user", content: userMsg }], temperature: 0.3 }),
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) throw new Error((((data.error as Record<string, unknown>) || {}).message as string) || "erro da API de IA");
  return ((data.choices as { message: { content: string } }[])?.[0]?.message?.content) ?? "(sem resposta)";
}
