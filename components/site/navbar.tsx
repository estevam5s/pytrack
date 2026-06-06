"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import { NAV_LINKS, LOGIN_URL, SIGNUP_URL, BRAND } from "@/lib/site-links";
import { Button } from "@/components/site/site-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt={BRAND.name}
        width={40}
        height={40}
        priority
        className="h-9 w-9 rounded-lg object-contain"
      />
      <span className="text-lg font-bold tracking-tight">{BRAND.name}</span>
    </Link>
  );
}

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // trava o scroll do body com o menu full-screen aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-300",
          scrolled || open
            ? "border-border bg-surface/95 backdrop-blur-md"
            : "border-transparent bg-surface",
        )}
      >
      <nav className="container flex h-[77px] items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-text-secondary hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {isLoggedIn ? (
            <Button href="/inicio" variant="primary">
              <LayoutDashboard className="h-4 w-4" /> Ir para o painel
            </Button>
          ) : (
            <>
              <Button href={LOGIN_URL} variant="ghost">
                Entrar
              </Button>
              <Button href={SIGNUP_URL} variant="primary">
                Começar agora
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative z-50 rounded-lg p-2 text-text-secondary hover:text-foreground"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      </header>

      {/* Menu full-screen no mobile (fora do header p/ não herdar o backdrop-blur) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: "rgb(var(--background))" }}
            className="fixed inset-x-0 bottom-0 top-[77px] z-[60] flex flex-col overflow-y-auto bg-background lg:hidden"
          >
            <div className="bg-grid radial-fade pointer-events-none absolute inset-0 opacity-40" />
            <nav className="relative flex flex-1 flex-col justify-center gap-1 px-6">
              {NAV_LINKS.map((l, i) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.06 }}
                  >
                    <Link
                      href={l.href}
                      className={cn(
                        "flex items-center justify-between border-b border-border/60 py-4 text-3xl font-bold tracking-tight transition-colors",
                        active ? "text-gradient" : "text-text-secondary hover:text-foreground",
                      )}
                    >
                      {l.label}
                      <ArrowRight className="h-5 w-5 opacity-40" />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="relative flex flex-col gap-3 border-t border-border p-6"
            >
              {isLoggedIn ? (
                <Button href="/inicio" variant="gradient" size="lg" className="w-full">
                  <LayoutDashboard className="h-5 w-5" /> Ir para o painel
                </Button>
              ) : (
                <>
                  <Button href={SIGNUP_URL} variant="gradient" size="lg" className="w-full">
                    Começar agora <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button href={LOGIN_URL} variant="outline" size="lg" className="w-full">
                    Entrar
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
