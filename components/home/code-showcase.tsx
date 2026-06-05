import { CodeBlock } from "@/components/content/code-block";

const SNIPPETS = [
  {
    file: "main.py",
    lib: "FastAPI",
    color: "#04D361",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="PyTrack API")

class Skill(BaseModel):
    name: str
    level: int

@app.get("/skills")
async def skills() -> list[Skill]:
    return [Skill(name="Python", level=99)]`,
  },
  {
    file: "analise.py",
    lib: "pandas",
    color: "#8257E5",
    code: `import pandas as pd

df = pd.read_csv("progresso.csv")
resumo = (
    df.groupby("area")["xp"]
      .sum()
      .sort_values(ascending=False)
)
print(resumo.head())`,
  },
  {
    file: "tasks.py",
    lib: "asyncio",
    color: "#F59E0B",
    code: `import asyncio

async def estudar(modulo: str) -> None:
    print(f"Estudando {modulo}...")
    await asyncio.sleep(1)

async def main() -> None:
    await asyncio.gather(
        estudar("APIs"), estudar("Async")
    )

asyncio.run(main())`,
  },
];

export function CodeShowcase() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {SNIPPETS.map((s) => (
        <div
          key={s.file}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            </span>
            <span className="ml-1 font-mono text-xs text-text-secondary">
              {s.file}
            </span>
            <span
              className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ color: s.color, background: `${s.color}1a` }}
            >
              {s.lib}
            </span>
          </div>
          <div className="p-3">
            <CodeBlock code={s.code} />
          </div>
        </div>
      ))}
    </div>
  );
}
