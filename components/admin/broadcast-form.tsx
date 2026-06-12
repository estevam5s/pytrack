"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { broadcast, type BroadcastResult } from "@/app/(dashboard)/admin/avisos/actions";

const inp = "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

const TEMPLATES = [
  { label: "Nova feature", title: "✨ Novidade na PyTrack!", body: "Acabamos de lançar um novo recurso. Confira!" },
  { label: "Novas trilhas", title: "🚀 Novas trilhas disponíveis", body: "Adicionamos novas trilhas de aprendizado. Bons estudos!" },
  { label: "Novos exercícios", title: "✅ +exercícios novos", body: "O banco de exercícios cresceu. Pratique mais!" },
  { label: "Promoção", title: "🎉 Oferta especial", body: "Aproveite uma condição especial nos planos." },
];

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar para os usuários
    </button>
  );
}

export function BroadcastForm() {
  const [state, action] = useActionState<BroadcastResult, FormData>(broadcast, {});

  return (
    <form action={action} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={(e) => {
              const form = (e.target as HTMLElement).closest("form")!;
              (form.querySelector('[name="title"]') as HTMLInputElement).value = t.title;
              (form.querySelector('[name="body"]') as HTMLTextAreaElement).value = t.body;
            }}
            className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-secondary hover:border-primary/40 hover:text-foreground"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Título</label>
        <input name="title" required className={inp} placeholder="Ex.: 🎉 Novo app desktop disponível!" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Mensagem</label>
        <textarea name="body" rows={3} className={inp} placeholder="Descreva a novidade, mudança de valor, nova trilha, etc." />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Link (opcional)</label>
          <input name="link" className={inp} placeholder="/apps, /precos..." />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Tipo</label>
          <select name="type" defaultValue="system" className={inp}>
            <option value="system">Sistema</option>
            <option value="success">Novidade</option>
            <option value="plan">Plano/Valores</option>
            <option value="community">Comunidade</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Público</label>
          <select name="audience" defaultValue="all" className={inp}>
            <option value="all">Todos os usuários</option>
            <option value="paid">Apenas assinantes</option>
          </select>
        </div>
      </div>

      {state.error && <p className="flex items-center gap-1.5 text-sm text-red-400"><AlertCircle className="h-4 w-4" /> {state.error}</p>}
      {state.success && <p className="flex items-center gap-1.5 text-sm text-green"><CheckCircle2 className="h-4 w-4" /> {state.success}</p>}

      <SubmitBtn />
    </form>
  );
}
