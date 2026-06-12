"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/site-data";

function Column({ items, duration, className }: { items: Testimonial[]; duration: number; className?: string }) {
  return (
    <div className={className}>
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex flex-col gap-5"
      >
        {[...items, ...items].map((t, i) => (
          <div
            key={i}
            className="w-full max-w-xs rounded-3xl border border-border bg-card p-7 shadow-lg shadow-black/5"
          >
            <Quote className="h-6 w-6 text-primary-light/60" />
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t.text}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-background`}>
                {t.initials}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-text-secondary">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialsMarquee({ items }: { items: Testimonial[] }) {
  const a = items.slice(0, 3);
  const b = items.slice(3, 6);
  const c = items.slice(6, 9);
  return (
    <div className="mt-12 flex max-h-[680px] justify-center gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
      <Column items={a} duration={24} />
      <Column items={b.length ? b : a} duration={30} className="hidden md:block" />
      <Column items={c.length ? c : a} duration={27} className="hidden lg:block" />
    </div>
  );
}
