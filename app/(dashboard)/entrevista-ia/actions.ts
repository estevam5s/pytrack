"use server";

import { chatComplete, type ChatMessage } from "@/lib/ai/openrouter";
import { getUserAiOverride } from "@/lib/ai/user-settings";

export interface InterviewTurn {
  role: "interviewer" | "candidate";
  content: string;
}

const SYSTEM = `Você é um entrevistador técnico sênior conduzindo uma SIMULAÇÃO de entrevista de emprego para vagas de Python (backend, dados, IA, etc.).
Regras:
- Conduza em português do Brasil, de forma realista, profissional e acolhedora.
- Faça UMA pergunta por vez. Comece por apresentação e experiência, depois aprofunde em técnico (Python, estruturas, async, bancos, testes, arquitetura) conforme o nível e a área do candidato.
- Após cada resposta do candidato: dê um feedback curto e construtivo (o que foi bom, o que faltou, uma dica), e então faça a PRÓXIMA pergunta.
- Adapte a dificuldade ao nível informado (júnior/pleno/sênior) e à vaga-alvo.
- Use Markdown leve. Seja conciso (máx ~150 palavras por turno).
- Quando o candidato pedir para encerrar, faça um resumo final com pontos fortes, pontos a melhorar e uma nota de 0 a 10.`;

export async function interviewTurn(input: {
  context: { role: string; level: string; experience: string };
  history: InterviewTurn[];
  message: string;
}): Promise<{ reply?: string; error?: string }> {
  const override = await getUserAiOverride();

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content: `Contexto do candidato:\n- Vaga-alvo: ${input.context.role}\n- Nível: ${input.context.level}\n- Experiência/skills: ${input.context.experience}\n\nInicie ou continue a entrevista conforme o histórico.`,
    },
    ...input.history.map((t) => ({
      role: (t.role === "interviewer" ? "assistant" : "user") as "assistant" | "user",
      content: t.content,
    })),
  ];
  if (input.message) {
    messages.push({ role: "user", content: input.message });
  }

  const res = await chatComplete(messages, { maxTokens: 600, temperature: 0.6 }, override ?? undefined);
  if (res.error || !res.content) {
    return { error: res.error ?? "A IA não respondeu. Tente novamente." };
  }
  return { reply: res.content.trim() };
}
