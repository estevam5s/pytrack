"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, Users, Briefcase, Bell, Search, ArrowLeft, ChevronDown,
  User, Settings, LogOut, Menu, X, MessageSquare, Calendar, Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommunityNotificationBell } from "./community-notification-bell";

interface Props {
  me: { id: string; name: string; avatar: string | null };
  unread: number;
  unreadMsgs?: number;
}

const NAV = [
  { href: "/comunidade", label: "Início", icon: Home, exact: true },
  { href: "/comunidade/conexoes", label: "Rede", icon: Users },
  { href: "/comunidade/vagas", label: "Vagas", icon: Briefcase },
  { href: "/comunidade/eventos", label: "Eventos", icon: Calendar },
  { href: "/comunidade/mensagens", label: "Mensagens", icon: MessageSquare },
  { href: "/comunidade/notificacoes", label: "Avisos", icon: Bell },
];

export function RedeTopNav({ me, unread, unreadMsgs = 0 }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  function submitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    router.push(q ? `/comunidade?q=${encodeURIComponent(q)}` : "/comunidade");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        {/* logo + busca */}
        <Link href="/comunidade" className="flex items-center gap-2 shrink-0">
          <Image src="/new-logo.png" alt="PyTrack" width={32} height={32} className="h-8 w-8 rounded-lg" />
          <span className="hidden text-sm font-bold sm:block">Rede</span>
        </Link>
        <form onSubmit={submitSearch} className="relative hidden max-w-xs flex-1 sm:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
          <input
            name="q"
            placeholder="Buscar pessoas, posts…"
            className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </form>

        {/* nav desktop */}
        <nav className="ml-auto hidden items-center md:flex">
          {NAV.filter((n) => !n.href.includes("notificacoes")).map((n) => {
            const isActive = active(n.href, n.exact);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "relative flex w-[76px] flex-col items-center gap-0.5 py-1.5 text-[11px] transition-colors",
                  isActive ? "text-foreground" : "text-text-secondary hover:text-foreground",
                )}
              >
                <span className="relative">
                  <n.icon className="h-5 w-5" />
                  {n.href.includes("notificacoes") && unread > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>
                  )}
                  {n.href.includes("mensagens") && unreadMsgs > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{unreadMsgs > 9 ? "9+" : unreadMsgs}</span>
                  )}
                </span>
                {n.label}
                {isActive && <span className="absolute -bottom-[1px] h-0.5 w-full rounded-full bg-foreground" />}
              </Link>
            );
          })}

          {/* central de notificações (dropdown) */}
          <CommunityNotificationBell />

          {/* eu (dropdown) */}
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="flex w-[76px] flex-col items-center gap-0.5 py-1.5 text-[11px] text-text-secondary hover:text-foreground">
              <Avatar me={me} size={20} />
              <span className="flex items-center gap-0.5">Eu <ChevronDown className="h-3 w-3" /></span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                  <div className="flex items-center gap-3 p-4">
                    <Avatar me={me} size={48} />
                    <div className="min-w-0"><p className="truncate text-sm font-semibold">{me.name}</p><p className="text-xs text-text-secondary">Ver perfil</p></div>
                  </div>
                  <div className="border-t border-border p-1.5">
                    <MenuLink href={`/comunidade/perfil/${me.id}`} icon={User}>Meu perfil</MenuLink>
                    <MenuLink href="/comunidade/badges" icon={Trophy}>Conquistas</MenuLink>
                    <MenuLink href="/comunidade/eu" icon={Settings}>Editar perfil</MenuLink>
                  </div>
                  <div className="border-t border-border p-1.5">
                    <MenuLink href="/inicio" icon={LogOut}>Voltar à plataforma</MenuLink>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* voltar à plataforma */}
          <Link href="/inicio" className="ml-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-primary/40 hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Plataforma
          </Link>
        </nav>

        {/* mobile toggle */}
        <button onClick={() => setMobileOpen((v) => !v)} className="ml-auto md:hidden">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* nav mobile */}
      {mobileOpen && (
        <nav className="border-t border-border bg-card px-4 py-2 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-text-secondary hover:bg-surface-2 hover:text-foreground">
              <n.icon className="h-5 w-5" /> {n.label}
            </Link>
          ))}
          <Link href={`/comunidade/perfil/${me.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-text-secondary hover:bg-surface-2 hover:text-foreground"><User className="h-5 w-5" /> Meu perfil</Link>
          <Link href="/comunidade/eu" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-text-secondary hover:bg-surface-2 hover:text-foreground"><Settings className="h-5 w-5" /> Editar perfil</Link>
          <Link href="/inicio" className="mt-1 flex items-center gap-3 rounded-lg border border-border px-2 py-2.5 text-sm text-text-secondary"><ArrowLeft className="h-5 w-5" /> Voltar à plataforma</Link>
        </nav>
      )}
    </header>
  );
}

function Avatar({ me, size }: { me: Props["me"]; size: number }) {
  if (me.avatar) {
    return <Image src={me.avatar} alt="" width={size} height={size} className="rounded-full object-cover" style={{ height: size, width: size }} />;
  }
  return (
    <span className="flex items-center justify-center rounded-full bg-primary/15 font-bold text-primary-light" style={{ height: size, width: size, fontSize: size * 0.45 }}>
      {(me.name ?? "?").charAt(0).toUpperCase()}
    </span>
  );
}

function MenuLink({ href, icon: Icon, children }: { href: string; icon: typeof User; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-text-secondary hover:bg-surface-2 hover:text-foreground">
      <Icon className="h-4 w-4" /> {children}
    </Link>
  );
}
