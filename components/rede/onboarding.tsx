"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, UserCog, Users, Briefcase, ArrowRight } from "lucide-react";

const KEY = "pytrack-rede-onboarded";

export function RedeOnboarding({ name }: { name: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  function close() {
    localStorage.setItem(KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-gradient-to-br from-primary to-primary-light p-6 text-white">
          <button onClick={close} className="absolute right-3 top-3 text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
          <Sparkles className="h-7 w-7" />
          <h2 className="mt-2 text-xl font-bold">Bem-vindo à Rede PyTrack, {name}! 🐍</h2>
          <p className="mt-1 text-sm text-white/90">Sua rede profissional de devs Python — estilo LinkedIn, dentro da plataforma.</p>
        </div>
        <div className="space-y-3 p-6">
          <Step icon={UserCog} title="Monte seu perfil profissional" desc="Experiência, formação, certificados, projetos, idiomas e mais." />
          <Step icon={Users} title="Conecte-se e siga" desc="Construa sua rede com outros estudantes e profissionais." />
          <Step icon={Briefcase} title="Encontre vagas Python" desc="Oportunidades publicadas pela comunidade." />
          <div className="flex gap-2 pt-1">
            <Link href="/comunidade/eu" onClick={close} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-light px-4 py-2.5 text-sm font-semibold text-white">
              Completar perfil <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={close} className="rounded-xl border border-border px-4 py-2.5 text-sm">Explorar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ icon: Icon, title, desc }: { icon: typeof Users; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-light"><Icon className="h-4 w-4" /></span>
      <div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-text-secondary">{desc}</p></div>
    </div>
  );
}
