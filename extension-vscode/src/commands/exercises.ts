import * as vscode from "vscode";
import { getCached } from "../state";
import { baseUrl, type Exercise } from "../api";

async function pickExercise(): Promise<Exercise | undefined> {
  const d = getCached();
  if (!d) { vscode.commands.executeCommand("pytrack.login"); return; }
  if (d.locked || !d.exercises.length) {
    vscode.window.showWarningMessage("Exercícios são exclusivos do plano Suprema (R$46).");
    return;
  }
  const pick = await vscode.window.showQuickPick(
    d.exercises.map((e) => ({ label: e.title, description: `${e.level} · ${e.category}`, e })),
    { title: "Buscar exercício", matchOnDescription: true, placeHolder: "Digite para filtrar entre os exercícios" },
  );
  return (pick as { e: Exercise } | undefined)?.e;
}

function scaffold(e: Exercise): string {
  const slug = e.ex_id || e.title.slice(0, 20);
  return `"""
Exercício PyTrack — ${e.title}
Categoria: ${e.category} · Nível: ${e.level}

Objetivo:
${e.objective}

Resolva abaixo. Depois, use "PyTrack: Rodar arquivo Python" para testar
e o "Assistente de IA" para revisar sua solução.
"""


def solucao():
    # TODO: implemente aqui
    ...


if __name__ == "__main__":
    print(solucao())
`;
}

export async function searchExercises() {
  const e = await pickExercise();
  if (!e) return;
  const action = await vscode.window.showQuickPick(
    ["Abrir como arquivo para resolver", "Abrir na plataforma (web)"],
    { title: e.title },
  );
  if (!action) return;
  if (action.startsWith("Abrir na")) {
    vscode.env.openExternal(vscode.Uri.parse(`${baseUrl()}/exercicios`));
    return;
  }
  const doc = await vscode.workspace.openTextDocument({ content: scaffold(e), language: "python" });
  await vscode.window.showTextDocument(doc);
}

export async function dailyChallenge() {
  const d = getCached();
  if (!d || d.locked || !d.exercises.length) {
    vscode.window.showWarningMessage("O desafio do dia é exclusivo do plano Suprema (R$46).");
    return;
  }
  // escolhe um exercício determinístico do dia
  const day = Math.floor(Date.now() / 86400000);
  const e = d.exercises[day % d.exercises.length];
  const go = await vscode.window.showInformationMessage(
    `🎯 Desafio do dia: ${e.title} (${e.level})`,
    "Resolver agora",
  );
  if (go) {
    const doc = await vscode.workspace.openTextDocument({ content: scaffold(e), language: "python" });
    await vscode.window.showTextDocument(doc);
  }
}
