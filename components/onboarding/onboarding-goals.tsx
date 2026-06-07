"use client";

import { useTransition, useState } from "react";
import {
  BarChart3,
  Bot,
  Briefcase,
  Cpu,
  Database,
  Loader2,
  Server,
} from "lucide-react";
import { saveOnboardingGoal } from "@/app/(dashboard)/onboarding/actions";
import { cn } from "@/lib/utils";

const GOALS = [
  { key: "backend", label: "Backend & APIs", desc: "FastAPI, Django, bancos", icon: Server, trilha: "backend", accent: "from-blue/20 to-blue/5 text-blue" },
  { key: "dados", label: "Análise de Dados", desc: "Pandas, NumPy, BI", icon: BarChart3, trilha: "data-analytics", accent: "from-primary-light/20 to-primary/5 text-primary-light" },
  { key: "engenharia-dados", label: "Engenharia de Dados", desc: "Pipelines, Spark, Airflow", icon: Database, trilha: "engenharia-dados", accent: "from-magenta/20 to-magenta/5 text-magenta" },
  { key: "automacao", label: "Automação", desc: "Scraping, bots, RPA", icon: Bot, trilha: "automacao", accent: "from-green/20 to-green/5 text-green" },
  { key: "iot", label: "IoT & Embarcados", desc: "MicroPython, ESP32, MQTT", icon: Cpu, trilha: "iot", accent: "from-green/20 to-green/5 text-green" },
  { key: "carreira", label: "Carreira em Python", desc: "Do zero ao primeiro emprego", icon: Briefcase, trilha: "python-developer", accent: "from-primary-light/20 to-primary/5 text-primary-light" },
];

export function OnboardingGoals() {
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<string | null>(null);

  function choose(goal: string, trilha: string) {
    setSelected(goal);
    start(() => saveOnboardingGoal(goal, trilha));
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GOALS.map((g) => (
        <button
          key={g.key}
          onClick={() => choose(g.key, g.trilha)}
          disabled={pending}
          className={cn(
            "card card-hover flex flex-col items-start gap-3 p-5 text-left transition-all disabled:opacity-60",
            selected === g.key && "border-primary ring-2 ring-primary/30",
          )}
        >
          <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br", g.accent)}>
            {pending && selected === g.key ? <Loader2 className="h-6 w-6 animate-spin" /> : <g.icon className="h-6 w-6" />}
          </span>
          <div>
            <p className="font-bold">{g.label}</p>
            <p className="text-sm text-text-secondary">{g.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
