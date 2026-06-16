import * as vscode from "vscode";

const COMMON_PACKAGES = [
  "requests", "numpy", "pandas", "fastapi", "flask", "django", "pydantic", "sqlalchemy",
  "pytest", "httpx", "rich", "typer", "polars", "scikit-learn", "matplotlib", "seaborn",
  "beautifulsoup4", "playwright", "streamlit", "langchain", "openai", "uvicorn", "celery", "redis",
];

export async function installPackage() {
  const pick = await vscode.window.showQuickPick(
    [...COMMON_PACKAGES, "$(edit) Outro pacote..."],
    { title: "Instalar pacote Python (pip)", placeHolder: "Escolha ou digite um pacote" },
  );
  if (!pick) return;
  let pkg = pick;
  if (pick.includes("Outro")) {
    const custom = await vscode.window.showInputBox({ title: "Nome do pacote", placeHolder: "ex.: pillow ou pillow==10.0.0" });
    if (!custom) return;
    pkg = custom;
  }
  const term = vscode.window.terminals.find((t) => t.name === "PyTrack") ?? vscode.window.createTerminal("PyTrack");
  term.show();
  term.sendText(`python -m pip install ${pkg}`);
  vscode.window.showInformationMessage(`PyTrack: instalando ${pkg}...`);
}

// Sintaxe equivalente em várias versões do Python — ensina a evolução da linguagem.
const SYNTAX: Record<string, { label: string; code: string }> = {
  fstring: {
    label: "Interpolação de strings",
    code: `# Python 3.0–3.5: .format()
nome = "Ana"; idade = 30
print("{} tem {} anos".format(nome, idade))

# Python 3.6+: f-strings
print(f"{nome} tem {idade} anos")

# Python 3.8+: f-string com '=' para debug
print(f"{idade=}")
`,
  },
  match: {
    label: "Condicional / match",
    code: `# Python <3.10: if/elif
def tipo(x):
    if x == 0: return "zero"
    elif x > 0: return "positivo"
    else: return "negativo"

# Python 3.10+: structural pattern matching
def tipo2(x):
    match x:
        case 0: return "zero"
        case n if n > 0: return "positivo"
        case _: return "negativo"
`,
  },
  typing: {
    label: "Type hints",
    code: `# Python 3.5–3.8: typing
from typing import List, Optional, Dict
def f(itens: List[int], n: Optional[int] = None) -> Dict[str, int]: ...

# Python 3.9+: coleções nativas
def g(itens: list[int], mapa: dict[str, int]) -> None: ...

# Python 3.10+: união com |
def h(x: int | None) -> str | None: ...
`,
  },
  walrus: {
    label: "Operador morsa (:=)",
    code: `# Python <3.8: atribuição separada
linha = input()
while linha:
    print(linha)
    linha = input()

# Python 3.8+: walrus operator
while (linha := input()):
    print(linha)
`,
  },
  async: {
    label: "Concorrência (async)",
    code: `# Python 3.4: corrotinas com decorator
import asyncio

# Python 3.5+: async/await
async def main():
    await asyncio.sleep(1)
    return "ok"

# Python 3.11+: TaskGroup
async def varias():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(main())
`,
  },
};

function term(name = "PyTrack"): vscode.Terminal {
  return vscode.window.terminals.find((t) => t.name === name) ?? vscode.window.createTerminal(name);
}

export async function runFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== "python") {
    vscode.window.showWarningMessage("Abra um arquivo .py para rodar.");
    return;
  }
  await editor.document.save();
  const t = term();
  t.show();
  t.sendText(`python "${editor.document.fileName}"`);
}

export async function createVenv() {
  const t = term();
  t.show();
  t.sendText("python -m venv .venv && echo 'Ambiente virtual criado em .venv'");
  vscode.window.showInformationMessage("PyTrack: criando ambiente virtual (.venv)...");
}

export async function freeze() {
  const t = term();
  t.show();
  t.sendText("python -m pip freeze > requirements.txt && echo 'requirements.txt gerado'");
}

export async function formatRuff() {
  const editor = vscode.window.activeTextEditor;
  const t = term();
  t.show();
  const file = editor?.document.fileName ? `"${editor.document.fileName}"` : ".";
  t.sendText(`ruff format ${file} && ruff check --fix ${file}`);
}

export async function insertSyntax() {
  const pick = await vscode.window.showQuickPick(
    Object.entries(SYNTAX).map(([k, v]) => ({ label: v.label, key: k })),
    { title: "Inserir sintaxe Python (com comparação entre versões)" },
  );
  if (!pick) return;
  const editor = vscode.window.activeTextEditor;
  const code = SYNTAX[(pick as { key: string }).key].code;
  if (editor) {
    editor.edit((b) => b.insert(editor.selection.active, code));
  } else {
    const doc = await vscode.workspace.openTextDocument({ content: code, language: "python" });
    await vscode.window.showTextDocument(doc);
  }
}
