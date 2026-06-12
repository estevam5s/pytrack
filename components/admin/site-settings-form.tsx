"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { saveSiteSettings, type SiteSettingsResult } from "@/app/(dashboard)/admin/site/actions";
import { Input } from "@/components/ui/input";

interface Settings {
  default_locale: string;
  maintenance: boolean;
  signups_enabled: boolean;
  announcement: string | null;
  announcement_type?: string | null;
  announcement_link?: string | null;
  primary_contact: string | null;
  social_github: string | null;
  social_linkedin: string | null;
}

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <Save className="h-4 w-4" /> {pending ? "Salvando..." : "Salvar configurações"}
    </button>
  );
}

export function SiteSettingsForm({ settings }: { settings: Settings }) {
  const [state, action] = useActionState<SiteSettingsResult, FormData>(saveSiteSettings, {});

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">
          <CheckCircle2 className="h-4 w-4" /> {state.success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Idioma padrão do site</label>
          <select
            name="default_locale"
            defaultValue={settings.default_locale}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="pt">Português (PT-BR)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">E-mail de contato</label>
          <Input name="primary_contact" defaultValue={settings.primary_contact ?? ""} placeholder="contato@..." />
        </div>
      </div>

      <div className="space-y-1.5 rounded-lg border border-border p-3">
        <label className="text-sm font-medium">Aviso/anúncio no topo do site (opcional)</label>
        <Input name="announcement" defaultValue={settings.announcement ?? ""} placeholder="Ex.: 🎉 Novidade: app desktop disponível!" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-text-secondary">Estilo</label>
            <select name="announcement_type" defaultValue={settings.announcement_type ?? "info"} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary">
              <option value="info">Info (roxo)</option>
              <option value="success">Sucesso (verde)</option>
              <option value="warning">Atenção (laranja)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-text-secondary">Link (opcional)</label>
            <Input name="announcement_link" defaultValue={settings.announcement_link ?? ""} placeholder="/apps ou https://..." />
          </div>
        </div>
        <p className="text-xs text-text-secondary">Deixe o texto vazio para esconder o aviso. Aparece no topo de todo o site.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">GitHub da organização</label>
          <Input name="social_github" defaultValue={settings.social_github ?? ""} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">LinkedIn</label>
          <Input name="social_linkedin" defaultValue={settings.social_linkedin ?? ""} />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-surface-2/40 p-4">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>
            <span className="font-medium">Permitir novos cadastros</span>
            <span className="block text-xs text-text-secondary">Desative para pausar registros temporariamente.</span>
          </span>
          <input type="checkbox" name="signups_enabled" defaultChecked={settings.signups_enabled} className="h-5 w-5 accent-[rgb(var(--primary))]" />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>
            <span className="font-medium text-warning">Modo manutenção</span>
            <span className="block text-xs text-text-secondary">Exibe um aviso de manutenção no site.</span>
          </span>
          <input type="checkbox" name="maintenance" defaultChecked={settings.maintenance} className="h-5 w-5 accent-[rgb(var(--primary))]" />
        </label>
      </div>

      <SaveBtn />
    </form>
  );
}
