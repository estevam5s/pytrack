"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";

const ITEMS = [
  { label: "Início", href: "/", desc: "Página inicial" },
  { label: "Trilhas", href: "/trilhas", desc: "17 trilhas de Python" },
  { label: "Recursos", href: "/recursos", desc: "Conteúdos, exercícios, IDE" },
  { label: "Projetos", href: "/projetos", desc: "Projetos para portfólio" },
  { label: "Carreira", href: "/carreira", desc: "Roadmap e mercado" },
  { label: "Preços", href: "/precos", desc: "Planos e comparativo" },
  { label: "Blog", href: "/blog", desc: "Artigos sobre Python" },
  { label: "Aprender grátis", href: "/aprender", desc: "Lições abertas" },
  { label: "Sobre", href: "/sobre", desc: "Sobre a PyTrack e contato" },
  { label: "Status", href: "/status", desc: "Status do sistema" },
  { label: "Entrar", href: "/auth/login", desc: "Acessar sua conta" },
  { label: "Criar conta", href: "/auth/register", desc: "Começar grátis" },
];

export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ITEMS;
    return ITEMS.filter(
      (i) => i.label.toLowerCase().includes(s) || i.desc.toLowerCase().includes(s),
    );
  }, [q]);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text-secondary transition-colors hover:border-primary/40"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Buscar…</span>
        <kbd className="ml-1 hidden rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold sm:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.97, y: -8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-border px-4">
                <Search className="h-4 w-4 text-text-secondary" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
                    if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
                    if (e.key === "Enter" && results[active]) go(results[active].href);
                  }}
                  placeholder="Buscar páginas…"
                  className="w-full bg-transparent py-3.5 text-sm outline-none"
                />
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 && (
                  <p className="p-4 text-center text-sm text-text-secondary">Nada encontrado.</p>
                )}
                {results.map((r, i) => (
                  <button
                    key={r.href}
                    onClick={() => go(r.href)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      i === active ? "bg-primary/10 text-foreground" : "text-text-secondary hover:bg-surface-2"
                    }`}
                  >
                    <span>
                      <span className="font-medium">{r.label}</span>
                      <span className="ml-2 text-xs text-text-secondary">{r.desc}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-40" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
