"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LogOut,
  Settings,
  User as UserIcon,
  ChevronDown,
  Globe,
} from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { initials } from "@/lib/utils";

export function UserMenu({
  name,
  email,
  avatarUrl,
}: {
  name: string | null;
  email: string;
  avatarUrl: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5 transition-colors hover:border-primary/40"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={name ?? "avatar"}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            initials(name ?? email)
          )}
        </span>
        <span className="hidden text-sm font-medium text-foreground sm:block max-w-[120px] truncate">
          {name ?? email.split("@")[0]}
        </span>
        <ChevronDown className="hidden h-4 w-4 text-text-secondary sm:block" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-sm font-medium text-foreground">
                {name ?? "Estudante Python"}
              </p>
              <p className="truncate text-xs text-text-secondary">{email}</p>
            </div>
            <div className="p-1.5">
              <Link
                href="/perfil"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-surface hover:text-foreground"
              >
                <UserIcon className="h-4 w-4" /> Perfil
              </Link>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-surface hover:text-foreground"
              >
                <Globe className="h-4 w-4" /> Ir para o site
              </Link>
              <Link
                href="/configuracoes"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-surface hover:text-foreground"
              >
                <Settings className="h-4 w-4" /> Configurações
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-danger hover:bg-danger/10"
                >
                  <LogOut className="h-4 w-4" /> Sair
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
