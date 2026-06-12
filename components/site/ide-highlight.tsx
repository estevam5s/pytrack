import { Play, Terminal, Zap, Check } from "lucide-react";
import { GradientText } from "@/components/site/gradient-text";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/site/site-button";
import { SIGNUP_URL } from "@/lib/site-links";

const BENEFITS = [
  "Sem instalar nada — roda no navegador",
  "Execute Python de verdade (WebAssembly)",
  "Conectada aos exercícios e à correção por IA",
  "32 temas de editor + autocompletar",
];

export function IdeHighlight() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface/40 py-20">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-[500px] rounded-full bg-secondary/10 blur-[120px]" />
      <div className="container relative grid items-center gap-12 lg:grid-cols-2">
        {/* texto */}
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
            <Zap className="h-3.5 w-3.5" /> Zero setup
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Escreva e rode Python <GradientText>direto no navegador</GradientText>
          </h2>
          <p className="mt-4 text-text-secondary">
            Nada de instalar Python, configurar ambiente ou perder tempo com setup.
            Abra a IDE e comece a programar em segundos — perfeito para quem está começando.
          </p>
          <ul className="mt-6 space-y-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-text-secondary">{b}</span>
              </li>
            ))}
          </ul>
          <Button href={SIGNUP_URL} external variant="primary" className="mt-8">
            <Play className="h-4 w-4" /> Testar a IDE grátis
          </Button>
        </Reveal>

        {/* mockup da IDE */}
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-border bg-[#1e1f29] shadow-2xl shadow-secondary/10">
            {/* barra */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-400/70" />
              <span className="ml-3 font-mono text-xs text-zinc-400">main.py — PyTrack IDE</span>
            </div>
            {/* código */}
            <div className="grid sm:grid-cols-2">
              <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
                <code>
                  <span className="text-[#ff79c6]">def</span> <span className="text-[#50fa7b]">fib</span>(n):{"\n"}
                  {"    "}a, b = <span className="text-[#bd93f9]">0</span>, <span className="text-[#bd93f9]">1</span>{"\n"}
                  {"    "}<span className="text-[#ff79c6]">for</span> _ <span className="text-[#ff79c6]">in</span> <span className="text-[#8be9fd]">range</span>(n):{"\n"}
                  {"        "}<span className="text-[#8be9fd]">print</span>(a){"\n"}
                  {"        "}a, b = b, a + b{"\n"}
                  {"\n"}
                  <span className="text-[#50fa7b]">fib</span>(<span className="text-[#bd93f9]">8</span>)
                </code>
              </pre>
              {/* console */}
              <div className="border-t border-white/10 bg-[#16171f] p-4 font-mono text-[13px] sm:border-l sm:border-t-0">
                <p className="mb-2 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Terminal className="h-3.5 w-3.5" /> Saída
                </p>
                <p className="text-zinc-300">0</p>
                <p className="text-zinc-300">1</p>
                <p className="text-zinc-300">1</p>
                <p className="text-zinc-300">2</p>
                <p className="text-zinc-300">3</p>
                <p className="text-zinc-300">5</p>
                <p className="text-zinc-300">8</p>
                <p className="text-zinc-300">13</p>
                <p className="mt-2 text-green-400">✓ Execução concluída.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
