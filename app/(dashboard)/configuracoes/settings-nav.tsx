"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  Code2,
  CreditCard,
  Database,
  Gift,
  Info,
  Palette,
  ShieldAlert,
  ShieldCheck,
  Github,
  UserCircle,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/configuracoes/conta", label: "Conta", icon: UserCircle },
  { href: "/configuracoes/perfil", label: "Perfil", icon: UserCog },
  { href: "/configuracoes/plano", label: "Plano e cobrança", icon: CreditCard },
  { href: "/configuracoes/seguranca", label: "Segurança (2FA)", icon: ShieldCheck },
  { href: "/configuracoes/notificacoes", label: "Notificações", icon: Bell },
  { href: "/configuracoes/github", label: "GitHub", icon: Github },
  { href: "/configuracoes/api", label: "API", icon: Code2 },
  { href: "/configuracoes/ia", label: "IA & Modelos", icon: Bot },
  { href: "/configuracoes/indicacoes", label: "Indique e ganhe", icon: Gift },
  { href: "/configuracoes/aparencia", label: "Aparência", icon: Palette },
  { href: "/configuracoes/plataforma", label: "Plataforma", icon: Database },
  {
    href: "/configuracoes/dados",
    label: "Dados e privacidade",
    icon: ShieldAlert,
  },
  { href: "/configuracoes/sobre", label: "Sobre", icon: Info },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <nav className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {ITEMS.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-text-secondary hover:bg-card hover:text-foreground",
              )}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
