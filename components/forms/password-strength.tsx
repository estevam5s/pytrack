"use client";

import { useMemo } from "react";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as common from "@zxcvbn-ts/language-common";

zxcvbnOptions.setOptions({
  dictionary: { ...common.dictionary },
  graphs: common.adjacencyGraphs,
});

const LABELS = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];
const COLORS = ["#ef4444", "#f59e0b", "#eab308", "#5F75F2", "#29E0A9"];

export function PasswordStrength({ password }: { password: string }) {
  const { score, feedback } = useMemo(() => {
    if (!password) return { score: -1, feedback: "" as string };
    const r = zxcvbn(password);
    const tip = r.feedback.warning || r.feedback.suggestions?.[0] || "";
    return { score: r.score, feedback: tip };
  }, [password]);

  if (score < 0) return null;

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{ background: i <= score ? COLORS[score] : "rgb(var(--border))" }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: COLORS[score] }}>
        {LABELS[score]}
        {feedback && <span className="text-text-secondary"> · {feedback}</span>}
      </p>
    </div>
  );
}

/** Retorna true se a senha é forte o bastante (score >= 2). */
export function isPasswordStrong(password: string): boolean {
  if (!password || password.length < 8) return false;
  try {
    return zxcvbn(password).score >= 2;
  } catch {
    return password.length >= 8;
  }
}
