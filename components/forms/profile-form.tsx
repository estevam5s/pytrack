"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/data/actions";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LearningLevel } from "@/types";

const LEVELS: { value: LearningLevel; label: string }[] = [
  { value: "basico", label: "Básico" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

export function ProfileForm({
  initialName,
  initialGoal,
  initialLevel,
}: {
  initialName: string;
  initialGoal: string;
  initialLevel: LearningLevel;
}) {
  const [name, setName] = useState(initialName);
  const [goal, setGoal] = useState(initialGoal);
  const [level, setLevel] = useState<LearningLevel>(initialLevel);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      const res = await updateProfile({ name, goal, current_level: level });
      if (!res?.error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    });

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nome</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Objetivo de aprendizado</label>
        <Textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Ex.: Tornar-me Backend Developer com FastAPI em 6 meses."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nível atual</label>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => setLevel(l.value)}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                level === l.value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-surface text-text-secondary hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={save} disabled={pending}>
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <Check className="h-4 w-4" />
        ) : null}
        {saved ? "Salvo!" : "Salvar alterações"}
      </Button>
    </div>
  );
}
