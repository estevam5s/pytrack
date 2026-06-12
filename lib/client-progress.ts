export interface LocalActivity {
  lessons: number;
  exercises: number;
  questions: number;
}

/** Lê os contadores de progresso salvos no localStorage do navegador. */
export function readLocalActivity(): LocalActivity {
  const result = { lessons: 0, exercises: 0, questions: 0 };
  if (typeof window === "undefined") return result;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("pytrack-lessons-")) {
        const arr = JSON.parse(localStorage.getItem(key) ?? "[]");
        if (Array.isArray(arr)) result.lessons += arr.length;
      }
    }
    result.exercises = (
      JSON.parse(localStorage.getItem("pytrack-exercises-done") ?? "[]") as unknown[]
    ).length;
    result.questions = (
      JSON.parse(localStorage.getItem("pytrack-questions-studied") ?? "[]") as unknown[]
    ).length;
  } catch {
    /* ignore */
  }
  return result;
}
