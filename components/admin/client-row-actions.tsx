"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Check, Loader2 } from "lucide-react";
import { setUserPlan, deleteUser } from "@/app/(dashboard)/admin/clientes/actions";
import type { Tier } from "@/lib/billing-access";

const TIERS: { value: Tier; label: string }[] = [
  { value: "free", label: "Gratuito" },
  { value: "essencial", label: "Essencial" },
  { value: "completo", label: "Completo" },
  { value: "suprema", label: "Suprema" },
  { value: "vitalicio", label: "Vitalício" },
];

export function ClientRowActions({
  userId,
  email,
  tier,
  isAdminUser = false,
}: {
  userId: string;
  email: string;
  tier: Tier;
  isAdminUser?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function changePlan(value: string) {
    start(async () => {
      const fd = new FormData();
      fd.set("user_id", userId);
      fd.set("tier", value);
      const res = await setUserPlan({}, fd);
      if (!res.error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  }

  function remove() {
    if (!confirm(`Excluir o usuário ${email}? Esta ação é irreversível.`)) return;
    start(async () => {
      const fd = new FormData();
      fd.set("user_id", userId);
      fd.set("email", email);
      const res = await deleteUser({}, fd);
      if (res.error) alert(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        defaultValue={tier}
        disabled={pending}
        onChange={(e) => changePlan(e.target.value)}
        className="rounded-md border border-border bg-surface px-2 py-1 text-xs outline-none focus:border-primary disabled:opacity-50"
        title="Mudar plano"
      >
        {TIERS.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin text-text-secondary" />
      ) : saved ? (
        <Check className="h-4 w-4 text-green" />
      ) : (
        <button
          onClick={remove}
          disabled={isAdminUser}
          title={isAdminUser ? "Admin não pode ser excluído" : "Excluir usuário"}
          className="text-text-secondary transition-colors hover:text-red-400 disabled:opacity-30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
